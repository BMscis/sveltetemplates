
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\InputContainer.svelte generated by Svelte v3.44.3 */

    const file$5 = "src\\InputContainer.svelte";
    const get_extrainput_slot_changes = dirty => ({});
    const get_extrainput_slot_context = ctx => ({});
    const get_inputtext_slot_changes = dirty => ({});
    const get_inputtext_slot_context = ctx => ({});
    const get_dialogslot_slot_changes = dirty => ({});
    const get_dialogslot_slot_context = ctx => ({});
    const get_taglogoslot_slot_changes = dirty => ({});
    const get_taglogoslot_slot_context = ctx => ({});
    const get_inputslot_slot_changes$1 = dirty => ({});
    const get_inputslot_slot_context$1 = ctx => ({});

    function create_fragment$5(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let current;
    	const inputslot_slot_template = /*#slots*/ ctx[1].inputslot;
    	const inputslot_slot = create_slot(inputslot_slot_template, ctx, /*$$scope*/ ctx[0], get_inputslot_slot_context$1);
    	const taglogoslot_slot_template = /*#slots*/ ctx[1].taglogoslot;
    	const taglogoslot_slot = create_slot(taglogoslot_slot_template, ctx, /*$$scope*/ ctx[0], get_taglogoslot_slot_context);
    	const dialogslot_slot_template = /*#slots*/ ctx[1].dialogslot;
    	const dialogslot_slot = create_slot(dialogslot_slot_template, ctx, /*$$scope*/ ctx[0], get_dialogslot_slot_context);
    	const inputtext_slot_template = /*#slots*/ ctx[1].inputtext;
    	const inputtext_slot = create_slot(inputtext_slot_template, ctx, /*$$scope*/ ctx[0], get_inputtext_slot_context);
    	const extrainput_slot_template = /*#slots*/ ctx[1].extrainput;
    	const extrainput_slot = create_slot(extrainput_slot_template, ctx, /*$$scope*/ ctx[0], get_extrainput_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (inputslot_slot) inputslot_slot.c();
    			t0 = space();
    			if (taglogoslot_slot) taglogoslot_slot.c();
    			t1 = space();
    			if (dialogslot_slot) dialogslot_slot.c();
    			t2 = space();
    			if (inputtext_slot) inputtext_slot.c();
    			t3 = space();
    			if (extrainput_slot) extrainput_slot.c();
    			attr_dev(div, "class", "inputcontainer");
    			add_location(div, file$5, 2, 0, 21);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (inputslot_slot) {
    				inputslot_slot.m(div, null);
    			}

    			append_dev(div, t0);

    			if (taglogoslot_slot) {
    				taglogoslot_slot.m(div, null);
    			}

    			append_dev(div, t1);

    			if (dialogslot_slot) {
    				dialogslot_slot.m(div, null);
    			}

    			append_dev(div, t2);

    			if (inputtext_slot) {
    				inputtext_slot.m(div, null);
    			}

    			append_dev(div, t3);

    			if (extrainput_slot) {
    				extrainput_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (inputslot_slot) {
    				if (inputslot_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						inputslot_slot,
    						inputslot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(inputslot_slot_template, /*$$scope*/ ctx[0], dirty, get_inputslot_slot_changes$1),
    						get_inputslot_slot_context$1
    					);
    				}
    			}

    			if (taglogoslot_slot) {
    				if (taglogoslot_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						taglogoslot_slot,
    						taglogoslot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(taglogoslot_slot_template, /*$$scope*/ ctx[0], dirty, get_taglogoslot_slot_changes),
    						get_taglogoslot_slot_context
    					);
    				}
    			}

    			if (dialogslot_slot) {
    				if (dialogslot_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						dialogslot_slot,
    						dialogslot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(dialogslot_slot_template, /*$$scope*/ ctx[0], dirty, get_dialogslot_slot_changes),
    						get_dialogslot_slot_context
    					);
    				}
    			}

    			if (inputtext_slot) {
    				if (inputtext_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						inputtext_slot,
    						inputtext_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(inputtext_slot_template, /*$$scope*/ ctx[0], dirty, get_inputtext_slot_changes),
    						get_inputtext_slot_context
    					);
    				}
    			}

    			if (extrainput_slot) {
    				if (extrainput_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						extrainput_slot,
    						extrainput_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(extrainput_slot_template, /*$$scope*/ ctx[0], dirty, get_extrainput_slot_changes),
    						get_extrainput_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputslot_slot, local);
    			transition_in(taglogoslot_slot, local);
    			transition_in(dialogslot_slot, local);
    			transition_in(inputtext_slot, local);
    			transition_in(extrainput_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputslot_slot, local);
    			transition_out(taglogoslot_slot, local);
    			transition_out(dialogslot_slot, local);
    			transition_out(inputtext_slot, local);
    			transition_out(extrainput_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (inputslot_slot) inputslot_slot.d(detaching);
    			if (taglogoslot_slot) taglogoslot_slot.d(detaching);
    			if (dialogslot_slot) dialogslot_slot.d(detaching);
    			if (inputtext_slot) inputtext_slot.d(detaching);
    			if (extrainput_slot) extrainput_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputContainer', slots, ['inputslot','taglogoslot','dialogslot','inputtext','extrainput']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class InputContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputContainer",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\PopDialog.svelte generated by Svelte v3.44.3 */

    const file$4 = "src\\PopDialog.svelte";
    const get_user_button_slot_changes = dirty => ({});
    const get_user_button_slot_context = ctx => ({});

    function create_fragment$4(ctx) {
    	let dialog1;
    	let h3;
    	let t0;
    	let t1;
    	let hr;
    	let t2;
    	let dialog0;
    	let t3;
    	let t4;
    	let current;
    	const user_button_slot_template = /*#slots*/ ctx[4]["user-button"];
    	const user_button_slot = create_slot(user_button_slot_template, ctx, /*$$scope*/ ctx[3], get_user_button_slot_context);

    	const block = {
    		c: function create() {
    			dialog1 = element("dialog");
    			h3 = element("h3");
    			t0 = text(/*popupHeading*/ ctx[0]);
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			dialog0 = element("dialog");
    			t3 = text(/*popupText*/ ctx[1]);
    			t4 = space();
    			if (user_button_slot) user_button_slot.c();
    			add_location(h3, file$4, 7, 4, 183);
    			add_location(hr, file$4, 8, 4, 212);
    			attr_dev(dialog0, "class", "top");
    			add_location(dialog0, file$4, 9, 4, 224);
    			attr_dev(dialog1, "class", "tooltip");
    			toggle_class(dialog1, "visible", /*visibility*/ ctx[2]);
    			add_location(dialog1, file$4, 6, 0, 126);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dialog1, anchor);
    			append_dev(dialog1, h3);
    			append_dev(h3, t0);
    			append_dev(dialog1, t1);
    			append_dev(dialog1, hr);
    			append_dev(dialog1, t2);
    			append_dev(dialog1, dialog0);
    			append_dev(dialog0, t3);
    			append_dev(dialog1, t4);

    			if (user_button_slot) {
    				user_button_slot.m(dialog1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*popupHeading*/ 1) set_data_dev(t0, /*popupHeading*/ ctx[0]);
    			if (!current || dirty & /*popupText*/ 2) set_data_dev(t3, /*popupText*/ ctx[1]);

    			if (user_button_slot) {
    				if (user_button_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						user_button_slot,
    						user_button_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(user_button_slot_template, /*$$scope*/ ctx[3], dirty, get_user_button_slot_changes),
    						get_user_button_slot_context
    					);
    				}
    			}

    			if (dirty & /*visibility*/ 4) {
    				toggle_class(dialog1, "visible", /*visibility*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user_button_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user_button_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(dialog1);
    			if (user_button_slot) user_button_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PopDialog', slots, ['user-button']);
    	let { popupHeading = "" } = $$props;
    	let { popupText = "" } = $$props;
    	let { visibility = false } = $$props;
    	const writable_props = ['popupHeading', 'popupText', 'visibility'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PopDialog> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('popupHeading' in $$props) $$invalidate(0, popupHeading = $$props.popupHeading);
    		if ('popupText' in $$props) $$invalidate(1, popupText = $$props.popupText);
    		if ('visibility' in $$props) $$invalidate(2, visibility = $$props.visibility);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ popupHeading, popupText, visibility });

    	$$self.$inject_state = $$props => {
    		if ('popupHeading' in $$props) $$invalidate(0, popupHeading = $$props.popupHeading);
    		if ('popupText' in $$props) $$invalidate(1, popupText = $$props.popupText);
    		if ('visibility' in $$props) $$invalidate(2, visibility = $$props.visibility);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [popupHeading, popupText, visibility, $$scope, slots];
    }

    class PopDialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			popupHeading: 0,
    			popupText: 1,
    			visibility: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PopDialog",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get popupHeading() {
    		throw new Error("<PopDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set popupHeading(value) {
    		throw new Error("<PopDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get popupText() {
    		throw new Error("<PopDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set popupText(value) {
    		throw new Error("<PopDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visibility() {
    		throw new Error("<PopDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visibility(value) {
    		throw new Error("<PopDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function requiredValidator() {
      return function required(value) {
        return (value !== undefined && value !== null && value !== '') || 'This field is required'
      }
    }
    function requiredRange(levelRange) {
      return function range(value) {
        return (value >= levelRange) || `The amount must be above ${levelRange}`
      }
    }
    function expandMore(expandCheck) {
      return function more(value) {
        //expandCheck == "false" ? (valCheck = "true") : (valCheck = "false")
        value == true || value == 'true' ? value = false : value = true;
        return (value)
      }
    }
    function timeConverter() {
      return function convertToTime(value) {
        let setVal = 0.0;
        value == undefined ? value = setVal : value = value;
        let checkVal = value % 2 == 0;
        checkVal ? (
          setVal = (value - (value / 2).toString() + " Years" + " 6 months")) : (setVal = (value - ((value - 1) / 2)).toString() + " Years");
          value = setVal;
        return ({response:value == setVal,reply:setVal}) || "error setting time"
      }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function buildValidator (validators) {
        return function validate (value, dirty) {
          if (!validators || validators.length === 0) {
            return { dirty, valid: true }
          }
      
          const failing = validators.find(v => v(value) !== true);
          validators.find(v => typeof v(value)  === "object");
      
          return {
            dirty,
            valid: !failing ,
            message: failing && failing(value),
          }
        }
      }

    function createFieldValidator (...validators) {
      const { subscribe, set } = writable({ dirty: false, valid: false, message: null });
      const validator = buildValidator(validators);

      function action (node, binding) {
        function validate (value, dirty) {
          const result = validator(value, dirty);
          set(result);
        }
        
        validate(binding, false);

        return {
          update (value) {
            validate(value, true);
          }
        }
      }

      return [ { subscribe }, action ]
    }

    /* src\InputNumber.svelte generated by Svelte v3.44.3 */
    const file$3 = "src\\InputNumber.svelte";

    // (19:4) 
    function create_inputslot_slot$2(ctx) {
    	let input;
    	let input_pullupdialog_value;
    	let input_isinputok_value;
    	let validate_action;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "slot", "inputslot");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "name", /*inputName*/ ctx[1]);
    			attr_dev(input, "id", /*inputId*/ ctx[2]);
    			attr_dev(input, "placeholder", /*inputPlaceholder*/ ctx[3]);
    			attr_dev(input, "onscreenvalue", /*inputValue*/ ctx[0]);
    			attr_dev(input, "pullupdialog", input_pullupdialog_value = /*$validity*/ ctx[5].dirty && !/*$validity*/ ctx[5].valid);
    			attr_dev(input, "isinputok", input_isinputok_value = /*$validity*/ ctx[5].valid);
    			toggle_class(input, "activated", /*$validity*/ ctx[5].valid);
    			add_location(input, file$3, 18, 4, 635);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*inputValue*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[10]),
    					action_destroyer(validate_action = /*validate*/ ctx[7].call(null, input, /*inputValue*/ ctx[0]))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputName*/ 2) {
    				attr_dev(input, "name", /*inputName*/ ctx[1]);
    			}

    			if (dirty & /*inputId*/ 4) {
    				attr_dev(input, "id", /*inputId*/ ctx[2]);
    			}

    			if (dirty & /*inputPlaceholder*/ 8) {
    				attr_dev(input, "placeholder", /*inputPlaceholder*/ ctx[3]);
    			}

    			if (dirty & /*inputValue*/ 1) {
    				attr_dev(input, "onscreenvalue", /*inputValue*/ ctx[0]);
    			}

    			if (dirty & /*$validity*/ 32 && input_pullupdialog_value !== (input_pullupdialog_value = /*$validity*/ ctx[5].dirty && !/*$validity*/ ctx[5].valid)) {
    				attr_dev(input, "pullupdialog", input_pullupdialog_value);
    			}

    			if (dirty & /*$validity*/ 32 && input_isinputok_value !== (input_isinputok_value = /*$validity*/ ctx[5].valid)) {
    				attr_dev(input, "isinputok", input_isinputok_value);
    			}

    			if (dirty & /*inputValue*/ 1 && to_number(input.value) !== /*inputValue*/ ctx[0]) {
    				set_input_value(input, /*inputValue*/ ctx[0]);
    			}

    			if (validate_action && is_function(validate_action.update) && dirty & /*inputValue*/ 1) validate_action.update.call(null, /*inputValue*/ ctx[0]);

    			if (dirty & /*$validity*/ 32) {
    				toggle_class(input, "activated", /*$validity*/ ctx[5].valid);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_inputslot_slot$2.name,
    		type: "slot",
    		source: "(19:4) ",
    		ctx
    	});

    	return block;
    }

    // (32:4) 
    function create_taglogoslot_slot(ctx) {
    	let span;
    	let t;
    	let span_isinputok_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*sign*/ ctx[4]);
    			attr_dev(span, "isinputok", span_isinputok_value = /*$validity*/ ctx[5].valid);
    			attr_dev(span, "class", "inputsign");
    			attr_dev(span, "slot", "taglogoslot");
    			add_location(span, file$3, 31, 4, 1036);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sign*/ 16) set_data_dev(t, /*sign*/ ctx[4]);

    			if (dirty & /*$validity*/ 32 && span_isinputok_value !== (span_isinputok_value = /*$validity*/ ctx[5].valid)) {
    				attr_dev(span, "isinputok", span_isinputok_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_taglogoslot_slot.name,
    		type: "slot",
    		source: "(32:4) ",
    		ctx
    	});

    	return block;
    }

    // (33:4) 
    function create_dialogslot_slot(ctx) {
    	let popdialog;
    	let current;

    	popdialog = new PopDialog({
    			props: {
    				popupText: /*$validity*/ ctx[5].message,
    				slot: "dialogslot"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(popdialog.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(popdialog, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const popdialog_changes = {};
    			if (dirty & /*$validity*/ 32) popdialog_changes.popupText = /*$validity*/ ctx[5].message;
    			popdialog.$set(popdialog_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(popdialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(popdialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(popdialog, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_dialogslot_slot.name,
    		type: "slot",
    		source: "(33:4) ",
    		ctx
    	});

    	return block;
    }

    // (34:4) 
    function create_inputtext_slot(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*inputPlaceholder*/ ctx[3]);
    			attr_dev(span, "class", "inputtext");
    			attr_dev(span, "slot", "inputtext");
    			add_location(span, file$3, 33, 4, 1193);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputPlaceholder*/ 8) set_data_dev(t, /*inputPlaceholder*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_inputtext_slot.name,
    		type: "slot",
    		source: "(34:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let inputcontainer;
    	let current;

    	inputcontainer = new InputContainer({
    			props: {
    				$$slots: {
    					inputtext: [create_inputtext_slot],
    					dialogslot: [create_dialogslot_slot],
    					taglogoslot: [create_taglogoslot_slot],
    					inputslot: [create_inputslot_slot$2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(inputcontainer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(inputcontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const inputcontainer_changes = {};

    			if (dirty & /*$$scope, inputPlaceholder, $validity, sign, inputName, inputId, inputValue*/ 2111) {
    				inputcontainer_changes.$$scope = { dirty, ctx };
    			}

    			inputcontainer.$set(inputcontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputcontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputcontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inputcontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $validity;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputNumber', slots, []);
    	let { inputValue } = $$props;
    	let { inputName } = $$props;
    	let { inputId } = $$props;
    	let { inputPlaceholder } = $$props;
    	const isRequired = false;
    	let { levelRange = 0 } = $$props;
    	let { sign = '' } = $$props;
    	const [validity, validate] = createFieldValidator(requiredValidator(), requiredRange(levelRange));
    	validate_store(validity, 'validity');
    	component_subscribe($$self, validity, value => $$invalidate(5, $validity = value));
    	const writable_props = ['inputValue', 'inputName', 'inputId', 'inputPlaceholder', 'levelRange', 'sign'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputNumber> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		inputValue = to_number(this.value);
    		$$invalidate(0, inputValue);
    	}

    	$$self.$$set = $$props => {
    		if ('inputValue' in $$props) $$invalidate(0, inputValue = $$props.inputValue);
    		if ('inputName' in $$props) $$invalidate(1, inputName = $$props.inputName);
    		if ('inputId' in $$props) $$invalidate(2, inputId = $$props.inputId);
    		if ('inputPlaceholder' in $$props) $$invalidate(3, inputPlaceholder = $$props.inputPlaceholder);
    		if ('levelRange' in $$props) $$invalidate(9, levelRange = $$props.levelRange);
    		if ('sign' in $$props) $$invalidate(4, sign = $$props.sign);
    	};

    	$$self.$capture_state = () => ({
    		InputContainer,
    		PopDialog,
    		requiredRange,
    		requiredValidator,
    		createFieldValidator,
    		inputValue,
    		inputName,
    		inputId,
    		inputPlaceholder,
    		isRequired,
    		levelRange,
    		sign,
    		validity,
    		validate,
    		$validity
    	});

    	$$self.$inject_state = $$props => {
    		if ('inputValue' in $$props) $$invalidate(0, inputValue = $$props.inputValue);
    		if ('inputName' in $$props) $$invalidate(1, inputName = $$props.inputName);
    		if ('inputId' in $$props) $$invalidate(2, inputId = $$props.inputId);
    		if ('inputPlaceholder' in $$props) $$invalidate(3, inputPlaceholder = $$props.inputPlaceholder);
    		if ('levelRange' in $$props) $$invalidate(9, levelRange = $$props.levelRange);
    		if ('sign' in $$props) $$invalidate(4, sign = $$props.sign);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		inputValue,
    		inputName,
    		inputId,
    		inputPlaceholder,
    		sign,
    		$validity,
    		validity,
    		validate,
    		isRequired,
    		levelRange,
    		input_input_handler
    	];
    }

    class InputNumber extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			inputValue: 0,
    			inputName: 1,
    			inputId: 2,
    			inputPlaceholder: 3,
    			isRequired: 8,
    			levelRange: 9,
    			sign: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputNumber",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*inputValue*/ ctx[0] === undefined && !('inputValue' in props)) {
    			console.warn("<InputNumber> was created without expected prop 'inputValue'");
    		}

    		if (/*inputName*/ ctx[1] === undefined && !('inputName' in props)) {
    			console.warn("<InputNumber> was created without expected prop 'inputName'");
    		}

    		if (/*inputId*/ ctx[2] === undefined && !('inputId' in props)) {
    			console.warn("<InputNumber> was created without expected prop 'inputId'");
    		}

    		if (/*inputPlaceholder*/ ctx[3] === undefined && !('inputPlaceholder' in props)) {
    			console.warn("<InputNumber> was created without expected prop 'inputPlaceholder'");
    		}
    	}

    	get inputValue() {
    		throw new Error("<InputNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputValue(value) {
    		throw new Error("<InputNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputName() {
    		throw new Error("<InputNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputName(value) {
    		throw new Error("<InputNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputId() {
    		throw new Error("<InputNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputId(value) {
    		throw new Error("<InputNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputPlaceholder() {
    		throw new Error("<InputNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputPlaceholder(value) {
    		throw new Error("<InputNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isRequired() {
    		return this.$$.ctx[8];
    	}

    	set isRequired(value) {
    		throw new Error("<InputNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get levelRange() {
    		throw new Error("<InputNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set levelRange(value) {
    		throw new Error("<InputNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sign() {
    		throw new Error("<InputNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sign(value) {
    		throw new Error("<InputNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\InputRange.svelte generated by Svelte v3.44.3 */
    const file$2 = "src\\InputRange.svelte";

    // (20:4) 
    function create_inputslot_slot_1(ctx) {
    	let div;
    	let progress;
    	let t;
    	let input;
    	let input_isinputok_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			progress = element("progress");
    			t = space();
    			input = element("input");
    			progress.value = /*inputValue*/ ctx[0];
    			attr_dev(progress, "min", /*inputMin*/ ctx[1]);
    			attr_dev(progress, "max", /*inputMax*/ ctx[2]);
    			add_location(progress, file$2, 20, 8, 648);
    			attr_dev(input, "min", /*inputMin*/ ctx[1]);
    			attr_dev(input, "max", /*inputMax*/ ctx[2]);
    			attr_dev(input, "name", /*inputName*/ ctx[3]);
    			attr_dev(input, "type", "range");
    			attr_dev(input, "isinputok", input_isinputok_value = /*$validity*/ ctx[7].message.response);
    			add_location(input, file$2, 21, 8, 719);
    			attr_dev(div, "slot", "inputslot");
    			attr_dev(div, "class", "input-range-container svelte-1mbn4gz");
    			add_location(div, file$2, 19, 4, 586);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, progress);
    			append_dev(div, t);
    			append_dev(div, input);
    			set_input_value(input, /*inputValue*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[10]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[10]),
    					listen_dev(input, "input", /*input_handler*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputValue*/ 1) {
    				prop_dev(progress, "value", /*inputValue*/ ctx[0]);
    			}

    			if (dirty & /*inputMin*/ 2) {
    				attr_dev(progress, "min", /*inputMin*/ ctx[1]);
    			}

    			if (dirty & /*inputMax*/ 4) {
    				attr_dev(progress, "max", /*inputMax*/ ctx[2]);
    			}

    			if (dirty & /*inputMin*/ 2) {
    				attr_dev(input, "min", /*inputMin*/ ctx[1]);
    			}

    			if (dirty & /*inputMax*/ 4) {
    				attr_dev(input, "max", /*inputMax*/ ctx[2]);
    			}

    			if (dirty & /*inputName*/ 8) {
    				attr_dev(input, "name", /*inputName*/ ctx[3]);
    			}

    			if (dirty & /*$validity*/ 128 && input_isinputok_value !== (input_isinputok_value = /*$validity*/ ctx[7].message.response)) {
    				attr_dev(input, "isinputok", input_isinputok_value);
    			}

    			if (dirty & /*inputValue*/ 1) {
    				set_input_value(input, /*inputValue*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_inputslot_slot_1.name,
    		type: "slot",
    		source: "(20:4) ",
    		ctx
    	});

    	return block;
    }

    // (40:8) {:else}
    function create_else_block(ctx) {
    	let span;
    	let t0;
    	let t1;
    	let t2_value = /*inputValue*/ ctx[0] * 1000 + "";
    	let t2;
    	let span_isinputok_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(/*sign*/ ctx[5]);
    			t1 = space();
    			t2 = text(t2_value);
    			attr_dev(span, "isinputok", span_isinputok_value = /*$validity*/ ctx[7].message.response);
    			attr_dev(span, "class", "inputsign");
    			add_location(span, file$2, 40, 8, 1350);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sign*/ 32) set_data_dev(t0, /*sign*/ ctx[5]);
    			if (dirty & /*inputValue*/ 1 && t2_value !== (t2_value = /*inputValue*/ ctx[0] * 1000 + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*$validity*/ 128 && span_isinputok_value !== (span_isinputok_value = /*$validity*/ ctx[7].message.response)) {
    				attr_dev(span, "isinputok", span_isinputok_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(40:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (38:8) {#if isTimeBound}
    function create_if_block(ctx) {
    	let span;
    	let t_value = /*$validity*/ ctx[7].message.reply + "";
    	let t;
    	let span_isinputok_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "isinputok", span_isinputok_value = /*$validity*/ ctx[7].message.response);
    			attr_dev(span, "class", "inputsign");
    			add_location(span, file$2, 38, 8, 1228);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$validity*/ 128 && t_value !== (t_value = /*$validity*/ ctx[7].message.reply + "")) set_data_dev(t, t_value);

    			if (dirty & /*$validity*/ 128 && span_isinputok_value !== (span_isinputok_value = /*$validity*/ ctx[7].message.response)) {
    				attr_dev(span, "isinputok", span_isinputok_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(38:8) {#if isTimeBound}",
    		ctx
    	});

    	return block;
    }

    // (36:4) 
    function create_inputslot_slot$1(ctx) {
    	let div;
    	let span;
    	let t0;
    	let t1;

    	function select_block_type(ctx, dirty) {
    		if (/*isTimeBound*/ ctx[6]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text(/*rangeText*/ ctx[4]);
    			t1 = space();
    			if_block.c();
    			attr_dev(span, "class", "checkbox-text");
    			add_location(span, file$2, 36, 8, 1145);
    			attr_dev(div, "slot", "inputslot");
    			attr_dev(div, "class", "input-range-container svelte-1mbn4gz");
    			add_location(div, file$2, 35, 4, 1083);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(div, t1);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*rangeText*/ 16) set_data_dev(t0, /*rangeText*/ ctx[4]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_inputslot_slot$1.name,
    		type: "slot",
    		source: "(36:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let inputcontainer0;
    	let t;
    	let inputcontainer1;
    	let current;

    	inputcontainer0 = new InputContainer({
    			props: {
    				$$slots: { inputslot: [create_inputslot_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	inputcontainer1 = new InputContainer({
    			props: {
    				$$slots: { inputslot: [create_inputslot_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(inputcontainer0.$$.fragment);
    			t = space();
    			create_component(inputcontainer1.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(inputcontainer0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(inputcontainer1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const inputcontainer0_changes = {};

    			if (dirty & /*$$scope, inputMin, inputMax, inputName, $validity, inputValue*/ 4239) {
    				inputcontainer0_changes.$$scope = { dirty, ctx };
    			}

    			inputcontainer0.$set(inputcontainer0_changes);
    			const inputcontainer1_changes = {};

    			if (dirty & /*$$scope, $validity, isTimeBound, inputValue, sign, rangeText*/ 4337) {
    				inputcontainer1_changes.$$scope = { dirty, ctx };
    			}

    			inputcontainer1.$set(inputcontainer1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputcontainer0.$$.fragment, local);
    			transition_in(inputcontainer1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputcontainer0.$$.fragment, local);
    			transition_out(inputcontainer1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inputcontainer0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(inputcontainer1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $validity;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputRange', slots, []);
    	let { inputValue = 0 } = $$props;
    	let { inputMin = 0 } = $$props;
    	let { inputMax = 0 } = $$props;
    	let { inputName = "" } = $$props;
    	let { rangeText = "" } = $$props;
    	let { sign = "" } = $$props;
    	let { isTimeBound = false } = $$props;
    	const [validity, validate] = createFieldValidator(timeConverter());
    	validate_store(validity, 'validity');
    	component_subscribe($$self, validity, value => $$invalidate(7, $validity = value));
    	validate(0);

    	const writable_props = [
    		'inputValue',
    		'inputMin',
    		'inputMax',
    		'inputName',
    		'rangeText',
    		'sign',
    		'isTimeBound'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputRange> was created with unknown prop '${key}'`);
    	});

    	function input_change_input_handler() {
    		inputValue = to_number(this.value);
    		$$invalidate(0, inputValue);
    	}

    	const input_handler = () => {
    		validate(this, inputValue);
    	};

    	$$self.$$set = $$props => {
    		if ('inputValue' in $$props) $$invalidate(0, inputValue = $$props.inputValue);
    		if ('inputMin' in $$props) $$invalidate(1, inputMin = $$props.inputMin);
    		if ('inputMax' in $$props) $$invalidate(2, inputMax = $$props.inputMax);
    		if ('inputName' in $$props) $$invalidate(3, inputName = $$props.inputName);
    		if ('rangeText' in $$props) $$invalidate(4, rangeText = $$props.rangeText);
    		if ('sign' in $$props) $$invalidate(5, sign = $$props.sign);
    		if ('isTimeBound' in $$props) $$invalidate(6, isTimeBound = $$props.isTimeBound);
    	};

    	$$self.$capture_state = () => ({
    		InputContainer,
    		requiredRange,
    		timeConverter,
    		createFieldValidator,
    		inputValue,
    		inputMin,
    		inputMax,
    		inputName,
    		rangeText,
    		sign,
    		isTimeBound,
    		validity,
    		validate,
    		$validity
    	});

    	$$self.$inject_state = $$props => {
    		if ('inputValue' in $$props) $$invalidate(0, inputValue = $$props.inputValue);
    		if ('inputMin' in $$props) $$invalidate(1, inputMin = $$props.inputMin);
    		if ('inputMax' in $$props) $$invalidate(2, inputMax = $$props.inputMax);
    		if ('inputName' in $$props) $$invalidate(3, inputName = $$props.inputName);
    		if ('rangeText' in $$props) $$invalidate(4, rangeText = $$props.rangeText);
    		if ('sign' in $$props) $$invalidate(5, sign = $$props.sign);
    		if ('isTimeBound' in $$props) $$invalidate(6, isTimeBound = $$props.isTimeBound);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		inputValue,
    		inputMin,
    		inputMax,
    		inputName,
    		rangeText,
    		sign,
    		isTimeBound,
    		$validity,
    		validity,
    		validate,
    		input_change_input_handler,
    		input_handler
    	];
    }

    class InputRange extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			inputValue: 0,
    			inputMin: 1,
    			inputMax: 2,
    			inputName: 3,
    			rangeText: 4,
    			sign: 5,
    			isTimeBound: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputRange",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get inputValue() {
    		throw new Error("<InputRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputValue(value) {
    		throw new Error("<InputRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputMin() {
    		throw new Error("<InputRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputMin(value) {
    		throw new Error("<InputRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputMax() {
    		throw new Error("<InputRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputMax(value) {
    		throw new Error("<InputRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputName() {
    		throw new Error("<InputRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputName(value) {
    		throw new Error("<InputRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rangeText() {
    		throw new Error("<InputRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rangeText(value) {
    		throw new Error("<InputRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sign() {
    		throw new Error("<InputRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sign(value) {
    		throw new Error("<InputRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isTimeBound() {
    		throw new Error("<InputRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isTimeBound(value) {
    		throw new Error("<InputRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\InputCheckbox.svelte generated by Svelte v3.44.3 */

    const { console: console_1 } = globals;
    const file$1 = "src\\InputCheckbox.svelte";

    // (21:8) 
    function create_inputslot_slot(ctx) {
    	let div1;
    	let input;
    	let input_isvalid_value;
    	let t0;
    	let div0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			input = element("input");
    			t0 = space();
    			div0 = element("div");
    			t1 = text(/*checkboxtext*/ ctx[4]);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "name", /*inputName*/ ctx[3]);
    			attr_dev(input, "id", /*inputId*/ ctx[2]);
    			attr_dev(input, "isvalid", input_isvalid_value = /*$validityCheck*/ ctx[7].valid);
    			add_location(input, file$1, 25, 12, 849);
    			attr_dev(div0, "class", "checkbox-text");
    			add_location(div0, file$1, 36, 12, 1261);
    			attr_dev(div1, "class", "checkbox-container");
    			attr_dev(div1, "slot", "inputslot");
    			toggle_class(div1, "has-checkboxes", /*extracheckbox*/ ctx[6]);
    			add_location(div1, file$1, 20, 8, 700);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, input);
    			set_input_value(input, /*extracheckboxfocus*/ ctx[1]);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*change_handler*/ ctx[12], false, false, false),
    					listen_dev(input, "change", /*input_change_handler_1*/ ctx[13])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputName*/ 8) {
    				attr_dev(input, "name", /*inputName*/ ctx[3]);
    			}

    			if (dirty & /*inputId*/ 4) {
    				attr_dev(input, "id", /*inputId*/ ctx[2]);
    			}

    			if (dirty & /*$validityCheck*/ 128 && input_isvalid_value !== (input_isvalid_value = /*$validityCheck*/ ctx[7].valid)) {
    				attr_dev(input, "isvalid", input_isvalid_value);
    			}

    			if (dirty & /*extracheckboxfocus*/ 2) {
    				set_input_value(input, /*extracheckboxfocus*/ ctx[1]);
    			}

    			if (dirty & /*checkboxtext*/ 16) set_data_dev(t1, /*checkboxtext*/ ctx[4]);

    			if (dirty & /*extracheckbox*/ 64) {
    				toggle_class(div1, "has-checkboxes", /*extracheckbox*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_inputslot_slot.name,
    		type: "slot",
    		source: "(21:8) ",
    		ctx
    	});

    	return block;
    }

    // (39:8) 
    function create_extrainput_slot(ctx) {
    	let div1;
    	let input;
    	let t0;
    	let div0;
    	let t1;
    	let div1_visible_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			input = element("input");
    			t0 = space();
    			div0 = element("div");
    			t1 = text(/*extracheckboxtext*/ ctx[5]);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "name", /*inputName*/ ctx[3]);
    			attr_dev(input, "id", /*inputId*/ ctx[2]);
    			add_location(input, file$1, 45, 12, 1559);
    			attr_dev(div0, "class", "checkbox-text");
    			add_location(div0, file$1, 52, 12, 1759);
    			attr_dev(div1, "slot", "extrainput");
    			attr_dev(div1, "class", "checkbox-container");
    			attr_dev(div1, "id", "morecheckbox");
    			attr_dev(div1, "name", "morecheckbox");
    			attr_dev(div1, "visible", div1_visible_value = /*$validityCheck*/ ctx[7].valid && /*extracheckbox*/ ctx[6]);
    			add_location(div1, file$1, 38, 8, 1334);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, input);
    			set_input_value(input, /*inputValue*/ ctx[0]);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_handler*/ ctx[10], false, false, false),
    					listen_dev(input, "change", /*input_change_handler*/ ctx[11])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputName*/ 8) {
    				attr_dev(input, "name", /*inputName*/ ctx[3]);
    			}

    			if (dirty & /*inputId*/ 4) {
    				attr_dev(input, "id", /*inputId*/ ctx[2]);
    			}

    			if (dirty & /*inputValue*/ 1) {
    				set_input_value(input, /*inputValue*/ ctx[0]);
    			}

    			if (dirty & /*extracheckboxtext*/ 32) set_data_dev(t1, /*extracheckboxtext*/ ctx[5]);

    			if (dirty & /*$validityCheck, extracheckbox*/ 192 && div1_visible_value !== (div1_visible_value = /*$validityCheck*/ ctx[7].valid && /*extracheckbox*/ ctx[6])) {
    				attr_dev(div1, "visible", div1_visible_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_extrainput_slot.name,
    		type: "slot",
    		source: "(39:8) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let inputcontainer;
    	let current;

    	inputcontainer = new InputContainer({
    			props: {
    				$$slots: {
    					extrainput: [create_extrainput_slot],
    					inputslot: [create_inputslot_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(inputcontainer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(inputcontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const inputcontainer_changes = {};

    			if (dirty & /*$$scope, $validityCheck, extracheckbox, extracheckboxtext, inputName, inputId, inputValue, checkboxtext, extracheckboxfocus*/ 16639) {
    				inputcontainer_changes.$$scope = { dirty, ctx };
    			}

    			inputcontainer.$set(inputcontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputcontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputcontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inputcontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $validityCheck;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputCheckbox', slots, []);
    	let { inputValue = 1 } = $$props;
    	let { inputId = "" } = $$props;
    	let { inputName = "" } = $$props;
    	let { checkboxtext = "" } = $$props;
    	let { extracheckboxfocus = false } = $$props;
    	let { extracheckboxtext = "" } = $$props;
    	let { extracheckbox = false } = $$props;
    	let [validityCheck, validateCheck] = createFieldValidator(expandMore());
    	validate_store(validityCheck, 'validityCheck');
    	component_subscribe($$self, validityCheck, value => $$invalidate(7, $validityCheck = value));
    	console.log(extracheckboxfocus);
    	console.log($validityCheck.valid);

    	const writable_props = [
    		'inputValue',
    		'inputId',
    		'inputName',
    		'checkboxtext',
    		'extracheckboxfocus',
    		'extracheckboxtext',
    		'extracheckbox'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<InputCheckbox> was created with unknown prop '${key}'`);
    	});

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_change_handler() {
    		inputValue = this.value;
    		$$invalidate(0, inputValue);
    	}

    	const change_handler = () => {
    		validateCheck(this, extracheckboxfocus);
    		$$invalidate(1, extracheckboxfocus = $validityCheck.valid);
    	};

    	function input_change_handler_1() {
    		extracheckboxfocus = this.value;
    		$$invalidate(1, extracheckboxfocus);
    	}

    	$$self.$$set = $$props => {
    		if ('inputValue' in $$props) $$invalidate(0, inputValue = $$props.inputValue);
    		if ('inputId' in $$props) $$invalidate(2, inputId = $$props.inputId);
    		if ('inputName' in $$props) $$invalidate(3, inputName = $$props.inputName);
    		if ('checkboxtext' in $$props) $$invalidate(4, checkboxtext = $$props.checkboxtext);
    		if ('extracheckboxfocus' in $$props) $$invalidate(1, extracheckboxfocus = $$props.extracheckboxfocus);
    		if ('extracheckboxtext' in $$props) $$invalidate(5, extracheckboxtext = $$props.extracheckboxtext);
    		if ('extracheckbox' in $$props) $$invalidate(6, extracheckbox = $$props.extracheckbox);
    	};

    	$$self.$capture_state = () => ({
    		InputContainer,
    		expandMore,
    		requiredRange,
    		createFieldValidator,
    		inputValue,
    		inputId,
    		inputName,
    		checkboxtext,
    		extracheckboxfocus,
    		extracheckboxtext,
    		extracheckbox,
    		validityCheck,
    		validateCheck,
    		$validityCheck
    	});

    	$$self.$inject_state = $$props => {
    		if ('inputValue' in $$props) $$invalidate(0, inputValue = $$props.inputValue);
    		if ('inputId' in $$props) $$invalidate(2, inputId = $$props.inputId);
    		if ('inputName' in $$props) $$invalidate(3, inputName = $$props.inputName);
    		if ('checkboxtext' in $$props) $$invalidate(4, checkboxtext = $$props.checkboxtext);
    		if ('extracheckboxfocus' in $$props) $$invalidate(1, extracheckboxfocus = $$props.extracheckboxfocus);
    		if ('extracheckboxtext' in $$props) $$invalidate(5, extracheckboxtext = $$props.extracheckboxtext);
    		if ('extracheckbox' in $$props) $$invalidate(6, extracheckbox = $$props.extracheckbox);
    		if ('validityCheck' in $$props) $$invalidate(8, validityCheck = $$props.validityCheck);
    		if ('validateCheck' in $$props) $$invalidate(9, validateCheck = $$props.validateCheck);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		inputValue,
    		extracheckboxfocus,
    		inputId,
    		inputName,
    		checkboxtext,
    		extracheckboxtext,
    		extracheckbox,
    		$validityCheck,
    		validityCheck,
    		validateCheck,
    		input_handler,
    		input_change_handler,
    		change_handler,
    		input_change_handler_1
    	];
    }

    class InputCheckbox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			inputValue: 0,
    			inputId: 2,
    			inputName: 3,
    			checkboxtext: 4,
    			extracheckboxfocus: 1,
    			extracheckboxtext: 5,
    			extracheckbox: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputCheckbox",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get inputValue() {
    		throw new Error("<InputCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputValue(value) {
    		throw new Error("<InputCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputId() {
    		throw new Error("<InputCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputId(value) {
    		throw new Error("<InputCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputName() {
    		throw new Error("<InputCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputName(value) {
    		throw new Error("<InputCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checkboxtext() {
    		throw new Error("<InputCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checkboxtext(value) {
    		throw new Error("<InputCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get extracheckboxfocus() {
    		throw new Error("<InputCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set extracheckboxfocus(value) {
    		throw new Error("<InputCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get extracheckboxtext() {
    		throw new Error("<InputCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set extracheckboxtext(value) {
    		throw new Error("<InputCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get extracheckbox() {
    		throw new Error("<InputCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set extracheckbox(value) {
    		throw new Error("<InputCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.44.3 */
    const file = "src\\App.svelte";
    const get_inputslot_slot_changes = dirty => ({});
    const get_inputslot_slot_context = ctx => ({});

    function create_fragment(ctx) {
    	let main;
    	let div;
    	let h2;
    	let t1;
    	let p;
    	let t3;
    	let t4;
    	let inputnumber;
    	let t5;
    	let inputcheckbox0;
    	let t6;
    	let inputcheckbox1;
    	let t7;
    	let inputrange0;
    	let t8;
    	let inputrange1;
    	let current;
    	const inputslot_slot_template = /*#slots*/ ctx[1].inputslot;
    	const inputslot_slot = create_slot(inputslot_slot_template, ctx, /*$$scope*/ ctx[0], get_inputslot_slot_context);

    	inputnumber = new InputNumber({
    			props: {
    				slot: "inputslot",
    				inputPlaceholder: "Total Monthly Income",
    				inputId: "totalmonthlyincome",
    				inputName: "totalmonthlyincome",
    				isRequired: "true",
    				levelRange: "900",
    				sign: "€"
    			},
    			$$inline: true
    		});

    	inputcheckbox0 = new InputCheckbox({
    			props: {
    				slot: "inputslot",
    				inputValue: "",
    				inputName: "coapplicant",
    				inputId: "coapplicant",
    				checkboxtext: "Applying with a co-applicant?",
    				extracheckboxtext: ""
    			},
    			$$inline: true
    		});

    	inputcheckbox1 = new InputCheckbox({
    			props: {
    				slot: "inputslot",
    				inputValue: "",
    				inputName: "dependants",
    				inputId: "dependants",
    				checkboxtext: "More than one dependant in the family?",
    				extracheckboxtext: "How Many Dependants",
    				extracheckbox: "true"
    			},
    			$$inline: true
    		});

    	inputrange0 = new InputRange({
    			props: {
    				inputValue: "1",
    				inputMin: "1",
    				inputMax: "25",
    				inputName: "loanamount",
    				rangeText: "Enter Loan Amount",
    				sign: "€"
    			},
    			$$inline: true
    		});

    	inputrange1 = new InputRange({
    			props: {
    				inputValue: "0",
    				inputMin: "0",
    				inputMax: "40",
    				inputName: "loanduration",
    				rangeText: "Choose loan term",
    				sign: "Years",
    				isTimeBound: "true"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Mortgage Accesibility";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Get to know the type of mortgages that you can access.";
    			t3 = space();
    			if (inputslot_slot) inputslot_slot.c();
    			t4 = space();
    			create_component(inputnumber.$$.fragment);
    			t5 = space();
    			create_component(inputcheckbox0.$$.fragment);
    			t6 = space();
    			create_component(inputcheckbox1.$$.fragment);
    			t7 = space();
    			create_component(inputrange0.$$.fragment);
    			t8 = space();
    			create_component(inputrange1.$$.fragment);
    			add_location(h2, file, 8, 2, 207);
    			add_location(p, file, 9, 2, 240);
    			attr_dev(div, "class", "formcontainer");
    			add_location(div, file, 7, 1, 177);
    			attr_dev(main, "class", "svelte-1tky8bj");
    			add_location(main, file, 6, 0, 169);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(div, t3);

    			if (inputslot_slot) {
    				inputslot_slot.m(div, null);
    			}

    			append_dev(div, t4);
    			mount_component(inputnumber, div, null);
    			append_dev(div, t5);
    			mount_component(inputcheckbox0, div, null);
    			append_dev(div, t6);
    			mount_component(inputcheckbox1, div, null);
    			append_dev(div, t7);
    			mount_component(inputrange0, div, null);
    			append_dev(div, t8);
    			mount_component(inputrange1, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (inputslot_slot) {
    				if (inputslot_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						inputslot_slot,
    						inputslot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(inputslot_slot_template, /*$$scope*/ ctx[0], dirty, get_inputslot_slot_changes),
    						get_inputslot_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputslot_slot, local);
    			transition_in(inputnumber.$$.fragment, local);
    			transition_in(inputcheckbox0.$$.fragment, local);
    			transition_in(inputcheckbox1.$$.fragment, local);
    			transition_in(inputrange0.$$.fragment, local);
    			transition_in(inputrange1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputslot_slot, local);
    			transition_out(inputnumber.$$.fragment, local);
    			transition_out(inputcheckbox0.$$.fragment, local);
    			transition_out(inputcheckbox1.$$.fragment, local);
    			transition_out(inputrange0.$$.fragment, local);
    			transition_out(inputrange1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (inputslot_slot) inputslot_slot.d(detaching);
    			destroy_component(inputnumber);
    			destroy_component(inputcheckbox0);
    			destroy_component(inputcheckbox1);
    			destroy_component(inputrange0);
    			destroy_component(inputrange1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, ['inputslot']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ InputNumber, InputRange, InputCheckbox });
    	return [$$scope, slots];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	// props: {
    	// 	name: 'world'
    	// }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
