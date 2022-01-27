<script>
    import { get } from "svelte/store";

</script>

<div class="form-container">
    <div class="head">
        <slot name="heading" />
        <slot name="paragraph" />
    </div>
    <slot name="forms" />
    <slot name="extra" />
</div>
