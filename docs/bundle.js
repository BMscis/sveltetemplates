
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
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
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
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
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
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children$1(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
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

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
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
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
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
                const nodes = children$1(options.target);
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
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
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

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.44.3 */

    function create_fragment$x(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(6, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(5, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(7, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$routes,
    		$base
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 128) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 96) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$location,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$x.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.44.3 */

    const get_default_slot_changes$6 = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context$6 = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context$6);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams, $location*/ 532)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes$6),
    						get_default_slot_context$6
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Link.svelte generated by Svelte v3.44.3 */
    const file$q = "node_modules\\svelte-routing\\src\\Link.svelte";

    function create_fragment$v(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$q, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(14, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(13, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		ariaCurrent,
    		$location,
    		$base
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('to' in $$props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('isCurrent' in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 16512) {
    			$$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 8193) {
    			$$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 8193) {
    			$$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 15361) {
    			$$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$location,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const accumulator = writable([]);
    const foodAlergies = writable([]);
    const medicalAlergies = writable([]);

    function emailValidator() {
      return function email(value) {
        return (value && !!value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+(com)))$/)) || 'Please enter a valid email'
      }
    }
    function nameValidator() {
      return function name(value) {
        return (value && !!value.match(/[^0-9]+[^<>()[\]\\.,;:\s@"]/) || "Enter a valid name.")
      }
    }
    function heightValidator() {
      return function name(value) {
        if (value != null) {
          const reg = /(\')/g;
          let setVal = null;
          let accum = get_store_value(accumulator);
          let heightComp = accum.find(v => v.component === "atr-height");
          if (heightComp.value != null && heightComp.value != undefined) {
            if (heightComp.value.length > 0) {
              heightComp.value.match(reg) ? setVal = value : setVal;
            }
            else {
              value.match(reg) ? setVal = value : setVal = value + "\'";

            }
          }
          else {
            if (value != null && value != undefined) {
              value.match(reg) ? setVal = value : setVal = value + "\'";
            }

          }
          setVal != null && setVal != undefined ? value = setVal : value;
          return setVal != null && setVal != undefined ? value = setVal : value
        }
        return
      }
    }
    function requiredValidator() {
      return function required(value) {
        return (value !== undefined && value !== null && value !== '') || 'This field is required'
      }
    }
    function requiredRange(levelRange) {
      return function range(value) {
        return (value > parseInt(levelRange)) || `The amount must be above ${levelRange}`
      }
    }
    function expandMore() {
      return function more(value) {
        return (value == true) || "You need to check this box."
      }
    }
    function timeConverter(inputMin) {
      return function convertToTime(value) {
        let setVal = "one year";
        if (value > inputMin) {
          value == undefined ? value = setVal : value = value;
          let checkVal = value % 2 == 0;
          checkVal ? (
            setVal = (value - (value / 2).toString() + " Years" + " 6 months")) : (setVal = (value - ((value - 1) / 2)).toString() + " Years");
        }
        return setVal = setVal 
      }
    }

    const convertFeetToCM = ((combineFeet) =>{
        const feetToInches = 12;
        const inchesToCm = 2.54;
        let splitFeet = combineFeet.split("\'");
        let convertFtoI = parseInt(splitFeet[0]) * feetToInches;
        let totalInches = convertFtoI + parseInt(splitFeet[1]);
        let convertToCM = totalInches * inchesToCm;

        return convertToCM/100
    });

    const getAccumulator = ((componentName) => {
        let accum = get_store_value(accumulator);
        let thisAccum = accum.find((v) => v.component === componentName);
        let val = "";
        try {
            val = thisAccum.value;
        } catch (error) {
            val = false;
        }
        return [thisAccum,thisAccum !== undefined && thisAccum !== null,val]
    } );

    const checkNot = /(not)+(-)+([a-z])+\w/g;
    const married = /^married$/g;
    const employed = /^employed$/g;
    const children = /^children$/g;
    const dualComponentList = [checkNot,children, married, employed];

    const validityCheck = ((componentName, validValue, validValid) => {
        let [thisAccum, isValid, hasVal] = getAccumulator(componentName);
        if (isValid ) {
            if (dualComponentList.find(v => componentName.match(v) != null)) {
                thisAccum.value = validValue ? "yes" : "no";
                thisAccum.ready = validValid;
            }
            else {
                if (validValue){
                    thisAccum.value = validValue;
                    thisAccum.ready = validValid;
                }
            }
            validValue ? accumulator.update((n) => (n = n)) : doNothing();
        }
        return
    });
    const doNothing = (() => { return });
    const tryValLen = ((val) => {
        try {
            return val.length > 0
        } catch (error) {
            return false
        }
    });
    const tryValBool = ((val) => {
        try {
            return val
        } catch (error) {
            return false
        }
    });
    const validityRangeCheck = ((componentName, validValue, validValid) => {
        try {
            switch (componentName) {
                case "age":
                    get_store_value(accumulator)[9].ready = validValid;
                    get_store_value(accumulator)[9].value = validValue;
                    get_store_value(accumulator)[10].ready = validValid;
                    get_store_value(accumulator)[10].value = validValue;
                    get_store_value(accumulator)[11].ready = validValid;
                    get_store_value(accumulator)[11].value = validValue;
                    accumulator.update((n) => (n = n));
                    //console.log("age changed");
                    break;
                case "eighteen to twenty five":
                    get_store_value(accumulator)[8].ready = validValid;
                    get_store_value(accumulator)[8].value = validValue;
                    get_store_value(accumulator)[10].ready = validValid;
                    get_store_value(accumulator)[10].value = validValue;
                    get_store_value(accumulator)[11].ready = validValid;
                    get_store_value(accumulator)[11].value = validValue;
                    accumulator.update((n) => (n = n));
                    //console.log("25 changed");
                    break;
                case "twenty six to thirty five":
                    get_store_value(accumulator)[8].ready = validValid;
                    get_store_value(accumulator)[8].value = validValue;
                    get_store_value(accumulator)[9].ready = validValid;
                    get_store_value(accumulator)[9].value = validValue;
                    get_store_value(accumulator)[11].ready = validValid;
                    get_store_value(accumulator)[11].value = validValue;
                    accumulator.update((n) => (n = n));
                    //console.log("35 changed");
                    break;
                case "thirty six to forty five":
                    get_store_value(accumulator)[8].ready = validValid;
                    get_store_value(accumulator)[8].value = validValue;
                    get_store_value(accumulator)[9].ready = validValid;
                    get_store_value(accumulator)[9].value = validValue;
                    get_store_value(accumulator)[10].ready = validValid;
                    get_store_value(accumulator)[10].value = validValue;
                    accumulator.update((n) => (n = n));
                    //console.log("45 changed");
                    break;
            }
        } catch (error) {
            return false
        }
    });
    const validityOr = ((componentName, validValue, validValid) => {
        let validLen = tryValLen(validValue);
        let validBool = tryValBool(validValue);
        if ( validLen ||  validBool) {
            const addNot = (() => {
                try {
                    let accum = get_store_value(accumulator);
                    let not = "not-";
                    let addComp = not.concat("", componentName);
                    let oldComp = accum.find((v) => v.component === componentName);
                    let trueComp = accum.find((v) => v.component === addComp);
                    trueComp.ready = validValid;
                    trueComp.value = oldComp.value == "yes" ? "no" : "yes";
                    accumulator.update((n) => (n = n));

                } catch (error) {
                    return false
                }
            });
            const removeNot = (() => {
                try {
                    let accum = get_store_value(accumulator);
                    let splitComponent = componentName.split("-");
                    let trueComp = accum.find((v) => v.component === splitComponent[1]);
                    let oldComp = accum.find((v) => v.component === componentName);
                    trueComp.ready = validValid;
                    trueComp.value = oldComp.value == "yes" ? "no" : "yes";
                    accumulator.update((n) => (n = n));
                } catch (error) {
                    return false
                }
            });
            const matchPositive = (() => {
                componentName.match(checkNot) ? removeNot() : addNot();
            });
            dualComponentList.find(v => componentName.match(v) != null) ? matchPositive() : doNothing();
        }
        else {
            return
        }
    });
    const bodyMassIndex = ((height, weight) => {
        let heightCM = convertFeetToCM(height);
        let bmi = (weight / Math.pow(heightCM, 2)).toFixed(2);
        let accum = get_store_value(accumulator);
        let thisAccum = accum.find((v) => v.component === "bmi");
        thisAccum.value = !parseFloat(bmi) ? 1 : parseFloat(bmi);
        accumulator.update((n) => (n = n));
        return bmi == "NaN" ? 1 : bmi
    });

    const addToAccumulator = ((componentName,isRequired,values) => {
        let accum = get_store_value(accumulator);
        let accumComponent = accum.find((v) => v.component === componentName);
        let accumCase = accumComponent === undefined ? true : false;
        if (isRequired == "true") {
            if (accumCase === true) {
              let val = values;
              accumulator.update((n) =>n.concat([{ component: componentName, ready: false, value: val }]));
            }
          }
       else {
            if (accumCase === true) {
              let val = values;
              accumulator.update((n) =>n.concat([{ component: componentName, ready: true, value: val }]));
            }
          }
    });

    function buildValidator (validators,isValidation) {
        return function validate (value, dirty) {
          if (!validators || validators.length === 0) {
            return { dirty, valid: true }
          }
          
          const failing = validators.find(v => v(value) !== true);
          const checkFallingLength = ((val) => {
            let isVal = false;
            let message = "";
            let accum = get_store_value(accumulator);
            try {
              //let timeComp = accum.find(v => v.component === "time")
              val.length > 0 ? isVal = true : message = "We need your height";
            } catch (error) {
              if(accum.find(v => v.component === "atr-height")){
                message = "We need your height";
              }
              isVal = false;
            }
            return [isVal,message]
          });
          if(isValidation){
            return {
              dirty,
              valid: !failing ,
              message: failing && failing(value),
              state: !!failing,
              response: failing && failing(value),
              value:value
            }
          }else {
            return {
              dirty,
              valid: checkFallingLength(failing(value))[0] ,
              message: checkFallingLength(failing(value))[1],
              state: !!failing,
              response: failing && failing(value),
              value:failing && failing(value)
            }
          }
        }
      }

    function createFieldValidator(values = false,componentName, isRequired,isValidation, ...validators) {
      const { subscribe, set } = writable({ dirty: false, valid: false, message: null, response: null, state: false, value: null });
      const validator = buildValidator(validators,isValidation);
      addToAccumulator(componentName, isRequired,values);

      function action(node, binding) {
        function validate(value, dirty) {
          const result = validator(value, dirty);
          set(result);
          return
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

    const mountComponent = ((inputName) => {
        let [thisAccum, isValid, hasVal] = getAccumulator(inputName);
        if (isValid) {
            if (hasVal) return thisAccum.value;
        }
        else {
            return false
        }
    });
    const typeOfInput = ((inputValue, accumValue) => {
        if(typeof(inputValue) == typeof(accumValue)){
            return accumValue
        }
        return false
    });

    /* src\InputContainer.svelte generated by Svelte v3.44.3 */

    const file$p = "src\\InputContainer.svelte";
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
    const get_input_slot_slot_changes = dirty => ({});
    const get_input_slot_slot_context = ctx => ({});

    function create_fragment$u(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let current;
    	const input_slot_slot_template = /*#slots*/ ctx[2]["input-slot"];
    	const input_slot_slot = create_slot(input_slot_slot_template, ctx, /*$$scope*/ ctx[1], get_input_slot_slot_context);
    	const outline_symbol_slot_slot_template = /*#slots*/ ctx[2]["outline-symbol-slot"];
    	const outline_symbol_slot_slot = create_slot(outline_symbol_slot_slot_template, ctx, /*$$scope*/ ctx[1], get_outline_symbol_slot_slot_context);
    	const outline_dialog_slot_slot_template = /*#slots*/ ctx[2]["outline-dialog-slot"];
    	const outline_dialog_slot_slot = create_slot(outline_dialog_slot_slot_template, ctx, /*$$scope*/ ctx[1], get_outline_dialog_slot_slot_context);
    	const outline_text_slot_slot_template = /*#slots*/ ctx[2]["outline-text-slot"];
    	const outline_text_slot_slot = create_slot(outline_text_slot_slot_template, ctx, /*$$scope*/ ctx[1], get_outline_text_slot_slot_context);
    	const extra_input_slot_slot_template = /*#slots*/ ctx[2]["extra-input-slot"];
    	const extra_input_slot_slot = create_slot(extra_input_slot_slot_template, ctx, /*$$scope*/ ctx[1], get_extra_input_slot_slot_context);
    	const outline_emoji_slot_slot_template = /*#slots*/ ctx[2]["outline-emoji-slot"];
    	const outline_emoji_slot_slot = create_slot(outline_emoji_slot_slot_template, ctx, /*$$scope*/ ctx[1], get_outline_emoji_slot_slot_context);
    	const outline_help_slot_slot_template = /*#slots*/ ctx[2]["outline-help-slot"];
    	const outline_help_slot_slot = create_slot(outline_help_slot_slot_template, ctx, /*$$scope*/ ctx[1], get_outline_help_slot_slot_context);
    	const extra_dialog_slot_slot_template = /*#slots*/ ctx[2]["extra-dialog-slot"];
    	const extra_dialog_slot_slot = create_slot(extra_dialog_slot_slot_template, ctx, /*$$scope*/ ctx[1], get_extra_dialog_slot_slot_context);

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
    			toggle_class(div, "pop", /*popover*/ ctx[0]);
    			add_location(div, file$p, 3, 0, 53);
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
    				if (input_slot_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						input_slot_slot,
    						input_slot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(input_slot_slot_template, /*$$scope*/ ctx[1], dirty, get_input_slot_slot_changes),
    						get_input_slot_slot_context
    					);
    				}
    			}

    			if (outline_symbol_slot_slot) {
    				if (outline_symbol_slot_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						outline_symbol_slot_slot,
    						outline_symbol_slot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(outline_symbol_slot_slot_template, /*$$scope*/ ctx[1], dirty, get_outline_symbol_slot_slot_changes),
    						get_outline_symbol_slot_slot_context
    					);
    				}
    			}

    			if (outline_dialog_slot_slot) {
    				if (outline_dialog_slot_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						outline_dialog_slot_slot,
    						outline_dialog_slot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(outline_dialog_slot_slot_template, /*$$scope*/ ctx[1], dirty, get_outline_dialog_slot_slot_changes),
    						get_outline_dialog_slot_slot_context
    					);
    				}
    			}

    			if (outline_text_slot_slot) {
    				if (outline_text_slot_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						outline_text_slot_slot,
    						outline_text_slot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(outline_text_slot_slot_template, /*$$scope*/ ctx[1], dirty, get_outline_text_slot_slot_changes),
    						get_outline_text_slot_slot_context
    					);
    				}
    			}

    			if (extra_input_slot_slot) {
    				if (extra_input_slot_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						extra_input_slot_slot,
    						extra_input_slot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(extra_input_slot_slot_template, /*$$scope*/ ctx[1], dirty, get_extra_input_slot_slot_changes),
    						get_extra_input_slot_slot_context
    					);
    				}
    			}

    			if (outline_emoji_slot_slot) {
    				if (outline_emoji_slot_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						outline_emoji_slot_slot,
    						outline_emoji_slot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(outline_emoji_slot_slot_template, /*$$scope*/ ctx[1], dirty, get_outline_emoji_slot_slot_changes),
    						get_outline_emoji_slot_slot_context
    					);
    				}
    			}

    			if (outline_help_slot_slot) {
    				if (outline_help_slot_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						outline_help_slot_slot,
    						outline_help_slot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(outline_help_slot_slot_template, /*$$scope*/ ctx[1], dirty, get_outline_help_slot_slot_changes),
    						get_outline_help_slot_slot_context
    					);
    				}
    			}

    			if (extra_dialog_slot_slot) {
    				if (extra_dialog_slot_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						extra_dialog_slot_slot,
    						extra_dialog_slot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(extra_dialog_slot_slot_template, /*$$scope*/ ctx[1], dirty, get_extra_dialog_slot_slot_changes),
    						get_extra_dialog_slot_slot_context
    					);
    				}
    			}

    			if (dirty & /*popover*/ 1) {
    				toggle_class(div, "pop", /*popover*/ ctx[0]);
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
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;

    	validate_slots('InputContainer', slots, [
    		'input-slot','outline-symbol-slot','outline-dialog-slot','outline-text-slot','extra-input-slot','outline-emoji-slot','outline-help-slot','extra-dialog-slot'
    	]);

    	let { popover = false } = $$props;
    	const writable_props = ['popover'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('popover' in $$props) $$invalidate(0, popover = $$props.popover);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ popover });

    	$$self.$inject_state = $$props => {
    		if ('popover' in $$props) $$invalidate(0, popover = $$props.popover);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [popover, $$scope, slots];
    }

    class InputContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, { popover: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputContainer",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get popover() {
    		throw new Error("<InputContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set popover(value) {
    		throw new Error("<InputContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\PopDialog.svelte generated by Svelte v3.44.3 */

    const file$o = "src\\PopDialog.svelte";

    function create_fragment$t(ctx) {
    	let dialog;
    	let t;

    	const block = {
    		c: function create() {
    			dialog = element("dialog");
    			t = text(/*popupText*/ ctx[0]);
    			attr_dev(dialog, "class", "top");
    			toggle_class(dialog, "visible", /*visibility*/ ctx[1] === "true" || /*visibility*/ ctx[1] === true);
    			toggle_class(dialog, "side", /*isSide*/ ctx[3] === "true");
    			toggle_class(dialog, "extra", /*isExtra*/ ctx[2] === "true");
    			add_location(dialog, file$o, 6, 0, 154);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dialog, anchor);
    			append_dev(dialog, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*popupText*/ 1) set_data_dev(t, /*popupText*/ ctx[0]);

    			if (dirty & /*visibility*/ 2) {
    				toggle_class(dialog, "visible", /*visibility*/ ctx[1] === "true" || /*visibility*/ ctx[1] === true);
    			}

    			if (dirty & /*isSide*/ 8) {
    				toggle_class(dialog, "side", /*isSide*/ ctx[3] === "true");
    			}

    			if (dirty & /*isExtra*/ 4) {
    				toggle_class(dialog, "extra", /*isExtra*/ ctx[2] === "true");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(dialog);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PopDialog', slots, []);
    	let { popupText = "" } = $$props;
    	let { visibility = false } = $$props;
    	let { isExtra = false } = $$props;
    	let { isSide = false } = $$props;
    	const writable_props = ['popupText', 'visibility', 'isExtra', 'isSide'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PopDialog> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('popupText' in $$props) $$invalidate(0, popupText = $$props.popupText);
    		if ('visibility' in $$props) $$invalidate(1, visibility = $$props.visibility);
    		if ('isExtra' in $$props) $$invalidate(2, isExtra = $$props.isExtra);
    		if ('isSide' in $$props) $$invalidate(3, isSide = $$props.isSide);
    	};

    	$$self.$capture_state = () => ({ popupText, visibility, isExtra, isSide });

    	$$self.$inject_state = $$props => {
    		if ('popupText' in $$props) $$invalidate(0, popupText = $$props.popupText);
    		if ('visibility' in $$props) $$invalidate(1, visibility = $$props.visibility);
    		if ('isExtra' in $$props) $$invalidate(2, isExtra = $$props.isExtra);
    		if ('isSide' in $$props) $$invalidate(3, isSide = $$props.isSide);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [popupText, visibility, isExtra, isSide];
    }

    class PopDialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {
    			popupText: 0,
    			visibility: 1,
    			isExtra: 2,
    			isSide: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PopDialog",
    			options,
    			id: create_fragment$t.name
    		});
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

    /* src\InputNumber.svelte generated by Svelte v3.44.3 */
    const file$n = "src\\InputNumber.svelte";
    const get_container_help_slot_slot_changes$1 = dirty => ({});
    const get_container_help_slot_slot_context$1 = ctx => ({ slot: "outline-help-slot" });
    const get_extra_dialog_slot_changes$1 = dirty => ({});
    const get_extra_dialog_slot_context$1 = ctx => ({ slot: "extra-dialog-slot" });

    // (54:4) 
    function create_input_slot_slot$4(ctx) {
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
    			attr_dev(input, "name", /*inputName*/ ctx[4]);
    			attr_dev(input, "id", /*inputName*/ ctx[4]);
    			attr_dev(input, "placeholder", /*inputPlaceholder*/ ctx[0]);
    			attr_dev(input, "onscreenvalue", /*inputValue*/ ctx[1]);
    			attr_dev(input, "pullupdialog", input_pullupdialog_value = /*$validity*/ ctx[5].dirty && !/*$validity*/ ctx[5].valid && /*inputValue*/ ctx[1] > 0);
    			attr_dev(input, "isinputok", input_isinputok_value = /*$validity*/ ctx[5].valid);
    			toggle_class(input, "activated", /*$validity*/ ctx[5].valid);
    			add_location(input, file$n, 53, 4, 1766);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*inputValue*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[12]),
    					action_destroyer(validate_action = /*validate*/ ctx[8].call(null, input, /*inputValue*/ ctx[1]))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputName*/ 16) {
    				attr_dev(input, "name", /*inputName*/ ctx[4]);
    			}

    			if (dirty & /*inputName*/ 16) {
    				attr_dev(input, "id", /*inputName*/ ctx[4]);
    			}

    			if (dirty & /*inputPlaceholder*/ 1) {
    				attr_dev(input, "placeholder", /*inputPlaceholder*/ ctx[0]);
    			}

    			if (dirty & /*inputValue*/ 2) {
    				attr_dev(input, "onscreenvalue", /*inputValue*/ ctx[1]);
    			}

    			if (dirty & /*$validity, inputValue*/ 34 && input_pullupdialog_value !== (input_pullupdialog_value = /*$validity*/ ctx[5].dirty && !/*$validity*/ ctx[5].valid && /*inputValue*/ ctx[1] > 0)) {
    				attr_dev(input, "pullupdialog", input_pullupdialog_value);
    			}

    			if (dirty & /*$validity*/ 32 && input_isinputok_value !== (input_isinputok_value = /*$validity*/ ctx[5].valid)) {
    				attr_dev(input, "isinputok", input_isinputok_value);
    			}

    			if (dirty & /*inputValue*/ 2 && to_number(input.value) !== /*inputValue*/ ctx[1]) {
    				set_input_value(input, /*inputValue*/ ctx[1]);
    			}

    			if (validate_action && is_function(validate_action.update) && dirty & /*inputValue*/ 2) validate_action.update.call(null, /*inputValue*/ ctx[1]);

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
    		id: create_input_slot_slot$4.name,
    		type: "slot",
    		source: "(54:4) ",
    		ctx
    	});

    	return block;
    }

    // (67:4) 
    function create_outline_symbol_slot_slot$1(ctx) {
    	let span;
    	let span_isinputok_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "isinputok", span_isinputok_value = /*$validity*/ ctx[5].valid);
    			attr_dev(span, "class", "outline-symbol-slot");
    			attr_dev(span, "slot", "outline-symbol-slot");
    			add_location(span, file$n, 66, 4, 2188);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			span.innerHTML = /*sign*/ ctx[3];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sign*/ 8) span.innerHTML = /*sign*/ ctx[3];
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
    		id: create_outline_symbol_slot_slot$1.name,
    		type: "slot",
    		source: "(67:4) ",
    		ctx
    	});

    	return block;
    }

    // (73:4) 
    function create_outline_dialog_slot_slot$1(ctx) {
    	let popdialog;
    	let current;

    	popdialog = new PopDialog({
    			props: {
    				popupText: /*$validity*/ ctx[5].message != undefined
    				? /*$validity*/ ctx[5].message
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

    			if (dirty & /*$validity*/ 32) popdialog_changes.popupText = /*$validity*/ ctx[5].message != undefined
    			? /*$validity*/ ctx[5].message
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
    		source: "(73:4) ",
    		ctx
    	});

    	return block;
    }

    // (79:4) 
    function create_outline_text_slot_slot$1(ctx) {
    	let span;

    	let t_value = (/*$validity*/ ctx[5].valid && /*inputValue*/ ctx[1] > 0
    	? /*inputPlaceholder*/ ctx[0]
    	: /*placeHolder*/ ctx[6]) + "";

    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "outline-text-slot");
    			attr_dev(span, "slot", "outline-text-slot");
    			add_location(span, file$n, 78, 4, 2534);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$validity, inputValue, inputPlaceholder*/ 35 && t_value !== (t_value = (/*$validity*/ ctx[5].valid && /*inputValue*/ ctx[1] > 0
    			? /*inputPlaceholder*/ ctx[0]
    			: /*placeHolder*/ ctx[6]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_outline_text_slot_slot$1.name,
    		type: "slot",
    		source: "(79:4) ",
    		ctx
    	});

    	return block;
    }

    // (84:4) 
    function create_outline_help_slot_slot$1(ctx) {
    	let current;
    	const container_help_slot_slot_template = /*#slots*/ ctx[11]["container-help-slot"];
    	const container_help_slot_slot = create_slot(container_help_slot_slot_template, ctx, /*$$scope*/ ctx[13], get_container_help_slot_slot_context$1);

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
    				if (container_help_slot_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						container_help_slot_slot,
    						container_help_slot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(container_help_slot_slot_template, /*$$scope*/ ctx[13], dirty, get_container_help_slot_slot_changes$1),
    						get_container_help_slot_slot_context$1
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
    		id: create_outline_help_slot_slot$1.name,
    		type: "slot",
    		source: "(84:4) ",
    		ctx
    	});

    	return block;
    }

    // (86:4) 
    function create_outline_emoji_slot_slot$1(ctx) {
    	let span;
    	let t;
    	let span_isinputok_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*emoji*/ ctx[2]);
    			attr_dev(span, "class", "outline-emoji");
    			attr_dev(span, "isinputok", span_isinputok_value = /*$validity*/ ctx[5].valid);
    			attr_dev(span, "slot", "outline-emoji-slot");
    			add_location(span, file$n, 85, 4, 2782);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*emoji*/ 4) set_data_dev(t, /*emoji*/ ctx[2]);

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
    		id: create_outline_emoji_slot_slot$1.name,
    		type: "slot",
    		source: "(86:4) ",
    		ctx
    	});

    	return block;
    }

    // (91:4) 
    function create_extra_dialog_slot_slot$1(ctx) {
    	let current;
    	const extra_dialog_slot_template = /*#slots*/ ctx[11]["extra-dialog"];
    	const extra_dialog_slot = create_slot(extra_dialog_slot_template, ctx, /*$$scope*/ ctx[13], get_extra_dialog_slot_context$1);

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
    				if (extra_dialog_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						extra_dialog_slot,
    						extra_dialog_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(extra_dialog_slot_template, /*$$scope*/ ctx[13], dirty, get_extra_dialog_slot_changes$1),
    						get_extra_dialog_slot_context$1
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
    		id: create_extra_dialog_slot_slot$1.name,
    		type: "slot",
    		source: "(91:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let inputcontainer;
    	let current;

    	inputcontainer = new InputContainer({
    			props: {
    				$$slots: {
    					"extra-dialog-slot": [create_extra_dialog_slot_slot$1],
    					"outline-emoji-slot": [create_outline_emoji_slot_slot$1],
    					"outline-help-slot": [create_outline_help_slot_slot$1],
    					"outline-text-slot": [create_outline_text_slot_slot$1],
    					"outline-dialog-slot": [create_outline_dialog_slot_slot$1],
    					"outline-symbol-slot": [create_outline_symbol_slot_slot$1],
    					"input-slot": [create_input_slot_slot$4]
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

    			if (dirty & /*$$scope, $validity, emoji, inputValue, inputPlaceholder, sign, inputName*/ 8255) {
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
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let $validity;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputNumber', slots, ['extra-dialog','container-help-slot']);
    	let { isRequired = false } = $$props;
    	let { inputPlaceholder } = $$props;
    	let { levelRange = 0 } = $$props;
    	let { inputValue } = $$props;
    	let { emoji = "" } = $$props;
    	let { sign = "" } = $$props;
    	let { inputName } = $$props;
    	let addVal = "";
    	const placeHolder = inputPlaceholder;

    	onMount(() => {
    		if (mountComponent(inputName)) {
    			typeOfInput(0, mountComponent(inputName))
    			? $$invalidate(1, inputValue = typeOfInput(0, mountComponent(inputName)))
    			: () => {
    					return;
    				};
    		}
    	});

    	const [validity, validate] = createFieldValidator(0, inputName, isRequired, true, requiredValidator(), requiredRange(levelRange));
    	validate_store(validity, 'validity');
    	component_subscribe($$self, validity, value => $$invalidate(5, $validity = value));

    	const accumulatorCheck = () => {
    		validityCheck(inputName, $validity.value == null ? 0 : $validity.value, $validity.valid);
    		validityRangeCheck(inputName, $validity.value, $validity.valid);
    	};

    	const writable_props = [
    		'isRequired',
    		'inputPlaceholder',
    		'levelRange',
    		'inputValue',
    		'emoji',
    		'sign',
    		'inputName'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputNumber> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		inputValue = to_number(this.value);
    		$$invalidate(1, inputValue);
    	}

    	$$self.$$set = $$props => {
    		if ('isRequired' in $$props) $$invalidate(9, isRequired = $$props.isRequired);
    		if ('inputPlaceholder' in $$props) $$invalidate(0, inputPlaceholder = $$props.inputPlaceholder);
    		if ('levelRange' in $$props) $$invalidate(10, levelRange = $$props.levelRange);
    		if ('inputValue' in $$props) $$invalidate(1, inputValue = $$props.inputValue);
    		if ('emoji' in $$props) $$invalidate(2, emoji = $$props.emoji);
    		if ('sign' in $$props) $$invalidate(3, sign = $$props.sign);
    		if ('inputName' in $$props) $$invalidate(4, inputName = $$props.inputName);
    		if ('$$scope' in $$props) $$invalidate(13, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		requiredRange,
    		requiredValidator,
    		validityCheck,
    		validityRangeCheck,
    		createFieldValidator,
    		mountComponent,
    		typeOfInput,
    		onMount,
    		InputContainer,
    		PopDialog,
    		isRequired,
    		inputPlaceholder,
    		levelRange,
    		inputValue,
    		emoji,
    		sign,
    		inputName,
    		addVal,
    		placeHolder,
    		validity,
    		validate,
    		accumulatorCheck,
    		$validity
    	});

    	$$self.$inject_state = $$props => {
    		if ('isRequired' in $$props) $$invalidate(9, isRequired = $$props.isRequired);
    		if ('inputPlaceholder' in $$props) $$invalidate(0, inputPlaceholder = $$props.inputPlaceholder);
    		if ('levelRange' in $$props) $$invalidate(10, levelRange = $$props.levelRange);
    		if ('inputValue' in $$props) $$invalidate(1, inputValue = $$props.inputValue);
    		if ('emoji' in $$props) $$invalidate(2, emoji = $$props.emoji);
    		if ('sign' in $$props) $$invalidate(3, sign = $$props.sign);
    		if ('inputName' in $$props) $$invalidate(4, inputName = $$props.inputName);
    		if ('addVal' in $$props) addVal = $$props.addVal;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$validity*/ 32) {
    			try {
    				$validity.valid
    				? $$invalidate(0, inputPlaceholder = $validity.value)
    				: $$invalidate(0, inputPlaceholder = placeHolder);
    			} catch(error) {
    				
    			}
    		}

    		if ($$self.$$.dirty & /*$validity*/ 32) {
    			try {
    				$validity.valid
    				? accumulatorCheck()
    				: accumulatorCheck();
    			} catch(error) {
    				
    			}
    		}
    	};

    	return [
    		inputPlaceholder,
    		inputValue,
    		emoji,
    		sign,
    		inputName,
    		$validity,
    		placeHolder,
    		validity,
    		validate,
    		isRequired,
    		levelRange,
    		slots,
    		input_input_handler,
    		$$scope
    	];
    }

    class InputNumber extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {
    			isRequired: 9,
    			inputPlaceholder: 0,
    			levelRange: 10,
    			inputValue: 1,
    			emoji: 2,
    			sign: 3,
    			inputName: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputNumber",
    			options,
    			id: create_fragment$s.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*inputPlaceholder*/ ctx[0] === undefined && !('inputPlaceholder' in props)) {
    			console.warn("<InputNumber> was created without expected prop 'inputPlaceholder'");
    		}

    		if (/*inputValue*/ ctx[1] === undefined && !('inputValue' in props)) {
    			console.warn("<InputNumber> was created without expected prop 'inputValue'");
    		}

    		if (/*inputName*/ ctx[4] === undefined && !('inputName' in props)) {
    			console.warn("<InputNumber> was created without expected prop 'inputName'");
    		}
    	}

    	get isRequired() {
    		throw new Error("<InputNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isRequired(value) {
    		throw new Error("<InputNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputPlaceholder() {
    		throw new Error("<InputNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputPlaceholder(value) {
    		throw new Error("<InputNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get levelRange() {
    		throw new Error("<InputNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set levelRange(value) {
    		throw new Error("<InputNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputValue() {
    		throw new Error("<InputNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputValue(value) {
    		throw new Error("<InputNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get emoji() {
    		throw new Error("<InputNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set emoji(value) {
    		throw new Error("<InputNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sign() {
    		throw new Error("<InputNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sign(value) {
    		throw new Error("<InputNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputName() {
    		throw new Error("<InputNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputName(value) {
    		throw new Error("<InputNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\FormContainer.svelte generated by Svelte v3.44.3 */
    const file$m = "src\\FormContainer.svelte";
    const get_extra_slot_changes = dirty => ({});
    const get_extra_slot_context = ctx => ({});
    const get_forms_slot_changes = dirty => ({});
    const get_forms_slot_context = ctx => ({});
    const get_paragraph_slot_changes = dirty => ({});
    const get_paragraph_slot_context = ctx => ({});
    const get_heading_slot_changes = dirty => ({});
    const get_heading_slot_context = ctx => ({});

    function create_fragment$r(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let t2;
    	let current;
    	const heading_slot_template = /*#slots*/ ctx[1].heading;
    	const heading_slot = create_slot(heading_slot_template, ctx, /*$$scope*/ ctx[0], get_heading_slot_context);
    	const paragraph_slot_template = /*#slots*/ ctx[1].paragraph;
    	const paragraph_slot = create_slot(paragraph_slot_template, ctx, /*$$scope*/ ctx[0], get_paragraph_slot_context);
    	const forms_slot_template = /*#slots*/ ctx[1].forms;
    	const forms_slot = create_slot(forms_slot_template, ctx, /*$$scope*/ ctx[0], get_forms_slot_context);
    	const extra_slot_template = /*#slots*/ ctx[1].extra;
    	const extra_slot = create_slot(extra_slot_template, ctx, /*$$scope*/ ctx[0], get_extra_slot_context);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (heading_slot) heading_slot.c();
    			t0 = space();
    			if (paragraph_slot) paragraph_slot.c();
    			t1 = space();
    			if (forms_slot) forms_slot.c();
    			t2 = space();
    			if (extra_slot) extra_slot.c();
    			attr_dev(div0, "class", "head");
    			add_location(div0, file$m, 6, 4, 100);
    			attr_dev(div1, "class", "form-container");
    			add_location(div1, file$m, 5, 0, 66);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (heading_slot) {
    				heading_slot.m(div0, null);
    			}

    			append_dev(div0, t0);

    			if (paragraph_slot) {
    				paragraph_slot.m(div0, null);
    			}

    			append_dev(div1, t1);

    			if (forms_slot) {
    				forms_slot.m(div1, null);
    			}

    			append_dev(div1, t2);

    			if (extra_slot) {
    				extra_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (heading_slot) {
    				if (heading_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						heading_slot,
    						heading_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(heading_slot_template, /*$$scope*/ ctx[0], dirty, get_heading_slot_changes),
    						get_heading_slot_context
    					);
    				}
    			}

    			if (paragraph_slot) {
    				if (paragraph_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						paragraph_slot,
    						paragraph_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(paragraph_slot_template, /*$$scope*/ ctx[0], dirty, get_paragraph_slot_changes),
    						get_paragraph_slot_context
    					);
    				}
    			}

    			if (forms_slot) {
    				if (forms_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						forms_slot,
    						forms_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(forms_slot_template, /*$$scope*/ ctx[0], dirty, get_forms_slot_changes),
    						get_forms_slot_context
    					);
    				}
    			}

    			if (extra_slot) {
    				if (extra_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						extra_slot,
    						extra_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(extra_slot_template, /*$$scope*/ ctx[0], dirty, get_extra_slot_changes),
    						get_extra_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(heading_slot, local);
    			transition_in(paragraph_slot, local);
    			transition_in(forms_slot, local);
    			transition_in(extra_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(heading_slot, local);
    			transition_out(paragraph_slot, local);
    			transition_out(forms_slot, local);
    			transition_out(extra_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (heading_slot) heading_slot.d(detaching);
    			if (paragraph_slot) paragraph_slot.d(detaching);
    			if (forms_slot) forms_slot.d(detaching);
    			if (extra_slot) extra_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormContainer', slots, ['heading','paragraph','forms','extra']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FormContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ get: get_store_value });
    	return [$$scope, slots];
    }

    class FormContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormContainer",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* src\FormSlot.svelte generated by Svelte v3.44.3 */

    const file$l = "src\\FormSlot.svelte";

    function create_fragment$q(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "inner-form");
    			add_location(div, file$l, 3, 0, 23);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormSlot', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FormSlot> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class FormSlot extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormSlot",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* src\InputRange.svelte generated by Svelte v3.44.3 */
    const file$k = "src\\InputRange.svelte";

    // (65:8) 
    function create_input_slot_slot_1(ctx) {
    	let div;
    	let progress;
    	let t0;
    	let input;
    	let input_isinputok_value;
    	let input_pullupdialog_value;
    	let validate_action;
    	let t1;
    	let popdialog;
    	let current;
    	let mounted;
    	let dispose;

    	popdialog = new PopDialog({
    			props: {
    				popupText: /*$validity*/ ctx[8].message != undefined
    				? /*$validity*/ ctx[8].message
    				: "cool",
    				slot: "outline-dialog-slot",
    				isExtra: "false",
    				isSide: "true"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			progress = element("progress");
    			t0 = space();
    			input = element("input");
    			t1 = space();
    			create_component(popdialog.$$.fragment);
    			progress.value = /*inputValue*/ ctx[0];
    			attr_dev(progress, "min", /*inputMin*/ ctx[5]);
    			attr_dev(progress, "max", /*inputMax*/ ctx[6]);
    			add_location(progress, file$k, 65, 12, 2156);
    			attr_dev(input, "min", /*inputMin*/ ctx[5]);
    			attr_dev(input, "max", /*inputMax*/ ctx[6]);
    			attr_dev(input, "name", /*inputName*/ ctx[3]);
    			attr_dev(input, "type", "range");

    			attr_dev(input, "isinputok", input_isinputok_value = /*rangeType*/ ctx[2] == "time"
    			? /*$validity*/ ctx[8].state
    			: /*$validity*/ ctx[8].valid);

    			attr_dev(input, "pullupdialog", input_pullupdialog_value = /*rangeType*/ ctx[2] == "time"
    			? !/*$validity*/ ctx[8].state
    			: !/*$validity*/ ctx[8].valid);

    			add_location(input, file$k, 66, 12, 2231);
    			attr_dev(div, "slot", "input-slot");
    			attr_dev(div, "class", "input-range-container");
    			add_location(div, file$k, 64, 8, 2089);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, progress);
    			append_dev(div, t0);
    			append_dev(div, input);
    			set_input_value(input, /*inputValue*/ ctx[0]);
    			append_dev(div, t1);
    			mount_component(popdialog, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[12]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[12]),
    					action_destroyer(validate_action = /*validate*/ ctx[9].call(null, input, /*inputValue*/ ctx[0]))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*inputValue*/ 1) {
    				prop_dev(progress, "value", /*inputValue*/ ctx[0]);
    			}

    			if (!current || dirty & /*inputMin*/ 32) {
    				attr_dev(progress, "min", /*inputMin*/ ctx[5]);
    			}

    			if (!current || dirty & /*inputMax*/ 64) {
    				attr_dev(progress, "max", /*inputMax*/ ctx[6]);
    			}

    			if (!current || dirty & /*inputMin*/ 32) {
    				attr_dev(input, "min", /*inputMin*/ ctx[5]);
    			}

    			if (!current || dirty & /*inputMax*/ 64) {
    				attr_dev(input, "max", /*inputMax*/ ctx[6]);
    			}

    			if (!current || dirty & /*inputName*/ 8) {
    				attr_dev(input, "name", /*inputName*/ ctx[3]);
    			}

    			if (!current || dirty & /*rangeType, $validity*/ 260 && input_isinputok_value !== (input_isinputok_value = /*rangeType*/ ctx[2] == "time"
    			? /*$validity*/ ctx[8].state
    			: /*$validity*/ ctx[8].valid)) {
    				attr_dev(input, "isinputok", input_isinputok_value);
    			}

    			if (!current || dirty & /*rangeType, $validity*/ 260 && input_pullupdialog_value !== (input_pullupdialog_value = /*rangeType*/ ctx[2] == "time"
    			? !/*$validity*/ ctx[8].state
    			: !/*$validity*/ ctx[8].valid)) {
    				attr_dev(input, "pullupdialog", input_pullupdialog_value);
    			}

    			if (dirty & /*inputValue*/ 1) {
    				set_input_value(input, /*inputValue*/ ctx[0]);
    			}

    			if (validate_action && is_function(validate_action.update) && dirty & /*inputValue*/ 1) validate_action.update.call(null, /*inputValue*/ ctx[0]);
    			const popdialog_changes = {};

    			if (dirty & /*$validity*/ 256) popdialog_changes.popupText = /*$validity*/ ctx[8].message != undefined
    			? /*$validity*/ ctx[8].message
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
    			if (detaching) detach_dev(div);
    			destroy_component(popdialog);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_input_slot_slot_1.name,
    		type: "slot",
    		source: "(65:8) ",
    		ctx
    	});

    	return block;
    }

    // (101:12) {:else}
    function create_else_block$1(ctx) {
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

    			attr_dev(span, "isinputok", span_isinputok_value = /*rangeType*/ ctx[2] == "time"
    			? /*$validity*/ ctx[8].state
    			: /*$validity*/ ctx[8].valid);

    			attr_dev(span, "class", "outline-symbol-text");
    			add_location(span, file$k, 101, 16, 3510);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			html_tag.m(/*sign*/ ctx[7], span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sign*/ 128) html_tag.p(/*sign*/ ctx[7]);
    			if (dirty & /*inputValue*/ 1 && t1_value !== (t1_value = /*inputValue*/ ctx[0] * 1000 + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*rangeType, $validity*/ 260 && span_isinputok_value !== (span_isinputok_value = /*rangeType*/ ctx[2] == "time"
    			? /*$validity*/ ctx[8].state
    			: /*$validity*/ ctx[8].valid)) {
    				attr_dev(span, "isinputok", span_isinputok_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(101:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (94:12) {#if isTimeBound}
    function create_if_block$3(ctx) {
    	let span;
    	let t_value = /*$validity*/ ctx[8].response + "";
    	let t;
    	let span_isinputok_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);

    			attr_dev(span, "isinputok", span_isinputok_value = /*rangeType*/ ctx[2] == "time"
    			? /*$validity*/ ctx[8].state
    			: /*$validity*/ ctx[8].valid);

    			attr_dev(span, "class", "outline-symbol-text");
    			add_location(span, file$k, 94, 16, 3232);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$validity*/ 256 && t_value !== (t_value = /*$validity*/ ctx[8].response + "")) set_data_dev(t, t_value);

    			if (dirty & /*rangeType, $validity*/ 260 && span_isinputok_value !== (span_isinputok_value = /*rangeType*/ ctx[2] == "time"
    			? /*$validity*/ ctx[8].state
    			: /*$validity*/ ctx[8].valid)) {
    				attr_dev(span, "isinputok", span_isinputok_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(94:12) {#if isTimeBound}",
    		ctx
    	});

    	return block;
    }

    // (92:8) 
    function create_input_slot_slot$3(ctx) {
    	let div;
    	let h4;
    	let t0;
    	let t1;

    	function select_block_type(ctx, dirty) {
    		if (/*isTimeBound*/ ctx[1]) return create_if_block$3;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			t0 = text(/*rangeText*/ ctx[4]);
    			t1 = space();
    			if_block.c();
    			attr_dev(h4, "class", "checkbox-text");
    			add_location(h4, file$k, 92, 12, 3141);
    			attr_dev(div, "slot", "input-slot");
    			attr_dev(div, "class", "input-range-container");
    			add_location(div, file$k, 91, 8, 3074);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(h4, t0);
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
    		id: create_input_slot_slot$3.name,
    		type: "slot",
    		source: "(92:8) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let div;
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
    				$$slots: { "input-slot": [create_input_slot_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(inputcontainer0.$$.fragment);
    			t = space();
    			create_component(inputcontainer1.$$.fragment);
    			attr_dev(div, "class", "range-pocket");
    			add_location(div, file$k, 62, 0, 2031);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(inputcontainer0, div, null);
    			append_dev(div, t);
    			mount_component(inputcontainer1, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const inputcontainer0_changes = {};

    			if (dirty & /*$$scope, $validity, inputMin, inputMax, inputName, rangeType, inputValue*/ 8557) {
    				inputcontainer0_changes.$$scope = { dirty, ctx };
    			}

    			inputcontainer0.$set(inputcontainer0_changes);
    			const inputcontainer1_changes = {};

    			if (dirty & /*$$scope, rangeType, $validity, isTimeBound, inputValue, sign, rangeText*/ 8599) {
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
    			if (detaching) detach_dev(div);
    			destroy_component(inputcontainer0);
    			destroy_component(inputcontainer1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let $validity,
    		$$unsubscribe_validity = noop,
    		$$subscribe_validity = () => ($$unsubscribe_validity(), $$unsubscribe_validity = subscribe(validity, $$value => $$invalidate(8, $validity = $$value)), validity);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_validity());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputRange', slots, []);
    	let { isTimeBound = false } = $$props;
    	let { isRequired = false } = $$props;
    	let { rangeType = "" } = $$props;
    	let { inputName = "" } = $$props;
    	let { rangeText = "" } = $$props;
    	let { inputValue = 0 } = $$props;
    	let { inputMin = 0 } = $$props;
    	let { inputMax = 0 } = $$props;
    	let { sign = "" } = $$props;
    	let validate;
    	let validity;

    	onMount(() => {
    		if (mountComponent(inputName)) {
    			typeOfInput(parseInt(inputValue), mountComponent(inputName))
    			? $$invalidate(0, inputValue = typeOfInput(parseInt(inputValue), mountComponent(inputName)))
    			: 1;
    		}
    	});

    	switch (rangeType) {
    		case "time":
    			$$subscribe_validity([validity, validate] = createFieldValidator("", inputName, isRequired, false, timeConverter(inputMin)));
    			break;
    		default:
    			$$subscribe_validity([validity, validate] = createFieldValidator(0, inputName, isRequired, true, requiredRange(parseInt(inputMin))));
    			break;
    	}

    	const writable_props = [
    		'isTimeBound',
    		'isRequired',
    		'rangeType',
    		'inputName',
    		'rangeText',
    		'inputValue',
    		'inputMin',
    		'inputMax',
    		'sign'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputRange> was created with unknown prop '${key}'`);
    	});

    	function input_change_input_handler() {
    		inputValue = to_number(this.value);
    		$$invalidate(0, inputValue);
    	}

    	$$self.$$set = $$props => {
    		if ('isTimeBound' in $$props) $$invalidate(1, isTimeBound = $$props.isTimeBound);
    		if ('isRequired' in $$props) $$invalidate(11, isRequired = $$props.isRequired);
    		if ('rangeType' in $$props) $$invalidate(2, rangeType = $$props.rangeType);
    		if ('inputName' in $$props) $$invalidate(3, inputName = $$props.inputName);
    		if ('rangeText' in $$props) $$invalidate(4, rangeText = $$props.rangeText);
    		if ('inputValue' in $$props) $$invalidate(0, inputValue = $$props.inputValue);
    		if ('inputMin' in $$props) $$invalidate(5, inputMin = $$props.inputMin);
    		if ('inputMax' in $$props) $$invalidate(6, inputMax = $$props.inputMax);
    		if ('sign' in $$props) $$invalidate(7, sign = $$props.sign);
    	};

    	$$self.$capture_state = () => ({
    		timeConverter,
    		requiredRange,
    		createFieldValidator,
    		validityCheck,
    		InputContainer,
    		PopDialog,
    		mountComponent,
    		typeOfInput,
    		onMount,
    		isTimeBound,
    		isRequired,
    		rangeType,
    		inputName,
    		rangeText,
    		inputValue,
    		inputMin,
    		inputMax,
    		sign,
    		validate,
    		validity,
    		$validity
    	});

    	$$self.$inject_state = $$props => {
    		if ('isTimeBound' in $$props) $$invalidate(1, isTimeBound = $$props.isTimeBound);
    		if ('isRequired' in $$props) $$invalidate(11, isRequired = $$props.isRequired);
    		if ('rangeType' in $$props) $$invalidate(2, rangeType = $$props.rangeType);
    		if ('inputName' in $$props) $$invalidate(3, inputName = $$props.inputName);
    		if ('rangeText' in $$props) $$invalidate(4, rangeText = $$props.rangeText);
    		if ('inputValue' in $$props) $$invalidate(0, inputValue = $$props.inputValue);
    		if ('inputMin' in $$props) $$invalidate(5, inputMin = $$props.inputMin);
    		if ('inputMax' in $$props) $$invalidate(6, inputMax = $$props.inputMax);
    		if ('sign' in $$props) $$invalidate(7, sign = $$props.sign);
    		if ('validate' in $$props) $$invalidate(9, validate = $$props.validate);
    		if ('validity' in $$props) $$subscribe_validity($$invalidate(10, validity = $$props.validity));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$validity, inputName, rangeType*/ 268) {
    			try {
    				$validity.valid
    				? validityCheck(inputName, $validity.value, rangeType == "time" ? $validity.state : $validity.valid)
    				: validityCheck(inputName, $validity.value, rangeType == "time" ? $validity.state : $validity.valid);
    			} catch(error) {
    				
    			}
    		}
    	};

    	return [
    		inputValue,
    		isTimeBound,
    		rangeType,
    		inputName,
    		rangeText,
    		inputMin,
    		inputMax,
    		sign,
    		$validity,
    		validate,
    		validity,
    		isRequired,
    		input_change_input_handler
    	];
    }

    class InputRange extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {
    			isTimeBound: 1,
    			isRequired: 11,
    			rangeType: 2,
    			inputName: 3,
    			rangeText: 4,
    			inputValue: 0,
    			inputMin: 5,
    			inputMax: 6,
    			sign: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputRange",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get isTimeBound() {
    		throw new Error("<InputRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isTimeBound(value) {
    		throw new Error("<InputRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isRequired() {
    		throw new Error("<InputRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isRequired(value) {
    		throw new Error("<InputRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rangeType() {
    		throw new Error("<InputRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rangeType(value) {
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

    	get sign() {
    		throw new Error("<InputRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sign(value) {
    		throw new Error("<InputRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\InputCheckbox.svelte generated by Svelte v3.44.3 */
    const file$j = "src\\InputCheckbox.svelte";

    // (55:4) 
    function create_input_slot_slot$2(ctx) {
    	let div;
    	let input;
    	let input_isinputok_value;
    	let validate_action;
    	let t0;
    	let label;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			t1 = text(/*checkboxtext*/ ctx[3]);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "name", /*inputName*/ ctx[4]);
    			attr_dev(input, "id", /*inputName*/ ctx[4]);
    			attr_dev(input, "isinputok", input_isinputok_value = /*$validity*/ ctx[5].valid);
    			input.disabled = /*checkable*/ ctx[6];
    			add_location(input, file$j, 59, 8, 1901);
    			attr_dev(label, "for", /*inputName*/ ctx[4]);
    			attr_dev(label, "class", "checkbox-text");
    			add_location(label, file$j, 68, 8, 2169);
    			attr_dev(div, "class", "checkbox-container");
    			attr_dev(div, "slot", "input-slot");
    			toggle_class(div, "has-checkboxes", /*extracheckbox*/ ctx[2]);
    			add_location(div, file$j, 54, 4, 1771);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			input.checked = /*inputValue*/ ctx[0];
    			append_dev(div, t0);
    			append_dev(div, label);
    			append_dev(label, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler_1*/ ctx[13]),
    					action_destroyer(validate_action = /*validate*/ ctx[8].call(null, input, /*inputValue*/ ctx[0]))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputName*/ 16) {
    				attr_dev(input, "name", /*inputName*/ ctx[4]);
    			}

    			if (dirty & /*inputName*/ 16) {
    				attr_dev(input, "id", /*inputName*/ ctx[4]);
    			}

    			if (dirty & /*$validity*/ 32 && input_isinputok_value !== (input_isinputok_value = /*$validity*/ ctx[5].valid)) {
    				attr_dev(input, "isinputok", input_isinputok_value);
    			}

    			if (dirty & /*inputValue*/ 1) {
    				input.checked = /*inputValue*/ ctx[0];
    			}

    			if (validate_action && is_function(validate_action.update) && dirty & /*inputValue*/ 1) validate_action.update.call(null, /*inputValue*/ ctx[0]);
    			if (dirty & /*checkboxtext*/ 8) set_data_dev(t1, /*checkboxtext*/ ctx[3]);

    			if (dirty & /*inputName*/ 16) {
    				attr_dev(label, "for", /*inputName*/ ctx[4]);
    			}

    			if (dirty & /*extracheckbox*/ 4) {
    				toggle_class(div, "has-checkboxes", /*extracheckbox*/ ctx[2]);
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
    		id: create_input_slot_slot$2.name,
    		type: "slot",
    		source: "(55:4) ",
    		ctx
    	});

    	return block;
    }

    // (71:4) 
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
    			t1 = text(/*extracheckboxtext*/ ctx[1]);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "name", /*inputName*/ ctx[4]);
    			attr_dev(input, "id", /*inputName*/ ctx[4]);
    			add_location(input, file$j, 77, 8, 2452);
    			attr_dev(div0, "class", "checkbox-text");
    			add_location(div0, file$j, 84, 8, 2626);
    			attr_dev(div1, "slot", "extra-input-slot");
    			attr_dev(div1, "class", "checkbox-container");
    			attr_dev(div1, "id", "morecheckbox");
    			attr_dev(div1, "name", "morecheckbox");
    			attr_dev(div1, "visible", div1_visible_value = /*$validity*/ ctx[5].valid && /*extracheckbox*/ ctx[2]);
    			add_location(div1, file$j, 70, 4, 2254);
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
    			if (dirty & /*inputName*/ 16) {
    				attr_dev(input, "name", /*inputName*/ ctx[4]);
    			}

    			if (dirty & /*inputName*/ 16) {
    				attr_dev(input, "id", /*inputName*/ ctx[4]);
    			}

    			if (dirty & /*inputValue*/ 1) {
    				set_input_value(input, /*inputValue*/ ctx[0]);
    			}

    			if (dirty & /*extracheckboxtext*/ 2) set_data_dev(t1, /*extracheckboxtext*/ ctx[1]);

    			if (dirty & /*$validity, extracheckbox*/ 36 && div1_visible_value !== (div1_visible_value = /*$validity*/ ctx[5].valid && /*extracheckbox*/ ctx[2])) {
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
    		source: "(71:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let inputcontainer;
    	let current;

    	inputcontainer = new InputContainer({
    			props: {
    				$$slots: {
    					"extra-input-slot": [create_extra_input_slot_slot],
    					"input-slot": [create_input_slot_slot$2]
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

    			if (dirty & /*$$scope, $validity, extracheckbox, extracheckboxtext, inputName, inputValue, checkboxtext*/ 32831) {
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
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let $validity;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputCheckbox', slots, []);
    	let { extracheckboxfocus = false } = $$props;
    	let { extracheckboxtext = "" } = $$props;
    	let { extracheckbox = false } = $$props;
    	let { inputValue = undefined } = $$props;
    	let { isRequired = false } = $$props;
    	let { checkboxtext = "" } = $$props;
    	let { inputName = "" } = $$props;
    	let checkable = false;

    	onMount(() => {
    		if (mountComponent(inputName)) {
    			typeOfInput(inputValue, mountComponent(inputName))
    			? $$invalidate(0, inputValue = typeOfInput(inputValue, mountComponent(inputName)))
    			: () => {
    					return;
    				};
    		}
    	});

    	const [validity, validate] = createFieldValidator(undefined, inputName, isRequired, true, expandMore());
    	validate_store(validity, 'validity');
    	component_subscribe($$self, validity, value => $$invalidate(5, $validity = value));

    	const accumulatorCheck = () => {
    		validityCheck(inputName, $validity.value == null ? undefined : $validity.value, $validity.valid);
    		validityRangeCheck(inputName, $validity.value == null ? undefined : $validity.value, $validity.valid);
    		validityOr(inputName, $validity.value == null ? undefined : $validity.value, $validity.valid);
    	};

    	const writable_props = [
    		'extracheckboxfocus',
    		'extracheckboxtext',
    		'extracheckbox',
    		'inputValue',
    		'isRequired',
    		'checkboxtext',
    		'inputName'
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

    	function input_change_handler_1() {
    		inputValue = this.checked;
    		$$invalidate(0, inputValue);
    	}

    	$$self.$$set = $$props => {
    		if ('extracheckboxfocus' in $$props) $$invalidate(9, extracheckboxfocus = $$props.extracheckboxfocus);
    		if ('extracheckboxtext' in $$props) $$invalidate(1, extracheckboxtext = $$props.extracheckboxtext);
    		if ('extracheckbox' in $$props) $$invalidate(2, extracheckbox = $$props.extracheckbox);
    		if ('inputValue' in $$props) $$invalidate(0, inputValue = $$props.inputValue);
    		if ('isRequired' in $$props) $$invalidate(10, isRequired = $$props.isRequired);
    		if ('checkboxtext' in $$props) $$invalidate(3, checkboxtext = $$props.checkboxtext);
    		if ('inputName' in $$props) $$invalidate(4, inputName = $$props.inputName);
    	};

    	$$self.$capture_state = () => ({
    		validityCheck,
    		validityRangeCheck,
    		validityOr,
    		createFieldValidator,
    		InputContainer,
    		expandMore,
    		mountComponent,
    		typeOfInput,
    		onMount,
    		extracheckboxfocus,
    		extracheckboxtext,
    		extracheckbox,
    		inputValue,
    		isRequired,
    		checkboxtext,
    		inputName,
    		checkable,
    		validity,
    		validate,
    		accumulatorCheck,
    		$validity
    	});

    	$$self.$inject_state = $$props => {
    		if ('extracheckboxfocus' in $$props) $$invalidate(9, extracheckboxfocus = $$props.extracheckboxfocus);
    		if ('extracheckboxtext' in $$props) $$invalidate(1, extracheckboxtext = $$props.extracheckboxtext);
    		if ('extracheckbox' in $$props) $$invalidate(2, extracheckbox = $$props.extracheckbox);
    		if ('inputValue' in $$props) $$invalidate(0, inputValue = $$props.inputValue);
    		if ('isRequired' in $$props) $$invalidate(10, isRequired = $$props.isRequired);
    		if ('checkboxtext' in $$props) $$invalidate(3, checkboxtext = $$props.checkboxtext);
    		if ('inputName' in $$props) $$invalidate(4, inputName = $$props.inputName);
    		if ('checkable' in $$props) $$invalidate(6, checkable = $$props.checkable);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$validity*/ 32) {
    			$validity.valid
    			? accumulatorCheck()
    			: accumulatorCheck();
    		}
    	};

    	return [
    		inputValue,
    		extracheckboxtext,
    		extracheckbox,
    		checkboxtext,
    		inputName,
    		$validity,
    		checkable,
    		validity,
    		validate,
    		extracheckboxfocus,
    		isRequired,
    		input_handler,
    		input_change_handler,
    		input_change_handler_1
    	];
    }

    class InputCheckbox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
    			extracheckboxfocus: 9,
    			extracheckboxtext: 1,
    			extracheckbox: 2,
    			inputValue: 0,
    			isRequired: 10,
    			checkboxtext: 3,
    			inputName: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputCheckbox",
    			options,
    			id: create_fragment$o.name
    		});
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

    	get inputValue() {
    		throw new Error("<InputCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputValue(value) {
    		throw new Error("<InputCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isRequired() {
    		throw new Error("<InputCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isRequired(value) {
    		throw new Error("<InputCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checkboxtext() {
    		throw new Error("<InputCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checkboxtext(value) {
    		throw new Error("<InputCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputName() {
    		throw new Error("<InputCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputName(value) {
    		throw new Error("<InputCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\InputText.svelte generated by Svelte v3.44.3 */
    const file$i = "src\\InputText.svelte";
    const get_container_help_slot_slot_changes = dirty => ({});
    const get_container_help_slot_slot_context = ctx => ({ slot: "outline-help-slot" });
    const get_extra_dialog_slot_changes = dirty => ({});
    const get_extra_dialog_slot_context = ctx => ({ slot: "extra-dialog-slot" });

    // (93:0) <InputContainer>
    function create_default_slot$c(ctx) {
    	let popdialog;
    	let current;

    	popdialog = new PopDialog({
    			props: {
    				popupHeading: /*helpTextHeading*/ ctx[2],
    				popupText: /*helpText*/ ctx[4],
    				visibility: false
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
    			if (dirty & /*helpText*/ 16) popdialog_changes.popupText = /*helpText*/ ctx[4];
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
    		id: create_default_slot$c.name,
    		type: "slot",
    		source: "(93:0) <InputContainer>",
    		ctx
    	});

    	return block;
    }

    // (94:4) 
    function create_input_slot_slot$1(ctx) {
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
    			attr_dev(input, "id", /*inputName*/ ctx[3]);
    			attr_dev(input, "placeholder", /*inputPlaceholder*/ ctx[0]);
    			attr_dev(input, "onscreenvalue", /*inputValue*/ ctx[1]);
    			attr_dev(input, "pullupdialog", input_pullupdialog_value = /*$validity*/ ctx[7].dirty && !/*$validity*/ ctx[7].valid);
    			attr_dev(input, "isinputok", input_isinputok_value = /*$validity*/ ctx[7].valid);
    			toggle_class(input, "activated", /*$validity*/ ctx[7].valid);
    			add_location(input, file$i, 93, 4, 2979);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*inputValue*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[13]),
    					action_destroyer(validate_action = /*validate*/ ctx[9].call(null, input, /*inputValue*/ ctx[1]))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputName*/ 8) {
    				attr_dev(input, "name", /*inputName*/ ctx[3]);
    			}

    			if (dirty & /*inputName*/ 8) {
    				attr_dev(input, "id", /*inputName*/ ctx[3]);
    			}

    			if (dirty & /*inputPlaceholder*/ 1) {
    				attr_dev(input, "placeholder", /*inputPlaceholder*/ ctx[0]);
    			}

    			if (dirty & /*inputValue*/ 2) {
    				attr_dev(input, "onscreenvalue", /*inputValue*/ ctx[1]);
    			}

    			if (dirty & /*$validity*/ 128 && input_pullupdialog_value !== (input_pullupdialog_value = /*$validity*/ ctx[7].dirty && !/*$validity*/ ctx[7].valid)) {
    				attr_dev(input, "pullupdialog", input_pullupdialog_value);
    			}

    			if (dirty & /*$validity*/ 128 && input_isinputok_value !== (input_isinputok_value = /*$validity*/ ctx[7].valid)) {
    				attr_dev(input, "isinputok", input_isinputok_value);
    			}

    			if (dirty & /*inputValue*/ 2 && input.value !== /*inputValue*/ ctx[1]) {
    				set_input_value(input, /*inputValue*/ ctx[1]);
    			}

    			if (validate_action && is_function(validate_action.update) && dirty & /*inputValue*/ 2) validate_action.update.call(null, /*inputValue*/ ctx[1]);

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
    		id: create_input_slot_slot$1.name,
    		type: "slot",
    		source: "(94:4) ",
    		ctx
    	});

    	return block;
    }

    // (107:4) 
    function create_outline_symbol_slot_slot(ctx) {
    	let span;
    	let span_isinputok_value;
    	let span_disabled_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "isinputok", span_isinputok_value = /*$validity*/ ctx[7].valid);
    			attr_dev(span, "class", "outline-symbol-slot");
    			attr_dev(span, "disabled", span_disabled_value = !(/*sign*/ ctx[6].length > 0));
    			attr_dev(span, "slot", "outline-symbol-slot");
    			add_location(span, file$i, 106, 4, 3381);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			span.innerHTML = /*sign*/ ctx[6];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sign*/ 64) span.innerHTML = /*sign*/ ctx[6];
    			if (dirty & /*$validity*/ 128 && span_isinputok_value !== (span_isinputok_value = /*$validity*/ ctx[7].valid)) {
    				attr_dev(span, "isinputok", span_isinputok_value);
    			}

    			if (dirty & /*sign*/ 64 && span_disabled_value !== (span_disabled_value = !(/*sign*/ ctx[6].length > 0))) {
    				attr_dev(span, "disabled", span_disabled_value);
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
    		source: "(107:4) ",
    		ctx
    	});

    	return block;
    }

    // (119:4) 
    function create_outline_dialog_slot_slot(ctx) {
    	let popdialog;
    	let current;

    	popdialog = new PopDialog({
    			props: {
    				isSide: "true",
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
    		source: "(119:4) ",
    		ctx
    	});

    	return block;
    }

    // (124:4) 
    function create_outline_text_slot_slot(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*inputPlaceholder*/ ctx[0]);
    			attr_dev(span, "class", "outline-text-slot");
    			attr_dev(span, "slot", "outline-text-slot");
    			add_location(span, file$i, 123, 4, 3863);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputPlaceholder*/ 1) set_data_dev(t, /*inputPlaceholder*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_outline_text_slot_slot.name,
    		type: "slot",
    		source: "(124:4) ",
    		ctx
    	});

    	return block;
    }

    // (127:4) 
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
    		source: "(127:4) ",
    		ctx
    	});

    	return block;
    }

    // (128:4) 
    function create_outline_emoji_slot_slot(ctx) {
    	let span;
    	let t;
    	let span_isinputok_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*emoji*/ ctx[5]);
    			attr_dev(span, "class", "outline-emoji");
    			attr_dev(span, "isinputok", span_isinputok_value = /*$validity*/ ctx[7].valid);
    			attr_dev(span, "slot", "outline-emoji-slot");
    			add_location(span, file$i, 127, 4, 4033);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*emoji*/ 32) set_data_dev(t, /*emoji*/ ctx[5]);

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
    		source: "(128:4) ",
    		ctx
    	});

    	return block;
    }

    // (133:4) 
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
    		source: "(133:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let inputcontainer;
    	let current;

    	inputcontainer = new InputContainer({
    			props: {
    				$$slots: {
    					"extra-dialog-slot": [create_extra_dialog_slot_slot],
    					"outline-emoji-slot": [create_outline_emoji_slot_slot],
    					"outline-help-slot": [create_outline_help_slot_slot],
    					"outline-text-slot": [create_outline_text_slot_slot],
    					"outline-dialog-slot": [create_outline_dialog_slot_slot],
    					"outline-symbol-slot": [create_outline_symbol_slot_slot],
    					"input-slot": [create_input_slot_slot$1],
    					default: [create_default_slot$c]
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

    			if (dirty & /*$$scope, $validity, emoji, inputPlaceholder, sign, inputName, inputValue, helpTextHeading, helpText*/ 16639) {
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
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const backSlash = "'";

    function instance$n($$self, $$props, $$invalidate) {
    	let $validity,
    		$$unsubscribe_validity = noop,
    		$$subscribe_validity = () => ($$unsubscribe_validity(), $$unsubscribe_validity = subscribe(validity, $$value => $$invalidate(7, $validity = $$value)), validity);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_validity());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputText', slots, ['extra-dialog','container-help-slot']);
    	let { inputPlaceholder = "" } = $$props;
    	let { helpTextHeading = "" } = $$props;
    	let { isRequired = false } = $$props;
    	let { textType = "name" } = $$props;
    	let { inputValue = "" } = $$props;
    	let { inputName = "" } = $$props;
    	let { helpText = "" } = $$props;
    	let { emoji = "" } = $$props;
    	let { sign = "" } = $$props;
    	let validity;
    	let validate;
    	const placeHolder = inputPlaceholder;

    	onMount(() => {
    		if (mountComponent(inputName)) {
    			typeOfInput(inputValue, mountComponent(inputName))
    			? $$invalidate(1, inputValue = typeOfInput(inputValue, mountComponent(inputName)))
    			: () => {
    					return;
    				};
    		}
    	});

    	switch (textType) {
    		case "email":
    			$$subscribe_validity([validity, validate] = createFieldValidator("", inputName, isRequired, true, emailValidator()));
    			break;
    		case "name":
    			$$subscribe_validity([validity, validate] = createFieldValidator("", inputName, isRequired, true, nameValidator()));
    			break;
    		case "height":
    			$$subscribe_validity([validity, validate] = createFieldValidator("", inputName, isRequired, false, heightValidator()));
    			break;
    		default:
    			$$subscribe_validity([validity, validate] = createFieldValidator("", inputName, isRequired, true, nameValidator()));
    			break;
    	}

    	const accumulatorCheck = () => {
    		validityCheck(inputName, $validity.value, $validity.valid);

    		textType == "height"
    		? inputValue != undefined && inputValue != null
    			? $$invalidate(1, inputValue = $validity.response)
    			: inputValue
    		: inputValue;

    		setPlaceHolder();
    	};

    	const setPlaceHolder = () => {
    		let checkVal = $validity.value != null && $validity.value != undefined && $validity.value.length > 0;

    		checkVal
    		? $$invalidate(0, inputPlaceholder = $validity.value)
    		: $$invalidate(0, inputPlaceholder = placeHolder);
    	};

    	const writable_props = [
    		'inputPlaceholder',
    		'helpTextHeading',
    		'isRequired',
    		'textType',
    		'inputValue',
    		'inputName',
    		'helpText',
    		'emoji',
    		'sign'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputText> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		inputValue = this.value;
    		$$invalidate(1, inputValue);
    	}

    	$$self.$$set = $$props => {
    		if ('inputPlaceholder' in $$props) $$invalidate(0, inputPlaceholder = $$props.inputPlaceholder);
    		if ('helpTextHeading' in $$props) $$invalidate(2, helpTextHeading = $$props.helpTextHeading);
    		if ('isRequired' in $$props) $$invalidate(10, isRequired = $$props.isRequired);
    		if ('textType' in $$props) $$invalidate(11, textType = $$props.textType);
    		if ('inputValue' in $$props) $$invalidate(1, inputValue = $$props.inputValue);
    		if ('inputName' in $$props) $$invalidate(3, inputName = $$props.inputName);
    		if ('helpText' in $$props) $$invalidate(4, helpText = $$props.helpText);
    		if ('emoji' in $$props) $$invalidate(5, emoji = $$props.emoji);
    		if ('sign' in $$props) $$invalidate(6, sign = $$props.sign);
    		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		emailValidator,
    		nameValidator,
    		heightValidator,
    		createFieldValidator,
    		validityCheck,
    		onMount,
    		InputContainer,
    		PopDialog,
    		mountComponent,
    		typeOfInput,
    		inputPlaceholder,
    		helpTextHeading,
    		isRequired,
    		textType,
    		inputValue,
    		inputName,
    		helpText,
    		emoji,
    		sign,
    		validity,
    		validate,
    		placeHolder,
    		backSlash,
    		accumulatorCheck,
    		setPlaceHolder,
    		$validity
    	});

    	$$self.$inject_state = $$props => {
    		if ('inputPlaceholder' in $$props) $$invalidate(0, inputPlaceholder = $$props.inputPlaceholder);
    		if ('helpTextHeading' in $$props) $$invalidate(2, helpTextHeading = $$props.helpTextHeading);
    		if ('isRequired' in $$props) $$invalidate(10, isRequired = $$props.isRequired);
    		if ('textType' in $$props) $$invalidate(11, textType = $$props.textType);
    		if ('inputValue' in $$props) $$invalidate(1, inputValue = $$props.inputValue);
    		if ('inputName' in $$props) $$invalidate(3, inputName = $$props.inputName);
    		if ('helpText' in $$props) $$invalidate(4, helpText = $$props.helpText);
    		if ('emoji' in $$props) $$invalidate(5, emoji = $$props.emoji);
    		if ('sign' in $$props) $$invalidate(6, sign = $$props.sign);
    		if ('validity' in $$props) $$subscribe_validity($$invalidate(8, validity = $$props.validity));
    		if ('validate' in $$props) $$invalidate(9, validate = $$props.validate);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$validity*/ 128) {
    			try {
    				$validity.valid
    				? accumulatorCheck()
    				: accumulatorCheck();
    			} catch(error) {
    				
    			}
    		}
    	};

    	return [
    		inputPlaceholder,
    		inputValue,
    		helpTextHeading,
    		inputName,
    		helpText,
    		emoji,
    		sign,
    		$validity,
    		validity,
    		validate,
    		isRequired,
    		textType,
    		slots,
    		input_input_handler,
    		$$scope
    	];
    }

    class InputText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {
    			inputPlaceholder: 0,
    			helpTextHeading: 2,
    			isRequired: 10,
    			textType: 11,
    			inputValue: 1,
    			inputName: 3,
    			helpText: 4,
    			emoji: 5,
    			sign: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputText",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get inputPlaceholder() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputPlaceholder(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helpTextHeading() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helpTextHeading(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isRequired() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isRequired(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textType() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textType(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputValue() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputValue(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputName() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputName(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helpText() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helpText(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get emoji() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set emoji(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sign() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sign(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var euro = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.a{fill:#fff;opacity:0;}</style></defs><rect class="a" /><path d="M16.3,17.3a5.9,5.9,0,0,1-2.6.7A5.1,5.1,0,0,1,10,16.4a6.1,6.1,0,0,1-1.3-3.1h-1v-.8h.9v-.3c0-.3.1-.6.1-.8h-1v-.9H8.8a5.7,5.7,0,0,1,1.5-3A4.7,4.7,0,0,1,13.8,6a5,5,0,0,1,2.4.6l-.4,1.1a4.6,4.6,0,0,0-2-.5,2.9,2.9,0,0,0-2.3,1,4.5,4.5,0,0,0-1.1,2.3h5v.9H10.3v1.1h5.1v.8H10.3a4.4,4.4,0,0,0,1,2.3,3.2,3.2,0,0,0,2.5,1.1,4.3,4.3,0,0,0,2.2-.6Z"/></svg>';

    /* src\MortgageForm.svelte generated by Svelte v3.44.3 */
    const file$h = "src\\MortgageForm.svelte";

    // (31:8) 
    function create_heading_slot$4(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Mortgage Accesibility";
    			attr_dev(h1, "slot", "heading");
    			add_location(h1, file$h, 30, 8, 1110);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_heading_slot$4.name,
    		type: "slot",
    		source: "(31:8) ",
    		ctx
    	});

    	return block;
    }

    // (32:8) 
    function create_paragraph_slot$3(ctx) {
    	let h4;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "Get to know the type of mortgages that you can access.";
    			attr_dev(h4, "slot", "paragraph");
    			add_location(h4, file$h, 31, 8, 1165);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_paragraph_slot$3.name,
    		type: "slot",
    		source: "(32:8) ",
    		ctx
    	});

    	return block;
    }

    // (54:16) 
    function create_extra_dialog_slot$1(ctx) {
    	let popdialog;
    	let current;

    	popdialog = new PopDialog({
    			props: {
    				isExtra: "true",
    				slot: "extra-dialog",
    				popupHeading: "Down Payment",
    				popupText: "This is the Monthly Income slot",
    				visibility: /*helpDialog*/ ctx[1]
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
    			if (dirty & /*helpDialog*/ 2) popdialog_changes.visibility = /*helpDialog*/ ctx[1];
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
    		id: create_extra_dialog_slot$1.name,
    		type: "slot",
    		source: "(54:16) ",
    		ctx
    	});

    	return block;
    }

    // (61:16) 
    function create_container_help_slot_slot$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "slot", "container-help-slot");
    			attr_dev(button, "class", "outline-help-slot helper-button");
    			add_location(button, file$h, 60, 16, 2220);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
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
    		id: create_container_help_slot_slot$1.name,
    		type: "slot",
    		source: "(61:16) ",
    		ctx
    	});

    	return block;
    }

    // (35:8) 
    function create_forms_slot$4(ctx) {
    	let div;
    	let inputtext;
    	let t0;
    	let br0;
    	let t1;
    	let inputnumber0;
    	let t2;
    	let br1;
    	let t3;
    	let inputnumber1;
    	let t4;
    	let br2;
    	let t5;
    	let inputcheckbox0;
    	let t6;
    	let br3;
    	let t7;
    	let inputcheckbox1;
    	let t8;
    	let br4;
    	let t9;
    	let inputrange0;
    	let t10;
    	let br5;
    	let t11;
    	let inputrange1;
    	let current;

    	inputtext = new InputText({
    			props: {
    				inputName: "user-name",
    				inputPlaceholder: "Enter First Name",
    				isRequired: "true",
    				emoji: "👏",
    				slot: "slot1"
    			},
    			$$inline: true
    		});

    	inputnumber0 = new InputNumber({
    			props: {
    				slot: "slot2",
    				inputPlaceholder: "Monthly Income",
    				inputName: "totalmonthlyincome",
    				isRequired: "true",
    				levelRange: "900",
    				sign: euro,
    				emoji: "👍",
    				hasHelp: "true",
    				$$slots: {
    					"container-help-slot": [create_container_help_slot_slot$1],
    					"extra-dialog": [create_extra_dialog_slot$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	inputnumber1 = new InputNumber({
    			props: {
    				slot: "slot3",
    				inputPlaceholder: "Down Payment",
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
    				slot: "slot4",
    				inputName: "coapplicant",
    				checkboxtext: "Applying with a co-applicant?",
    				extracheckboxtext: "",
    				isRequired: "true"
    			},
    			$$inline: true
    		});

    	inputcheckbox1 = new InputCheckbox({
    			props: {
    				slot: "slot5",
    				isRequired: "true",
    				inputName: "dependants",
    				checkboxtext: "More than one dependant in the family?",
    				extracheckboxtext: "How Many Dependants",
    				extracheckbox: "true"
    			},
    			$$inline: true
    		});

    	inputrange0 = new InputRange({
    			props: {
    				rangeText: "Enter Loan Amount",
    				inputName: "loanamount",
    				rangeType: "number",
    				isRequired: "true",
    				inputValue: "1",
    				inputMax: "25",
    				inputMin: "0",
    				slot: "slot6",
    				sign: euro
    			},
    			$$inline: true
    		});

    	inputrange1 = new InputRange({
    			props: {
    				slot: "slot7",
    				inputValue: "0",
    				inputMin: "1",
    				inputMax: "40",
    				inputName: "loanduration",
    				rangeText: "Choose loan term",
    				isTimeBound: "true",
    				isRequired: "true",
    				rangeType: "time"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(inputtext.$$.fragment);
    			t0 = space();
    			br0 = element("br");
    			t1 = space();
    			create_component(inputnumber0.$$.fragment);
    			t2 = space();
    			br1 = element("br");
    			t3 = space();
    			create_component(inputnumber1.$$.fragment);
    			t4 = space();
    			br2 = element("br");
    			t5 = space();
    			create_component(inputcheckbox0.$$.fragment);
    			t6 = space();
    			br3 = element("br");
    			t7 = space();
    			create_component(inputcheckbox1.$$.fragment);
    			t8 = space();
    			br4 = element("br");
    			t9 = space();
    			create_component(inputrange0.$$.fragment);
    			t10 = space();
    			br5 = element("br");
    			t11 = space();
    			create_component(inputrange1.$$.fragment);
    			add_location(br0, file$h, 42, 12, 1580);
    			add_location(br1, file$h, 68, 12, 2520);
    			add_location(br2, file$h, 78, 12, 2826);
    			add_location(br3, file$h, 86, 12, 3094);
    			add_location(br4, file$h, 95, 12, 3427);
    			add_location(br5, file$h, 107, 12, 3794);
    			attr_dev(div, "class", "inner-form");
    			attr_dev(div, "slot", "forms");
    			toggle_class(div, "next", /*isFormReady*/ ctx[0]);
    			add_location(div, file$h, 34, 8, 1279);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(inputtext, div, null);
    			append_dev(div, t0);
    			append_dev(div, br0);
    			append_dev(div, t1);
    			mount_component(inputnumber0, div, null);
    			append_dev(div, t2);
    			append_dev(div, br1);
    			append_dev(div, t3);
    			mount_component(inputnumber1, div, null);
    			append_dev(div, t4);
    			append_dev(div, br2);
    			append_dev(div, t5);
    			mount_component(inputcheckbox0, div, null);
    			append_dev(div, t6);
    			append_dev(div, br3);
    			append_dev(div, t7);
    			mount_component(inputcheckbox1, div, null);
    			append_dev(div, t8);
    			append_dev(div, br4);
    			append_dev(div, t9);
    			mount_component(inputrange0, div, null);
    			append_dev(div, t10);
    			append_dev(div, br5);
    			append_dev(div, t11);
    			mount_component(inputrange1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputnumber0_changes = {};

    			if (dirty & /*$$scope, helpDialog*/ 18) {
    				inputnumber0_changes.$$scope = { dirty, ctx };
    			}

    			inputnumber0.$set(inputnumber0_changes);

    			if (dirty & /*isFormReady*/ 1) {
    				toggle_class(div, "next", /*isFormReady*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputtext.$$.fragment, local);
    			transition_in(inputnumber0.$$.fragment, local);
    			transition_in(inputnumber1.$$.fragment, local);
    			transition_in(inputcheckbox0.$$.fragment, local);
    			transition_in(inputcheckbox1.$$.fragment, local);
    			transition_in(inputrange0.$$.fragment, local);
    			transition_in(inputrange1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputtext.$$.fragment, local);
    			transition_out(inputnumber0.$$.fragment, local);
    			transition_out(inputnumber1.$$.fragment, local);
    			transition_out(inputcheckbox0.$$.fragment, local);
    			transition_out(inputcheckbox1.$$.fragment, local);
    			transition_out(inputrange0.$$.fragment, local);
    			transition_out(inputrange1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(inputtext);
    			destroy_component(inputnumber0);
    			destroy_component(inputnumber1);
    			destroy_component(inputcheckbox0);
    			destroy_component(inputcheckbox1);
    			destroy_component(inputrange0);
    			destroy_component(inputrange1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_forms_slot$4.name,
    		type: "slot",
    		source: "(35:8) ",
    		ctx
    	});

    	return block;
    }

    // (29:0) <Router basepath="/mortgages" url="/mortgages">
    function create_default_slot$b(ctx) {
    	let formcontainer;
    	let current;

    	formcontainer = new FormContainer({
    			props: {
    				$$slots: {
    					forms: [create_forms_slot$4],
    					paragraph: [create_paragraph_slot$3],
    					heading: [create_heading_slot$4]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formcontainer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formcontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formcontainer_changes = {};

    			if (dirty & /*$$scope, isFormReady, helpDialog*/ 19) {
    				formcontainer_changes.$$scope = { dirty, ctx };
    			}

    			formcontainer.$set(formcontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formcontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formcontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formcontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(29:0) <Router basepath=\\\"/mortgages\\\" url=\\\"/mortgages\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				basepath: "/mortgages",
    				url: "/mortgages",
    				$$slots: { default: [create_default_slot$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, isFormReady, helpDialog*/ 19) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MortgageForm', slots, []);
    	let { isFormReady = false } = $$props;
    	let helpDialog = false;
    	let page = 0;

    	onMount(() => {
    		$$invalidate(0, isFormReady = false);
    	});

    	afterUpdate(() => {
    		if (isFormReady) {
    			//console.log("THIS IS DONE: ", isFormReady);
    			navigate(`diet/`, { replace: false });
    		}
    	});

    	const writable_props = ['isFormReady'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MortgageForm> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(1, helpDialog = !helpDialog);
    	};

    	$$self.$$set = $$props => {
    		if ('isFormReady' in $$props) $$invalidate(0, isFormReady = $$props.isFormReady);
    	};

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		Link,
    		InputNumber,
    		FormContainer,
    		FormSlot,
    		InputRange,
    		InputCheckbox,
    		InputText,
    		PopDialog,
    		euro,
    		accumulator,
    		afterUpdate,
    		onMount,
    		get: get_store_value,
    		navigate,
    		isFormReady,
    		helpDialog,
    		page
    	});

    	$$self.$inject_state = $$props => {
    		if ('isFormReady' in $$props) $$invalidate(0, isFormReady = $$props.isFormReady);
    		if ('helpDialog' in $$props) $$invalidate(1, helpDialog = $$props.helpDialog);
    		if ('page' in $$props) page = $$props.page;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isFormReady, helpDialog, click_handler];
    }

    class MortgageForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { isFormReady: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MortgageForm",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get isFormReady() {
    		throw new Error("<MortgageForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFormReady(value) {
    		throw new Error("<MortgageForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const setProfile = (() =>{
        let accum_name = get_store_value(accumulator).find(
            (v) => v.component === "user-name"
        ).value;
        let accum_email = get_store_value(accumulator).find(
            (v) => v.component === "user-email"
        ).value;
        let accum_age = get_store_value(accumulator).find(
            (v) => v.component === "age"
        ).value;
        let accum_income = get_store_value(accumulator).find(
            (v) => v.component === "totalmonthlyincome"
        ).value;

        return [accum_name,accum_age,accum_email,accum_income]
    });

    /* src\Profile.svelte generated by Svelte v3.44.3 */

    const file$g = "src\\Profile.svelte";

    function create_fragment$l(ctx) {
    	let h2;
    	let t0;
    	let t1;
    	let t2;
    	let caption;
    	let t3;
    	let t4;
    	let p;
    	let t5;
    	let t6;
    	let t7;
    	let br0;
    	let t8;
    	let h3;
    	let t9;
    	let t10;
    	let t11;
    	let br1;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text("Welcome ");
    			t1 = text(/*userName*/ ctx[0]);
    			t2 = space();
    			caption = element("caption");
    			t3 = text(/*age*/ ctx[2]);
    			t4 = space();
    			p = element("p");
    			t5 = text("Your loan amount based on your your total monthly income $");
    			t6 = text(/*income*/ ctx[1]);
    			t7 = space();
    			br0 = element("br");
    			t8 = space();
    			h3 = element("h3");
    			t9 = text("We will contact you on this email: ");
    			t10 = text(/*email*/ ctx[3]);
    			t11 = space();
    			br1 = element("br");
    			add_location(h2, file$g, 6, 0, 115);
    			add_location(caption, file$g, 7, 0, 145);
    			add_location(p, file$g, 8, 0, 171);
    			add_location(br0, file$g, 9, 0, 247);
    			add_location(h3, file$g, 10, 0, 253);
    			add_location(br1, file$g, 11, 0, 306);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			append_dev(h2, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, caption, anchor);
    			append_dev(caption, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t5);
    			append_dev(p, t6);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t9);
    			append_dev(h3, t10);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, br1, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*userName*/ 1) set_data_dev(t1, /*userName*/ ctx[0]);
    			if (dirty & /*age*/ 4) set_data_dev(t3, /*age*/ ctx[2]);
    			if (dirty & /*income*/ 2) set_data_dev(t6, /*income*/ ctx[1]);
    			if (dirty & /*email*/ 8) set_data_dev(t10, /*email*/ ctx[3]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(caption);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(br1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Profile', slots, []);
    	let { userName } = $$props;
    	let { income } = $$props;
    	let { age } = $$props;
    	let { email } = $$props;
    	const writable_props = ['userName', 'income', 'age', 'email'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Profile> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('userName' in $$props) $$invalidate(0, userName = $$props.userName);
    		if ('income' in $$props) $$invalidate(1, income = $$props.income);
    		if ('age' in $$props) $$invalidate(2, age = $$props.age);
    		if ('email' in $$props) $$invalidate(3, email = $$props.email);
    	};

    	$$self.$capture_state = () => ({ userName, income, age, email });

    	$$self.$inject_state = $$props => {
    		if ('userName' in $$props) $$invalidate(0, userName = $$props.userName);
    		if ('income' in $$props) $$invalidate(1, income = $$props.income);
    		if ('age' in $$props) $$invalidate(2, age = $$props.age);
    		if ('email' in $$props) $$invalidate(3, email = $$props.email);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [userName, income, age, email];
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { userName: 0, income: 1, age: 2, email: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*userName*/ ctx[0] === undefined && !('userName' in props)) {
    			console.warn("<Profile> was created without expected prop 'userName'");
    		}

    		if (/*income*/ ctx[1] === undefined && !('income' in props)) {
    			console.warn("<Profile> was created without expected prop 'income'");
    		}

    		if (/*age*/ ctx[2] === undefined && !('age' in props)) {
    			console.warn("<Profile> was created without expected prop 'age'");
    		}

    		if (/*email*/ ctx[3] === undefined && !('email' in props)) {
    			console.warn("<Profile> was created without expected prop 'email'");
    		}
    	}

    	get userName() {
    		throw new Error("<Profile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set userName(value) {
    		throw new Error("<Profile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get income() {
    		throw new Error("<Profile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set income(value) {
    		throw new Error("<Profile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get age() {
    		throw new Error("<Profile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set age(value) {
    		throw new Error("<Profile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get email() {
    		throw new Error("<Profile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set email(value) {
    		throw new Error("<Profile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\HealthForm.svelte generated by Svelte v3.44.3 */
    const file$f = "src\\HealthForm.svelte";

    // (41:8) 
    function create_heading_slot$3(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Dietary Plan";
    			attr_dev(h1, "slot", "heading");
    			add_location(h1, file$f, 40, 8, 1446);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_heading_slot$3.name,
    		type: "slot",
    		source: "(41:8) ",
    		ctx
    	});

    	return block;
    }

    // (42:8) 
    function create_paragraph_slot$2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Get your personalized diet plan.";
    			attr_dev(p, "slot", "paragraph");
    			add_location(p, file$f, 41, 8, 1492);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_paragraph_slot$2.name,
    		type: "slot",
    		source: "(42:8) ",
    		ctx
    	});

    	return block;
    }

    // (44:12) <Route path="/">
    function create_default_slot_3$2(ctx) {
    	let h4;
    	let t0;
    	let t1;
    	let t2;
    	let p;
    	let t4;
    	let inputtext;
    	let t5;
    	let div;
    	let current;

    	inputtext = new InputText({
    			props: {
    				inputName: "user-email",
    				inputPlaceholder: "Enter Email",
    				isRequired: "true",
    				emoji: "👏",
    				textType: "email"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t0 = text("Hello ");
    			t1 = text(/*userName*/ ctx[0]);
    			t2 = text(",\r\n                    ");
    			p = element("p");
    			p.textContent = "please enter your email";
    			t4 = space();
    			create_component(inputtext.$$.fragment);
    			t5 = space();
    			div = element("div");
    			add_location(p, file$f, 46, 20, 1708);
    			add_location(h4, file$f, 44, 16, 1643);
    			attr_dev(div, "class", "empty-input");
    			add_location(div, file$f, 55, 16, 2032);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t0);
    			append_dev(h4, t1);
    			append_dev(h4, t2);
    			append_dev(h4, p);
    			insert_dev(target, t4, anchor);
    			mount_component(inputtext, target, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*userName*/ 1) set_data_dev(t1, /*userName*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputtext.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputtext.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t4);
    			destroy_component(inputtext, detaching);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(44:12) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (58:12) <Route path="step3">
    function create_default_slot_2$3(ctx) {
    	let h4;
    	let t0;
    	let t1;
    	let t2;
    	let p0;
    	let t4;
    	let inputnumber;
    	let t5;
    	let p1;
    	let t7;
    	let inputcheckbox0;
    	let t8;
    	let inputcheckbox1;
    	let t9;
    	let inputcheckbox2;
    	let current;

    	inputnumber = new InputNumber({
    			props: {
    				inputPlaceholder: "How old are you",
    				inputName: "age",
    				isRequired: "true",
    				levelRange: "18",
    				emoji: "👍",
    				hasHelp: "true"
    			},
    			$$inline: true
    		});

    	inputcheckbox0 = new InputCheckbox({
    			props: {
    				inputName: "eighteen to twenty five",
    				checkboxtext: "18 - 25",
    				isRequired: "true;"
    			},
    			$$inline: true
    		});

    	inputcheckbox1 = new InputCheckbox({
    			props: {
    				inputName: "twenty six to thirty five",
    				checkboxtext: "26 - 35",
    				isRequired: "true;"
    			},
    			$$inline: true
    		});

    	inputcheckbox2 = new InputCheckbox({
    			props: {
    				inputName: "thirty six to forty five",
    				checkboxtext: "36 - 45",
    				isRequired: "true;"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t0 = text("Yo ");
    			t1 = text(/*userName*/ ctx[0]);
    			t2 = text(",\r\n                    \r\n                    ");
    			p0 = element("p");
    			p0.textContent = "are you comfortable with giving us your age?";
    			t4 = space();
    			create_component(inputnumber.$$.fragment);
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "or are you more comfortable with a range?";
    			t7 = space();
    			create_component(inputcheckbox0.$$.fragment);
    			t8 = space();
    			create_component(inputcheckbox1.$$.fragment);
    			t9 = space();
    			create_component(inputcheckbox2.$$.fragment);
    			add_location(p0, file$f, 61, 20, 2217);
    			add_location(p1, file$f, 72, 20, 2653);
    			add_location(h4, file$f, 58, 16, 2133);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t0);
    			append_dev(h4, t1);
    			append_dev(h4, t2);
    			append_dev(h4, p0);
    			append_dev(h4, t4);
    			mount_component(inputnumber, h4, null);
    			append_dev(h4, t5);
    			append_dev(h4, p1);
    			append_dev(h4, t7);
    			mount_component(inputcheckbox0, h4, null);
    			append_dev(h4, t8);
    			mount_component(inputcheckbox1, h4, null);
    			append_dev(h4, t9);
    			mount_component(inputcheckbox2, h4, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*userName*/ 1) set_data_dev(t1, /*userName*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputnumber.$$.fragment, local);
    			transition_in(inputcheckbox0.$$.fragment, local);
    			transition_in(inputcheckbox1.$$.fragment, local);
    			transition_in(inputcheckbox2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputnumber.$$.fragment, local);
    			transition_out(inputcheckbox0.$$.fragment, local);
    			transition_out(inputcheckbox1.$$.fragment, local);
    			transition_out(inputcheckbox2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			destroy_component(inputnumber);
    			destroy_component(inputcheckbox0);
    			destroy_component(inputcheckbox1);
    			destroy_component(inputcheckbox2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(58:12) <Route path=\\\"step3\\\">",
    		ctx
    	});

    	return block;
    }

    // (92:12) <Route path="welcome-page">
    function create_default_slot_1$6(ctx) {
    	let profile;
    	let current;

    	profile = new Profile({
    			props: {
    				age: /*age*/ ctx[3],
    				userName: /*userName*/ ctx[0],
    				income: /*totalIncome*/ ctx[2],
    				email: /*email*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(profile.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(profile, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const profile_changes = {};
    			if (dirty & /*age*/ 8) profile_changes.age = /*age*/ ctx[3];
    			if (dirty & /*userName*/ 1) profile_changes.userName = /*userName*/ ctx[0];
    			if (dirty & /*totalIncome*/ 4) profile_changes.income = /*totalIncome*/ ctx[2];
    			if (dirty & /*email*/ 2) profile_changes.email = /*email*/ ctx[1];
    			profile.$set(profile_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(profile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(profile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(profile, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(92:12) <Route path=\\\"welcome-page\\\">",
    		ctx
    	});

    	return block;
    }

    // (43:8) 
    function create_forms_slot$3(ctx) {
    	let div;
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let current;

    	route0 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "step3",
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "welcome-page",
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			attr_dev(div, "class", "inner-form");
    			attr_dev(div, "slot", "forms");
    			add_location(div, file$f, 42, 8, 1558);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(route0, div, null);
    			append_dev(div, t0);
    			mount_component(route1, div, null);
    			append_dev(div, t1);
    			mount_component(route2, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope, userName*/ 65) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope, userName*/ 65) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope, age, userName, totalIncome, email*/ 79) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_forms_slot$3.name,
    		type: "slot",
    		source: "(43:8) ",
    		ctx
    	});

    	return block;
    }

    // (39:0) <Router basepath="/diet" url="/diet">
    function create_default_slot$a(ctx) {
    	let formcontainer;
    	let current;

    	formcontainer = new FormContainer({
    			props: {
    				$$slots: {
    					forms: [create_forms_slot$3],
    					paragraph: [create_paragraph_slot$2],
    					heading: [create_heading_slot$3]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formcontainer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formcontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formcontainer_changes = {};

    			if (dirty & /*$$scope, age, userName, totalIncome, email*/ 79) {
    				formcontainer_changes.$$scope = { dirty, ctx };
    			}

    			formcontainer.$set(formcontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formcontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formcontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formcontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(39:0) <Router basepath=\\\"/diet\\\" url=\\\"/diet\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				basepath: "/diet",
    				url: "/diet",
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, age, userName, totalIncome, email*/ 79) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HealthForm', slots, []);
    	let { isFormReady = false } = $$props;
    	let page = 2;
    	let userName;
    	let email;
    	let totalIncome;
    	let age;

    	onMount(() => {
    		$$invalidate(4, isFormReady = false);
    		let accum = get_store_value(accumulator).find(v => v.component === "user-name");

    		if (accum) {
    			if (accum.value.length > 0) $$invalidate(0, userName = accum.value);
    		}
    	});

    	afterUpdate(() => {
    		if (isFormReady) {
    			//console.log("THIS IS DONE: ", isFormReady);
    			if (get_store_value(accumulator).length < 10) {
    				navigate(`step${page + 1}`, { replace: false });
    			} else {
    				$$invalidate(0, [userName, age, email, totalIncome] = setProfile(), userName, $$invalidate(3, age), $$invalidate(1, email), $$invalidate(2, totalIncome));
    				navigate("welcome-page", { replace: false });
    			}
    		}
    	});

    	const writable_props = ['isFormReady'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HealthForm> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('isFormReady' in $$props) $$invalidate(4, isFormReady = $$props.isFormReady);
    	};

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		Link,
    		navigate,
    		setProfile,
    		FormContainer,
    		InputText,
    		InputCheckbox,
    		InputNumber,
    		get: get_store_value,
    		accumulator,
    		afterUpdate,
    		onMount,
    		Profile,
    		isFormReady,
    		page,
    		userName,
    		email,
    		totalIncome,
    		age
    	});

    	$$self.$inject_state = $$props => {
    		if ('isFormReady' in $$props) $$invalidate(4, isFormReady = $$props.isFormReady);
    		if ('page' in $$props) page = $$props.page;
    		if ('userName' in $$props) $$invalidate(0, userName = $$props.userName);
    		if ('email' in $$props) $$invalidate(1, email = $$props.email);
    		if ('totalIncome' in $$props) $$invalidate(2, totalIncome = $$props.totalIncome);
    		if ('age' in $$props) $$invalidate(3, age = $$props.age);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [userName, email, totalIncome, age, isFormReady];
    }

    class HealthForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { isFormReady: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HealthForm",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get isFormReady() {
    		throw new Error("<HealthForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFormReady(value) {
    		throw new Error("<HealthForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var dayjs_min = createCommonjsModule(function (module, exports) {
    !function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",f="month",h="quarter",c="year",d="date",$="Invalid Date",l=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},m=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},g={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,f),s=n-i<0,u=e.clone().add(r+(s?-1:1),f);return +(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return {M:f,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},D="en",v={};v[D]=M;var p=function(t){return t instanceof _},S=function(t,e,n){var r;if(!t)return D;if("string"==typeof t)v[t]&&(r=t),e&&(v[t]=e,r=t);else {var i=t.name;v[i]=t,r=i;}return !n&&r&&(D=r),r||!n&&D},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},O=g;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t);}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(l);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init();},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},m.$utils=function(){return O},m.isValid=function(){return !(this.$d.toString()===$)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,h=O.p(t),$=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},l=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,g="set"+(this.$u?"UTC":"");switch(h){case c:return r?$(1,0):$(31,11);case f:return r?$(1,M):$(0,M+1);case o:var D=this.$locale().weekStart||0,v=(y<D?y+7:y)-D;return $(r?m-v:m+(6-v),M);case a:case d:return l(g+"Hours",0);case u:return l(g+"Minutes",1);case s:return l(g+"Seconds",2);case i:return l(g+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),h="set"+(this.$u?"UTC":""),$=(n={},n[a]=h+"Date",n[d]=h+"Date",n[f]=h+"Month",n[c]=h+"FullYear",n[u]=h+"Hours",n[s]=h+"Minutes",n[i]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],l=o===a?this.$D+(e-this.$W):e;if(o===f||o===c){var y=this.clone().set(d,1);y.$d[$](l),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d;}else $&&this.$d[$](l);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,h){var d,$=this;r=Number(r);var l=O.p(h),y=function(t){var e=w($);return O.w(e.date(e.date()+Math.round(t*r)),$)};if(l===f)return this.set(f,this.$M+r);if(l===c)return this.set(c,this.$y+r);if(l===a)return y(1);if(l===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[l]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||$;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,f=n.months,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].substr(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:h(n.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:h(n.weekdaysMin,this.$W,o,2),ddd:h(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:i};return r.replace(y,(function(t,e){return e||l[t]||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,$){var l,y=O.p(d),M=w(r),m=(M.utcOffset()-this.utcOffset())*e,g=this-M,D=O.m(this,M);return D=(l={},l[c]=D/12,l[f]=D,l[h]=D/3,l[o]=(g-m)/6048e5,l[a]=(g-m)/864e5,l[u]=g/n,l[s]=g/e,l[i]=g/t,l)[y]||g,$?D:O.a(D)},m.daysInMonth=function(){return this.endOf(f).$D},m.$locale=function(){return v[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),b=_.prototype;return w.prototype=b,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",f],["$y",c],["$D",d]].forEach((function(t){b[t[1]]=function(e){return this.$g(e,t[0],t[1])};})),w.extend=function(t,e){return t.$i||(t(e,_,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=v[D],w.Ls=v,w.p={},w}));
    });

    const PICKER_TYPES = ['days', 'months', 'years'];

    const updateSelected = (value, property) => (state) => {
    	const newState = { ...state, [property]: value };
    	return { ...newState, selected: new Date(newState.year, newState.month, newState.day) };
    };

    const pipe = (...fns) => (val) => fns.reduce((accum, fn) => fn(accum), val);

    const zeroDay = (date) => dayjs_min(date).startOf('day').toDate();

    const get = ({ selected, start, end, startOfWeekIndex = 0, shouldEnlargeDay = false }) => {
    	const { subscribe, set, update } = writable({
    		open: false,
    		hasChosen: false,
    		selected,
    		start: zeroDay(start),
    		end: zeroDay(end),
    		shouldEnlargeDay,
    		enlargeDay: false,
    		year: selected.getFullYear(),
    		month: selected.getMonth(),
    		day: selected.getDate(),
    		activeView: 'days',
    		activeViewDirection: 1,
    		startOfWeekIndex
    	});

    	return {
    		set,
    		subscribe,
    		getState() {
    			return get_store_value({ subscribe });
    		},
    		enlargeDay(enlargeDay = true) {
    			update((state) => ({ ...state, enlargeDay }));
    		},
    		getSelectableVector(date) {
    			const { start, end } = this.getState();
    			if (date < start) return -1;
    			if (date > end) return 1;
    			return 0;
    		},
    		isSelectable(date, clamping = []) {
    			const vector = this.getSelectableVector(date);
    			if (vector === 0) return true;
    			if (!clamping.length) return false;
    			const clamped = this.clampValue(dayjs_min(date), clamping).toDate();
    			return this.isSelectable(clamped);
    		},
    		clampValue(day, clampable) {
    			const vector = this.getSelectableVector(day.toDate());
    			if (vector === 0) return day;
    			const boundaryKey = vector === 1 ? 'end' : 'start';
    			const boundary = dayjs_min(this.getState()[boundaryKey]);
    			return clampable.reduce((day, type) => day[type](boundary[type]()), day);
    		},
    		add(amount, unit, clampable = []) {
    			update(({ month, year, day, ...state }) => {
    				const d = this.clampValue(dayjs_min(new Date(year, month, day)).add(amount, unit), clampable);
    				if (!this.isSelectable(d.toDate())) return { ...state, year, month, day };
    				return {
    					...state,
    					month: d.month(),
    					year: d.year(),
    					day: d.date(),
    					selected: d.toDate()
    				};
    			});
    		},
    		setActiveView(newActiveView) {
    			const newIndex = PICKER_TYPES.indexOf(newActiveView);
    			if (newIndex === -1) return;
    			update(({ activeView, ...state }) => ({
    				...state,
    				activeViewDirection: PICKER_TYPES.indexOf(activeView) > newIndex ? -1 : 1,
    				activeView: newActiveView
    			}));
    		},
    		setYear(year) {
    			update(updateSelected(year, 'year'));
    		},
    		setMonth(month) {
    			update(updateSelected(month, 'month'));
    		},
    		setDay(day) {
    			update(
    				pipe(
    					updateSelected(day.getDate(), 'day'),
    					updateSelected(day.getMonth(), 'month'),
    					updateSelected(day.getFullYear(), 'year')
    				)
    			);
    		},
    		close(extraState) {
    			update((state) => ({ ...state, ...extraState, open: false }));
    		},
    		selectDay() {
    			this.close({ hasChosen: true });
    		},
    		getCalendarPage(month, year) {
    			const { startOfWeekIndex } = this.getState();
    			let last = { date: new Date(year, month, 1), outsider: false };
    			const days = [];

    			while (last.date.getMonth() === month) {
    				days.push(last);
    				const date = new Date(last.date);
    				date.setDate(last.date.getDate() + 1);
    				last = { date, outsider: false };
    			}

    			while (days[0].date.getDay() !== startOfWeekIndex) {
    				const date = new Date(days[0].date);
    				date.setDate(days[0].date.getDate() - 1);
    				days.unshift({
    					date,
    					outsider: true
    				});
    			}

    			last.outsider = true;
    			while (days.length < 42) {
    				days.push(last);
    				last = { date: new Date(last.date), outsider: true };
    				last.date.setDate(last.date.getDate() + 1);
    			}

    			return days;
    		}
    	};
    };

    var datepickerStore = { get };

    const storeContextKey = {};
    const keyControlsContextKey = {};
    const themeContextKey = {};

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }
    function crossfade(_a) {
        var { fallback } = _a, defaults = __rest(_a, ["fallback"]);
        const to_receive = new Map();
        const to_send = new Map();
        function crossfade(from, node, params) {
            const { delay = 0, duration = d => Math.sqrt(d) * 30, easing = cubicOut } = assign(assign({}, defaults), params);
            const to = node.getBoundingClientRect();
            const dx = from.left - to.left;
            const dy = from.top - to.top;
            const dw = from.width / to.width;
            const dh = from.height / to.height;
            const d = Math.sqrt(dx * dx + dy * dy);
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            const opacity = +style.opacity;
            return {
                delay,
                duration: is_function(duration) ? duration(d) : duration,
                easing,
                css: (t, u) => `
				opacity: ${t * opacity};
				transform-origin: top left;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
			`
            };
        }
        function transition(items, counterparts, intro) {
            return (node, params) => {
                items.set(params.key, {
                    rect: node.getBoundingClientRect()
                });
                return () => {
                    if (counterparts.has(params.key)) {
                        const { rect } = counterparts.get(params.key);
                        counterparts.delete(params.key);
                        return crossfade(rect, node, params);
                    }
                    // if the node is disappearing altogether
                    // (i.e. wasn't claimed by the other list)
                    // then we need to supply an outro
                    items.delete(params.key);
                    return fallback && fallback(node, params, intro);
                };
            };
        }
        return [
            transition(to_send, to_receive, false),
            transition(to_receive, to_send, true)
        ];
    }

    /* node_modules\svelte-calendar\components\generic\crossfade\Crossfade.svelte generated by Svelte v3.44.3 */
    const get_default_slot_changes$5 = dirty => ({ key: dirty & /*key*/ 1 });

    const get_default_slot_context$5 = ctx => ({
    	key: /*key*/ ctx[0],
    	send: /*send*/ ctx[1],
    	receive: /*receive*/ ctx[2]
    });

    function create_fragment$j(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], get_default_slot_context$5);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, key*/ 33)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, get_default_slot_changes$5),
    						get_default_slot_context$5
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Crossfade', slots, ['default']);
    	let { key = {} } = $$props;
    	let { duration = d => Math.max(150, Math.sqrt(d * 150)) } = $$props;
    	let { easing = cubicInOut } = $$props;

    	const [send, receive] = crossfade({
    		duration,
    		easing,
    		fallback(node, params) {
    			const style = getComputedStyle(node);
    			const transform = style.transform === 'none' ? '' : style.transform;

    			return {
    				duration,
    				easing,
    				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
    			};
    		}
    	});

    	const store = readable({ key, send, receive });
    	setContext('crossfade', store);
    	const writable_props = ['key', 'duration', 'easing'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Crossfade> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('key' in $$props) $$invalidate(0, key = $$props.key);
    		if ('duration' in $$props) $$invalidate(3, duration = $$props.duration);
    		if ('easing' in $$props) $$invalidate(4, easing = $$props.easing);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		readable,
    		crossfade,
    		cubicInOut,
    		key,
    		duration,
    		easing,
    		send,
    		receive,
    		store
    	});

    	$$self.$inject_state = $$props => {
    		if ('key' in $$props) $$invalidate(0, key = $$props.key);
    		if ('duration' in $$props) $$invalidate(3, duration = $$props.duration);
    		if ('easing' in $$props) $$invalidate(4, easing = $$props.easing);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [key, send, receive, duration, easing, $$scope, slots];
    }

    class Crossfade extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { key: 0, duration: 3, easing: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Crossfade",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get key() {
    		throw new Error("<Crossfade>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Crossfade>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Crossfade>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Crossfade>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get easing() {
    		throw new Error("<Crossfade>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set easing(value) {
    		throw new Error("<Crossfade>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var blurr = (node) => {
    	const click = (evt) => {
    		if (!node || node.contains(evt.target) || evt.defaultPrevented) return;
    		node.dispatchEvent(new CustomEvent('blurr', node));
    	};

    	document.addEventListener('click', click, true);

    	return {
    		destroy() {
    			document.removeEventListener('click', click, true);
    		}
    	};
    };

    /* node_modules\svelte-calendar\components\Popover.svelte generated by Svelte v3.44.3 */
    const file$e = "node_modules\\svelte-calendar\\components\\Popover.svelte";

    const get_contents_slot_changes = dirty => ({
    	key: dirty & /*key*/ 1048576,
    	send: dirty & /*send*/ 524288,
    	receive: dirty & /*receive*/ 262144
    });

    const get_contents_slot_context = ctx => ({
    	key: /*key*/ ctx[20],
    	send: /*send*/ ctx[19],
    	receive: /*receive*/ ctx[18]
    });

    const get_default_slot_changes$4 = dirty => ({
    	key: dirty & /*key*/ 1048576,
    	send: dirty & /*send*/ 524288,
    	receive: dirty & /*receive*/ 262144
    });

    const get_default_slot_context$4 = ctx => ({
    	key: /*key*/ ctx[20],
    	send: /*send*/ ctx[19],
    	receive: /*receive*/ ctx[18]
    });

    // (69:2) {:else}
    function create_else_block(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let current;
    	const contents_slot_template = /*#slots*/ ctx[8].contents;
    	const contents_slot = create_slot(contents_slot_template, ctx, /*$$scope*/ ctx[12], get_contents_slot_context);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (contents_slot) contents_slot.c();
    			attr_dev(div0, "class", "contents-inner svelte-5jisbp");
    			add_location(div0, file$e, 74, 5, 1626);
    			attr_dev(div1, "class", "contents svelte-5jisbp");
    			add_location(div1, file$e, 73, 4, 1598);
    			attr_dev(div2, "class", "contents-wrapper svelte-5jisbp");
    			add_location(div2, file$e, 69, 3, 1523);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (contents_slot) {
    				contents_slot.m(div0, null);
    			}

    			/*div2_binding*/ ctx[10](div2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (contents_slot) {
    				if (contents_slot.p && (!current || dirty & /*$$scope, key, send, receive*/ 1839104)) {
    					update_slot_base(
    						contents_slot,
    						contents_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(contents_slot_template, /*$$scope*/ ctx[12], dirty, get_contents_slot_changes),
    						get_contents_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contents_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contents_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (contents_slot) contents_slot.d(detaching);
    			/*div2_binding*/ ctx[10](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(69:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (60:2) {#if !isOpen}
    function create_if_block$2(ctx) {
    	let div;
    	let div_resize_listener;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], get_default_slot_context$4);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "trigger svelte-5jisbp");
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[9].call(div));
    			add_location(div, file$e, 60, 3, 1333);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[9].bind(div));
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*openPopover*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, key, send, receive*/ 1839104)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, get_default_slot_changes$4),
    						get_default_slot_context$4
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			div_resize_listener();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(60:2) {#if !isOpen}",
    		ctx
    	});

    	return block;
    }

    // (52:0) <Crossfade let:receive let:send let:key>
    function create_default_slot$9(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let div_style_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*isOpen*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "sc-popover svelte-5jisbp");
    			attr_dev(div, "style", div_style_value = "" + (/*style*/ ctx[1] + "; min-width: " + (/*triggerWidth*/ ctx[4] + 1) + "px; min-height: " + (/*triggerHeight*/ ctx[5] + 1) + "px;"));
    			add_location(div, file$e, 52, 1, 1145);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			/*div_binding*/ ctx[11](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(blurr.call(null, div)),
    					listen_dev(div, "blurr", /*close*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}

    			if (!current || dirty & /*style, triggerWidth, triggerHeight*/ 50 && div_style_value !== (div_style_value = "" + (/*style*/ ctx[1] + "; min-width: " + (/*triggerWidth*/ ctx[4] + 1) + "px; min-height: " + (/*triggerHeight*/ ctx[5] + 1) + "px;"))) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			/*div_binding*/ ctx[11](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(52:0) <Crossfade let:receive let:send let:key>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let crossfade;
    	let current;

    	crossfade = new Crossfade({
    			props: {
    				$$slots: {
    					default: [
    						create_default_slot$9,
    						({ receive, send, key }) => ({ 18: receive, 19: send, 20: key }),
    						({ receive, send, key }) => (receive ? 262144 : 0) | (send ? 524288 : 0) | (key ? 1048576 : 0)
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(crossfade.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(crossfade, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const crossfade_changes = {};

    			if (dirty & /*$$scope, style, triggerWidth, triggerHeight, popover, key, send, receive, isOpen, contentsWrapper*/ 1839227) {
    				crossfade_changes.$$scope = { dirty, ctx };
    			}

    			crossfade.$set(crossfade_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(crossfade.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(crossfade.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(crossfade, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Popover', slots, ['default','contents']);
    	let { isOpen = false } = $$props;
    	let { style = '' } = $$props;
    	let translateY = 0;
    	let translateX = 0;
    	let popover;
    	let triggerWidth;
    	let triggerHeight;
    	let contentsWrapper;

    	const close = () => {
    		$$invalidate(0, isOpen = false);
    	};

    	const getDistanceToEdges = () => {
    		let { top, bottom, left, right } = contentsWrapper.getBoundingClientRect();

    		return {
    			top: top + -1 * translateY,
    			bottom: window.innerHeight - bottom + translateY,
    			left: left + -1 * translateX,
    			right: document.body.clientWidth - right + translateX
    		};
    	};

    	const getY = ({ bottom, top }) => {
    		if (top < 0) return -1 * top;
    		if (bottom < 0) return bottom;
    		return 0;
    	};

    	const getX = ({ left, right }) => {
    		if (left < 0) return -1 * left;
    		if (right < 0) return right;
    		return 0;
    	};

    	const openPopover = async () => {
    		$$invalidate(0, isOpen = true);
    		await tick();
    		let dist = getDistanceToEdges();
    		translateX = getX(dist);
    		translateY = getY(dist);
    	};

    	const writable_props = ['isOpen', 'style'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Popover> was created with unknown prop '${key}'`);
    	});

    	function div_elementresize_handler() {
    		triggerWidth = this.offsetWidth;
    		triggerHeight = this.offsetHeight;
    		$$invalidate(4, triggerWidth);
    		$$invalidate(5, triggerHeight);
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			contentsWrapper = $$value;
    			$$invalidate(6, contentsWrapper);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			popover = $$value;
    			$$invalidate(3, popover);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Crossfade,
    		blurr,
    		tick,
    		isOpen,
    		style,
    		translateY,
    		translateX,
    		popover,
    		triggerWidth,
    		triggerHeight,
    		contentsWrapper,
    		close,
    		getDistanceToEdges,
    		getY,
    		getX,
    		openPopover
    	});

    	$$self.$inject_state = $$props => {
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    		if ('translateY' in $$props) translateY = $$props.translateY;
    		if ('translateX' in $$props) translateX = $$props.translateX;
    		if ('popover' in $$props) $$invalidate(3, popover = $$props.popover);
    		if ('triggerWidth' in $$props) $$invalidate(4, triggerWidth = $$props.triggerWidth);
    		if ('triggerHeight' in $$props) $$invalidate(5, triggerHeight = $$props.triggerHeight);
    		if ('contentsWrapper' in $$props) $$invalidate(6, contentsWrapper = $$props.contentsWrapper);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isOpen,
    		style,
    		close,
    		popover,
    		triggerWidth,
    		triggerHeight,
    		contentsWrapper,
    		openPopover,
    		slots,
    		div_elementresize_handler,
    		div2_binding,
    		div_binding,
    		$$scope
    	];
    }

    class Popover extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { isOpen: 0, style: 1, close: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Popover",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get isOpen() {
    		throw new Error("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		return this.$$.ctx[2];
    	}

    	set close(value) {
    		throw new Error("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const light = {
    	calendar: {
    		width: '700px',
    		maxWidth: '100vw',
    		legend: {
    			height: '45px'
    		},
    		shadow: '0px 10px 26px rgba(0, 0, 0, 0.25)',
    		colors: {
    			text: {
    				primary: '#333',
    				highlight: '#fff'
    			},
    			background: {
    				primary: '#fff',
    				highlight: '#eb7400',
    				hover: '#eee'
    			},
    			border: '#eee'
    		},
    		font: {
    			regular: '1.5em',
    			large: '37em'
    		},
    		grid: {
    			disabledOpacity: '.35',
    			outsiderOpacity: '.6'
    		}
    	}
    };

    /* node_modules\svelte-calendar\components\generic\Theme.svelte generated by Svelte v3.44.3 */

    const { Object: Object_1 } = globals;

    const get_default_slot_changes$3 = dirty => ({
    	appliedTheme: dirty & /*appliedTheme*/ 1,
    	style: dirty & /*style*/ 2
    });

    const get_default_slot_context$3 = ctx => ({
    	appliedTheme: /*appliedTheme*/ ctx[0],
    	style: /*style*/ ctx[1]
    });

    function create_fragment$h(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], get_default_slot_context$3);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, appliedTheme, style*/ 35)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, get_default_slot_changes$3),
    						get_default_slot_context$3
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let style;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Theme', slots, ['default']);
    	let { theme = {} } = $$props;
    	let { appliedTheme } = $$props;
    	let { prefix = '--sc-theme' } = $$props;
    	let { defaultTheme = light } = $$props;
    	const store = writable();
    	setContext(themeContextKey, store);
    	const getStyle = obj => Object.entries(obj).map(([k, v]) => `${prefix}-${k}: ${v}`).join(';');

    	const getTheme = (defaults, overrides = {}, base = '') => Object.entries(defaults).reduce(
    		(acc, [k, v]) => {
    			if (typeof v === 'object') return {
    				...acc,
    				...getTheme(v, overrides[k], [base, k].filter(Boolean).join('-'))
    			};

    			return {
    				...acc,
    				[[base, k].filter(Boolean).join('-')]: overrides[k] || v
    			};
    		},
    		{}
    	);

    	const writable_props = ['theme', 'appliedTheme', 'prefix', 'defaultTheme'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Theme> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('theme' in $$props) $$invalidate(2, theme = $$props.theme);
    		if ('appliedTheme' in $$props) $$invalidate(0, appliedTheme = $$props.appliedTheme);
    		if ('prefix' in $$props) $$invalidate(3, prefix = $$props.prefix);
    		if ('defaultTheme' in $$props) $$invalidate(4, defaultTheme = $$props.defaultTheme);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		lightTheme: light,
    		themeContextKey,
    		setContext,
    		writable,
    		theme,
    		appliedTheme,
    		prefix,
    		defaultTheme,
    		store,
    		getStyle,
    		getTheme,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('theme' in $$props) $$invalidate(2, theme = $$props.theme);
    		if ('appliedTheme' in $$props) $$invalidate(0, appliedTheme = $$props.appliedTheme);
    		if ('prefix' in $$props) $$invalidate(3, prefix = $$props.prefix);
    		if ('defaultTheme' in $$props) $$invalidate(4, defaultTheme = $$props.defaultTheme);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*defaultTheme, theme*/ 20) {
    			$$invalidate(0, appliedTheme = getTheme(defaultTheme, theme));
    		}

    		if ($$self.$$.dirty & /*appliedTheme*/ 1) {
    			$$invalidate(1, style = getStyle(appliedTheme));
    		}

    		if ($$self.$$.dirty & /*appliedTheme*/ 1) {
    			store.set(appliedTheme);
    		}
    	};

    	return [appliedTheme, style, theme, prefix, defaultTheme, $$scope, slots];
    }

    class Theme extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			theme: 2,
    			appliedTheme: 0,
    			prefix: 3,
    			defaultTheme: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Theme",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*appliedTheme*/ ctx[0] === undefined && !('appliedTheme' in props)) {
    			console.warn("<Theme> was created without expected prop 'appliedTheme'");
    		}
    	}

    	get theme() {
    		throw new Error("<Theme>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<Theme>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get appliedTheme() {
    		throw new Error("<Theme>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set appliedTheme(value) {
    		throw new Error("<Theme>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error("<Theme>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error("<Theme>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get defaultTheme() {
    		throw new Error("<Theme>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set defaultTheme(value) {
    		throw new Error("<Theme>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const KEY_CODES = {
    	33: 'pageUp',
    	34: 'pageDown',
    	37: 'left',
    	38: 'up',
    	39: 'right',
    	40: 'down',
    	27: 'escape',
    	13: 'enter',
    	17: 'control'
    };

    var justThrottle = throttle;

    function throttle(fn, interval, options) {
      var timeoutId = null;
      var throttledFn = null;
      var leading = (options && options.leading);
      var trailing = (options && options.trailing);

      if (leading == null) {
        leading = true; // default
      }

      if (trailing == null) {
        trailing = !leading; //default
      }

      if (leading == true) {
        trailing = false; // forced because there should be invocation per call
      }

      var cancel = function() {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      };

      var flush = function() {
        var call = throttledFn;
        cancel();

        if (call) {
          call();
        }
      };

      var throttleWrapper = function() {
        var callNow = leading && !timeoutId;
        var context = this;
        var args = arguments;

        throttledFn = function() {
          return fn.apply(context, args);
        };

        if (!timeoutId) {
          timeoutId = setTimeout(function() {
            timeoutId = null;

            if (trailing) {
              return throttledFn();
            }
          }, interval);
        }

        if (callNow) {
          callNow = false;
          return throttledFn();
        }
      };

      throttleWrapper.cancel = cancel;
      throttleWrapper.flush = flush;

      return throttleWrapper;
    }

    /* node_modules\svelte-calendar\components\generic\KeyControls.svelte generated by Svelte v3.44.3 */

    function create_fragment$g(ctx) {
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					window,
    					"keydown",
    					function () {
    						if (is_function(/*eventHandler*/ ctx[0])) /*eventHandler*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let eventHandler;
    	let $currentCtx;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('KeyControls', slots, ['default']);
    	let { limit = 0 } = $$props;
    	let { ctx = null } = $$props;
    	const currentCtx = getContext(keyControlsContextKey);
    	validate_store(currentCtx, 'currentCtx');
    	component_subscribe($$self, currentCtx, value => $$invalidate(6, $currentCtx = value));

    	const key = evt => {
    		if (ctx && !ctx.includes($currentCtx)) return;
    		const mapping = $$props[KEY_CODES[evt.keyCode]];
    		if (mapping) mapping();
    	};

    	$$self.$$set = $$new_props => {
    		$$invalidate(8, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('limit' in $$new_props) $$invalidate(2, limit = $$new_props.limit);
    		if ('ctx' in $$new_props) $$invalidate(3, ctx = $$new_props.ctx);
    		if ('$$scope' in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		KEY_CODES,
    		keyControlsContextKey,
    		throttle: justThrottle,
    		getContext,
    		limit,
    		ctx,
    		currentCtx,
    		key,
    		eventHandler,
    		$currentCtx
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(8, $$props = assign(assign({}, $$props), $$new_props));
    		if ('limit' in $$props) $$invalidate(2, limit = $$new_props.limit);
    		if ('ctx' in $$props) $$invalidate(3, ctx = $$new_props.ctx);
    		if ('eventHandler' in $$props) $$invalidate(0, eventHandler = $$new_props.eventHandler);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*limit*/ 4) {
    			$$invalidate(0, eventHandler = limit ? justThrottle(key, limit) : key);
    		}
    	};

    	$$props = exclude_internal_props($$props);
    	return [eventHandler, currentCtx, limit, ctx, $$scope, slots];
    }

    class KeyControls extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { limit: 2, ctx: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "KeyControls",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get limit() {
    		throw new Error("<KeyControls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set limit(value) {
    		throw new Error("<KeyControls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ctx() {
    		throw new Error("<KeyControls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ctx(value) {
    		throw new Error("<KeyControls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-calendar\components\generic\Grid.svelte generated by Svelte v3.44.3 */

    const file$d = "node_modules\\svelte-calendar\\components\\generic\\Grid.svelte";

    function create_fragment$f(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "grid svelte-yborwk");
    			set_style(div, "grid-template", /*template*/ ctx[0]);
    			add_location(div, file$d, 4, 0, 78);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*template*/ 1) {
    				set_style(div, "grid-template", /*template*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grid', slots, ['default']);
    	let { template = 'repeat(4, 1fr) / repeat(3, 1fr)' } = $$props;
    	const writable_props = ['template'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Grid> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('template' in $$props) $$invalidate(0, template = $$props.template);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ template });

    	$$self.$inject_state = $$props => {
    		if ('template' in $$props) $$invalidate(0, template = $$props.template);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [template, $$scope, slots];
    }

    class Grid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { template: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grid",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get template() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set template(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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

    /* node_modules\svelte-calendar\components\generic\InfiniteGrid.svelte generated by Svelte v3.44.3 */
    const file$c = "node_modules\\svelte-calendar\\components\\generic\\InfiniteGrid.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	return child_ctx;
    }

    const get_default_slot_spread_changes = dirty => dirty & /*$visibleData*/ 16;
    const get_default_slot_changes$2 = dirty => ({ index: dirty & /*$visibleData*/ 16 });

    const get_default_slot_context$2 = ctx => ({
    	.../*obj*/ ctx[28].data,
    	index: /*obj*/ ctx[28].index
    });

    // (74:1) {#each $visibleData as obj (obj.data?.[idKey] || obj.index)}
    function create_each_block$4(key_1, ctx) {
    	let div;
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[21].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[20], get_default_slot_context$2);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			set_style(div, "transform", "translateY(" + /*obj*/ ctx[28].pos + "px)");
    			attr_dev(div, "class", "svelte-198r3wi");
    			add_location(div, file$c, 74, 2, 2276);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $visibleData*/ 1048592)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[20],
    						get_default_slot_spread_changes(dirty) || !current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[20])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[20], dirty, get_default_slot_changes$2),
    						get_default_slot_context$2
    					);
    				}
    			}

    			if (!current || dirty & /*$visibleData*/ 16) {
    				set_style(div, "transform", "translateY(" + /*obj*/ ctx[28].pos + "px)");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(74:1) {#each $visibleData as obj (obj.data?.[idKey] || obj.index)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let div_resize_listener;
    	let current;
    	let each_value = /*$visibleData*/ ctx[4];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*obj*/ ctx[28].data?.[/*idKey*/ ctx[0]] || /*obj*/ ctx[28].index;
    	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "grid svelte-198r3wi");
    			attr_dev(div, "style", /*gridStyle*/ ctx[3]);
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[22].call(div));
    			add_location(div, file$c, 72, 0, 2122);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[22].bind(div));
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$visibleData, $$scope, idKey*/ 1048593) {
    				each_value = /*$visibleData*/ ctx[4];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$4, null, get_each_context$4);
    				check_outros();
    			}

    			if (!current || dirty & /*gridStyle*/ 8) {
    				attr_dev(div, "style", /*gridStyle*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			div_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let type;
    	let gridStyle;
    	let $initialized;
    	let $dim;
    	let $offset;

    	let $visibleData,
    		$$unsubscribe_visibleData = noop,
    		$$subscribe_visibleData = () => ($$unsubscribe_visibleData(), $$unsubscribe_visibleData = subscribe(visibleData, $$value => $$invalidate(4, $visibleData = $$value)), visibleData);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_visibleData());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InfiniteGrid', slots, ['default']);
    	let { cellCount = 4 } = $$props;
    	let { itemCount = 0 } = $$props;
    	let { index = 0 } = $$props;
    	let { vertical = true } = $$props;
    	let { get } = $$props;
    	let { stiffness = 0.065 } = $$props;
    	let { damping = 0.9 } = $$props;
    	let { useCache = true } = $$props;
    	let { idKey = undefined } = $$props;

    	const move = amount => {
    		$$invalidate(8, index = Math.max(0, Math.min(itemCount - 1, index + amount)));
    	};

    	const forceUpdate = writable(false);

    	const triggerUpdate = async () => {
    		await tick();
    		forceUpdate.set(true);
    		await tick();
    		forceUpdate.set(false);
    	};

    	const getCached = index => $visibleData.find(({ index: i }) => i === index)?.data || get(index);
    	let inRange = [-Infinity, Infinity];
    	const initialized = writable(false);
    	validate_store(initialized, 'initialized');
    	component_subscribe($$self, initialized, value => $$invalidate(19, $initialized = value));
    	const dim = writable({ w: 0, h: 0 });
    	validate_store(dim, 'dim');
    	component_subscribe($$self, dim, value => $$invalidate(2, $dim = value));
    	const offset = spring(0, { stiffness, damping });
    	validate_store(offset, 'offset');
    	component_subscribe($$self, offset, value => $$invalidate(24, $offset = value));

    	const visibleData = derived(
    		[dim, offset, initialized, forceUpdate],
    		([{ w, h }, $o, $initialized, $force]) => {
    			if (!w || !h || !$initialized) return [];
    			if ($o < inRange[0] || $o > inRange[1]) return $visibleData;
    			const cellHeight = h / cellCount;
    			const start = Math.max(-1, Math.floor(-1 * $o / cellHeight) - 1);
    			const baseOffset = $o % cellHeight;

    			return Array(cellCount + 2).fill(0).map((_, i) => {
    				const index = i + start;
    				const pos = baseOffset + (i - 1) * cellHeight;
    				if (index < 0 || index >= itemCount) return undefined;
    				const data = $force || !useCache ? get(index) : getCached(index);
    				return { data, pos, index };
    			}).filter(Boolean);
    		},
    		[]
    	);

    	validate_store(visibleData, 'visibleData');
    	$$subscribe_visibleData();

    	const updateOffset = o => {
    		inRange = [o, $offset].sort((a, b) => a - b);
    		offset.set(o, { hard: !$initialized });
    	};

    	const writable_props = [
    		'cellCount',
    		'itemCount',
    		'index',
    		'vertical',
    		'get',
    		'stiffness',
    		'damping',
    		'useCache',
    		'idKey'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InfiniteGrid> was created with unknown prop '${key}'`);
    	});

    	function div_elementresize_handler() {
    		$dim.h = this.clientHeight;
    		dim.set($dim);
    		$dim.w = this.clientWidth;
    		dim.set($dim);
    	}

    	$$self.$$set = $$props => {
    		if ('cellCount' in $$props) $$invalidate(9, cellCount = $$props.cellCount);
    		if ('itemCount' in $$props) $$invalidate(10, itemCount = $$props.itemCount);
    		if ('index' in $$props) $$invalidate(8, index = $$props.index);
    		if ('vertical' in $$props) $$invalidate(11, vertical = $$props.vertical);
    		if ('get' in $$props) $$invalidate(12, get = $$props.get);
    		if ('stiffness' in $$props) $$invalidate(13, stiffness = $$props.stiffness);
    		if ('damping' in $$props) $$invalidate(14, damping = $$props.damping);
    		if ('useCache' in $$props) $$invalidate(15, useCache = $$props.useCache);
    		if ('idKey' in $$props) $$invalidate(0, idKey = $$props.idKey);
    		if ('$$scope' in $$props) $$invalidate(20, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		tick,
    		spring,
    		derived,
    		writable,
    		cellCount,
    		itemCount,
    		index,
    		vertical,
    		get,
    		stiffness,
    		damping,
    		useCache,
    		idKey,
    		move,
    		forceUpdate,
    		triggerUpdate,
    		getCached,
    		inRange,
    		initialized,
    		dim,
    		offset,
    		visibleData,
    		updateOffset,
    		type,
    		gridStyle,
    		$initialized,
    		$dim,
    		$offset,
    		$visibleData
    	});

    	$$self.$inject_state = $$props => {
    		if ('cellCount' in $$props) $$invalidate(9, cellCount = $$props.cellCount);
    		if ('itemCount' in $$props) $$invalidate(10, itemCount = $$props.itemCount);
    		if ('index' in $$props) $$invalidate(8, index = $$props.index);
    		if ('vertical' in $$props) $$invalidate(11, vertical = $$props.vertical);
    		if ('get' in $$props) $$invalidate(12, get = $$props.get);
    		if ('stiffness' in $$props) $$invalidate(13, stiffness = $$props.stiffness);
    		if ('damping' in $$props) $$invalidate(14, damping = $$props.damping);
    		if ('useCache' in $$props) $$invalidate(15, useCache = $$props.useCache);
    		if ('idKey' in $$props) $$invalidate(0, idKey = $$props.idKey);
    		if ('inRange' in $$props) inRange = $$props.inRange;
    		if ('type' in $$props) $$invalidate(18, type = $$props.type);
    		if ('gridStyle' in $$props) $$invalidate(3, gridStyle = $$props.gridStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*vertical*/ 2048) {
    			$$invalidate(18, type = vertical ? 'rows' : 'columns');
    		}

    		if ($$self.$$.dirty & /*type, cellCount*/ 262656) {
    			$$invalidate(3, gridStyle = `grid-template-${type}: repeat(${cellCount}, 1fr);`);
    		}

    		if ($$self.$$.dirty & /*$dim, cellCount, index, $initialized*/ 525060) {
    			{
    				if ($dim.w && $dim.h) {
    					updateOffset($dim.h / cellCount * index * -1);
    					if (!$initialized) initialized.set(true);
    				}
    			}
    		}
    	};

    	return [
    		idKey,
    		visibleData,
    		$dim,
    		gridStyle,
    		$visibleData,
    		initialized,
    		dim,
    		offset,
    		index,
    		cellCount,
    		itemCount,
    		vertical,
    		get,
    		stiffness,
    		damping,
    		useCache,
    		move,
    		triggerUpdate,
    		type,
    		$initialized,
    		$$scope,
    		slots,
    		div_elementresize_handler
    	];
    }

    class InfiniteGrid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			cellCount: 9,
    			itemCount: 10,
    			index: 8,
    			vertical: 11,
    			get: 12,
    			stiffness: 13,
    			damping: 14,
    			useCache: 15,
    			idKey: 0,
    			move: 16,
    			triggerUpdate: 17,
    			visibleData: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InfiniteGrid",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*get*/ ctx[12] === undefined && !('get' in props)) {
    			console.warn("<InfiniteGrid> was created without expected prop 'get'");
    		}
    	}

    	get cellCount() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cellCount(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemCount() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemCount(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vertical() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vertical(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get get() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set get(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stiffness() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stiffness(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get damping() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set damping(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get useCache() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set useCache(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get idKey() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set idKey(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get move() {
    		return this.$$.ctx[16];
    	}

    	set move(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get triggerUpdate() {
    		return this.$$.ctx[17];
    	}

    	set triggerUpdate(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visibleData() {
    		return this.$$.ctx[1];
    	}

    	set visibleData(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const scrollStep = 120;

    var scrollable = (node, opts) => {
    	let { y: yi = 0, step = scrollStep } = opts;
    	let lastTouch = 0;
    	let y = yi;

    	const updateY = (val) => {
    		const { maxSteps = Infinity } = opts;
    		y = Math.max(0, Math.min(maxSteps * step, val));
    	};

    	const emitY = () => {
    		if (Math.round(y / step) === Math.round(yi / step)) return;
    		yi = y;
    		node.dispatchEvent(
    			new CustomEvent('y', {
    				detail: {
    					y,
    					step: Math.round(y / step)
    				}
    			})
    		);
    	};

    	const wheelListener = ({ deltaY }) => {
    		updateY(y + deltaY);
    		emitY();
    	};
    	const touchstartListener = ({ touches: [{ pageY }] }) => {
    		lastTouch = pageY;
    		emitY();
    	};
    	const touchmoveListener = ({ touches: [{ pageY }] }) => {
    		updateY(y - (pageY - lastTouch));
    		lastTouch = pageY;
    		emitY();
    	};

    	node.addEventListener('wheel', wheelListener);
    	node.addEventListener('touchstart', touchstartListener);
    	node.addEventListener('touchmove', touchmoveListener);
    	node.style.touchAction = 'none';

    	return {
    		destroy() {
    			node.removeEventListener('wheel', wheelListener);
    			node.removeEventListener('touchstart', touchstartListener);
    			node.removeEventListener('touchmove', touchmoveListener);
    		}
    	};
    };

    /* node_modules\svelte-calendar\components\calendar\DayPicker.svelte generated by Svelte v3.44.3 */
    const file$b = "node_modules\\svelte-calendar\\components\\calendar\\DayPicker.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	child_ctx[21] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    // (72:2) {#each legend as label}
    function create_each_block_1$1(ctx) {
    	let span;
    	let t_value = /*label*/ ctx[22] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$b, 72, 3, 2148);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(72:2) {#each legend as label}",
    		ctx
    	});

    	return block;
    }

    // (88:6) {#if !$store.enlargeDay || index !== monthIndex || !dayjs(day.date).isSame($store.selected)}
    function create_if_block_1$1(ctx) {
    	let a;
    	let t0_value = /*day*/ ctx[19].date.getDate() + "";
    	let t0;
    	let t1;
    	let a_intro;
    	let a_outro;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", "#pickday");
    			attr_dev(a, "class", "svelte-rnjxf7");
    			toggle_class(a, "disabled", !/*store*/ ctx[4].isSelectable(/*day*/ ctx[19].date));
    			toggle_class(a, "selected", /*index*/ ctx[18] === /*monthIndex*/ ctx[0] && dayjs_min(/*day*/ ctx[19].date).isSame(/*$store*/ ctx[1].selected, 'day'));
    			toggle_class(a, "outsider", /*day*/ ctx[19].outsider);
    			add_location(a, file$b, 88, 7, 2659);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			append_dev(a, t1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "keydown", prevent_default(/*keydown_handler*/ ctx[10]), false, true, false),
    					listen_dev(
    						a,
    						"click",
    						prevent_default(function () {
    							if (is_function(/*select*/ ctx[6](/*day*/ ctx[19].date))) /*select*/ ctx[6](/*day*/ ctx[19].date).apply(this, arguments);
    						}),
    						false,
    						true,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*days*/ 131072) && t0_value !== (t0_value = /*day*/ ctx[19].date.getDate() + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*store, days*/ 131088) {
    				toggle_class(a, "disabled", !/*store*/ ctx[4].isSelectable(/*day*/ ctx[19].date));
    			}

    			if (dirty & /*index, monthIndex, dayjs, days, $store*/ 393219) {
    				toggle_class(a, "selected", /*index*/ ctx[18] === /*monthIndex*/ ctx[0] && dayjs_min(/*day*/ ctx[19].date).isSame(/*$store*/ ctx[1].selected, 'day'));
    			}

    			if (dirty & /*days*/ 131072) {
    				toggle_class(a, "outsider", /*day*/ ctx[19].outsider);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (a_outro) a_outro.end(1);
    					a_intro = create_in_transition(a, /*receive*/ ctx[15], { key: /*key*/ ctx[14] });
    					a_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (a_intro) a_intro.invalidate();

    			if (local) {
    				a_outro = create_out_transition(a, /*send*/ ctx[16], { key: /*key*/ ctx[14] });
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (detaching && a_outro) a_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(88:6) {#if !$store.enlargeDay || index !== monthIndex || !dayjs(day.date).isSame($store.selected)}",
    		ctx
    	});

    	return block;
    }

    // (87:5) {#each days as day, i (day)}
    function create_each_block$3(key_1, ctx) {
    	let first;
    	let show_if = !/*$store*/ ctx[1].enlargeDay || /*index*/ ctx[18] !== /*monthIndex*/ ctx[0] || !dayjs_min(/*day*/ ctx[19].date).isSame(/*$store*/ ctx[1].selected);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_1$1(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$store, index, monthIndex, days*/ 393219) show_if = !/*$store*/ ctx[1].enlargeDay || /*index*/ ctx[18] !== /*monthIndex*/ ctx[0] || !dayjs_min(/*day*/ ctx[19].date).isSame(/*$store*/ ctx[1].selected);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$store, index, monthIndex, days*/ 393219) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(87:5) {#each days as day, i (day)}",
    		ctx
    	});

    	return block;
    }

    // (86:4) <Grid template="repeat(6, 1fr) / repeat(7, 1fr)">
    function create_default_slot_2$2(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value = /*days*/ ctx[17];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*day*/ ctx[19];
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*key, store, days, index, monthIndex, dayjs, $store, select*/ 409683) {
    				each_value = /*days*/ ctx[17];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block$3, each_1_anchor, get_each_context$3);
    			}
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(86:4) <Grid template=\\\"repeat(6, 1fr) / repeat(7, 1fr)\\\">",
    		ctx
    	});

    	return block;
    }

    // (78:3) <InfiniteGrid     cellCount={1}     itemCount={totalMonths}     bind:index={monthIndex}     {get}     let:days     let:index    >
    function create_default_slot_1$5(ctx) {
    	let grid;
    	let current;

    	grid = new Grid({
    			props: {
    				template: "repeat(6, 1fr) / repeat(7, 1fr)",
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(grid.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const grid_changes = {};

    			if (dirty & /*$$scope, days, key, index, monthIndex, $store*/ 33964035) {
    				grid_changes.$$scope = { dirty, ctx };
    			}

    			grid.$set(grid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(grid, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(78:3) <InfiniteGrid     cellCount={1}     itemCount={totalMonths}     bind:index={monthIndex}     {get}     let:days     let:index    >",
    		ctx
    	});

    	return block;
    }

    // (107:2) {#if $store.enlargeDay}
    function create_if_block$1(ctx) {
    	let div;
    	let t_value = dayjs_min(/*$store*/ ctx[1].selected).date() + "";
    	let t;
    	let div_intro;
    	let div_outro;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "stage selected-big svelte-rnjxf7");
    			add_location(div, file$b, 107, 3, 3181);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*$store*/ 2) && t_value !== (t_value = dayjs_min(/*$store*/ ctx[1].selected).date() + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (div_outro) div_outro.end(1);
    					div_intro = create_in_transition(div, /*receive*/ ctx[15], { key: /*key*/ ctx[14] });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();

    			if (local) {
    				div_outro = create_out_transition(div, /*send*/ ctx[16], { key: /*key*/ ctx[14] });
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(107:2) {#if $store.enlargeDay}",
    		ctx
    	});

    	return block;
    }

    // (76:1) <Crossfade {duration} let:key let:receive let:send>
    function create_default_slot$8(ctx) {
    	let div;
    	let infinitegrid;
    	let updating_index;
    	let scrollable_action;
    	let t;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;

    	function infinitegrid_index_binding(value) {
    		/*infinitegrid_index_binding*/ ctx[11](value);
    	}

    	let infinitegrid_props = {
    		cellCount: 1,
    		itemCount: /*totalMonths*/ ctx[3],
    		get: /*get*/ ctx[8],
    		$$slots: {
    			default: [
    				create_default_slot_1$5,
    				({ days, index }) => ({ 17: days, 18: index }),
    				({ days, index }) => (days ? 131072 : 0) | (index ? 262144 : 0)
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*monthIndex*/ ctx[0] !== void 0) {
    		infinitegrid_props.index = /*monthIndex*/ ctx[0];
    	}

    	infinitegrid = new InfiniteGrid({
    			props: infinitegrid_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(infinitegrid, 'index', infinitegrid_index_binding));
    	let if_block = /*$store*/ ctx[1].enlargeDay && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(infinitegrid.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", "stage svelte-rnjxf7");
    			add_location(div, file$b, 76, 2, 2242);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(infinitegrid, div, null);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(scrollable_action = scrollable.call(null, div, { y: /*initialY*/ ctx[2], step: scrollStep })),
    					listen_dev(div, "y", /*updateIndex*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const infinitegrid_changes = {};
    			if (dirty & /*totalMonths*/ 8) infinitegrid_changes.itemCount = /*totalMonths*/ ctx[3];

    			if (dirty & /*$$scope, days, key, index, monthIndex, $store*/ 33964035) {
    				infinitegrid_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_index && dirty & /*monthIndex*/ 1) {
    				updating_index = true;
    				infinitegrid_changes.index = /*monthIndex*/ ctx[0];
    				add_flush_callback(() => updating_index = false);
    			}

    			infinitegrid.$set(infinitegrid_changes);
    			if (scrollable_action && is_function(scrollable_action.update) && dirty & /*initialY*/ 4) scrollable_action.update.call(null, { y: /*initialY*/ ctx[2], step: scrollStep });

    			if (/*$store*/ ctx[1].enlargeDay) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$store*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(infinitegrid.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(infinitegrid.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(infinitegrid);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(76:1) <Crossfade {duration} let:key let:receive let:send>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let keycontrols;
    	let t0;
    	let div1;
    	let div0;
    	let t1;
    	let crossfade;
    	let current;
    	const keycontrols_spread_levels = [/*KEY_MAPPINGS*/ ctx[7], { ctx: ['days'] }];
    	let keycontrols_props = {};

    	for (let i = 0; i < keycontrols_spread_levels.length; i += 1) {
    		keycontrols_props = assign(keycontrols_props, keycontrols_spread_levels[i]);
    	}

    	keycontrols = new KeyControls({ props: keycontrols_props, $$inline: true });
    	let each_value_1 = /*legend*/ ctx[5];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	crossfade = new Crossfade({
    			props: {
    				duration,
    				$$slots: {
    					default: [
    						create_default_slot$8,
    						({ key, receive, send }) => ({ 14: key, 15: receive, 16: send }),
    						({ key, receive, send }) => (key ? 16384 : 0) | (receive ? 32768 : 0) | (send ? 65536 : 0)
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(keycontrols.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(crossfade.$$.fragment);
    			attr_dev(div0, "class", "legend svelte-rnjxf7");
    			add_location(div0, file$b, 70, 1, 2098);
    			attr_dev(div1, "class", "container svelte-rnjxf7");
    			add_location(div1, file$b, 69, 0, 2073);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(keycontrols, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t1);
    			mount_component(crossfade, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const keycontrols_changes = (dirty & /*KEY_MAPPINGS*/ 128)
    			? get_spread_update(keycontrols_spread_levels, [get_spread_object(/*KEY_MAPPINGS*/ ctx[7]), keycontrols_spread_levels[1]])
    			: {};

    			keycontrols.$set(keycontrols_changes);

    			if (dirty & /*legend*/ 32) {
    				each_value_1 = /*legend*/ ctx[5];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			const crossfade_changes = {};

    			if (dirty & /*$$scope, key, $store, initialY, totalMonths, monthIndex*/ 33570831) {
    				crossfade_changes.$$scope = { dirty, ctx };
    			}

    			crossfade.$set(crossfade_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(keycontrols.$$.fragment, local);
    			transition_in(crossfade.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(keycontrols.$$.fragment, local);
    			transition_out(crossfade.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(keycontrols, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			destroy_component(crossfade);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const duration = 450;

    function instance$d($$self, $$props, $$invalidate) {
    	let totalMonths;
    	let monthIndex;
    	let initialY;
    	let $store;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DayPicker', slots, []);
    	const store = getContext(storeContextKey);
    	validate_store(store, 'store');
    	component_subscribe($$self, store, value => $$invalidate(1, $store = value));
    	const legend = Array(7).fill(0).map((d, i) => dayjs_min().day(($store.startOfWeekIndex + i) % 7).format('ddd'));
    	const add = amount => () => store.add(amount, 'day');

    	const select = day => () => {
    		if (!store.isSelectable(day)) return;
    		store.setDay(day || $store.selected);
    		if (!$store.shouldEnlargeDay) return store.selectDay();
    		store.enlargeDay();

    		setTimeout(
    			() => {
    				store.selectDay();
    				store.enlargeDay(false);
    			},
    			duration + 60
    		);
    	};

    	const KEY_MAPPINGS = {
    		left: add(-1),
    		right: add(1),
    		up: add(-7),
    		down: add(7),
    		enter: select(),
    		escape: () => store.close()
    	};

    	const calPagesBetweenDates = (a, b) => {
    		const yearDelta = b.getFullYear() - a.getFullYear();

    		const firstPartialYear = yearDelta
    		? 12 - a.getMonth()
    		: b.getMonth() - a.getMonth() + 1;

    		const fullYears = yearDelta > 1 ? (yearDelta - 1) * 12 : 0;
    		const lastPartialYear = yearDelta ? b.getMonth() + 1 : 0;
    		return firstPartialYear + fullYears + lastPartialYear;
    	};

    	const get = index => {
    		const d = dayjs_min($store.start).add(index, 'month');

    		return {
    			days: store.getCalendarPage(d.month(), d.year())
    		};
    	};

    	const updateIndex = ({ detail: { step: newIndex } }) => {
    		store.add(newIndex - monthIndex, 'month', ['date']);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DayPicker> was created with unknown prop '${key}'`);
    	});

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function infinitegrid_index_binding(value) {
    		monthIndex = value;
    		($$invalidate(0, monthIndex), $$invalidate(1, $store));
    	}

    	$$self.$capture_state = () => ({
    		getContext,
    		storeContextKey,
    		KeyControls,
    		Grid,
    		InfiniteGrid,
    		dayjs: dayjs_min,
    		Crossfade,
    		scrollable,
    		scrollStep,
    		store,
    		duration,
    		legend,
    		add,
    		select,
    		KEY_MAPPINGS,
    		calPagesBetweenDates,
    		get,
    		updateIndex,
    		monthIndex,
    		initialY,
    		totalMonths,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('monthIndex' in $$props) $$invalidate(0, monthIndex = $$props.monthIndex);
    		if ('initialY' in $$props) $$invalidate(2, initialY = $$props.initialY);
    		if ('totalMonths' in $$props) $$invalidate(3, totalMonths = $$props.totalMonths);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$store*/ 2) {
    			$$invalidate(3, totalMonths = calPagesBetweenDates($store.start, $store.end));
    		}

    		if ($$self.$$.dirty & /*$store*/ 2) {
    			$$invalidate(0, monthIndex = calPagesBetweenDates($store.start, $store.selected) - 1);
    		}

    		if ($$self.$$.dirty & /*monthIndex*/ 1) {
    			$$invalidate(2, initialY = monthIndex * scrollStep);
    		}
    	};

    	return [
    		monthIndex,
    		$store,
    		initialY,
    		totalMonths,
    		store,
    		legend,
    		select,
    		KEY_MAPPINGS,
    		get,
    		updateIndex,
    		keydown_handler,
    		infinitegrid_index_binding
    	];
    }

    class DayPicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DayPicker",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* node_modules\svelte-calendar\components\generic\ViewTransitionEffect.svelte generated by Svelte v3.44.3 */
    const file$a = "node_modules\\svelte-calendar\\components\\generic\\ViewTransitionEffect.svelte";

    function create_fragment$c(ctx) {
    	let div;
    	let div_intro;
    	let div_outro;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			add_location(div, file$a, 8, 0, 197);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			if (local) {
    				add_render_callback(() => {
    					if (div_outro) div_outro.end(1);

    					div_intro = create_in_transition(div, scale, {
    						start: /*$store*/ ctx[0].activeViewDirection * 0.5 + 1,
    						delay: 110
    					});

    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div_intro) div_intro.invalidate();

    			if (local) {
    				div_outro = create_out_transition(div, scale, {
    					start: /*$store*/ ctx[0].activeViewDirection * -0.5 + 1
    				});
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $store;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ViewTransitionEffect', slots, ['default']);
    	const store = getContext(storeContextKey);
    	validate_store(store, 'store');
    	component_subscribe($$self, store, value => $$invalidate(0, $store = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ViewTransitionEffect> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		scale,
    		storeContextKey,
    		getContext,
    		store,
    		$store
    	});

    	return [$store, store, $$scope, slots];
    }

    class ViewTransitionEffect extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ViewTransitionEffect",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* node_modules\svelte-calendar\components\generic\Arrow.svelte generated by Svelte v3.44.3 */

    const file$9 = "node_modules\\svelte-calendar\\components\\generic\\Arrow.svelte";

    function create_fragment$b(ctx) {
    	let i;
    	let i_class_value;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", i_class_value = "" + (null_to_empty(/*dir*/ ctx[0]) + " svelte-1eiemu5"));
    			add_location(i, file$9, 4, 0, 46);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dir*/ 1 && i_class_value !== (i_class_value = "" + (null_to_empty(/*dir*/ ctx[0]) + " svelte-1eiemu5"))) {
    				attr_dev(i, "class", i_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Arrow', slots, []);
    	let { dir = 'left' } = $$props;
    	const writable_props = ['dir'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Arrow> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('dir' in $$props) $$invalidate(0, dir = $$props.dir);
    	};

    	$$self.$capture_state = () => ({ dir });

    	$$self.$inject_state = $$props => {
    		if ('dir' in $$props) $$invalidate(0, dir = $$props.dir);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [dir];
    }

    class Arrow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { dir: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Arrow",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get dir() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dir(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-calendar\components\calendar\CalendarControls.svelte generated by Svelte v3.44.3 */
    const file$8 = "node_modules\\svelte-calendar\\components\\calendar\\CalendarControls.svelte";

    function create_fragment$a(ctx) {
    	let keycontrols;
    	let t0;
    	let div2;
    	let div0;
    	let arrow0;
    	let t1;
    	let span;
    	let t2;
    	let t3;
    	let div1;
    	let arrow1;
    	let current;
    	let mounted;
    	let dispose;
    	const keycontrols_spread_levels = [{ ctx: ['days', 'months', 'years'] }, { limit: 180 }, /*KEY_MAPPINGS*/ ctx[4]];
    	let keycontrols_props = {};

    	for (let i = 0; i < keycontrols_spread_levels.length; i += 1) {
    		keycontrols_props = assign(keycontrols_props, keycontrols_spread_levels[i]);
    	}

    	keycontrols = new KeyControls({ props: keycontrols_props, $$inline: true });
    	arrow0 = new Arrow({ props: { dir: "left" }, $$inline: true });
    	arrow1 = new Arrow({ props: { dir: "right" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(keycontrols.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			create_component(arrow0.$$.fragment);
    			t1 = space();
    			span = element("span");
    			t2 = text(/*label*/ ctx[0]);
    			t3 = space();
    			div1 = element("div");
    			create_component(arrow1.$$.fragment);
    			attr_dev(div0, "class", "button svelte-1p8wpqo");
    			add_location(div0, file$8, 37, 1, 1197);
    			attr_dev(span, "class", "button label svelte-1p8wpqo");
    			add_location(span, file$8, 40, 1, 1269);
    			attr_dev(div1, "class", "button svelte-1p8wpqo");
    			add_location(div1, file$8, 43, 1, 1345);
    			attr_dev(div2, "class", "controls svelte-1p8wpqo");
    			add_location(div2, file$8, 36, 0, 1173);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(keycontrols, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(arrow0, div0, null);
    			append_dev(div2, t1);
    			append_dev(div2, span);
    			append_dev(span, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			mount_component(arrow1, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*add*/ ctx[2](-1), false, false, false),
    					listen_dev(span, "click", /*updateActiveView*/ ctx[3], false, false, false),
    					listen_dev(div1, "click", /*add*/ ctx[2](1), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const keycontrols_changes = (dirty & /*KEY_MAPPINGS*/ 16)
    			? get_spread_update(keycontrols_spread_levels, [
    					keycontrols_spread_levels[0],
    					keycontrols_spread_levels[1],
    					get_spread_object(/*KEY_MAPPINGS*/ ctx[4])
    				])
    			: {};

    			keycontrols.$set(keycontrols_changes);
    			if (!current || dirty & /*label*/ 1) set_data_dev(t2, /*label*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(keycontrols.$$.fragment, local);
    			transition_in(arrow0.$$.fragment, local);
    			transition_in(arrow1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(keycontrols.$$.fragment, local);
    			transition_out(arrow0.$$.fragment, local);
    			transition_out(arrow1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(keycontrols, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_component(arrow0);
    			destroy_component(arrow1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let visibleMonth;
    	let label;
    	let addMult;
    	let $store;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CalendarControls', slots, []);
    	const store = getContext(storeContextKey);
    	validate_store(store, 'store');
    	component_subscribe($$self, store, value => $$invalidate(6, $store = value));

    	const UNIT_BY_VIEW = {
    		days: 'month',
    		months: 'year',
    		years: 'year'
    	};

    	const add = amount => () => store.add(amount * addMult, UNIT_BY_VIEW[$store.activeView]);
    	const VIEW_TRANSITIONS = ['days', 'months', 'years'];

    	const updateActiveView = () => {
    		const transitionIndex = VIEW_TRANSITIONS.indexOf($store.activeView) + 1;

    		const newView = transitionIndex
    		? VIEW_TRANSITIONS[transitionIndex]
    		: null;

    		if (newView) store.setActiveView(newView);
    	};

    	const KEY_MAPPINGS = {
    		pageDown: add(-1),
    		pageUp: add(1),
    		control: updateActiveView
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CalendarControls> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Arrow,
    		getContext,
    		storeContextKey,
    		dayjs: dayjs_min,
    		KeyControls,
    		store,
    		UNIT_BY_VIEW,
    		add,
    		VIEW_TRANSITIONS,
    		updateActiveView,
    		KEY_MAPPINGS,
    		addMult,
    		visibleMonth,
    		label,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('addMult' in $$props) addMult = $$props.addMult;
    		if ('visibleMonth' in $$props) $$invalidate(5, visibleMonth = $$props.visibleMonth);
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$store*/ 64) {
    			$$invalidate(5, visibleMonth = dayjs_min(new Date($store.year, $store.month, 1)));
    		}

    		if ($$self.$$.dirty & /*$store, visibleMonth*/ 96) {
    			$$invalidate(0, label = `${$store.activeView === 'days'
			? visibleMonth.format('MMMM ')
			: ''}${$store.year}`);
    		}

    		if ($$self.$$.dirty & /*$store*/ 64) {
    			addMult = $store.activeView === 'years' ? 10 : 1;
    		}
    	};

    	return [label, store, add, updateActiveView, KEY_MAPPINGS, visibleMonth, $store];
    }

    class CalendarControls extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CalendarControls",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* node_modules\svelte-calendar\components\generic\crossfade\CrossfadeProvider.svelte generated by Svelte v3.44.3 */

    const get_default_slot_changes$1 = dirty => ({
    	key: dirty & /*$store*/ 1,
    	send: dirty & /*$store*/ 1,
    	receive: dirty & /*$store*/ 1
    });

    const get_default_slot_context$1 = ctx => ({
    	key: /*$store*/ ctx[0].key,
    	send: /*$store*/ ctx[0].send,
    	receive: /*$store*/ ctx[0].receive
    });

    function create_fragment$9(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $store*/ 5)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $store;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CrossfadeProvider', slots, ['default']);
    	const noop = () => false;
    	const store = getContext('crossfade') || writable({ send: noop, receive: noop });
    	validate_store(store, 'store');
    	component_subscribe($$self, store, value => $$invalidate(0, $store = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CrossfadeProvider> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		writable,
    		noop,
    		store,
    		$store
    	});

    	return [$store, store, $$scope, slots];
    }

    class CrossfadeProvider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CrossfadeProvider",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* node_modules\svelte-calendar\components\calendar\MonthPicker.svelte generated by Svelte v3.44.3 */
    const file$7 = "node_modules\\svelte-calendar\\components\\calendar\\MonthPicker.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	child_ctx[17] = i;
    	return child_ctx;
    }

    // (63:3) {#each months as month, i}
    function create_each_block$2(ctx) {
    	let a;
    	let t0_value = /*month*/ ctx[15].label + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", "#selectMonth");
    			toggle_class(a, "disabled", /*month*/ ctx[15].disabled);
    			toggle_class(a, "selected", /*$store*/ ctx[1].month === /*i*/ ctx[17] && /*$store*/ ctx[1].year === /*month*/ ctx[15].year);
    			add_location(a, file$7, 63, 4, 1837);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			append_dev(a, t1);

    			if (!mounted) {
    				dispose = listen_dev(
    					a,
    					"click",
    					prevent_default(function () {
    						if (is_function(/*select*/ ctx[7](/*month*/ ctx[15]))) /*select*/ ctx[7](/*month*/ ctx[15]).apply(this, arguments);
    					}),
    					false,
    					true,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*months*/ 16384 && t0_value !== (t0_value = /*month*/ ctx[15].label + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*months*/ 16384) {
    				toggle_class(a, "disabled", /*month*/ ctx[15].disabled);
    			}

    			if (dirty & /*$store, months*/ 16386) {
    				toggle_class(a, "selected", /*$store*/ ctx[1].month === /*i*/ ctx[17] && /*$store*/ ctx[1].year === /*month*/ ctx[15].year);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(63:3) {#each months as month, i}",
    		ctx
    	});

    	return block;
    }

    // (62:2) <Grid template="repeat(4, 1fr) / repeat(3, 1fr)">
    function create_default_slot_1$4(ctx) {
    	let each_1_anchor;
    	let each_value = /*months*/ ctx[14];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*months, $store, select*/ 16514) {
    				each_value = /*months*/ ctx[14];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(62:2) <Grid template=\\\"repeat(4, 1fr) / repeat(3, 1fr)\\\">",
    		ctx
    	});

    	return block;
    }

    // (61:1) <InfiniteGrid cellCount={1} {itemCount} bind:index={yearIndex} {get} let:months bind:this={grid}>
    function create_default_slot$7(ctx) {
    	let grid_1;
    	let current;

    	grid_1 = new Grid({
    			props: {
    				template: "repeat(4, 1fr) / repeat(3, 1fr)",
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(grid_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(grid_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const grid_1_changes = {};

    			if (dirty & /*$$scope, months, $store*/ 278530) {
    				grid_1_changes.$$scope = { dirty, ctx };
    			}

    			grid_1.$set(grid_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grid_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(grid_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(61:1) <InfiniteGrid cellCount={1} {itemCount} bind:index={yearIndex} {get} let:months bind:this={grid}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let keycontrols;
    	let t;
    	let div;
    	let infinitegrid;
    	let updating_index;
    	let scrollable_action;
    	let current;
    	let mounted;
    	let dispose;
    	const keycontrols_spread_levels = [/*KEY_MAPPINGS*/ ctx[9], { ctx: ['months'] }];
    	let keycontrols_props = {};

    	for (let i = 0; i < keycontrols_spread_levels.length; i += 1) {
    		keycontrols_props = assign(keycontrols_props, keycontrols_spread_levels[i]);
    	}

    	keycontrols = new KeyControls({ props: keycontrols_props, $$inline: true });

    	function infinitegrid_index_binding(value) {
    		/*infinitegrid_index_binding*/ ctx[10](value);
    	}

    	let infinitegrid_props = {
    		cellCount: 1,
    		itemCount: /*itemCount*/ ctx[3],
    		get: /*get*/ ctx[6],
    		$$slots: {
    			default: [
    				create_default_slot$7,
    				({ months }) => ({ 14: months }),
    				({ months }) => months ? 16384 : 0
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*yearIndex*/ ctx[0] !== void 0) {
    		infinitegrid_props.index = /*yearIndex*/ ctx[0];
    	}

    	infinitegrid = new InfiniteGrid({
    			props: infinitegrid_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(infinitegrid, 'index', infinitegrid_index_binding));
    	/*infinitegrid_binding*/ ctx[11](infinitegrid);

    	const block = {
    		c: function create() {
    			create_component(keycontrols.$$.fragment);
    			t = space();
    			div = element("div");
    			create_component(infinitegrid.$$.fragment);
    			attr_dev(div, "class", "svelte-t161t");
    			add_location(div, file$7, 59, 0, 1555);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(keycontrols, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(infinitegrid, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(scrollable_action = scrollable.call(null, div, {
    						y: /*initialY*/ ctx[4],
    						step: scrollStep,
    						maxSteps: /*itemCount*/ ctx[3]
    					})),
    					listen_dev(div, "y", /*updateIndex*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const keycontrols_changes = (dirty & /*KEY_MAPPINGS*/ 512)
    			? get_spread_update(keycontrols_spread_levels, [get_spread_object(/*KEY_MAPPINGS*/ ctx[9]), keycontrols_spread_levels[1]])
    			: {};

    			keycontrols.$set(keycontrols_changes);
    			const infinitegrid_changes = {};
    			if (dirty & /*itemCount*/ 8) infinitegrid_changes.itemCount = /*itemCount*/ ctx[3];

    			if (dirty & /*$$scope, months, $store*/ 278530) {
    				infinitegrid_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_index && dirty & /*yearIndex*/ 1) {
    				updating_index = true;
    				infinitegrid_changes.index = /*yearIndex*/ ctx[0];
    				add_flush_callback(() => updating_index = false);
    			}

    			infinitegrid.$set(infinitegrid_changes);

    			if (scrollable_action && is_function(scrollable_action.update) && dirty & /*initialY, itemCount*/ 24) scrollable_action.update.call(null, {
    				y: /*initialY*/ ctx[4],
    				step: scrollStep,
    				maxSteps: /*itemCount*/ ctx[3]
    			});
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(keycontrols.$$.fragment, local);
    			transition_in(infinitegrid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(keycontrols.$$.fragment, local);
    			transition_out(infinitegrid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(keycontrols, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			/*infinitegrid_binding*/ ctx[11](null);
    			destroy_component(infinitegrid);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let yearIndex;
    	let initialY;
    	let itemCount;
    	let $store;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MonthPicker', slots, []);
    	const store = getContext(storeContextKey);
    	validate_store(store, 'store');
    	component_subscribe($$self, store, value => $$invalidate(1, $store = value));
    	let grid;

    	const get = index => ({
    		months: Array(12).fill(0).map((d, i) => {
    			const month = dayjs_min(new Date($store.start.getFullYear() + index, i, 1));

    			return {
    				year: $store.start.getFullYear() + index,
    				label: month.format('MMM'),
    				index: i,
    				disabled: !store.isSelectable(month, ['date'])
    			};
    		})
    	});

    	const close = () => store.setActiveView('days');

    	const select = month => () => {
    		if (month.disabled) return;
    		store.setMonth(month.index);
    		close();
    	};

    	const add = amount => () => {
    		store.add(amount, 'month', ['date']);
    	};

    	const updateIndex = ({ detail: { step: newIndex } }) => {
    		store.add(newIndex - yearIndex, 'year', ['month', 'date']);
    	};

    	const KEY_MAPPINGS = {
    		left: add(-1),
    		right: add(1),
    		up: add(-3),
    		down: add(3),
    		enter: close,
    		escape: close
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MonthPicker> was created with unknown prop '${key}'`);
    	});

    	function infinitegrid_index_binding(value) {
    		yearIndex = value;
    		($$invalidate(0, yearIndex), $$invalidate(1, $store));
    	}

    	function infinitegrid_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			grid = $$value;
    			$$invalidate(2, grid);
    		});
    	}

    	$$self.$capture_state = () => ({
    		getContext,
    		storeContextKey,
    		dayjs: dayjs_min,
    		KeyControls,
    		Grid,
    		InfiniteGrid,
    		scrollable,
    		scrollStep,
    		store,
    		grid,
    		get,
    		close,
    		select,
    		add,
    		updateIndex,
    		KEY_MAPPINGS,
    		itemCount,
    		yearIndex,
    		initialY,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('grid' in $$props) $$invalidate(2, grid = $$props.grid);
    		if ('itemCount' in $$props) $$invalidate(3, itemCount = $$props.itemCount);
    		if ('yearIndex' in $$props) $$invalidate(0, yearIndex = $$props.yearIndex);
    		if ('initialY' in $$props) $$invalidate(4, initialY = $$props.initialY);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$store*/ 2) {
    			$$invalidate(0, yearIndex = $store.year - $store.start.getFullYear());
    		}

    		if ($$self.$$.dirty & /*yearIndex*/ 1) {
    			$$invalidate(4, initialY = yearIndex * scrollStep);
    		}

    		if ($$self.$$.dirty & /*$store*/ 2) {
    			$$invalidate(3, itemCount = $store.end.getFullYear() - $store.start.getFullYear() + 1);
    		}
    	};

    	return [
    		yearIndex,
    		$store,
    		grid,
    		itemCount,
    		initialY,
    		store,
    		get,
    		select,
    		updateIndex,
    		KEY_MAPPINGS,
    		infinitegrid_index_binding,
    		infinitegrid_binding
    	];
    }

    class MonthPicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MonthPicker",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* node_modules\svelte-calendar\components\calendar\YearPicker.svelte generated by Svelte v3.44.3 */
    const file$6 = "node_modules\\svelte-calendar\\components\\calendar\\YearPicker.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    // (64:3) {#each years as year}
    function create_each_block$1(ctx) {
    	let a;
    	let t0_value = /*year*/ ctx[18].number + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", "#year");
    			toggle_class(a, "selected", /*$store*/ ctx[3].year === /*year*/ ctx[18].number);
    			toggle_class(a, "disabled", !/*year*/ ctx[18].selectable);
    			add_location(a, file$6, 64, 4, 2010);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			append_dev(a, t1);

    			if (!mounted) {
    				dispose = listen_dev(
    					a,
    					"click",
    					prevent_default(function () {
    						if (is_function(/*select*/ ctx[10](/*year*/ ctx[18]))) /*select*/ ctx[10](/*year*/ ctx[18]).apply(this, arguments);
    					}),
    					false,
    					true,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*years*/ 131072 && t0_value !== (t0_value = /*year*/ ctx[18].number + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$store, years*/ 131080) {
    				toggle_class(a, "selected", /*$store*/ ctx[3].year === /*year*/ ctx[18].number);
    			}

    			if (dirty & /*years*/ 131072) {
    				toggle_class(a, "disabled", !/*year*/ ctx[18].selectable);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(64:3) {#each years as year}",
    		ctx
    	});

    	return block;
    }

    // (63:2) <Grid template="repeat({rowCount}, 1fr) / repeat({colCount}, 1fr)">
    function create_default_slot_1$3(ctx) {
    	let each_1_anchor;
    	let each_value = /*years*/ ctx[17];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$store, years, select*/ 132104) {
    				each_value = /*years*/ ctx[17];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(63:2) <Grid template=\\\"repeat({rowCount}, 1fr) / repeat({colCount}, 1fr)\\\">",
    		ctx
    	});

    	return block;
    }

    // (62:1) <InfiniteGrid cellCount={1} {itemCount} bind:index={yearIndex} {get} let:years>
    function create_default_slot$6(ctx) {
    	let grid;
    	let current;

    	grid = new Grid({
    			props: {
    				template: "repeat(" + /*rowCount*/ ctx[0] + ", 1fr) / repeat(" + /*colCount*/ ctx[1] + ", 1fr)",
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(grid.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const grid_changes = {};
    			if (dirty & /*rowCount, colCount*/ 3) grid_changes.template = "repeat(" + /*rowCount*/ ctx[0] + ", 1fr) / repeat(" + /*colCount*/ ctx[1] + ", 1fr)";

    			if (dirty & /*$$scope, years, $store*/ 2228232) {
    				grid_changes.$$scope = { dirty, ctx };
    			}

    			grid.$set(grid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(grid, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(62:1) <InfiniteGrid cellCount={1} {itemCount} bind:index={yearIndex} {get} let:years>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let keycontrols;
    	let t;
    	let div;
    	let infinitegrid;
    	let updating_index;
    	let scrollable_action;
    	let current;
    	let mounted;
    	let dispose;
    	const keycontrols_spread_levels = [/*KEY_MAPPINGS*/ ctx[6], { ctx: ['years'] }];
    	let keycontrols_props = {};

    	for (let i = 0; i < keycontrols_spread_levels.length; i += 1) {
    		keycontrols_props = assign(keycontrols_props, keycontrols_spread_levels[i]);
    	}

    	keycontrols = new KeyControls({ props: keycontrols_props, $$inline: true });

    	function infinitegrid_index_binding(value) {
    		/*infinitegrid_index_binding*/ ctx[14](value);
    	}

    	let infinitegrid_props = {
    		cellCount: 1,
    		itemCount: /*itemCount*/ ctx[5],
    		get: /*get*/ ctx[8],
    		$$slots: {
    			default: [
    				create_default_slot$6,
    				({ years }) => ({ 17: years }),
    				({ years }) => years ? 131072 : 0
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*yearIndex*/ ctx[2] !== void 0) {
    		infinitegrid_props.index = /*yearIndex*/ ctx[2];
    	}

    	infinitegrid = new InfiniteGrid({
    			props: infinitegrid_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(infinitegrid, 'index', infinitegrid_index_binding));

    	const block = {
    		c: function create() {
    			create_component(keycontrols.$$.fragment);
    			t = space();
    			div = element("div");
    			create_component(infinitegrid.$$.fragment);
    			attr_dev(div, "class", "svelte-t161t");
    			add_location(div, file$6, 60, 0, 1733);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(keycontrols, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(infinitegrid, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(scrollable_action = scrollable.call(null, div, {
    						y: /*initialY*/ ctx[4],
    						step: scrollStep,
    						maxSteps: /*itemCount*/ ctx[5]
    					})),
    					listen_dev(div, "y", /*updateIndex*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const keycontrols_changes = (dirty & /*KEY_MAPPINGS*/ 64)
    			? get_spread_update(keycontrols_spread_levels, [get_spread_object(/*KEY_MAPPINGS*/ ctx[6]), keycontrols_spread_levels[1]])
    			: {};

    			keycontrols.$set(keycontrols_changes);
    			const infinitegrid_changes = {};
    			if (dirty & /*itemCount*/ 32) infinitegrid_changes.itemCount = /*itemCount*/ ctx[5];

    			if (dirty & /*$$scope, rowCount, colCount, years, $store*/ 2228235) {
    				infinitegrid_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_index && dirty & /*yearIndex*/ 4) {
    				updating_index = true;
    				infinitegrid_changes.index = /*yearIndex*/ ctx[2];
    				add_flush_callback(() => updating_index = false);
    			}

    			infinitegrid.$set(infinitegrid_changes);

    			if (scrollable_action && is_function(scrollable_action.update) && dirty & /*initialY, itemCount*/ 48) scrollable_action.update.call(null, {
    				y: /*initialY*/ ctx[4],
    				step: scrollStep,
    				maxSteps: /*itemCount*/ ctx[5]
    			});
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(keycontrols.$$.fragment, local);
    			transition_in(infinitegrid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(keycontrols.$$.fragment, local);
    			transition_out(infinitegrid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(keycontrols, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			destroy_component(infinitegrid);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let KEY_MAPPINGS;
    	let startYear;
    	let endYear;
    	let numPerPage;
    	let itemCount;
    	let yearIndex;
    	let initialY;
    	let $store;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('YearPicker', slots, []);
    	let { rowCount = 3 } = $$props;
    	let { colCount = 3 } = $$props;
    	const store = getContext(storeContextKey);
    	validate_store(store, 'store');
    	component_subscribe($$self, store, value => $$invalidate(3, $store = value));
    	const close = () => store.setActiveView('months');

    	const add = amount => () => {
    		const result = $store.year + amount;
    		if (result < startYear || result > endYear) return;
    		store.add(amount, 'year', ['month', 'date']);
    	};

    	const get = index => {
    		const firstYear = startYear + index * numPerPage;

    		return {
    			years: Array(numPerPage).fill(0).map((d, i) => ({
    				number: firstYear + i,
    				selectable: firstYear + i <= endYear
    			}))
    		};
    	};

    	const updateIndex = ({ detail: { step: newIndex } }) => {
    		store.add(numPerPage * (newIndex - yearIndex), 'year', ['year', 'month', 'date']);
    	};

    	const select = year => () => {
    		if (!year.selectable) return;
    		store.setYear(year.number);
    		close();
    	};

    	const writable_props = ['rowCount', 'colCount'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<YearPicker> was created with unknown prop '${key}'`);
    	});

    	function infinitegrid_index_binding(value) {
    		yearIndex = value;
    		((((($$invalidate(2, yearIndex), $$invalidate(3, $store)), $$invalidate(12, startYear)), $$invalidate(11, numPerPage)), $$invalidate(0, rowCount)), $$invalidate(1, colCount));
    	}

    	$$self.$$set = $$props => {
    		if ('rowCount' in $$props) $$invalidate(0, rowCount = $$props.rowCount);
    		if ('colCount' in $$props) $$invalidate(1, colCount = $$props.colCount);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		storeContextKey,
    		KeyControls,
    		Grid,
    		InfiniteGrid,
    		scrollable,
    		scrollStep,
    		rowCount,
    		colCount,
    		store,
    		close,
    		add,
    		get,
    		updateIndex,
    		select,
    		yearIndex,
    		initialY,
    		numPerPage,
    		startYear,
    		endYear,
    		itemCount,
    		KEY_MAPPINGS,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('rowCount' in $$props) $$invalidate(0, rowCount = $$props.rowCount);
    		if ('colCount' in $$props) $$invalidate(1, colCount = $$props.colCount);
    		if ('yearIndex' in $$props) $$invalidate(2, yearIndex = $$props.yearIndex);
    		if ('initialY' in $$props) $$invalidate(4, initialY = $$props.initialY);
    		if ('numPerPage' in $$props) $$invalidate(11, numPerPage = $$props.numPerPage);
    		if ('startYear' in $$props) $$invalidate(12, startYear = $$props.startYear);
    		if ('endYear' in $$props) $$invalidate(13, endYear = $$props.endYear);
    		if ('itemCount' in $$props) $$invalidate(5, itemCount = $$props.itemCount);
    		if ('KEY_MAPPINGS' in $$props) $$invalidate(6, KEY_MAPPINGS = $$props.KEY_MAPPINGS);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*colCount*/ 2) {
    			$$invalidate(6, KEY_MAPPINGS = {
    				up: add(-1 * colCount),
    				down: add(colCount),
    				left: add(-1),
    				right: add(1),
    				enter: close,
    				escape: close
    			});
    		}

    		if ($$self.$$.dirty & /*$store*/ 8) {
    			$$invalidate(12, startYear = $store.start.getFullYear());
    		}

    		if ($$self.$$.dirty & /*$store*/ 8) {
    			$$invalidate(13, endYear = $store.end.getFullYear());
    		}

    		if ($$self.$$.dirty & /*rowCount, colCount*/ 3) {
    			$$invalidate(11, numPerPage = rowCount * colCount);
    		}

    		if ($$self.$$.dirty & /*endYear, startYear, numPerPage*/ 14336) {
    			$$invalidate(5, itemCount = Math.ceil(endYear - startYear + 1) / numPerPage);
    		}

    		if ($$self.$$.dirty & /*$store, startYear, numPerPage*/ 6152) {
    			$$invalidate(2, yearIndex = Math.floor(($store.year - startYear) / numPerPage));
    		}

    		if ($$self.$$.dirty & /*yearIndex*/ 4) {
    			$$invalidate(4, initialY = yearIndex * scrollStep);
    		}
    	};

    	return [
    		rowCount,
    		colCount,
    		yearIndex,
    		$store,
    		initialY,
    		itemCount,
    		KEY_MAPPINGS,
    		store,
    		get,
    		updateIndex,
    		select,
    		numPerPage,
    		startYear,
    		endYear,
    		infinitegrid_index_binding
    	];
    }

    class YearPicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { rowCount: 0, colCount: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "YearPicker",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get rowCount() {
    		throw new Error("<YearPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rowCount(value) {
    		throw new Error("<YearPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colCount() {
    		throw new Error("<YearPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colCount(value) {
    		throw new Error("<YearPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-calendar\components\calendar\Calendar.svelte generated by Svelte v3.44.3 */
    const file$5 = "node_modules\\svelte-calendar\\components\\calendar\\Calendar.svelte";

    // (26:43) 
    function create_if_block_2(ctx) {
    	let viewtransitioneffect;
    	let current;

    	viewtransitioneffect = new ViewTransitionEffect({
    			props: {
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(viewtransitioneffect.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(viewtransitioneffect, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(viewtransitioneffect.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(viewtransitioneffect.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(viewtransitioneffect, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(26:43) ",
    		ctx
    	});

    	return block;
    }

    // (22:44) 
    function create_if_block_1(ctx) {
    	let viewtransitioneffect;
    	let current;

    	viewtransitioneffect = new ViewTransitionEffect({
    			props: {
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(viewtransitioneffect.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(viewtransitioneffect, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(viewtransitioneffect.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(viewtransitioneffect.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(viewtransitioneffect, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(22:44) ",
    		ctx
    	});

    	return block;
    }

    // (18:3) {#if $store.activeView === 'days'}
    function create_if_block(ctx) {
    	let viewtransitioneffect;
    	let current;

    	viewtransitioneffect = new ViewTransitionEffect({
    			props: {
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(viewtransitioneffect.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(viewtransitioneffect, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(viewtransitioneffect.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(viewtransitioneffect.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(viewtransitioneffect, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(18:3) {#if $store.activeView === 'days'}",
    		ctx
    	});

    	return block;
    }

    // (27:4) <ViewTransitionEffect>
    function create_default_slot_3$1(ctx) {
    	let yearpicker;
    	let current;
    	yearpicker = new YearPicker({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(yearpicker.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(yearpicker, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(yearpicker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(yearpicker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(yearpicker, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(27:4) <ViewTransitionEffect>",
    		ctx
    	});

    	return block;
    }

    // (23:4) <ViewTransitionEffect>
    function create_default_slot_2$1(ctx) {
    	let monthpicker;
    	let current;
    	monthpicker = new MonthPicker({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(monthpicker.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(monthpicker, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(monthpicker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(monthpicker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(monthpicker, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(23:4) <ViewTransitionEffect>",
    		ctx
    	});

    	return block;
    }

    // (19:4) <ViewTransitionEffect>
    function create_default_slot_1$2(ctx) {
    	let daypicker;
    	let current;
    	daypicker = new DayPicker({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(daypicker.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(daypicker, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(daypicker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(daypicker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(daypicker, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(19:4) <ViewTransitionEffect>",
    		ctx
    	});

    	return block;
    }

    // (14:0) <CrossfadeProvider let:key let:send let:receive>
    function create_default_slot$5(ctx) {
    	let div1;
    	let datepickercontrols;
    	let t;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let div1_intro;
    	let div1_outro;
    	let current;
    	datepickercontrols = new CalendarControls({ $$inline: true });
    	const if_block_creators = [create_if_block, create_if_block_1, create_if_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$store*/ ctx[0].activeView === 'days') return 0;
    		if (/*$store*/ ctx[0].activeView === 'months') return 1;
    		if (/*$store*/ ctx[0].activeView === 'years') return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(datepickercontrols.$$.fragment);
    			t = space();
    			div0 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "contents svelte-lt9ob0");
    			add_location(div0, file$5, 16, 2, 783);
    			attr_dev(div1, "class", "grid svelte-lt9ob0");
    			add_location(div1, file$5, 14, 1, 685);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(datepickercontrols, div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(datepickercontrols.$$.fragment, local);
    			transition_in(if_block);

    			if (local) {
    				add_render_callback(() => {
    					if (div1_outro) div1_outro.end(1);
    					div1_intro = create_in_transition(div1, /*receive*/ ctx[4], { key: /*key*/ ctx[2] });
    					div1_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(datepickercontrols.$$.fragment, local);
    			transition_out(if_block);
    			if (div1_intro) div1_intro.invalidate();

    			if (local) {
    				div1_outro = create_out_transition(div1, /*send*/ ctx[3], { key: /*key*/ ctx[2] });
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(datepickercontrols);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (detaching && div1_outro) div1_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(14:0) <CrossfadeProvider let:key let:send let:receive>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let crossfadeprovider;
    	let current;

    	crossfadeprovider = new CrossfadeProvider({
    			props: {
    				$$slots: {
    					default: [
    						create_default_slot$5,
    						({ key, send, receive }) => ({ 2: key, 3: send, 4: receive }),
    						({ key, send, receive }) => (key ? 4 : 0) | (send ? 8 : 0) | (receive ? 16 : 0)
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(crossfadeprovider.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(crossfadeprovider, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const crossfadeprovider_changes = {};

    			if (dirty & /*$$scope, key, $store*/ 37) {
    				crossfadeprovider_changes.$$scope = { dirty, ctx };
    			}

    			crossfadeprovider.$set(crossfadeprovider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(crossfadeprovider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(crossfadeprovider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(crossfadeprovider, detaching);
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
    	let $store;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Calendar', slots, []);
    	const store = getContext(storeContextKey);
    	validate_store(store, 'store');
    	component_subscribe($$self, store, value => $$invalidate(0, $store = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Calendar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		DayPicker,
    		ViewTransitionEffect,
    		DatepickerControls: CalendarControls,
    		getContext,
    		storeContextKey,
    		CrossfadeProvider,
    		MonthPicker,
    		YearPicker,
    		store,
    		$store
    	});

    	return [$store, store];
    }

    class Calendar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Calendar",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    const calendar = {
    	selected: new Date(),
    	start: dayjs_min().add(-100, 'year').toDate(),
    	end: dayjs_min().add(100, 'year').toDate(),
    	format: 'MM/DD/YYYY'
    };

    /* node_modules\svelte-calendar\components\Datepicker.svelte generated by Svelte v3.44.3 */
    const file$4 = "node_modules\\svelte-calendar\\components\\Datepicker.svelte";

    const get_default_slot_changes = dirty => ({
    	key: dirty & /*key*/ 16384,
    	send: dirty & /*send*/ 32768,
    	receive: dirty & /*receive*/ 65536,
    	formatted: dirty & /*formatted*/ 1
    });

    const get_default_slot_context = ctx => ({
    	key: /*key*/ ctx[14],
    	send: /*send*/ ctx[15],
    	receive: /*receive*/ ctx[16],
    	formatted: /*formatted*/ ctx[0]
    });

    // (41:43)     
    function fallback_block(ctx) {
    	let div;
    	let button;
    	let button_intro;
    	let button_outro;
    	let t0;
    	let span;
    	let t1;
    	let span_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t0 = space();
    			span = element("span");
    			t1 = text(/*formatted*/ ctx[0]);
    			attr_dev(button, "class", "svelte-18igz6t");
    			add_location(button, file$4, 42, 4, 1358);
    			attr_dev(span, "class", "button-text svelte-18igz6t");
    			add_location(span, file$4, 43, 4, 1425);
    			attr_dev(div, "class", "button-container svelte-18igz6t");
    			add_location(div, file$4, 41, 3, 1323);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(div, t0);
    			append_dev(div, span);
    			append_dev(span, t1);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (!current || dirty & /*formatted*/ 1) set_data_dev(t1, /*formatted*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (button_outro) button_outro.end(1);
    					button_intro = create_in_transition(button, /*receive*/ ctx[16], { key: /*key*/ ctx[14] });
    					button_intro.start();
    				});
    			}

    			if (local) {
    				add_render_callback(() => {
    					if (!span_transition) span_transition = create_bidirectional_transition(span, fade, { delay: 2 }, true);
    					span_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (button_intro) button_intro.invalidate();

    			if (local) {
    				button_outro = create_out_transition(button, /*send*/ ctx[15], { key: /*key*/ ctx[14] });
    			}

    			if (local) {
    				if (!span_transition) span_transition = create_bidirectional_transition(span, fade, { delay: 2 }, false);
    				span_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && button_outro) button_outro.end();
    			if (detaching && span_transition) span_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(41:43)     ",
    		ctx
    	});

    	return block;
    }

    // (40:1) <Popover {style} let:key let:send let:receive bind:isOpen={$store.open}>
    function create_default_slot_1$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], get_default_slot_context);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, key, send, receive, formatted*/ 118785)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*formatted, key*/ 16385)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(40:1) <Popover {style} let:key let:send let:receive bind:isOpen={$store.open}>",
    		ctx
    	});

    	return block;
    }

    // (47:2) <svelte:fragment slot="contents">
    function create_contents_slot(ctx) {
    	let calendar;
    	let current;
    	calendar = new Calendar({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(calendar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(calendar, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calendar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calendar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(calendar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_contents_slot.name,
    		type: "slot",
    		source: "(47:2) <svelte:fragment slot=\\\"contents\\\">",
    		ctx
    	});

    	return block;
    }

    // (39:0) <Theme {defaultTheme} {theme} let:style>
    function create_default_slot$4(ctx) {
    	let popover;
    	let updating_isOpen;
    	let current;

    	function popover_isOpen_binding(value) {
    		/*popover_isOpen_binding*/ ctx[11](value);
    	}

    	let popover_props = {
    		style: /*style*/ ctx[13],
    		$$slots: {
    			contents: [
    				create_contents_slot,
    				({ key, send, receive }) => ({ 14: key, 15: send, 16: receive }),
    				({ key, send, receive }) => (key ? 16384 : 0) | (send ? 32768 : 0) | (receive ? 65536 : 0)
    			],
    			default: [
    				create_default_slot_1$1,
    				({ key, send, receive }) => ({ 14: key, 15: send, 16: receive }),
    				({ key, send, receive }) => (key ? 16384 : 0) | (send ? 32768 : 0) | (receive ? 65536 : 0)
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*$store*/ ctx[4].open !== void 0) {
    		popover_props.isOpen = /*$store*/ ctx[4].open;
    	}

    	popover = new Popover({ props: popover_props, $$inline: true });
    	binding_callbacks.push(() => bind(popover, 'isOpen', popover_isOpen_binding));

    	const block = {
    		c: function create() {
    			create_component(popover.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(popover, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const popover_changes = {};
    			if (dirty & /*style*/ 8192) popover_changes.style = /*style*/ ctx[13];

    			if (dirty & /*$$scope, formatted, key, send, receive*/ 118785) {
    				popover_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_isOpen && dirty & /*$store*/ 16) {
    				updating_isOpen = true;
    				popover_changes.isOpen = /*$store*/ ctx[4].open;
    				add_flush_callback(() => updating_isOpen = false);
    			}

    			popover.$set(popover_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(popover.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(popover.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(popover, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(39:0) <Theme {defaultTheme} {theme} let:style>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let theme_1;
    	let current;

    	theme_1 = new Theme({
    			props: {
    				defaultTheme: /*defaultTheme*/ ctx[2],
    				theme: /*theme*/ ctx[1],
    				$$slots: {
    					default: [
    						create_default_slot$4,
    						({ style }) => ({ 13: style }),
    						({ style }) => style ? 8192 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(theme_1.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(theme_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const theme_1_changes = {};
    			if (dirty & /*defaultTheme*/ 4) theme_1_changes.defaultTheme = /*defaultTheme*/ ctx[2];
    			if (dirty & /*theme*/ 2) theme_1_changes.theme = /*theme*/ ctx[1];

    			if (dirty & /*$$scope, style, $store, formatted*/ 12305) {
    				theme_1_changes.$$scope = { dirty, ctx };
    			}

    			theme_1.$set(theme_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(theme_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(theme_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(theme_1, detaching);
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
    	let $store,
    		$$unsubscribe_store = noop,
    		$$subscribe_store = () => ($$unsubscribe_store(), $$unsubscribe_store = subscribe(store, $$value => $$invalidate(4, $store = $$value)), store);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_store());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Datepicker', slots, ['default']);
    	let { selected = calendar.selected } = $$props;
    	let { start = calendar.start } = $$props;
    	let { end = calendar.end } = $$props;
    	let { format = calendar.format } = $$props;
    	let { formatted = '' } = $$props;
    	let { theme = {} } = $$props;
    	let { defaultTheme = undefined } = $$props;
    	let { startOfWeekIndex = 0 } = $$props;

    	let { store = datepickerStore.get({
    		selected,
    		start,
    		end,
    		shouldEnlargeDay: true,
    		startOfWeekIndex
    	}) } = $$props;

    	validate_store(store, 'store');
    	$$subscribe_store();
    	setContext(storeContextKey, store);
    	setContext(keyControlsContextKey, derived(store, $s => $s.activeView));

    	const writable_props = [
    		'selected',
    		'start',
    		'end',
    		'format',
    		'formatted',
    		'theme',
    		'defaultTheme',
    		'startOfWeekIndex',
    		'store'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Datepicker> was created with unknown prop '${key}'`);
    	});

    	function popover_isOpen_binding(value) {
    		if ($$self.$$.not_equal($store.open, value)) {
    			$store.open = value;
    			store.set($store);
    		}
    	}

    	$$self.$$set = $$props => {
    		if ('selected' in $$props) $$invalidate(5, selected = $$props.selected);
    		if ('start' in $$props) $$invalidate(6, start = $$props.start);
    		if ('end' in $$props) $$invalidate(7, end = $$props.end);
    		if ('format' in $$props) $$invalidate(8, format = $$props.format);
    		if ('formatted' in $$props) $$invalidate(0, formatted = $$props.formatted);
    		if ('theme' in $$props) $$invalidate(1, theme = $$props.theme);
    		if ('defaultTheme' in $$props) $$invalidate(2, defaultTheme = $$props.defaultTheme);
    		if ('startOfWeekIndex' in $$props) $$invalidate(9, startOfWeekIndex = $$props.startOfWeekIndex);
    		if ('store' in $$props) $$subscribe_store($$invalidate(3, store = $$props.store));
    		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		dayjs: dayjs_min,
    		datepickerStore,
    		keyControlsContextKey,
    		storeContextKey,
    		setContext,
    		derived,
    		Popover,
    		Theme,
    		Calendar,
    		fade,
    		calendarDefaults: calendar,
    		selected,
    		start,
    		end,
    		format,
    		formatted,
    		theme,
    		defaultTheme,
    		startOfWeekIndex,
    		store,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('selected' in $$props) $$invalidate(5, selected = $$props.selected);
    		if ('start' in $$props) $$invalidate(6, start = $$props.start);
    		if ('end' in $$props) $$invalidate(7, end = $$props.end);
    		if ('format' in $$props) $$invalidate(8, format = $$props.format);
    		if ('formatted' in $$props) $$invalidate(0, formatted = $$props.formatted);
    		if ('theme' in $$props) $$invalidate(1, theme = $$props.theme);
    		if ('defaultTheme' in $$props) $$invalidate(2, defaultTheme = $$props.defaultTheme);
    		if ('startOfWeekIndex' in $$props) $$invalidate(9, startOfWeekIndex = $$props.startOfWeekIndex);
    		if ('store' in $$props) $$subscribe_store($$invalidate(3, store = $$props.store));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$store*/ 16) {
    			$$invalidate(5, selected = $store.selected);
    		}

    		if ($$self.$$.dirty & /*selected, format*/ 288) {
    			$$invalidate(0, formatted = dayjs_min(selected).format(format));
    		}
    	};

    	return [
    		formatted,
    		theme,
    		defaultTheme,
    		store,
    		$store,
    		selected,
    		start,
    		end,
    		format,
    		startOfWeekIndex,
    		slots,
    		popover_isOpen_binding,
    		$$scope
    	];
    }

    class Datepicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			selected: 5,
    			start: 6,
    			end: 7,
    			format: 8,
    			formatted: 0,
    			theme: 1,
    			defaultTheme: 2,
    			startOfWeekIndex: 9,
    			store: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Datepicker",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get selected() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get start() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set start(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get end() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set end(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get format() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set format(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatted() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatted(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get theme() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get defaultTheme() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set defaultTheme(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get startOfWeekIndex() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set startOfWeekIndex(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get store() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set store(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\DateComponent.svelte generated by Svelte v3.44.3 */

    // (33:4) 
    function create_input_slot_slot(ctx) {
    	let datepicker;
    	let updating_store;
    	let current;

    	function datepicker_store_binding(value) {
    		/*datepicker_store_binding*/ ctx[3](value);
    	}

    	let datepicker_props = {
    		slot: "input-slot",
    		format,
    		theme: /*theme*/ ctx[1]
    	};

    	if (/*store*/ ctx[0] !== void 0) {
    		datepicker_props.store = /*store*/ ctx[0];
    	}

    	datepicker = new Datepicker({ props: datepicker_props, $$inline: true });
    	binding_callbacks.push(() => bind(datepicker, 'store', datepicker_store_binding));

    	const block = {
    		c: function create() {
    			create_component(datepicker.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(datepicker, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const datepicker_changes = {};

    			if (!updating_store && dirty & /*store*/ 1) {
    				updating_store = true;
    				datepicker_changes.store = /*store*/ ctx[0];
    				add_flush_callback(() => updating_store = false);
    			}

    			datepicker.$set(datepicker_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(datepicker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(datepicker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(datepicker, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_input_slot_slot.name,
    		type: "slot",
    		source: "(33:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let inputcontainer;
    	let current;

    	inputcontainer = new InputContainer({
    			props: {
    				popover: "true",
    				$$slots: { "input-slot": [create_input_slot_slot] },
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

    			if (dirty & /*$$scope, store*/ 257) {
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

    const format = "dddd, MMMM D, YYYY";

    function instance$4($$self, $$props, $$invalidate) {
    	let $store,
    		$$unsubscribe_store = noop,
    		$$subscribe_store = () => ($$unsubscribe_store(), $$unsubscribe_store = subscribe(store, $$value => $$invalidate(2, $store = $$value)), store);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_store());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DateComponent', slots, []);
    	let inputName = "dob";
    	let isRequired = true;
    	let store;

    	const theme = {
    		calendar: {
    			width: "100%",
    			height: "100%",
    			colors: { background: { highlight: "purple" } }
    		}
    	};

    	const [validity, validate] = createFieldValidator(0, inputName, isRequired, true);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DateComponent> was created with unknown prop '${key}'`);
    	});

    	function datepicker_store_binding(value) {
    		store = value;
    		$$subscribe_store($$invalidate(0, store));
    	}

    	$$self.$capture_state = () => ({
    		Datepicker,
    		InputContainer,
    		createFieldValidator,
    		validityCheck,
    		validityRangeCheck,
    		format,
    		inputName,
    		isRequired,
    		store,
    		theme,
    		validity,
    		validate,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('inputName' in $$props) $$invalidate(4, inputName = $$props.inputName);
    		if ('isRequired' in $$props) isRequired = $$props.isRequired;
    		if ('store' in $$props) $$subscribe_store($$invalidate(0, store = $$props.store));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$store*/ 4) {
    			try {
    				validityCheck(inputName, $store.selected, $store.hasChosen);
    			} catch(error) {
    				
    			}
    		}
    	};

    	return [store, theme, $store, datepicker_store_binding];
    }

    class DateComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DateComponent",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\PageBasicInformation.svelte generated by Svelte v3.44.3 */
    const file$3 = "src\\PageBasicInformation.svelte";

    // (14:8) 
    function create_heading_slot$2(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Basic Information";
    			attr_dev(h1, "slot", "heading");
    			add_location(h1, file$3, 13, 8, 475);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_heading_slot$2.name,
    		type: "slot",
    		source: "(14:8) ",
    		ctx
    	});

    	return block;
    }

    // (15:8) 
    function create_paragraph_slot$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "We are going to collect basic Information to prepare a diet plan";
    			attr_dev(p, "slot", "paragraph");
    			add_location(p, file$3, 14, 8, 526);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_paragraph_slot$1.name,
    		type: "slot",
    		source: "(15:8) ",
    		ctx
    	});

    	return block;
    }

    // (18:8) 
    function create_forms_slot$2(ctx) {
    	let div;
    	let inputtext;
    	let t0;
    	let h40;
    	let t2;
    	let datecomponent;
    	let t3;
    	let h41;
    	let t5;
    	let inputcheckbox0;
    	let t6;
    	let inputcheckbox1;
    	let t7;
    	let h42;
    	let t9;
    	let inputcheckbox2;
    	let t10;
    	let inputcheckbox3;
    	let t11;
    	let h43;
    	let t13;
    	let inputcheckbox4;
    	let t14;
    	let inputcheckbox5;
    	let current;

    	inputtext = new InputText({
    			props: {
    				inputPlaceholder: "what is your name? ",
    				helpTextHeading: "Client Name.",
    				isRequired: "true",
    				helpText: "Please enter your first name.",
    				inputName: "user-name"
    			},
    			$$inline: true
    		});

    	datecomponent = new DateComponent({ $$inline: true });

    	inputcheckbox0 = new InputCheckbox({
    			props: {
    				checkboxtext: "Married",
    				isRequired: "true",
    				inputName: "married"
    			},
    			$$inline: true
    		});

    	inputcheckbox1 = new InputCheckbox({
    			props: {
    				checkboxtext: "Single",
    				isRequired: "true",
    				inputName: "not-married"
    			},
    			$$inline: true
    		});

    	inputcheckbox2 = new InputCheckbox({
    			props: {
    				checkboxtext: "Yes",
    				isRequired: "true",
    				inputName: "children"
    			},
    			$$inline: true
    		});

    	inputcheckbox3 = new InputCheckbox({
    			props: {
    				checkboxtext: "No",
    				isRequired: "true",
    				inputName: "not-children"
    			},
    			$$inline: true
    		});

    	inputcheckbox4 = new InputCheckbox({
    			props: {
    				checkboxtext: "Employed",
    				isRequired: "true",
    				inputName: "employed"
    			},
    			$$inline: true
    		});

    	inputcheckbox5 = new InputCheckbox({
    			props: {
    				checkboxtext: "Self-Employed",
    				isRequired: "true",
    				inputName: "not-employed"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(inputtext.$$.fragment);
    			t0 = space();
    			h40 = element("h4");
    			h40.textContent = "Date of Birth";
    			t2 = space();
    			create_component(datecomponent.$$.fragment);
    			t3 = space();
    			h41 = element("h4");
    			h41.textContent = "Maritial Status";
    			t5 = space();
    			create_component(inputcheckbox0.$$.fragment);
    			t6 = space();
    			create_component(inputcheckbox1.$$.fragment);
    			t7 = space();
    			h42 = element("h4");
    			h42.textContent = "Do you have children?";
    			t9 = space();
    			create_component(inputcheckbox2.$$.fragment);
    			t10 = space();
    			create_component(inputcheckbox3.$$.fragment);
    			t11 = space();
    			h43 = element("h4");
    			h43.textContent = "Employment Status";
    			t13 = space();
    			create_component(inputcheckbox4.$$.fragment);
    			t14 = space();
    			create_component(inputcheckbox5.$$.fragment);
    			add_location(h40, file$3, 25, 12, 975);
    			add_location(h41, file$3, 27, 12, 1041);
    			add_location(h42, file$3, 40, 12, 1430);
    			add_location(h43, file$3, 53, 12, 1819);
    			attr_dev(div, "class", "inner-form");
    			attr_dev(div, "slot", "forms");
    			add_location(div, file$3, 17, 8, 648);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(inputtext, div, null);
    			append_dev(div, t0);
    			append_dev(div, h40);
    			append_dev(div, t2);
    			mount_component(datecomponent, div, null);
    			append_dev(div, t3);
    			append_dev(div, h41);
    			append_dev(div, t5);
    			mount_component(inputcheckbox0, div, null);
    			append_dev(div, t6);
    			mount_component(inputcheckbox1, div, null);
    			append_dev(div, t7);
    			append_dev(div, h42);
    			append_dev(div, t9);
    			mount_component(inputcheckbox2, div, null);
    			append_dev(div, t10);
    			mount_component(inputcheckbox3, div, null);
    			append_dev(div, t11);
    			append_dev(div, h43);
    			append_dev(div, t13);
    			mount_component(inputcheckbox4, div, null);
    			append_dev(div, t14);
    			mount_component(inputcheckbox5, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputtext.$$.fragment, local);
    			transition_in(datecomponent.$$.fragment, local);
    			transition_in(inputcheckbox0.$$.fragment, local);
    			transition_in(inputcheckbox1.$$.fragment, local);
    			transition_in(inputcheckbox2.$$.fragment, local);
    			transition_in(inputcheckbox3.$$.fragment, local);
    			transition_in(inputcheckbox4.$$.fragment, local);
    			transition_in(inputcheckbox5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputtext.$$.fragment, local);
    			transition_out(datecomponent.$$.fragment, local);
    			transition_out(inputcheckbox0.$$.fragment, local);
    			transition_out(inputcheckbox1.$$.fragment, local);
    			transition_out(inputcheckbox2.$$.fragment, local);
    			transition_out(inputcheckbox3.$$.fragment, local);
    			transition_out(inputcheckbox4.$$.fragment, local);
    			transition_out(inputcheckbox5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(inputtext);
    			destroy_component(datecomponent);
    			destroy_component(inputcheckbox0);
    			destroy_component(inputcheckbox1);
    			destroy_component(inputcheckbox2);
    			destroy_component(inputcheckbox3);
    			destroy_component(inputcheckbox4);
    			destroy_component(inputcheckbox5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_forms_slot$2.name,
    		type: "slot",
    		source: "(18:8) ",
    		ctx
    	});

    	return block;
    }

    // (12:0) <Router basepath="/basic-information" url="/basic-information">
    function create_default_slot$3(ctx) {
    	let formcontainer;
    	let current;

    	formcontainer = new FormContainer({
    			props: {
    				$$slots: {
    					forms: [create_forms_slot$2],
    					paragraph: [create_paragraph_slot$1],
    					heading: [create_heading_slot$2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formcontainer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formcontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formcontainer_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				formcontainer_changes.$$scope = { dirty, ctx };
    			}

    			formcontainer.$set(formcontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formcontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formcontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formcontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(12:0) <Router basepath=\\\"/basic-information\\\" url=\\\"/basic-information\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				basepath: "/basic-information",
    				url: "/basic-information",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PageBasicInformation', slots, []);
    	let { isFormReady } = $$props;
    	const writable_props = ['isFormReady'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PageBasicInformation> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('isFormReady' in $$props) $$invalidate(0, isFormReady = $$props.isFormReady);
    	};

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		Link,
    		FormContainer,
    		InputCheckbox,
    		InputText,
    		Datepicker,
    		DateComponent,
    		isFormReady
    	});

    	$$self.$inject_state = $$props => {
    		if ('isFormReady' in $$props) $$invalidate(0, isFormReady = $$props.isFormReady);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isFormReady];
    }

    class PageBasicInformation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { isFormReady: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PageBasicInformation",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*isFormReady*/ ctx[0] === undefined && !('isFormReady' in props)) {
    			console.warn("<PageBasicInformation> was created without expected prop 'isFormReady'");
    		}
    	}

    	get isFormReady() {
    		throw new Error("<PageBasicInformation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFormReady(value) {
    		throw new Error("<PageBasicInformation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\PageAnthropometricMeasurments.svelte generated by Svelte v3.44.3 */
    const file$2 = "src\\PageAnthropometricMeasurments.svelte";

    // (38:8) 
    function create_heading_slot$1(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Anthroprometric Information";
    			attr_dev(h1, "slot", "heading");
    			add_location(h1, file$2, 37, 8, 1241);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_heading_slot$1.name,
    		type: "slot",
    		source: "(38:8) ",
    		ctx
    	});

    	return block;
    }

    // (39:8) 
    function create_paragraph_slot(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Let's calculate your body mass index.";
    			attr_dev(h2, "slot", "paragraph");
    			add_location(h2, file$2, 38, 8, 1302);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_paragraph_slot.name,
    		type: "slot",
    		source: "(39:8) ",
    		ctx
    	});

    	return block;
    }

    // (49:16) 
    function create_extra_dialog_slot_1(ctx) {
    	let popdialog;
    	let current;

    	popdialog = new PopDialog({
    			props: {
    				isExtra: "true",
    				slot: "extra-dialog",
    				popupHeading: "Height",
    				popupText: "Enter your height in feet and inches.",
    				visibility: /*helpDialog1*/ ctx[1]
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
    			if (dirty & /*helpDialog1*/ 2) popdialog_changes.visibility = /*helpDialog1*/ ctx[1];
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
    		id: create_extra_dialog_slot_1.name,
    		type: "slot",
    		source: "(49:16) ",
    		ctx
    	});

    	return block;
    }

    // (56:16) 
    function create_container_help_slot_slot_1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "slot", "container-help-slot");
    			attr_dev(button, "class", "outline-help-slot helper-button");
    			add_location(button, file$2, 55, 16, 2021);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

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
    		id: create_container_help_slot_slot_1.name,
    		type: "slot",
    		source: "(56:16) ",
    		ctx
    	});

    	return block;
    }

    // (72:16) 
    function create_extra_dialog_slot(ctx) {
    	let popdialog;
    	let current;

    	popdialog = new PopDialog({
    			props: {
    				isExtra: "true",
    				slot: "extra-dialog",
    				popupHeading: "Height",
    				popupText: "This is your weight in kg's",
    				visibility: /*helpDialog2*/ ctx[2]
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
    			if (dirty & /*helpDialog2*/ 4) popdialog_changes.visibility = /*helpDialog2*/ ctx[2];
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
    		source: "(72:16) ",
    		ctx
    	});

    	return block;
    }

    // (79:16) 
    function create_container_help_slot_slot(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "slot", "container-help-slot");
    			attr_dev(button, "class", "outline-help-slot helper-button");
    			add_location(button, file$2, 78, 16, 2829);
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
    		id: create_container_help_slot_slot.name,
    		type: "slot",
    		source: "(79:16) ",
    		ctx
    	});

    	return block;
    }

    // (40:8) 
    function create_forms_slot$1(ctx) {
    	let div1;
    	let inputtext;
    	let t0;
    	let inputnumber0;
    	let t1;
    	let h3;
    	let t2;
    	let t3;
    	let t4;
    	let div0;
    	let inputnumber1;
    	let current;

    	inputtext = new InputText({
    			props: {
    				inputName: "atr-height",
    				helpText: "Please enter your height in feet and inches",
    				inputPlaceholder: "Enter your height",
    				isRequired: "true",
    				textType: "height",
    				sign: "''",
    				$$slots: {
    					"container-help-slot": [create_container_help_slot_slot_1],
    					"extra-dialog": [create_extra_dialog_slot_1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	inputnumber0 = new InputNumber({
    			props: {
    				inputName: "atr-weight",
    				inputPlaceholder: "Weight",
    				isRequired: "true",
    				sign: "kg",
    				levelRange: "50",
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
    				inputName: "bmi",
    				inputPlaceholder: "bmi",
    				isRequired: "true",
    				sign: "bmi",
    				levelRange: "-1",
    				inputValue: /*bmi*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(inputtext.$$.fragment);
    			t0 = space();
    			create_component(inputnumber0.$$.fragment);
    			t1 = space();
    			h3 = element("h3");
    			t2 = text("Your Body Mass Index is : ");
    			t3 = text(/*bmi*/ ctx[0]);
    			t4 = space();
    			div0 = element("div");
    			create_component(inputnumber1.$$.fragment);
    			add_location(h3, file$2, 87, 12, 3137);
    			attr_dev(div0, "class", "nextQuest");
    			attr_dev(div0, "disabled", "true");
    			add_location(div0, file$2, 88, 12, 3191);
    			attr_dev(div1, "class", "inner-form");
    			attr_dev(div1, "slot", "forms");
    			add_location(div1, file$2, 39, 8, 1375);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(inputtext, div1, null);
    			append_dev(div1, t0);
    			mount_component(inputnumber0, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, h3);
    			append_dev(h3, t2);
    			append_dev(h3, t3);
    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			mount_component(inputnumber1, div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputtext_changes = {};

    			if (dirty & /*$$scope, helpDialog1*/ 130) {
    				inputtext_changes.$$scope = { dirty, ctx };
    			}

    			inputtext.$set(inputtext_changes);
    			const inputnumber0_changes = {};

    			if (dirty & /*$$scope, helpDialog2*/ 132) {
    				inputnumber0_changes.$$scope = { dirty, ctx };
    			}

    			inputnumber0.$set(inputnumber0_changes);
    			if (!current || dirty & /*bmi*/ 1) set_data_dev(t3, /*bmi*/ ctx[0]);
    			const inputnumber1_changes = {};
    			if (dirty & /*bmi*/ 1) inputnumber1_changes.inputValue = /*bmi*/ ctx[0];
    			inputnumber1.$set(inputnumber1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputtext.$$.fragment, local);
    			transition_in(inputnumber0.$$.fragment, local);
    			transition_in(inputnumber1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputtext.$$.fragment, local);
    			transition_out(inputnumber0.$$.fragment, local);
    			transition_out(inputnumber1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(inputtext);
    			destroy_component(inputnumber0);
    			destroy_component(inputnumber1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_forms_slot$1.name,
    		type: "slot",
    		source: "(40:8) ",
    		ctx
    	});

    	return block;
    }

    // (36:0) <Router url="/anthro-measurements" basepath="/anthro-measurements">
    function create_default_slot$2(ctx) {
    	let formcontainer;
    	let current;

    	formcontainer = new FormContainer({
    			props: {
    				$$slots: {
    					forms: [create_forms_slot$1],
    					paragraph: [create_paragraph_slot],
    					heading: [create_heading_slot$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formcontainer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formcontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formcontainer_changes = {};

    			if (dirty & /*$$scope, bmi, helpDialog2, helpDialog1*/ 135) {
    				formcontainer_changes.$$scope = { dirty, ctx };
    			}

    			formcontainer.$set(formcontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formcontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formcontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formcontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(36:0) <Router url=\\\"/anthro-measurements\\\" basepath=\\\"/anthro-measurements\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: "/anthro-measurements",
    				basepath: "/anthro-measurements",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, bmi, helpDialog2, helpDialog1*/ 135) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PageAnthropometricMeasurments', slots, []);
    	let { isFormReady = false } = $$props;
    	let bmi = 0;
    	let helpDialog1 = false;
    	let helpDialog2 = false;

    	afterUpdate(() => {
    		//console.log(isFormReady)
    		getAccumulator();

    		if (isFormReady) ; else {
    			return;
    		}
    	});

    	function getAccumulator() {
    		let accum = get_store_value(accumulator);

    		try {
    			let height = accum.find(v => v.component === "atr-height");
    			let weight = accum.find(v => v.component === "atr-weight");
    			$$invalidate(0, bmi = bodyMassIndex(height.value, weight.value));
    		} catch(error) {
    			return;
    		}
    	}

    	const writable_props = ['isFormReady'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PageAnthropometricMeasurments> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(1, helpDialog1 = !helpDialog1);
    	};

    	const click_handler_1 = () => {
    		$$invalidate(2, helpDialog2 = !helpDialog2);
    	};

    	$$self.$$set = $$props => {
    		if ('isFormReady' in $$props) $$invalidate(3, isFormReady = $$props.isFormReady);
    	};

    	$$self.$capture_state = () => ({
    		accumulator,
    		bodyMassIndex,
    		FormContainer,
    		InputNumber,
    		PopDialog,
    		InputText,
    		Router,
    		get: get_store_value,
    		afterUpdate,
    		isFormReady,
    		bmi,
    		helpDialog1,
    		helpDialog2,
    		getAccumulator
    	});

    	$$self.$inject_state = $$props => {
    		if ('isFormReady' in $$props) $$invalidate(3, isFormReady = $$props.isFormReady);
    		if ('bmi' in $$props) $$invalidate(0, bmi = $$props.bmi);
    		if ('helpDialog1' in $$props) $$invalidate(1, helpDialog1 = $$props.helpDialog1);
    		if ('helpDialog2' in $$props) $$invalidate(2, helpDialog2 = $$props.helpDialog2);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [bmi, helpDialog1, helpDialog2, isFormReady, click_handler, click_handler_1];
    }

    class PageAnthropometricMeasurments extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { isFormReady: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PageAnthropometricMeasurments",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get isFormReady() {
    		throw new Error("<PageAnthropometricMeasurments>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFormReady(value) {
    		throw new Error("<PageAnthropometricMeasurments>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\PageHealthHistory.svelte generated by Svelte v3.44.3 */
    const file$1 = "src\\PageHealthHistory.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (48:8) 
    function create_heading_slot(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Health History";
    			attr_dev(h1, "slot", "heading");
    			add_location(h1, file$1, 47, 8, 1646);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_heading_slot.name,
    		type: "slot",
    		source: "(48:8) ",
    		ctx
    	});

    	return block;
    }

    // (103:12) {#each $medicalAlergies as item}
    function create_each_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*item*/ ctx[8]];
    	var switch_value = InputText;

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$medicalAlergies*/ 1)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*item*/ ctx[8])])
    			: {};

    			if (switch_value !== (switch_value = InputText)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(103:12) {#each $medicalAlergies as item}",
    		ctx
    	});

    	return block;
    }

    // (111:12) {#each $foodAlergies as item}
    function create_each_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*item*/ ctx[8]];
    	var switch_value = InputText;

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$foodAlergies*/ 2)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*item*/ ctx[8])])
    			: {};

    			if (switch_value !== (switch_value = InputText)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(111:12) {#each $foodAlergies as item}",
    		ctx
    	});

    	return block;
    }

    // (49:8) 
    function create_forms_slot(ctx) {
    	let div2;
    	let p0;
    	let t1;
    	let inputcheckbox0;
    	let t2;
    	let inputcheckbox1;
    	let t3;
    	let inputcheckbox2;
    	let t4;
    	let inputcheckbox3;
    	let t5;
    	let p1;
    	let t7;
    	let inputcheckbox4;
    	let t8;
    	let inputcheckbox5;
    	let t9;
    	let inputcheckbox6;
    	let t10;
    	let inputcheckbox7;
    	let t11;
    	let div0;
    	let p2;
    	let t13;
    	let button0;
    	let t14;
    	let t15;
    	let div1;
    	let p3;
    	let t17;
    	let button1;
    	let t18;
    	let t19;
    	let br;
    	let current;
    	let mounted;
    	let dispose;

    	inputcheckbox0 = new InputCheckbox({
    			props: {
    				inputName: "my-asthma",
    				checkboxtext: "Asthma",
    				isRequired: "false"
    			},
    			$$inline: true
    		});

    	inputcheckbox1 = new InputCheckbox({
    			props: {
    				inputName: "my-hypertension",
    				checkboxtext: "Hypertension",
    				isRequired: "false"
    			},
    			$$inline: true
    		});

    	inputcheckbox2 = new InputCheckbox({
    			props: {
    				inputName: "my-diabetes",
    				checkboxtext: "Diabetes",
    				isRequired: "false"
    			},
    			$$inline: true
    		});

    	inputcheckbox3 = new InputCheckbox({
    			props: {
    				inputName: "my-heartdisease",
    				checkboxtext: "Heart Disease",
    				isRequired: "false"
    			},
    			$$inline: true
    		});

    	inputcheckbox4 = new InputCheckbox({
    			props: {
    				inputName: "fam-asthma",
    				checkboxtext: "Asthma",
    				isRequired: "false"
    			},
    			$$inline: true
    		});

    	inputcheckbox5 = new InputCheckbox({
    			props: {
    				inputName: "fam-hypertension",
    				checkboxtext: "Hypertension",
    				isRequired: "false"
    			},
    			$$inline: true
    		});

    	inputcheckbox6 = new InputCheckbox({
    			props: {
    				inputName: "fam-diabetes",
    				checkboxtext: "Diabetes",
    				isRequired: "false"
    			},
    			$$inline: true
    		});

    	inputcheckbox7 = new InputCheckbox({
    			props: {
    				inputName: "fam-heartdisease",
    				checkboxtext: "Heart Disease",
    				isRequired: "false"
    			},
    			$$inline: true
    		});

    	let each_value_1 = /*$medicalAlergies*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*$foodAlergies*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			p0 = element("p");
    			p0.textContent = "Do you have or have currently experienced the following\r\n                underlying conditions?";
    			t1 = space();
    			create_component(inputcheckbox0.$$.fragment);
    			t2 = space();
    			create_component(inputcheckbox1.$$.fragment);
    			t3 = space();
    			create_component(inputcheckbox2.$$.fragment);
    			t4 = space();
    			create_component(inputcheckbox3.$$.fragment);
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "Do you have a family history of any of the following underlying\r\n                conditions?";
    			t7 = space();
    			create_component(inputcheckbox4.$$.fragment);
    			t8 = space();
    			create_component(inputcheckbox5.$$.fragment);
    			t9 = space();
    			create_component(inputcheckbox6.$$.fragment);
    			t10 = space();
    			create_component(inputcheckbox7.$$.fragment);
    			t11 = space();
    			div0 = element("div");
    			p2 = element("p");
    			p2.textContent = "Do you have any medical alergies?";
    			t13 = space();
    			button0 = element("button");
    			t14 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t15 = space();
    			div1 = element("div");
    			p3 = element("p");
    			p3.textContent = "Do you have any alergies?";
    			t17 = space();
    			button1 = element("button");
    			t18 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t19 = space();
    			br = element("br");
    			add_location(p0, file$1, 49, 12, 1745);
    			add_location(p1, file$1, 73, 12, 2546);
    			add_location(p2, file$1, 98, 16, 3388);
    			attr_dev(button0, "class", "add-button");
    			add_location(button0, file$1, 99, 16, 3446);
    			attr_dev(div0, "class", "p-button");
    			add_location(div0, file$1, 97, 12, 3348);
    			add_location(p3, file$1, 106, 16, 3718);
    			attr_dev(button1, "class", "add-button");
    			add_location(button1, file$1, 107, 16, 3768);
    			attr_dev(div1, "class", "p-button");
    			add_location(div1, file$1, 105, 12, 3678);
    			add_location(br, file$1, 113, 12, 3998);
    			attr_dev(div2, "class", "inner-form");
    			attr_dev(div2, "slot", "forms");
    			add_location(div2, file$1, 48, 8, 1694);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, p0);
    			append_dev(div2, t1);
    			mount_component(inputcheckbox0, div2, null);
    			append_dev(div2, t2);
    			mount_component(inputcheckbox1, div2, null);
    			append_dev(div2, t3);
    			mount_component(inputcheckbox2, div2, null);
    			append_dev(div2, t4);
    			mount_component(inputcheckbox3, div2, null);
    			append_dev(div2, t5);
    			append_dev(div2, p1);
    			append_dev(div2, t7);
    			mount_component(inputcheckbox4, div2, null);
    			append_dev(div2, t8);
    			mount_component(inputcheckbox5, div2, null);
    			append_dev(div2, t9);
    			mount_component(inputcheckbox6, div2, null);
    			append_dev(div2, t10);
    			mount_component(inputcheckbox7, div2, null);
    			append_dev(div2, t11);
    			append_dev(div2, div0);
    			append_dev(div0, p2);
    			append_dev(div0, t13);
    			append_dev(div0, button0);
    			append_dev(div2, t14);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div2, null);
    			}

    			append_dev(div2, t15);
    			append_dev(div2, div1);
    			append_dev(div1, p3);
    			append_dev(div1, t17);
    			append_dev(div1, button1);
    			append_dev(div2, t18);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(div2, t19);
    			append_dev(div2, br);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*InputText, $medicalAlergies*/ 1) {
    				each_value_1 = /*$medicalAlergies*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div2, t15);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*InputText, $foodAlergies*/ 2) {
    				each_value = /*$foodAlergies*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div2, t19);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputcheckbox0.$$.fragment, local);
    			transition_in(inputcheckbox1.$$.fragment, local);
    			transition_in(inputcheckbox2.$$.fragment, local);
    			transition_in(inputcheckbox3.$$.fragment, local);
    			transition_in(inputcheckbox4.$$.fragment, local);
    			transition_in(inputcheckbox5.$$.fragment, local);
    			transition_in(inputcheckbox6.$$.fragment, local);
    			transition_in(inputcheckbox7.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputcheckbox0.$$.fragment, local);
    			transition_out(inputcheckbox1.$$.fragment, local);
    			transition_out(inputcheckbox2.$$.fragment, local);
    			transition_out(inputcheckbox3.$$.fragment, local);
    			transition_out(inputcheckbox4.$$.fragment, local);
    			transition_out(inputcheckbox5.$$.fragment, local);
    			transition_out(inputcheckbox6.$$.fragment, local);
    			transition_out(inputcheckbox7.$$.fragment, local);
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(inputcheckbox0);
    			destroy_component(inputcheckbox1);
    			destroy_component(inputcheckbox2);
    			destroy_component(inputcheckbox3);
    			destroy_component(inputcheckbox4);
    			destroy_component(inputcheckbox5);
    			destroy_component(inputcheckbox6);
    			destroy_component(inputcheckbox7);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_forms_slot.name,
    		type: "slot",
    		source: "(49:8) ",
    		ctx
    	});

    	return block;
    }

    // (46:0) <Router url="health-history" basepath="health-history">
    function create_default_slot$1(ctx) {
    	let formcontainer;
    	let current;

    	formcontainer = new FormContainer({
    			props: {
    				$$slots: {
    					forms: [create_forms_slot],
    					heading: [create_heading_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formcontainer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formcontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formcontainer_changes = {};

    			if (dirty & /*$$scope, $foodAlergies, $medicalAlergies*/ 8195) {
    				formcontainer_changes.$$scope = { dirty, ctx };
    			}

    			formcontainer.$set(formcontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formcontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formcontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formcontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(46:0) <Router url=\\\"health-history\\\" basepath=\\\"health-history\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: "health-history",
    				basepath: "health-history",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, $foodAlergies, $medicalAlergies*/ 8195) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
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
    	let $medicalAlergies;
    	let $foodAlergies;
    	validate_store(medicalAlergies, 'medicalAlergies');
    	component_subscribe($$self, medicalAlergies, $$value => $$invalidate(0, $medicalAlergies = $$value));
    	validate_store(foodAlergies, 'foodAlergies');
    	component_subscribe($$self, foodAlergies, $$value => $$invalidate(1, $foodAlergies = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PageHealthHistory', slots, []);
    	let { isFormReady = false } = $$props;
    	let foodCount = 0;
    	let medCount = 0;

    	const addAlergie = alergy => {
    		switch (alergy) {
    			case "food":
    				foodCount += 1;
    				foodAlergies.update(n => n.concat([
    					{
    						inputName: "alergies-" + foodCount,
    						inputPlaceholder: "Any Food Alergies?",
    						isRequired: "true"
    					}
    				]));
    				//console.log(get(foodAlergies));
    				break;
    			case "med":
    				medCount += 1;
    				medicalAlergies.update(n => n.concat([
    					{
    						inputName: "med-alergies-" + medCount,
    						inputPlaceholder: "Any Medical Alergies?",
    						isRequired: "true"
    					}
    				]));
    				//console.log(get(medicalAlergies));
    				break;
    		}
    	};

    	const writable_props = ['isFormReady'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PageHealthHistory> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => addAlergie("med");
    	const click_handler_1 = () => addAlergie("food");

    	$$self.$$set = $$props => {
    		if ('isFormReady' in $$props) $$invalidate(3, isFormReady = $$props.isFormReady);
    	};

    	$$self.$capture_state = () => ({
    		Router,
    		FormContainer,
    		InputCheckbox,
    		InputText,
    		get: get_store_value,
    		foodAlergies,
    		medicalAlergies,
    		onMount,
    		isFormReady,
    		foodCount,
    		medCount,
    		addAlergie,
    		$medicalAlergies,
    		$foodAlergies
    	});

    	$$self.$inject_state = $$props => {
    		if ('isFormReady' in $$props) $$invalidate(3, isFormReady = $$props.isFormReady);
    		if ('foodCount' in $$props) foodCount = $$props.foodCount;
    		if ('medCount' in $$props) medCount = $$props.medCount;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		$medicalAlergies,
    		$foodAlergies,
    		addAlergie,
    		isFormReady,
    		click_handler,
    		click_handler_1
    	];
    }

    class PageHealthHistory extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { isFormReady: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PageHealthHistory",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get isFormReady() {
    		throw new Error("<PageHealthHistory>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFormReady(value) {
    		throw new Error("<PageHealthHistory>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.44.3 */
    const file = "src\\App.svelte";

    // (33:2) <Link to="/">
    function create_default_slot_11(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(33:2) <Link to=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (34:2) <Link to="mortgages">
    function create_default_slot_10(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Mortgages");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(34:2) <Link to=\\\"mortgages\\\">",
    		ctx
    	});

    	return block;
    }

    // (35:2) <Link to="diet">
    function create_default_slot_9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Diet Plan");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(35:2) <Link to=\\\"diet\\\">",
    		ctx
    	});

    	return block;
    }

    // (36:2) <Link to="basic-information">
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Basic Information");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(36:2) <Link to=\\\"basic-information\\\">",
    		ctx
    	});

    	return block;
    }

    // (37:2) <Link to="anthro-measurements">
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Anthro");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(37:2) <Link to=\\\"anthro-measurements\\\">",
    		ctx
    	});

    	return block;
    }

    // (38:2) <Link to="health-history">
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("health-history");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(38:2) <Link to=\\\"health-history\\\">",
    		ctx
    	});

    	return block;
    }

    // (41:2) <Route path="diet/*">
    function create_default_slot_5(ctx) {
    	let healthform;
    	let current;

    	healthform = new HealthForm({
    			props: { isFormReady: /*isFormReady*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(healthform.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(healthform, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const healthform_changes = {};
    			if (dirty & /*isFormReady*/ 1) healthform_changes.isFormReady = /*isFormReady*/ ctx[0];
    			healthform.$set(healthform_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(healthform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(healthform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(healthform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(41:2) <Route path=\\\"diet/*\\\">",
    		ctx
    	});

    	return block;
    }

    // (44:2) <Route path="mortgages">
    function create_default_slot_4(ctx) {
    	let mortgageform;
    	let current;

    	mortgageform = new MortgageForm({
    			props: { isFormReady: /*isFormReady*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mortgageform.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mortgageform, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const mortgageform_changes = {};
    			if (dirty & /*isFormReady*/ 1) mortgageform_changes.isFormReady = /*isFormReady*/ ctx[0];
    			mortgageform.$set(mortgageform_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mortgageform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mortgageform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mortgageform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(44:2) <Route path=\\\"mortgages\\\">",
    		ctx
    	});

    	return block;
    }

    // (47:2) <Route path="/basic-information">
    function create_default_slot_3(ctx) {
    	let pagebasicinformation;
    	let current;

    	pagebasicinformation = new PageBasicInformation({
    			props: { isFormReady: /*isFormReady*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pagebasicinformation.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pagebasicinformation, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pagebasicinformation_changes = {};
    			if (dirty & /*isFormReady*/ 1) pagebasicinformation_changes.isFormReady = /*isFormReady*/ ctx[0];
    			pagebasicinformation.$set(pagebasicinformation_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagebasicinformation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pagebasicinformation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pagebasicinformation, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(47:2) <Route path=\\\"/basic-information\\\">",
    		ctx
    	});

    	return block;
    }

    // (50:2) <Route path="/anthro-measurements">
    function create_default_slot_2(ctx) {
    	let pageanthropometricmeasurments;
    	let current;

    	pageanthropometricmeasurments = new PageAnthropometricMeasurments({
    			props: { isFormReady: /*isFormReady*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pageanthropometricmeasurments.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pageanthropometricmeasurments, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pageanthropometricmeasurments_changes = {};
    			if (dirty & /*isFormReady*/ 1) pageanthropometricmeasurments_changes.isFormReady = /*isFormReady*/ ctx[0];
    			pageanthropometricmeasurments.$set(pageanthropometricmeasurments_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pageanthropometricmeasurments.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pageanthropometricmeasurments.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pageanthropometricmeasurments, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(50:2) <Route path=\\\"/anthro-measurements\\\">",
    		ctx
    	});

    	return block;
    }

    // (53:2) <Route path="/health-history">
    function create_default_slot_1(ctx) {
    	let pagehealthhistory;
    	let current;

    	pagehealthhistory = new PageHealthHistory({
    			props: { isFormReady: /*isFormReady*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pagehealthhistory.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pagehealthhistory, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pagehealthhistory_changes = {};
    			if (dirty & /*isFormReady*/ 1) pagehealthhistory_changes.isFormReady = /*isFormReady*/ ctx[0];
    			pagehealthhistory.$set(pagehealthhistory_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagehealthhistory.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pagehealthhistory.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pagehealthhistory, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(53:2) <Route path=\\\"/health-history\\\">",
    		ctx
    	});

    	return block;
    }

    // (31:0) <Router basepath={url}>
    function create_default_slot(ctx) {
    	let nav;
    	let link0;
    	let t0;
    	let link1;
    	let t1;
    	let link2;
    	let t2;
    	let link3;
    	let t3;
    	let link4;
    	let t4;
    	let link5;
    	let t5;
    	let main;
    	let route0;
    	let t6;
    	let route1;
    	let t7;
    	let route2;
    	let t8;
    	let route3;
    	let t9;
    	let route4;
    	let current;

    	link0 = new Link({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				to: "mortgages",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link({
    			props: {
    				to: "diet",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link({
    			props: {
    				to: "basic-information",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4 = new Link({
    			props: {
    				to: "anthro-measurements",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link5 = new Link({
    			props: {
    				to: "health-history",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route0 = new Route({
    			props: {
    				path: "diet/*",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "mortgages",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "/basic-information",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route({
    			props: {
    				path: "/anthro-measurements",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route({
    			props: {
    				path: "/health-history",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			create_component(link1.$$.fragment);
    			t1 = space();
    			create_component(link2.$$.fragment);
    			t2 = space();
    			create_component(link3.$$.fragment);
    			t3 = space();
    			create_component(link4.$$.fragment);
    			t4 = space();
    			create_component(link5.$$.fragment);
    			t5 = space();
    			main = element("main");
    			create_component(route0.$$.fragment);
    			t6 = space();
    			create_component(route1.$$.fragment);
    			t7 = space();
    			create_component(route2.$$.fragment);
    			t8 = space();
    			create_component(route3.$$.fragment);
    			t9 = space();
    			create_component(route4.$$.fragment);
    			add_location(nav, file, 31, 1, 968);
    			attr_dev(main, "class", "svelte-1wlpxaj");
    			add_location(main, file, 39, 1, 1238);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			mount_component(link0, nav, null);
    			append_dev(nav, t0);
    			mount_component(link1, nav, null);
    			append_dev(nav, t1);
    			mount_component(link2, nav, null);
    			append_dev(nav, t2);
    			mount_component(link3, nav, null);
    			append_dev(nav, t3);
    			mount_component(link4, nav, null);
    			append_dev(nav, t4);
    			mount_component(link5, nav, null);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(route0, main, null);
    			append_dev(main, t6);
    			mount_component(route1, main, null);
    			append_dev(main, t7);
    			mount_component(route2, main, null);
    			append_dev(main, t8);
    			mount_component(route3, main, null);
    			append_dev(main, t9);
    			mount_component(route4, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);
    			const link4_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link4_changes.$$scope = { dirty, ctx };
    			}

    			link4.$set(link4_changes);
    			const link5_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link5_changes.$$scope = { dirty, ctx };
    			}

    			link5.$set(link5_changes);
    			const route0_changes = {};

    			if (dirty & /*$$scope, isFormReady*/ 5) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope, isFormReady*/ 5) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope, isFormReady*/ 5) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope, isFormReady*/ 5) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope, isFormReady*/ 5) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(link4.$$.fragment, local);
    			transition_in(link5.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(link4.$$.fragment, local);
    			transition_out(link5.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(link3);
    			destroy_component(link4);
    			destroy_component(link5);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(main);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(route4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(31:0) <Router basepath={url}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				basepath: /*url*/ ctx[1],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, isFormReady*/ 5) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
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
    	validate_slots('App', slots, []);
    	let isFormReady = false;
    	let url = "/";

    	onMount(() => {
    		accumulator.subscribe(value => {
    			//console.log(get(accumulator));
    			$$invalidate(0, isFormReady = !get_store_value(accumulator).find(v => v.ready === false || undefined) && get_store_value(accumulator).length > 0
    			? true
    			: false);
    		});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		Link,
    		MortgageForm,
    		HealthForm,
    		PageBasicInformation,
    		accumulator,
    		get: get_store_value,
    		onMount,
    		PageAnthropometricMeasurments,
    		PageHealthHistory,
    		isFormReady,
    		url
    	});

    	$$self.$inject_state = $$props => {
    		if ('isFormReady' in $$props) $$invalidate(0, isFormReady = $$props.isFormReady);
    		if ('url' in $$props) $$invalidate(1, url = $$props.url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(0, isFormReady = !get_store_value(accumulator).find(v => v.ready === false || undefined) && get_store_value(accumulator).length > 0
    	? true
    	: false);

    	return [isFormReady, url];
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
