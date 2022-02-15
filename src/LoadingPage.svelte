<script>
    import { afterUpdate, onMount } from "svelte";
    import { Router, navigate } from "svelte-routing";
    import { get } from "svelte/store";
    import { navigateTo } from "./functions/formAccumulator";
    let lokation = "";
    onMount(() => {
        return navigateTo.subscribe((value) => {
            let nav = get(navigateTo);
            lokation = nav.location;
            //console.log("LOADING: ", nav.location);
        });
    });
    afterUpdate(() => {
        setTimeout(() => {
            navigate(lokation, { replace: false });
        }, 1300);
    });
</script>

<Router basepath="loading" url="loading">
    <div class="loader" />
    <div id="loading">Loading</div>
</Router>

<style>
    .loader {
        border-radius: 50%;
        width: 120px;
        height: 120px;
        -webkit-animation: spin 2s linear infinite; /* Safari */
        animation: spin 2s linear infinite;
        margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    }

    /* Safari */
    @-webkit-keyframes spin {
        0% {
            -webkit-transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
        }
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
