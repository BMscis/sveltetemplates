<script>
    import { get } from "svelte/store";
    export let bgColor = "#DEA33C"
</script>

<div class="form-container" style="background: {bgColor};">
    <div class="head">
        <slot name="heading" />
        <slot name="paragraph" />
    </div>
    <slot name="forms" />
    <slot name="extra" />
</div>
<style>
</style>