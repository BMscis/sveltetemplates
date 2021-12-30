<script>
    export let popupHeading = "";
    export let popupText = "";
    export let visibility = false;
    export let isExtra = false;
    export let isSide = false;
</script>

<dialog class="tooltip" class:visible={visibility === "true" || visibility === true} class:side={isSide === "true"} class:extra={isExtra === "true"}>
    <h3>{popupHeading}</h3>
    <hr />
    <dialog class="top">{popupText}</dialog>
    <slot name="user-button" />
</dialog>
