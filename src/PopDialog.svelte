<script>
    export let popupText = "";
    export let visibility = false;
    export let isExtra = false;
    export let isSide = false;
</script>
<dialog class="top" class:visible={visibility === "true" || visibility === true} class:side={isSide === "true"} class:extra={isExtra === "true"}>{popupText}</dialog>
