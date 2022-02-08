<script>
    import { get } from "svelte/store";
    export let bgColor = "#DEA33C";
</script>

<div class="form-container" style="background-image: linear-gradient(180deg, {bgColor},22%, transparent);">
    <slot name="extra" />
    <div class="head">
        <slot name="heading" />
        <slot name="paragraph" />
    </div>
    <slot name="forms" />
    <slot name="steps" />
</div>

<style>
</style>
