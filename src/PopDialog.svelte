<script>
    export let popupHeading = "";
    export let popupText = "";
    export let visibility = false;
</script>

<dialog class="tooltip" class:visible={visibility}>
    <h3>{popupHeading}</h3>
    <hr />
    <dialog class="top">{popupText}</dialog>
    <slot name="user-button" />
</dialog>
