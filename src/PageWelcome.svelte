<script>
	import { navigate, Router } from "svelte-routing";
    let isFormReady = false
    </script>
<Router basepath="/page-welcome" url="/page-welcome">
<h4>Welcome to the diet plan setup.</h4>
<h5>Click next to continue.</h5>
<button
    on:click={() => {
        navigate("/basic-information", { replace: true });
    }}
    class="navbutton">next</button>
</Router>