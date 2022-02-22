<script>
    export let popupText = "";
    export let visibility = false;
    export let isExtra = false;
</script>
<dialog class="top" class:visible={visibility === "true" || visibility === true}  class:extra={isExtra === "true"}>{popupText}</dialog>
