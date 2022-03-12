<script>
    export let popupText = "";
    export let visibility = false;
    export let isExtra = false;
</script>
<small class="input-dialog" class:visible={visibility === "true" || visibility === true}  class:extra={isExtra === "true"}>{popupText}</small>
