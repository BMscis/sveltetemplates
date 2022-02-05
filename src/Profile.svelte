<script>
    import { onMount } from "svelte";

    import { Router, navigate } from "svelte-routing";
    import { setProfile } from "./functions/getProfile";
    let userName;
    let bmi;
    let age;
    let email;
    let married;
    let employed;

    const setAge = (() => {
        [userName, age, email, bmi,employed,married] = setProfile();
        
        return true
    })
</script>

<Router basepath="/user-profile" url="/user-profile">
    <div class="profile">
        <h2>Welcome {userName}</h2>
        {#if setAge()}
            <caption>Age: {age}</caption>
        {:else}
            <caption>Age Range: {age}</caption>
        {/if}
        <br />
        <caption>Body Mass Index : {bmi}</caption>
        <br />
        <caption>Email: {email}</caption>
        <br />
    </div>
</Router>
