<script>
    export let popover = false
    export let disabled = false
</script>
<div class="input-container" class:pop={popover} disabled={disabled}>
    <slot name="outline-symbol-slot"></slot>
    <slot name="input-slot"></slot>
    <slot name="top-label-slot"></slot>
    <slot name="outline-emoji-slot"></slot>
    <slot name="outline-dialog-slot"></slot>
    <slot name="extra-input-slot"></slot>
    <slot name="outline-help-slot"></slot>
    <slot name="extra-dialog-slot"></slot>
</div>
<style>

</style>