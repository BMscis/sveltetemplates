<script>
    import { Router } from "svelte-routing";
    import InputText from "./InputText.svelte";
    import FormViewer from "./FormViewer.svelte";
    import { onMount } from "svelte";
    import { setNavigateTo } from "./functions/setNavigateTo";
    import { navigatorCount } from "./functions/formAccumulator";
    export let isFormReady;
    const bgColor = "#21aaf5";
    onMount(() => {
        document.body.scrollIntoView();
        navigatorCount.update((n) => n + 1);
    });
    $: if (isFormReady) {
        setNavigateTo("/family-information");
    }
</script>

<div class="MainContainer">
    <Router basepath="/basic-information" url="/basic-information">
        <FormViewer
            header="Basic Information"
            onboardingText="Lets create a profile for you."
            avatar="basic"
        >
            <div id="content" slot="slot1">
                <InputText
                    inputPlaceholder="Name"
                    helpTextHeading="Client Name."
                    isRequired="true"
                    helpText="Please enter your first name."
                    inputName="user-name"
                    outlineColor="#bb974a"
                    sign="👤"
                    emoji="👏"
                />
                <InputText
                    inputPlaceholder="Email"
                    helpTextHeading="Client Email."
                    inputName="user-email"
                    isRequired="true"
                    emoji="👏"
                    textType="email"
                    outlineColor="#ce9535"
                    sign="📧"
                />
                <InputText
                    inputPlaceholder="Birthday"
                    helpTextHeading="Birthday."
                    inputName="dob"
                    inputType="date"
                    isRequired="true"
                    emoji="👏"
                    textType="date"
                    outlineColor="#ce9535"
                    sign="📅"
                    pattern="dd-mm-yyyy"
                />
            </div>
        </FormViewer>
    </Router>
</div>

<style>
</style>
