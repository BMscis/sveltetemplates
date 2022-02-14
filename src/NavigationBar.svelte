<script>
    import {navigate} from "svelte-routing"
    export let isFormReady
</script>
<div id="Scroll_Group_1_pd">
    <button on:click={() => {navigate("/loading",{replace: false})}} disabled={!isFormReady} id="move-to-next"></button>
</div>