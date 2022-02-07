<script>
    import { navigate, Router } from "svelte-routing";
    let isFormReady = false;
</script>

<div class="container">
    <Router basepath="/" url="/">
        <h4>Welcome to the diet plan setup.</h4>
        <h5>Click next to continue.</h5>
        <div class="rolling-ball">
            <div class="outer-ring center" />
            <div class="inner-ring center">
                <button
                    on:click={() => {
                        navigate("/basic-information", { replace: false });
                    }}
                    class="navbutton">next</button
                >
            </div>
        </div>
    </Router>
</div>
<style>
    .container{
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        align-items: center;
    }
</style>