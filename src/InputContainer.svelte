<script>
    export let popover = false
</script>
<div class="input-container" class:pop={popover}>
    <slot name="backdrop"></slot>
    <slot name="input-slot"></slot>
    <slot name="outline-symbol-slot"></slot>
    <slot name="outline-dialog-slot"></slot>
    <slot name="outline-text-slot"></slot>
    <slot name="extra-input-slot"></slot>
    <slot name="outline-emoji-slot"></slot>
    <slot name="outline-help-slot"></slot>
    <slot name="extra-dialog-slot"></slot>
</div>
<style>

</style>