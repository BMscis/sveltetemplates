<script>
import { Router } from "svelte-routing";
import FormViewer from "./FormViewer.svelte";
export let basepath=""
export let header
export let onBoardingText
export let avatar
</script>
<div class="Maincontainer">
    <Router >
        <FormViewer
            {header}
            {onBoardingText}
            {avatar}
        ></FormViewer>
    </Router>
</div>
<style></style>