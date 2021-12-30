
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
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
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
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

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
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
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
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

    const file$6 = "src\\InputContainer.svelte";
    const get_extra_dialog_slot_slot_changes = dirty => ({});
    const get_extra_dialog_slot_slot_context = ctx => ({});
    const get_outline_help_slot_slot_changes = dirty => ({});
    const get_outline_help_slot_slot_context = ctx => ({});
    const get_outline_emoji_slot_slot_changes = dirty => ({});
    const get_outline_emoji_slot_slot_context = ctx => ({});
    const get_extra_input_slot_slot_changes = dirty => ({});
    const get_extra_input_slot_slot_context = ctx => ({});
    const get_outline_text_slot_slot_changes = dirty => ({});
    const get_outline_text_slot_slot_context = ctx => ({});
    const get_outline_dialog_slot_slot_changes = dirty => ({});
    const get_outline_dialog_slot_slot_context = ctx => ({});
    const get_outline_symbol_slot_slot_changes = dirty => ({});
    const get_outline_symbol_slot_slot_context = ctx => ({});
    const get_input_slot_slot_changes$1 = dirty => ({});
    const get_input_slot_slot_context$1 = ctx => ({});

    function create_fragment$6(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let current;
    	const input_slot_slot_template = /*#slots*/ ctx[1]["input-slot"];
    	const input_slot_slot = create_slot(input_slot_slot_template, ctx, /*$$scope*/ ctx[0], get_input_slot_slot_context$1);
    	const outline_symbol_slot_slot_template = /*#slots*/ ctx[1]["outline-symbol-slot"];
    	const outline_symbol_slot_slot = create_slot(outline_symbol_slot_slot_template, ctx, /*$$scope*/ ctx[0], get_outline_symbol_slot_slot_context);
    	const outline_dialog_slot_slot_template = /*#slots*/ ctx[1]["outline-dialog-slot"];
    	const outline_dialog_slot_slot = create_slot(outline_dialog_slot_slot_template, ctx, /*$$scope*/ ctx[0], get_outline_dialog_slot_slot_context);
    	const outline_text_slot_slot_template = /*#slots*/ ctx[1]["outline-text-slot"];
    	const outline_text_slot_slot = create_slot(outline_text_slot_slot_template, ctx, /*$$scope*/ ctx[0], get_outline_text_slot_slot_context);
    	const extra_input_slot_slot_template = /*#slots*/ ctx[1]["extra-input-slot"];
    	const extra_input_slot_slot = create_slot(extra_input_slot_slot_template, ctx, /*$$scope*/ ctx[0], get_extra_input_slot_slot_context);
    	const outline_emoji_slot_slot_template = /*#slots*/ ctx[1]["outline-emoji-slot"];
    	const outline_emoji_slot_slot = create_slot(outline_emoji_slot_slot_template, ctx, /*$$scope*/ ctx[0], get_outline_emoji_slot_slot_context);
    	const outline_help_slot_slot_template = /*#slots*/ ctx[1]["outline-help-slot"];
    	const outline_help_slot_slot = create_slot(outline_help_slot_slot_template, ctx, /*$$scope*/ ctx[0], get_outline_help_slot_slot_context);
    	const extra_dialog_slot_slot_template = /*#slots*/ ctx[1]["extra-dialog-slot"];
    	const extra_dialog_slot_slot = create_slot(extra_dialog_slot_slot_template, ctx, /*$$scope*/ ctx[0], get_extra_dialog_slot_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (input_slot_slot) input_slot_slot.c();
    			t0 = space();
    			if (outline_symbol_slot_slot) outline_symbol_slot_slot.c();
    			t1 = space();
    			if (outline_dialog_slot_slot) outline_dialog_slot_slot.c();
    			t2 = space();
    			if (outline_text_slot_slot) outline_text_slot_slot.c();
    			t3 = space();
    			if (extra_input_slot_slot) extra_input_slot_slot.c();
    			t4 = space();
    			if (outline_emoji_slot_slot) outline_emoji_slot_slot.c();
    			t5 = space();
    			if (outline_help_slot_slot) outline_help_slot_slot.c();
    			t6 = space();
    			if (extra_dialog_slot_slot) extra_dialog_slot_slot.c();
    			attr_dev(div, "class", "input-container");
    			add_location(div, file$6, 2, 0, 21);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (input_slot_slot) {
    				input_slot_slot.m(div, null);
    			}

    			append_dev(div, t0);

    			if (outline_symbol_slot_slot) {
    				outline_symbol_slot_slot.m(div, null);
    			}

    			append_dev(div, t1);

    			if (outline_dialog_slot_slot) {
    				outline_dialog_slot_slot.m(div, null);
    			}

    			append_dev(div, t2);

    			if (outline_text_slot_slot) {
    				outline_text_slot_slot.m(div, null);
    			}

    			append_dev(div, t3);

    			if (extra_input_slot_slot) {
    				extra_input_slot_slot.m(div, null);
    			}

    			append_dev(div, t4);

    			if (outline_emoji_slot_slot) {
    				outline_emoji_slot_slot.m(div, null);
    			}

    			append_dev(div, t5);

    			if (outline_help_slot_slot) {
    				outline_help_slot_slot.m(div, null);
    			}

    			append_dev(div, t6);

    			if (extra_dialog_slot_slot) {
    				extra_dialog_slot_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (input_slot_slot) {
    				if (input_slot_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						input_slot_slot,
    						input_slot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(input_slot_slot_template, /*$$scope*/ ctx[0], dirty, get_input_slot_slot_changes$1),
    						get_input_slot_slot_context$1
    					);
    				}
    			}

    			if (outline_symbol_slot_slot) {
    				if (outline_symbol_slot_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						outline_symbol_slot_slot,
    						outline_symbol_slot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(outline_symbol_slot_slot_template, /*$$scope*/ ctx[0], dirty, get_outline_symbol_slot_slot_changes),
    						get_outline_symbol_slot_slot_context
    					);
    				}
    			}

    			if (outline_dialog_slot_slot) {
    				if (outline_dialog_slot_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						outline_dialog_slot_slot,
    						outline_dialog_slot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(outline_dialog_slot_slot_template, /*$$scope*/ ctx[0], dirty, get_outline_dialog_slot_slot_changes),
    						get_outline_dialog_slot_slot_context
    					);
    				}
    			}

    			if (outline_text_slot_slot) {
    				if (outline_text_slot_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						outline_text_slot_slot,
    						outline_text_slot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(outline_text_slot_slot_template, /*$$scope*/ ctx[0], dirty, get_outline_text_slot_slot_changes),
    						get_outline_text_slot_slot_context
    					);
    				}
    			}

    			if (extra_input_slot_slot) {
    				if (extra_input_slot_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						extra_input_slot_slot,
    						extra_input_slot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(extra_input_slot_slot_template, /*$$scope*/ ctx[0], dirty, get_extra_input_slot_slot_changes),
    						get_extra_input_slot_slot_context
    					);
    				}
    			}

    			if (outline_emoji_slot_slot) {
    				if (outline_emoji_slot_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						outline_emoji_slot_slot,
    						outline_emoji_slot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(outline_emoji_slot_slot_template, /*$$scope*/ ctx[0], dirty, get_outline_emoji_slot_slot_changes),
    						get_outline_emoji_slot_slot_context
    					);
    				}
    			}

    			if (outline_help_slot_slot) {
    				if (outline_help_slot_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						outline_help_slot_slot,
    						outline_help_slot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(outline_help_slot_slot_template, /*$$scope*/ ctx[0], dirty, get_outline_help_slot_slot_changes),
    						get_outline_help_slot_slot_context
    					);
    				}
    			}

    			if (extra_dialog_slot_slot) {
    				if (extra_dialog_slot_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						extra_dialog_slot_slot,
    						extra_dialog_slot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(extra_dialog_slot_slot_template, /*$$scope*/ ctx[0], dirty, get_extra_dialog_slot_slot_changes),
    						get_extra_dialog_slot_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input_slot_slot, local);
    			transition_in(outline_symbol_slot_slot, local);
    			transition_in(outline_dialog_slot_slot, local);
    			transition_in(outline_text_slot_slot, local);
    			transition_in(extra_input_slot_slot, local);
    			transition_in(outline_emoji_slot_slot, local);
    			transition_in(outline_help_slot_slot, local);
    			transition_in(extra_dialog_slot_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input_slot_slot, local);
    			transition_out(outline_symbol_slot_slot, local);
    			transition_out(outline_dialog_slot_slot, local);
    			transition_out(outline_text_slot_slot, local);
    			transition_out(extra_input_slot_slot, local);
    			transition_out(outline_emoji_slot_slot, local);
    			transition_out(outline_help_slot_slot, local);
    			transition_out(extra_dialog_slot_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (input_slot_slot) input_slot_slot.d(detaching);
    			if (outline_symbol_slot_slot) outline_symbol_slot_slot.d(detaching);
    			if (outline_dialog_slot_slot) outline_dialog_slot_slot.d(detaching);
    			if (outline_text_slot_slot) outline_text_slot_slot.d(detaching);
    			if (extra_input_slot_slot) extra_input_slot_slot.d(detaching);
    			if (outline_emoji_slot_slot) outline_emoji_slot_slot.d(detaching);
    			if (outline_help_slot_slot) outline_help_slot_slot.d(detaching);
    			if (extra_dialog_slot_slot) extra_dialog_slot_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;

    	validate_slots('InputContainer', slots, [
    		'input-slot','outline-symbol-slot','outline-dialog-slot','outline-text-slot','extra-input-slot','outline-emoji-slot','outline-help-slot','extra-dialog-slot'
    	]);

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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputContainer",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\PopDialog.svelte generated by Svelte v3.44.3 */

    const file$5 = "src\\PopDialog.svelte";
    const get_user_button_slot_changes = dirty => ({});
    const get_user_button_slot_context = ctx => ({});

    function create_fragment$5(ctx) {
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
    	const user_button_slot_template = /*#slots*/ ctx[6]["user-button"];
    	const user_button_slot = create_slot(user_button_slot_template, ctx, /*$$scope*/ ctx[5], get_user_button_slot_context);

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
    			add_location(h3, file$5, 9, 4, 346);
    			add_location(hr, file$5, 10, 4, 375);
    			attr_dev(dialog0, "class", "top");
    			add_location(dialog0, file$5, 11, 4, 387);
    			attr_dev(dialog1, "class", "tooltip");
    			toggle_class(dialog1, "visible", /*visibility*/ ctx[2] === "true" || /*visibility*/ ctx[2] === true);
    			toggle_class(dialog1, "side", /*isSide*/ ctx[4] === "true");
    			toggle_class(dialog1, "extra", /*isExtra*/ ctx[3] === "true");
    			add_location(dialog1, file$5, 8, 0, 191);
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
    				if (user_button_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						user_button_slot,
    						user_button_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(user_button_slot_template, /*$$scope*/ ctx[5], dirty, get_user_button_slot_changes),
    						get_user_button_slot_context
    					);
    				}
    			}

    			if (dirty & /*visibility*/ 4) {
    				toggle_class(dialog1, "visible", /*visibility*/ ctx[2] === "true" || /*visibility*/ ctx[2] === true);
    			}

    			if (dirty & /*isSide*/ 16) {
    				toggle_class(dialog1, "side", /*isSide*/ ctx[4] === "true");
    			}

    			if (dirty & /*isExtra*/ 8) {
    				toggle_class(dialog1, "extra", /*isExtra*/ ctx[3] === "true");
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PopDialog', slots, ['user-button']);
    	let { popupHeading = "" } = $$props;
    	let { popupText = "" } = $$props;
    	let { visibility = false } = $$props;
    	let { isExtra = false } = $$props;
    	let { isSide = false } = $$props;
    	const writable_props = ['popupHeading', 'popupText', 'visibility', 'isExtra', 'isSide'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PopDialog> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('popupHeading' in $$props) $$invalidate(0, popupHeading = $$props.popupHeading);
    		if ('popupText' in $$props) $$invalidate(1, popupText = $$props.popupText);
    		if ('visibility' in $$props) $$invalidate(2, visibility = $$props.visibility);
    		if ('isExtra' in $$props) $$invalidate(3, isExtra = $$props.isExtra);
    		if ('isSide' in $$props) $$invalidate(4, isSide = $$props.isSide);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		popupHeading,
    		popupText,
    		visibility,
    		isExtra,
    		isSide
    	});

    	$$self.$inject_state = $$props => {
    		if ('popupHeading' in $$props) $$invalidate(0, popupHeading = $$props.popupHeading);
    		if ('popupText' in $$props) $$invalidate(1, popupText = $$props.popupText);
    		if ('visibility' in $$props) $$invalidate(2, visibility = $$props.visibility);
    		if ('isExtra' in $$props) $$invalidate(3, isExtra = $$props.isExtra);
    		if ('isSide' in $$props) $$invalidate(4, isSide = $$props.isSide);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [popupHeading, popupText, visibility, isExtra, isSide, $$scope, slots];
    }

    class PopDialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			popupHeading: 0,
    			popupText: 1,
    			visibility: 2,
    			isExtra: 3,
    			isSide: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PopDialog",
    			options,
    			id: create_fragment$5.name
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

    	get isExtra() {
    		throw new Error("<PopDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isExtra(value) {
    		throw new Error("<PopDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSide() {
    		throw new Error("<PopDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSide(value) {
    		throw new Error("<PopDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
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
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const accumulator = writable([]);

    function nameValidator(){
      return function name(value){
        return (value != undefined && value.length > 2) || "Enter a valid name."
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
          
        return setVal
      }
    }

    function buildValidator (validators) {
        return function validate (value, dirty) {
          if (!validators || validators.length === 0) {
            return { dirty, valid: true }
          }
          
          const failing = validators.find(v => v(value) !== true);
      
          return {
            dirty,
            valid: !failing ,
            message: failing && failing(value),
            state: !!failing,
            response: failing && failing(value)
          }
        }
      }

    function createFieldValidator(componentName, isRequired, ...validators) {
      const { subscribe, set } = writable({ dirty: false, valid: false, message: null, response: null, state: false });
      const validator = buildValidator(validators);
      if (isRequired || isRequired === "true") {
        accumulator.update((n) =>
          n.concat([{ component: componentName, ready: false }])
        );
      }
      function action(node, binding) {
        function validate(value, dirty) {
          const result = validator(value, dirty);
          set(result);
        }

        validate(binding, false);

        return {
          update(value) {
            validate(value, true);
          }
        }
      }

      return [{ subscribe }, action]
    }

    /* src\InputNumber.svelte generated by Svelte v3.44.3 */
    const file$4 = "src\\InputNumber.svelte";
    const get_container_help_slot_slot_changes = dirty => ({});
    const get_container_help_slot_slot_context = ctx => ({ slot: "outline-help-slot" });
    const get_extra_dialog_slot_changes = dirty => ({});
    const get_extra_dialog_slot_context = ctx => ({ slot: "extra-dialog-slot" });

    // (40:4) 
    function create_input_slot_slot$3(ctx) {
    	let input;
    	let input_pullupdialog_value;
    	let input_isinputok_value;
    	let validate_action;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "slot", "input-slot");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "name", /*inputName*/ ctx[1]);
    			attr_dev(input, "id", /*inputId*/ ctx[2]);
    			attr_dev(input, "placeholder", /*inputPlaceholder*/ ctx[3]);
    			attr_dev(input, "onscreenvalue", /*inputValue*/ ctx[0]);
    			attr_dev(input, "pullupdialog", input_pullupdialog_value = /*$validity*/ ctx[6].dirty && !/*$validity*/ ctx[6].valid);
    			attr_dev(input, "isinputok", input_isinputok_value = /*$validity*/ ctx[6].valid);
    			toggle_class(input, "activated", /*$validity*/ ctx[6].valid);
    			add_location(input, file$4, 39, 4, 1334);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*inputValue*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[13]),
    					action_destroyer(validate_action = /*validate*/ ctx[8].call(null, input, /*inputValue*/ ctx[0]))
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

    			if (dirty & /*$validity*/ 64 && input_pullupdialog_value !== (input_pullupdialog_value = /*$validity*/ ctx[6].dirty && !/*$validity*/ ctx[6].valid)) {
    				attr_dev(input, "pullupdialog", input_pullupdialog_value);
    			}

    			if (dirty & /*$validity*/ 64 && input_isinputok_value !== (input_isinputok_value = /*$validity*/ ctx[6].valid)) {
    				attr_dev(input, "isinputok", input_isinputok_value);
    			}

    			if (dirty & /*inputValue*/ 1 && to_number(input.value) !== /*inputValue*/ ctx[0]) {
    				set_input_value(input, /*inputValue*/ ctx[0]);
    			}

    			if (validate_action && is_function(validate_action.update) && dirty & /*inputValue*/ 1) validate_action.update.call(null, /*inputValue*/ ctx[0]);

    			if (dirty & /*$validity*/ 64) {
    				toggle_class(input, "activated", /*$validity*/ ctx[6].valid);
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
    		id: create_input_slot_slot$3.name,
    		type: "slot",
    		source: "(40:4) ",
    		ctx
    	});

    	return block;
    }

    // (53:4) 
    function create_outline_symbol_slot_slot(ctx) {
    	let span;
    	let span_isinputok_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "isinputok", span_isinputok_value = /*$validity*/ ctx[6].valid);
    			attr_dev(span, "class", "outline-symbol-slot");
    			attr_dev(span, "slot", "outline-symbol-slot");
    			add_location(span, file$4, 52, 4, 1736);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			span.innerHTML = /*sign*/ ctx[4];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sign*/ 16) span.innerHTML = /*sign*/ ctx[4];
    			if (dirty & /*$validity*/ 64 && span_isinputok_value !== (span_isinputok_value = /*$validity*/ ctx[6].valid)) {
    				attr_dev(span, "isinputok", span_isinputok_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_outline_symbol_slot_slot.name,
    		type: "slot",
    		source: "(53:4) ",
    		ctx
    	});

    	return block;
    }

    // (58:4) 
    function create_outline_dialog_slot_slot$1(ctx) {
    	let popdialog;
    	let current;

    	popdialog = new PopDialog({
    			props: {
    				popupText: /*$validity*/ ctx[6].message != undefined
    				? /*$validity*/ ctx[6].message
    				: "cool",
    				slot: "outline-dialog-slot",
    				isExtra: "false",
    				isSide: "true"
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

    			if (dirty & /*$validity*/ 64) popdialog_changes.popupText = /*$validity*/ ctx[6].message != undefined
    			? /*$validity*/ ctx[6].message
    			: "cool";

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
    		id: create_outline_dialog_slot_slot$1.name,
    		type: "slot",
    		source: "(58:4) ",
    		ctx
    	});

    	return block;
    }

    // (64:4) 
    function create_outline_text_slot_slot$1(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*inputPlaceholder*/ ctx[3]);
    			attr_dev(span, "class", "outline-text-slot");
    			attr_dev(span, "slot", "outline-text-slot");
    			add_location(span, file$4, 63, 4, 2068);
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
    		id: create_outline_text_slot_slot$1.name,
    		type: "slot",
    		source: "(64:4) ",
    		ctx
    	});

    	return block;
    }

    // (67:4) 
    function create_outline_help_slot_slot(ctx) {
    	let current;
    	const container_help_slot_slot_template = /*#slots*/ ctx[12]["container-help-slot"];
    	const container_help_slot_slot = create_slot(container_help_slot_slot_template, ctx, /*$$scope*/ ctx[14], get_container_help_slot_slot_context);

    	const block = {
    		c: function create() {
    			if (container_help_slot_slot) container_help_slot_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (container_help_slot_slot) {
    				container_help_slot_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (container_help_slot_slot) {
    				if (container_help_slot_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						container_help_slot_slot,
    						container_help_slot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(container_help_slot_slot_template, /*$$scope*/ ctx[14], dirty, get_container_help_slot_slot_changes),
    						get_container_help_slot_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container_help_slot_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container_help_slot_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (container_help_slot_slot) container_help_slot_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_outline_help_slot_slot.name,
    		type: "slot",
    		source: "(67:4) ",
    		ctx
    	});

    	return block;
    }

    // (69:4) 
    function create_outline_emoji_slot_slot$1(ctx) {
    	let span;
    	let t;
    	let span_isinputok_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*emoji*/ ctx[5]);
    			attr_dev(span, "class", "outline-emoji");
    			attr_dev(span, "isinputok", span_isinputok_value = /*$validity*/ ctx[6].valid);
    			attr_dev(span, "slot", "outline-emoji-slot");
    			add_location(span, file$4, 68, 4, 2247);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*emoji*/ 32) set_data_dev(t, /*emoji*/ ctx[5]);

    			if (dirty & /*$validity*/ 64 && span_isinputok_value !== (span_isinputok_value = /*$validity*/ ctx[6].valid)) {
    				attr_dev(span, "isinputok", span_isinputok_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_outline_emoji_slot_slot$1.name,
    		type: "slot",
    		source: "(69:4) ",
    		ctx
    	});

    	return block;
    }

    // (70:4) 
    function create_extra_dialog_slot_slot(ctx) {
    	let current;
    	const extra_dialog_slot_template = /*#slots*/ ctx[12]["extra-dialog"];
    	const extra_dialog_slot = create_slot(extra_dialog_slot_template, ctx, /*$$scope*/ ctx[14], get_extra_dialog_slot_context);

    	const block = {
    		c: function create() {
    			if (extra_dialog_slot) extra_dialog_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (extra_dialog_slot) {
    				extra_dialog_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (extra_dialog_slot) {
    				if (extra_dialog_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						extra_dialog_slot,
    						extra_dialog_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(extra_dialog_slot_template, /*$$scope*/ ctx[14], dirty, get_extra_dialog_slot_changes),
    						get_extra_dialog_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(extra_dialog_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(extra_dialog_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (extra_dialog_slot) extra_dialog_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_extra_dialog_slot_slot.name,
    		type: "slot",
    		source: "(70:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let inputcontainer;
    	let current;

    	inputcontainer = new InputContainer({
    			props: {
    				$$slots: {
    					"extra-dialog-slot": [create_extra_dialog_slot_slot],
    					"outline-emoji-slot": [create_outline_emoji_slot_slot$1],
    					"outline-help-slot": [create_outline_help_slot_slot],
    					"outline-text-slot": [create_outline_text_slot_slot$1],
    					"outline-dialog-slot": [create_outline_dialog_slot_slot$1],
    					"outline-symbol-slot": [create_outline_symbol_slot_slot],
    					"input-slot": [create_input_slot_slot$3]
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

    			if (dirty & /*$$scope, $validity, emoji, inputPlaceholder, sign, inputName, inputId, inputValue*/ 16511) {
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $validity;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputNumber', slots, ['extra-dialog','container-help-slot']);
    	let { inputValue } = $$props;
    	let { inputName } = $$props;
    	let { inputId } = $$props;
    	let { inputPlaceholder } = $$props;
    	let { isRequired = false } = $$props;
    	let { levelRange = 0 } = $$props;
    	let { sign = "" } = $$props;
    	let { emoji = "" } = $$props;
    	let { hasHelp = false } = $$props;
    	const [validity, validate] = createFieldValidator(inputName, isRequired, requiredValidator(), requiredRange(levelRange));
    	validate_store(validity, 'validity');
    	component_subscribe($$self, validity, value => $$invalidate(6, $validity = value));

    	if (isRequired === true || isRequired === "true") {
    		const derivedClass = derived(validity, ($validity, set) => {
    			set($validity);
    		});

    		derivedClass.subscribe(value => {
    			let accum = get_store_value(accumulator);
    			let thisAccum = accum.find(v => v.component === inputName);
    			thisAccum.ready = $validity.valid;
    			accumulator.update(n => n = n);
    		});
    	}

    	const writable_props = [
    		'inputValue',
    		'inputName',
    		'inputId',
    		'inputPlaceholder',
    		'isRequired',
    		'levelRange',
    		'sign',
    		'emoji',
    		'hasHelp'
    	];

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
    		if ('isRequired' in $$props) $$invalidate(9, isRequired = $$props.isRequired);
    		if ('levelRange' in $$props) $$invalidate(10, levelRange = $$props.levelRange);
    		if ('sign' in $$props) $$invalidate(4, sign = $$props.sign);
    		if ('emoji' in $$props) $$invalidate(5, emoji = $$props.emoji);
    		if ('hasHelp' in $$props) $$invalidate(11, hasHelp = $$props.hasHelp);
    		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		InputContainer,
    		PopDialog,
    		get: get_store_value,
    		derived,
    		accumulator,
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
    		emoji,
    		hasHelp,
    		validity,
    		validate,
    		$validity
    	});

    	$$self.$inject_state = $$props => {
    		if ('inputValue' in $$props) $$invalidate(0, inputValue = $$props.inputValue);
    		if ('inputName' in $$props) $$invalidate(1, inputName = $$props.inputName);
    		if ('inputId' in $$props) $$invalidate(2, inputId = $$props.inputId);
    		if ('inputPlaceholder' in $$props) $$invalidate(3, inputPlaceholder = $$props.inputPlaceholder);
    		if ('isRequired' in $$props) $$invalidate(9, isRequired = $$props.isRequired);
    		if ('levelRange' in $$props) $$invalidate(10, levelRange = $$props.levelRange);
    		if ('sign' in $$props) $$invalidate(4, sign = $$props.sign);
    		if ('emoji' in $$props) $$invalidate(5, emoji = $$props.emoji);
    		if ('hasHelp' in $$props) $$invalidate(11, hasHelp = $$props.hasHelp);
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
    		emoji,
    		$validity,
    		validity,
    		validate,
    		isRequired,
    		levelRange,
    		hasHelp,
    		slots,
    		input_input_handler,
    		$$scope
    	];
    }

    class InputNumber extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			inputValue: 0,
    			inputName: 1,
    			inputId: 2,
    			inputPlaceholder: 3,
    			isRequired: 9,
    			levelRange: 10,
    			sign: 4,
    			emoji: 5,
    			hasHelp: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputNumber",
    			options,
    			id: create_fragment$4.name
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
    		throw new Error("<InputNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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

    	get emoji() {
    		throw new Error("<InputNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set emoji(value) {
    		throw new Error("<InputNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasHelp() {
    		throw new Error("<InputNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasHelp(value) {
    		throw new Error("<InputNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function tick_spring(ctx, last_value, current_value, target_value) {
        if (typeof current_value === 'number' || is_date(current_value)) {
            // @ts-ignore
            const delta = target_value - current_value;
            // @ts-ignore
            const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
            const spring = ctx.opts.stiffness * delta;
            const damper = ctx.opts.damping * velocity;
            const acceleration = (spring - damper) * ctx.inv_mass;
            const d = (velocity + acceleration) * ctx.dt;
            if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
                return target_value; // settled
            }
            else {
                ctx.settled = false; // signal loop to keep ticking
                // @ts-ignore
                return is_date(current_value) ?
                    new Date(current_value.getTime() + d) : current_value + d;
            }
        }
        else if (Array.isArray(current_value)) {
            // @ts-ignore
            return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
        }
        else if (typeof current_value === 'object') {
            const next_value = {};
            for (const k in current_value) {
                // @ts-ignore
                next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
            }
            // @ts-ignore
            return next_value;
        }
        else {
            throw new Error(`Cannot spring ${typeof current_value} values`);
        }
    }
    function spring(value, opts = {}) {
        const store = writable(value);
        const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
        let last_time;
        let task;
        let current_token;
        let last_value = value;
        let target_value = value;
        let inv_mass = 1;
        let inv_mass_recovery_rate = 0;
        let cancel_task = false;
        function set(new_value, opts = {}) {
            target_value = new_value;
            const token = current_token = {};
            if (value == null || opts.hard || (spring.stiffness >= 1 && spring.damping >= 1)) {
                cancel_task = true; // cancel any running animation
                last_time = now();
                last_value = new_value;
                store.set(value = target_value);
                return Promise.resolve();
            }
            else if (opts.soft) {
                const rate = opts.soft === true ? .5 : +opts.soft;
                inv_mass_recovery_rate = 1 / (rate * 60);
                inv_mass = 0; // infinite mass, unaffected by spring forces
            }
            if (!task) {
                last_time = now();
                cancel_task = false;
                task = loop(now => {
                    if (cancel_task) {
                        cancel_task = false;
                        task = null;
                        return false;
                    }
                    inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
                    const ctx = {
                        inv_mass,
                        opts: spring,
                        settled: true,
                        dt: (now - last_time) * 60 / 1000
                    };
                    const next_value = tick_spring(ctx, last_value, value, target_value);
                    last_time = now;
                    last_value = value;
                    store.set(value = next_value);
                    if (ctx.settled) {
                        task = null;
                    }
                    return !ctx.settled;
                });
            }
            return new Promise(fulfil => {
                task.promise.then(() => {
                    if (token === current_token)
                        fulfil();
                });
            });
        }
        const spring = {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe,
            stiffness,
            damping,
            precision
        };
        return spring;
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* src\InputRange.svelte generated by Svelte v3.44.3 */
    const file$3 = "src\\InputRange.svelte";

    // (35:4) 
    function create_input_slot_slot_1(ctx) {
    	let div;
    	let progress;
    	let t;
    	let input;
    	let input_isinputok_value;
    	let validate_action;
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
    			add_location(progress, file$3, 35, 8, 1204);
    			attr_dev(input, "min", /*inputMin*/ ctx[1]);
    			attr_dev(input, "max", /*inputMax*/ ctx[2]);
    			attr_dev(input, "name", /*inputName*/ ctx[3]);
    			attr_dev(input, "type", "range");
    			attr_dev(input, "isinputok", input_isinputok_value = /*$validity*/ ctx[7].state);
    			add_location(input, file$3, 36, 8, 1275);
    			attr_dev(div, "slot", "input-slot");
    			attr_dev(div, "class", "input-range-container svelte-1mbn4gz");
    			add_location(div, file$3, 34, 4, 1141);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, progress);
    			append_dev(div, t);
    			append_dev(div, input);
    			set_input_value(input, /*inputValue*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[11]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[11]),
    					action_destroyer(validate_action = /*validate*/ ctx[9].call(null, input, /*inputValue*/ ctx[0]))
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

    			if (dirty & /*$validity*/ 128 && input_isinputok_value !== (input_isinputok_value = /*$validity*/ ctx[7].state)) {
    				attr_dev(input, "isinputok", input_isinputok_value);
    			}

    			if (dirty & /*inputValue*/ 1) {
    				set_input_value(input, /*inputValue*/ ctx[0]);
    			}

    			if (validate_action && is_function(validate_action.update) && dirty & /*inputValue*/ 1) validate_action.update.call(null, /*inputValue*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_input_slot_slot_1.name,
    		type: "slot",
    		source: "(35:4) ",
    		ctx
    	});

    	return block;
    }

    // (53:8) {:else}
    function create_else_block(ctx) {
    	let span;
    	let html_tag;
    	let t0;
    	let t1_value = /*inputValue*/ ctx[0] * 1000 + "";
    	let t1;
    	let span_isinputok_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			html_tag = new HtmlTag();
    			t0 = space();
    			t1 = text(t1_value);
    			html_tag.a = t0;
    			attr_dev(span, "isinputok", span_isinputok_value = /*$validity*/ ctx[7].state);
    			attr_dev(span, "class", "outline-symbol-text");
    			add_location(span, file$3, 53, 8, 1839);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			html_tag.m(/*sign*/ ctx[5], span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sign*/ 32) html_tag.p(/*sign*/ ctx[5]);
    			if (dirty & /*inputValue*/ 1 && t1_value !== (t1_value = /*inputValue*/ ctx[0] * 1000 + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*$validity*/ 128 && span_isinputok_value !== (span_isinputok_value = /*$validity*/ ctx[7].state)) {
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
    		source: "(53:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (51:8) {#if isTimeBound}
    function create_if_block(ctx) {
    	let span;
    	let t_value = /*$validity*/ ctx[7].response + "";
    	let t;
    	let span_isinputok_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "isinputok", span_isinputok_value = /*$validity*/ ctx[7].state);
    			attr_dev(span, "class", "outline-symbol-text");
    			add_location(span, file$3, 51, 8, 1723);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$validity*/ 128 && t_value !== (t_value = /*$validity*/ ctx[7].response + "")) set_data_dev(t, t_value);

    			if (dirty & /*$validity*/ 128 && span_isinputok_value !== (span_isinputok_value = /*$validity*/ ctx[7].state)) {
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
    		source: "(51:8) {#if isTimeBound}",
    		ctx
    	});

    	return block;
    }

    // (49:4) 
    function create_input_slot_slot$2(ctx) {
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
    			add_location(span, file$3, 49, 8, 1640);
    			attr_dev(div, "slot", "input-slot");
    			attr_dev(div, "class", "input-range-container svelte-1mbn4gz");
    			add_location(div, file$3, 48, 4, 1577);
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
    		id: create_input_slot_slot$2.name,
    		type: "slot",
    		source: "(49:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let inputcontainer0;
    	let t;
    	let inputcontainer1;
    	let current;

    	inputcontainer0 = new InputContainer({
    			props: {
    				$$slots: { "input-slot": [create_input_slot_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	inputcontainer1 = new InputContainer({
    			props: {
    				$$slots: { "input-slot": [create_input_slot_slot$2] },
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
    	validate_slots('InputRange', slots, []);
    	let { isRequired = false } = $$props;
    	let { inputValue = 0 } = $$props;
    	let { inputMin = 0 } = $$props;
    	let { inputMax = 0 } = $$props;
    	let { inputName = "" } = $$props;
    	let { rangeText = "" } = $$props;
    	let { sign = "" } = $$props;
    	let { isTimeBound = false } = $$props;
    	const [validity, validate] = createFieldValidator(inputName, isRequired, timeConverter());
    	validate_store(validity, 'validity');
    	component_subscribe($$self, validity, value => $$invalidate(7, $validity = value));

    	if (isRequired === true || isRequired === "true") {
    		const derivedClass = derived(validity, ($validity, set) => {
    			set($validity);
    		});

    		derivedClass.subscribe(value => {
    			let accum = get_store_value(accumulator);
    			let thisAccum = accum.find(v => v.component === inputName);
    			thisAccum.ready = $validity.state;
    			accumulator.update(n => n = n);
    		});
    	}

    	const writable_props = [
    		'isRequired',
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

    	$$self.$$set = $$props => {
    		if ('isRequired' in $$props) $$invalidate(10, isRequired = $$props.isRequired);
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
    		timeConverter,
    		get: get_store_value,
    		derived,
    		accumulator,
    		createFieldValidator,
    		isRequired,
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
    		if ('isRequired' in $$props) $$invalidate(10, isRequired = $$props.isRequired);
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
    		isRequired,
    		input_change_input_handler
    	];
    }

    class InputRange extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			isRequired: 10,
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
    			id: create_fragment$3.name
    		});
    	}

    	get isRequired() {
    		throw new Error("<InputRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isRequired(value) {
    		throw new Error("<InputRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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
    const file$2 = "src\\InputCheckbox.svelte";

    // (35:4) 
    function create_input_slot_slot$1(ctx) {
    	let div1;
    	let input;
    	let input_isinputok_value;
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
    			attr_dev(input, "isinputok", input_isinputok_value = /*$validity*/ ctx[7].valid);
    			add_location(input, file$2, 39, 8, 1358);
    			attr_dev(div0, "class", "checkbox-text");
    			add_location(div0, file$2, 50, 8, 1713);
    			attr_dev(div1, "class", "checkbox-container");
    			attr_dev(div1, "slot", "input-slot");
    			toggle_class(div1, "has-checkboxes", /*extracheckbox*/ ctx[6]);
    			add_location(div1, file$2, 34, 4, 1228);
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
    					listen_dev(input, "change", /*change_handler*/ ctx[13], false, false, false),
    					listen_dev(input, "change", /*input_change_handler_1*/ ctx[14])
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

    			if (dirty & /*$validity*/ 128 && input_isinputok_value !== (input_isinputok_value = /*$validity*/ ctx[7].valid)) {
    				attr_dev(input, "isinputok", input_isinputok_value);
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
    		id: create_input_slot_slot$1.name,
    		type: "slot",
    		source: "(35:4) ",
    		ctx
    	});

    	return block;
    }

    // (53:4) 
    function create_extra_input_slot_slot(ctx) {
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
    			add_location(input, file$2, 59, 8, 1976);
    			attr_dev(div0, "class", "checkbox-text");
    			add_location(div0, file$2, 66, 8, 2148);
    			attr_dev(div1, "slot", "extra-input-slot");
    			attr_dev(div1, "class", "checkbox-container");
    			attr_dev(div1, "id", "morecheckbox");
    			attr_dev(div1, "name", "morecheckbox");
    			attr_dev(div1, "visible", div1_visible_value = /*$validity*/ ctx[7].valid && /*extracheckbox*/ ctx[6]);
    			add_location(div1, file$2, 52, 4, 1778);
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
    					listen_dev(input, "input", /*input_handler*/ ctx[11], false, false, false),
    					listen_dev(input, "change", /*input_change_handler*/ ctx[12])
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

    			if (dirty & /*$validity, extracheckbox*/ 192 && div1_visible_value !== (div1_visible_value = /*$validity*/ ctx[7].valid && /*extracheckbox*/ ctx[6])) {
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
    		id: create_extra_input_slot_slot.name,
    		type: "slot",
    		source: "(53:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let inputcontainer;
    	let current;

    	inputcontainer = new InputContainer({
    			props: {
    				$$slots: {
    					"extra-input-slot": [create_extra_input_slot_slot],
    					"input-slot": [create_input_slot_slot$1]
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

    			if (dirty & /*$$scope, $validity, extracheckbox, extracheckboxtext, inputName, inputId, inputValue, checkboxtext, extracheckboxfocus*/ 33023) {
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
    	validate_slots('InputCheckbox', slots, []);
    	let { inputValue = 1 } = $$props;
    	let { inputId = "" } = $$props;
    	let { inputName = "" } = $$props;
    	let { checkboxtext = "" } = $$props;
    	let { isRequired = false } = $$props;
    	let { extracheckboxfocus = false } = $$props;
    	let { extracheckboxtext = "" } = $$props;
    	let { extracheckbox = false } = $$props;
    	let [validity, validate] = createFieldValidator(inputName, isRequired, expandMore());
    	validate_store(validity, 'validity');
    	component_subscribe($$self, validity, value => $$invalidate(7, $validity = value));

    	if (isRequired === true || isRequired === "true") {
    		const derivedClass = derived(validity, ($validity, set) => {
    			set($validity);
    		});

    		derivedClass.subscribe(value => {
    			let accum = get_store_value(accumulator);
    			let thisAccum = accum.find(v => v.component === inputName);
    			thisAccum.ready = $validity.valid;
    			accumulator.update(n => n = n);
    		});
    	}

    	const writable_props = [
    		'inputValue',
    		'inputId',
    		'inputName',
    		'checkboxtext',
    		'isRequired',
    		'extracheckboxfocus',
    		'extracheckboxtext',
    		'extracheckbox'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputCheckbox> was created with unknown prop '${key}'`);
    	});

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_change_handler() {
    		inputValue = this.value;
    		$$invalidate(0, inputValue);
    	}

    	const change_handler = () => {
    		validate(this, extracheckboxfocus);
    		$$invalidate(1, extracheckboxfocus = $validity.valid);
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
    		if ('isRequired' in $$props) $$invalidate(10, isRequired = $$props.isRequired);
    		if ('extracheckboxfocus' in $$props) $$invalidate(1, extracheckboxfocus = $$props.extracheckboxfocus);
    		if ('extracheckboxtext' in $$props) $$invalidate(5, extracheckboxtext = $$props.extracheckboxtext);
    		if ('extracheckbox' in $$props) $$invalidate(6, extracheckbox = $$props.extracheckbox);
    	};

    	$$self.$capture_state = () => ({
    		InputContainer,
    		expandMore,
    		createFieldValidator,
    		get: get_store_value,
    		derived,
    		accumulator,
    		inputValue,
    		inputId,
    		inputName,
    		checkboxtext,
    		isRequired,
    		extracheckboxfocus,
    		extracheckboxtext,
    		extracheckbox,
    		validity,
    		validate,
    		$validity
    	});

    	$$self.$inject_state = $$props => {
    		if ('inputValue' in $$props) $$invalidate(0, inputValue = $$props.inputValue);
    		if ('inputId' in $$props) $$invalidate(2, inputId = $$props.inputId);
    		if ('inputName' in $$props) $$invalidate(3, inputName = $$props.inputName);
    		if ('checkboxtext' in $$props) $$invalidate(4, checkboxtext = $$props.checkboxtext);
    		if ('isRequired' in $$props) $$invalidate(10, isRequired = $$props.isRequired);
    		if ('extracheckboxfocus' in $$props) $$invalidate(1, extracheckboxfocus = $$props.extracheckboxfocus);
    		if ('extracheckboxtext' in $$props) $$invalidate(5, extracheckboxtext = $$props.extracheckboxtext);
    		if ('extracheckbox' in $$props) $$invalidate(6, extracheckbox = $$props.extracheckbox);
    		if ('validity' in $$props) $$invalidate(8, validity = $$props.validity);
    		if ('validate' in $$props) $$invalidate(9, validate = $$props.validate);
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
    		$validity,
    		validity,
    		validate,
    		isRequired,
    		input_handler,
    		input_change_handler,
    		change_handler,
    		input_change_handler_1
    	];
    }

    class InputCheckbox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			inputValue: 0,
    			inputId: 2,
    			inputName: 3,
    			checkboxtext: 4,
    			isRequired: 10,
    			extracheckboxfocus: 1,
    			extracheckboxtext: 5,
    			extracheckbox: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputCheckbox",
    			options,
    			id: create_fragment$2.name
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

    	get isRequired() {
    		throw new Error("<InputCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isRequired(value) {
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

    /* src\InputText.svelte generated by Svelte v3.44.3 */
    const file$1 = "src\\InputText.svelte";

    // (48:8) 
    function create_user_button_slot$1(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "slot", "user-button");
    			add_location(button, file$1, 47, 8, 1674);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_user_button_slot$1.name,
    		type: "slot",
    		source: "(48:8) ",
    		ctx
    	});

    	return block;
    }

    // (33:0) <InputContainer>
    function create_default_slot(ctx) {
    	let popdialog;
    	let current;

    	popdialog = new PopDialog({
    			props: {
    				popupHeading: /*helpTextHeading*/ ctx[2],
    				popupText: /*helpText*/ ctx[1],
    				visibility: false,
    				$$slots: { "user-button": [create_user_button_slot$1] },
    				$$scope: { ctx }
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
    			if (dirty & /*helpTextHeading*/ 4) popdialog_changes.popupHeading = /*helpTextHeading*/ ctx[2];
    			if (dirty & /*helpText*/ 2) popdialog_changes.popupText = /*helpText*/ ctx[1];

    			if (dirty & /*$$scope*/ 4096) {
    				popdialog_changes.$$scope = { dirty, ctx };
    			}

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
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(33:0) <InputContainer>",
    		ctx
    	});

    	return block;
    }

    // (34:4) 
    function create_input_slot_slot(ctx) {
    	let input;
    	let input_pullupdialog_value;
    	let input_isinputok_value;
    	let validate_action;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "slot", "input-slot");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", /*inputName*/ ctx[3]);
    			attr_dev(input, "id", /*inputId*/ ctx[4]);
    			attr_dev(input, "placeholder", /*inputPlaceholder*/ ctx[5]);
    			attr_dev(input, "onscreenvalue", /*inputValue*/ ctx[0]);
    			attr_dev(input, "pullupdialog", input_pullupdialog_value = /*$validity*/ ctx[7].dirty && !/*$validity*/ ctx[7].valid);
    			attr_dev(input, "isinputok", input_isinputok_value = /*$validity*/ ctx[7].valid);
    			toggle_class(input, "activated", /*$validity*/ ctx[7].valid);
    			add_location(input, file$1, 33, 4, 1182);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*inputValue*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[11]),
    					action_destroyer(validate_action = /*validate*/ ctx[9].call(null, input, /*inputValue*/ ctx[0]))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputName*/ 8) {
    				attr_dev(input, "name", /*inputName*/ ctx[3]);
    			}

    			if (dirty & /*inputId*/ 16) {
    				attr_dev(input, "id", /*inputId*/ ctx[4]);
    			}

    			if (dirty & /*inputPlaceholder*/ 32) {
    				attr_dev(input, "placeholder", /*inputPlaceholder*/ ctx[5]);
    			}

    			if (dirty & /*inputValue*/ 1) {
    				attr_dev(input, "onscreenvalue", /*inputValue*/ ctx[0]);
    			}

    			if (dirty & /*$validity*/ 128 && input_pullupdialog_value !== (input_pullupdialog_value = /*$validity*/ ctx[7].dirty && !/*$validity*/ ctx[7].valid)) {
    				attr_dev(input, "pullupdialog", input_pullupdialog_value);
    			}

    			if (dirty & /*$validity*/ 128 && input_isinputok_value !== (input_isinputok_value = /*$validity*/ ctx[7].valid)) {
    				attr_dev(input, "isinputok", input_isinputok_value);
    			}

    			if (dirty & /*inputValue*/ 1 && input.value !== /*inputValue*/ ctx[0]) {
    				set_input_value(input, /*inputValue*/ ctx[0]);
    			}

    			if (validate_action && is_function(validate_action.update) && dirty & /*inputValue*/ 1) validate_action.update.call(null, /*inputValue*/ ctx[0]);

    			if (dirty & /*$validity*/ 128) {
    				toggle_class(input, "activated", /*$validity*/ ctx[7].valid);
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
    		id: create_input_slot_slot.name,
    		type: "slot",
    		source: "(34:4) ",
    		ctx
    	});

    	return block;
    }

    // (50:4) 
    function create_outline_dialog_slot_slot(ctx) {
    	let popdialog;
    	let current;

    	popdialog = new PopDialog({
    			props: {
    				popupText: /*$validity*/ ctx[7].message != undefined
    				? /*$validity*/ ctx[7].message
    				: "cool",
    				slot: "outline-dialog-slot"
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

    			if (dirty & /*$validity*/ 128) popdialog_changes.popupText = /*$validity*/ ctx[7].message != undefined
    			? /*$validity*/ ctx[7].message
    			: "cool";

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
    		id: create_outline_dialog_slot_slot.name,
    		type: "slot",
    		source: "(50:4) ",
    		ctx
    	});

    	return block;
    }

    // (51:4) 
    function create_outline_text_slot_slot(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*inputPlaceholder*/ ctx[5]);
    			attr_dev(span, "class", "outline-text-slot");
    			attr_dev(span, "slot", "outline-text-slot");
    			add_location(span, file$1, 50, 4, 1852);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputPlaceholder*/ 32) set_data_dev(t, /*inputPlaceholder*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_outline_text_slot_slot.name,
    		type: "slot",
    		source: "(51:4) ",
    		ctx
    	});

    	return block;
    }

    // (52:4) 
    function create_outline_emoji_slot_slot(ctx) {
    	let span;
    	let t;
    	let span_isinputok_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*emoji*/ ctx[6]);
    			attr_dev(span, "class", "outline-emoji");
    			attr_dev(span, "isinputok", span_isinputok_value = /*$validity*/ ctx[7].valid);
    			attr_dev(span, "slot", "outline-emoji-slot");
    			add_location(span, file$1, 51, 4, 1940);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*emoji*/ 64) set_data_dev(t, /*emoji*/ ctx[6]);

    			if (dirty & /*$validity*/ 128 && span_isinputok_value !== (span_isinputok_value = /*$validity*/ ctx[7].valid)) {
    				attr_dev(span, "isinputok", span_isinputok_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_outline_emoji_slot_slot.name,
    		type: "slot",
    		source: "(52:4) ",
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
    					"outline-emoji-slot": [create_outline_emoji_slot_slot],
    					"outline-text-slot": [create_outline_text_slot_slot],
    					"outline-dialog-slot": [create_outline_dialog_slot_slot],
    					"input-slot": [create_input_slot_slot],
    					default: [create_default_slot]
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

    			if (dirty & /*$$scope, $validity, emoji, inputPlaceholder, inputName, inputId, inputValue, helpTextHeading, helpText*/ 4351) {
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
    	let $validity;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputText', slots, []);
    	let { inputValue = "" } = $$props;
    	let { helpText = "" } = $$props;
    	let { helpTextHeading = "" } = $$props;
    	let { inputName = "" } = $$props;
    	let { inputId = "" } = $$props;
    	let { inputPlaceholder = "" } = $$props;
    	let { emoji = "" } = $$props;
    	let { isRequired = false } = $$props;
    	const [validity, validate] = createFieldValidator(inputName, isRequired, nameValidator());
    	validate_store(validity, 'validity');
    	component_subscribe($$self, validity, value => $$invalidate(7, $validity = value));

    	if (isRequired === true || isRequired === "true") {
    		const derivedClass = derived(validity, ($validity, set) => {
    			set($validity);
    		});

    		derivedClass.subscribe(value => {
    			let accum = get_store_value(accumulator);
    			let thisAccum = accum.find(v => v.component === inputName);
    			thisAccum.ready = $validity.valid;
    			accumulator.update(n => n = n);
    		});
    	}

    	const writable_props = [
    		'inputValue',
    		'helpText',
    		'helpTextHeading',
    		'inputName',
    		'inputId',
    		'inputPlaceholder',
    		'emoji',
    		'isRequired'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputText> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		inputValue = this.value;
    		$$invalidate(0, inputValue);
    	}

    	$$self.$$set = $$props => {
    		if ('inputValue' in $$props) $$invalidate(0, inputValue = $$props.inputValue);
    		if ('helpText' in $$props) $$invalidate(1, helpText = $$props.helpText);
    		if ('helpTextHeading' in $$props) $$invalidate(2, helpTextHeading = $$props.helpTextHeading);
    		if ('inputName' in $$props) $$invalidate(3, inputName = $$props.inputName);
    		if ('inputId' in $$props) $$invalidate(4, inputId = $$props.inputId);
    		if ('inputPlaceholder' in $$props) $$invalidate(5, inputPlaceholder = $$props.inputPlaceholder);
    		if ('emoji' in $$props) $$invalidate(6, emoji = $$props.emoji);
    		if ('isRequired' in $$props) $$invalidate(10, isRequired = $$props.isRequired);
    	};

    	$$self.$capture_state = () => ({
    		InputContainer,
    		PopDialog,
    		nameValidator,
    		createFieldValidator,
    		get: get_store_value,
    		derived,
    		accumulator,
    		inputValue,
    		helpText,
    		helpTextHeading,
    		inputName,
    		inputId,
    		inputPlaceholder,
    		emoji,
    		isRequired,
    		validity,
    		validate,
    		$validity
    	});

    	$$self.$inject_state = $$props => {
    		if ('inputValue' in $$props) $$invalidate(0, inputValue = $$props.inputValue);
    		if ('helpText' in $$props) $$invalidate(1, helpText = $$props.helpText);
    		if ('helpTextHeading' in $$props) $$invalidate(2, helpTextHeading = $$props.helpTextHeading);
    		if ('inputName' in $$props) $$invalidate(3, inputName = $$props.inputName);
    		if ('inputId' in $$props) $$invalidate(4, inputId = $$props.inputId);
    		if ('inputPlaceholder' in $$props) $$invalidate(5, inputPlaceholder = $$props.inputPlaceholder);
    		if ('emoji' in $$props) $$invalidate(6, emoji = $$props.emoji);
    		if ('isRequired' in $$props) $$invalidate(10, isRequired = $$props.isRequired);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		inputValue,
    		helpText,
    		helpTextHeading,
    		inputName,
    		inputId,
    		inputPlaceholder,
    		emoji,
    		$validity,
    		validity,
    		validate,
    		isRequired,
    		input_input_handler
    	];
    }

    class InputText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			inputValue: 0,
    			helpText: 1,
    			helpTextHeading: 2,
    			inputName: 3,
    			inputId: 4,
    			inputPlaceholder: 5,
    			emoji: 6,
    			isRequired: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputText",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get inputValue() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputValue(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helpText() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helpText(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helpTextHeading() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helpTextHeading(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputName() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputName(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputId() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputId(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputPlaceholder() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputPlaceholder(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get emoji() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set emoji(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isRequired() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isRequired(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function getClientStyle(component){
        return [window.getComputedStyle(component).transformOrigin, window.pageYOffset,window.pageXOffset]
    }

    var help = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.a{fill:#fff;}</style></defs><rect class="a" /><path d="M6.4,14H5.6a1.3,1.3,0,0,0-.1-.6,3.6,3.6,0,0,1,.2-1.1,2.6,2.6,0,0,1,1.1-1.4,2.2,2.2,0,0,0,.9-.7,3.6,3.6,0,0,0,.4-.9A2,2,0,0,0,8,8.6a1.2,1.2,0,0,0-1.1-.9,1.7,1.7,0,0,0-1.2.2A1.9,1.9,0,0,0,5,9v.2c0,.1,0,.1-.1.1H3.4c-.1,0-.1,0-.1-.1a1.6,1.6,0,0,1,.2-1A2.9,2.9,0,0,1,5.8,6.1H7.3a4.2,4.2,0,0,1,1.9.9,3.3,3.3,0,0,1,.7,1.6,3,3,0,0,1-1.4,3.2l-.8.6a1.3,1.3,0,0,0-.4,1,1.3,1.3,0,0,0-.1.6H6.4Z" transform="translate(5.4 0)"/><path d="M8,16.6a1.3,1.3,0,0,1-.1.6,1.2,1.2,0,0,1-1.1.8H6.1a1.3,1.3,0,0,1-.8-1.1,1.7,1.7,0,0,1,.1-.7,1.3,1.3,0,0,1,1.1-.8H7a1.4,1.4,0,0,1,1,1.2Z" transform="translate(5.4 0)"/></svg>';

    var euro = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.a{fill:#fff;opacity:0;}</style></defs><rect class="a" /><path d="M16.3,17.3a5.9,5.9,0,0,1-2.6.7A5.1,5.1,0,0,1,10,16.4a6.1,6.1,0,0,1-1.3-3.1h-1v-.8h.9v-.3c0-.3.1-.6.1-.8h-1v-.9H8.8a5.7,5.7,0,0,1,1.5-3A4.7,4.7,0,0,1,13.8,6a5,5,0,0,1,2.4.6l-.4,1.1a4.6,4.6,0,0,0-2-.5,2.9,2.9,0,0,0-2.3,1,4.5,4.5,0,0,0-1.1,2.3h5v.9H10.3v1.1h5.1v.8H10.3a4.4,4.4,0,0,0,1,2.3,3.2,3.2,0,0,0,2.5,1.1,4.3,4.3,0,0,0,2.2-.6Z"/></svg>';

    /* src\App.svelte generated by Svelte v3.44.3 */
    const file = "src\\App.svelte";
    const get_input_slot_slot_changes = dirty => ({});
    const get_input_slot_slot_context = ctx => ({});

    // (72:4) 
    function create_user_button_slot(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "OK";
    			attr_dev(button, "slot", "user-button");
    			attr_dev(button, "class", "navbutton");
    			add_location(button, file, 71, 4, 2154);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_user_button_slot.name,
    		type: "slot",
    		source: "(72:4) ",
    		ctx
    	});

    	return block;
    }

    // (65:3) 
    function create_extra_dialog_slot(ctx) {
    	let popdialog;
    	let current;

    	popdialog = new PopDialog({
    			props: {
    				isExtra: "true",
    				slot: "extra-dialog",
    				popupHeading: "Down Payment",
    				popupText: "This is the Downpayment slot",
    				visibility: /*helpDialog*/ ctx[2],
    				$$slots: { "user-button": [create_user_button_slot] },
    				$$scope: { ctx }
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
    			if (dirty & /*helpDialog*/ 4) popdialog_changes.visibility = /*helpDialog*/ ctx[2];

    			if (dirty & /*$$scope, helpDialog*/ 132) {
    				popdialog_changes.$$scope = { dirty, ctx };
    			}

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
    		id: create_extra_dialog_slot.name,
    		type: "slot",
    		source: "(65:3) ",
    		ctx
    	});

    	return block;
    }

    // (74:3) 
    function create_container_help_slot_slot(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "slot", "container-help-slot");
    			attr_dev(button, "class", "outline-help-slot helper-button");
    			add_location(button, file, 73, 3, 2274);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			button.innerHTML = help;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_container_help_slot_slot.name,
    		type: "slot",
    		source: "(74:3) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div;
    	let h2;
    	let t1;
    	let p;
    	let t3;
    	let t4;
    	let inputnumber0;
    	let t5;
    	let inputnumber1;
    	let t6;
    	let inputcheckbox0;
    	let t7;
    	let inputcheckbox1;
    	let t8;
    	let inputrange0;
    	let t9;
    	let inputrange1;
    	let t10;
    	let inputtext;
    	let t11;
    	let button;
    	let t12;
    	let button_disabled_value;
    	let current;
    	const input_slot_slot_template = /*#slots*/ ctx[3]["input-slot"];
    	const input_slot_slot = create_slot(input_slot_slot_template, ctx, /*$$scope*/ ctx[7], get_input_slot_slot_context);

    	inputnumber0 = new InputNumber({
    			props: {
    				slot: "input-slot",
    				inputPlaceholder: "Monthly Income",
    				inputId: "totalmonthlyincome",
    				inputName: "totalmonthlyincome",
    				isRequired: "true",
    				levelRange: "900",
    				sign: euro,
    				emoji: "👍",
    				hasHelp: "true",
    				$$slots: {
    					"container-help-slot": [create_container_help_slot_slot],
    					"extra-dialog": [create_extra_dialog_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	inputnumber1 = new InputNumber({
    			props: {
    				slot: "input-slot",
    				inputPlaceholder: "Down Payment",
    				inputId: "downpayment",
    				inputName: "downpayment",
    				isRequired: "true",
    				levelRange: "900",
    				sign: euro,
    				emoji: "👍"
    			},
    			$$inline: true
    		});

    	inputcheckbox0 = new InputCheckbox({
    			props: {
    				slot: "input-slot",
    				inputValue: "",
    				inputName: "coapplicant",
    				inputId: "coapplicant",
    				checkboxtext: "Applying with a co-applicant?",
    				extracheckboxtext: "",
    				isRequired: "true"
    			},
    			$$inline: true
    		});

    	inputcheckbox1 = new InputCheckbox({
    			props: {
    				slot: "input-slot",
    				inputValue: "",
    				isRequired: "true",
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
    				isRequired: "true",
    				sign: euro
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
    				isTimeBound: "true",
    				isRequired: "true"
    			},
    			$$inline: true
    		});

    	inputtext = new InputText({
    			props: {
    				inputName: "firstname",
    				inputId: "firstname",
    				inputPlaceholder: "Enter First Name",
    				isRequired: "true",
    				emoji: "👏"
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
    			if (input_slot_slot) input_slot_slot.c();
    			t4 = space();
    			create_component(inputnumber0.$$.fragment);
    			t5 = space();
    			create_component(inputnumber1.$$.fragment);
    			t6 = space();
    			create_component(inputcheckbox0.$$.fragment);
    			t7 = space();
    			create_component(inputcheckbox1.$$.fragment);
    			t8 = space();
    			create_component(inputrange0.$$.fragment);
    			t9 = space();
    			create_component(inputrange1.$$.fragment);
    			t10 = space();
    			create_component(inputtext.$$.fragment);
    			t11 = space();
    			button = element("button");
    			t12 = text("NEXT");
    			add_location(h2, file, 50, 2, 1626);
    			add_location(p, file, 51, 2, 1659);
    			button.disabled = button_disabled_value = !/*isFormReady*/ ctx[0];
    			attr_dev(button, "class", "navbutton");
    			add_location(button, file, 129, 2, 3568);
    			attr_dev(div, "class", "formcontainer");
    			add_location(div, file, 49, 1, 1596);
    			attr_dev(main, "class", "svelte-1wlpxaj");
    			add_location(main, file, 48, 0, 1588);
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

    			if (input_slot_slot) {
    				input_slot_slot.m(div, null);
    			}

    			append_dev(div, t4);
    			mount_component(inputnumber0, div, null);
    			append_dev(div, t5);
    			mount_component(inputnumber1, div, null);
    			append_dev(div, t6);
    			mount_component(inputcheckbox0, div, null);
    			append_dev(div, t7);
    			mount_component(inputcheckbox1, div, null);
    			append_dev(div, t8);
    			mount_component(inputrange0, div, null);
    			append_dev(div, t9);
    			mount_component(inputrange1, div, null);
    			append_dev(div, t10);
    			mount_component(inputtext, div, null);
    			append_dev(div, t11);
    			append_dev(div, button);
    			append_dev(button, t12);
    			/*button_binding*/ ctx[6](button);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (input_slot_slot) {
    				if (input_slot_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						input_slot_slot,
    						input_slot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(input_slot_slot_template, /*$$scope*/ ctx[7], dirty, get_input_slot_slot_changes),
    						get_input_slot_slot_context
    					);
    				}
    			}

    			const inputnumber0_changes = {};

    			if (dirty & /*$$scope, helpDialog*/ 132) {
    				inputnumber0_changes.$$scope = { dirty, ctx };
    			}

    			inputnumber0.$set(inputnumber0_changes);

    			if (!current || dirty & /*isFormReady*/ 1 && button_disabled_value !== (button_disabled_value = !/*isFormReady*/ ctx[0])) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input_slot_slot, local);
    			transition_in(inputnumber0.$$.fragment, local);
    			transition_in(inputnumber1.$$.fragment, local);
    			transition_in(inputcheckbox0.$$.fragment, local);
    			transition_in(inputcheckbox1.$$.fragment, local);
    			transition_in(inputrange0.$$.fragment, local);
    			transition_in(inputrange1.$$.fragment, local);
    			transition_in(inputtext.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input_slot_slot, local);
    			transition_out(inputnumber0.$$.fragment, local);
    			transition_out(inputnumber1.$$.fragment, local);
    			transition_out(inputcheckbox0.$$.fragment, local);
    			transition_out(inputcheckbox1.$$.fragment, local);
    			transition_out(inputrange0.$$.fragment, local);
    			transition_out(inputrange1.$$.fragment, local);
    			transition_out(inputtext.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (input_slot_slot) input_slot_slot.d(detaching);
    			destroy_component(inputnumber0);
    			destroy_component(inputnumber1);
    			destroy_component(inputcheckbox0);
    			destroy_component(inputcheckbox1);
    			destroy_component(inputrange0);
    			destroy_component(inputrange1);
    			destroy_component(inputtext);
    			/*button_binding*/ ctx[6](null);
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
    	validate_slots('App', slots, ['input-slot']);
    	let isFormReady;
    	let pointer;
    	let buttonPointer;
    	let helpDialog = false;
    	const pointerRotation = writable(0);

    	accumulator.subscribe(value => {
    		$$invalidate(0, isFormReady = !get_store_value(accumulator).find(v => v.ready === false || undefined));
    	});

    	const coordsX = writable(50);
    	const coordsY = writable(50);
    	let coords = tweened({ x: 50, y: 50 }, { stiffness: 0.1, damping: 0.1 });
    	let size = spring(10);

    	function mouseR() {
    		let pointerBox = buttonPointer.getBoundingClientRect();
    		let centerPoint = getClientStyle(buttonPointer);
    		let centers = centerPoint[0].split(" ");
    		let centerY = pointerBox.top + parseInt(centers[1]) - centerPoint[1];
    		let centerX = pointerBox.left + parseInt(centers[0]) - centerPoint[2];
    		let radians = Math.atan2(e.clientX - centerX, e.clientY - centerY);
    		pointerRotation.update(n => radians * (180 / Math.PI) * -1);
    		coordsY.update(n => e.clientY);
    		coordsX.update(n => e.clientX);
    	} //coords.set({ x: e.clientX, y: e.clientY });

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(2, helpDialog = !helpDialog);
    	};

    	const click_handler_1 = () => {
    		$$invalidate(2, helpDialog = !helpDialog);
    	};

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			buttonPointer = $$value;
    			$$invalidate(1, buttonPointer);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		InputNumber,
    		spring,
    		tweened,
    		InputRange,
    		InputCheckbox,
    		InputText,
    		get: get_store_value,
    		writable,
    		accumulator,
    		getClientStyle,
    		PopDialog,
    		help,
    		euro,
    		isFormReady,
    		pointer,
    		buttonPointer,
    		helpDialog,
    		pointerRotation,
    		coordsX,
    		coordsY,
    		coords,
    		size,
    		mouseR
    	});

    	$$self.$inject_state = $$props => {
    		if ('isFormReady' in $$props) $$invalidate(0, isFormReady = $$props.isFormReady);
    		if ('pointer' in $$props) pointer = $$props.pointer;
    		if ('buttonPointer' in $$props) $$invalidate(1, buttonPointer = $$props.buttonPointer);
    		if ('helpDialog' in $$props) $$invalidate(2, helpDialog = $$props.helpDialog);
    		if ('coords' in $$props) coords = $$props.coords;
    		if ('size' in $$props) size = $$props.size;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isFormReady,
    		buttonPointer,
    		helpDialog,
    		slots,
    		click_handler,
    		click_handler_1,
    		button_binding,
    		$$scope
    	];
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
