<script>
    import { Router } from "svelte-routing";
    import InputText from "./InputText.svelte";
    import DateComponent from "./DateComponent.svelte";
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

<div class="Mycontainer">
    <Router basepath="/basic-information" url="/basic-information">
        <FormViewer
            header="Basic Information"
            onboardingText="Lets create a profile for you."
        >
            <div id="content" slot="slot1">
                <InputText
                    inputPlaceholder="what is your name? "
                    helpTextHeading="Client Name."
                    isRequired="true"
                    helpText="Please enter your first name."
                    inputName="user-name"
                    outlineColor="#bb974a"
                    sign= "👤"
                    emoji="👏"
                />
                <InputText
                    inputPlaceholder="what is your email? "
                    helpTextHeading="Client Email."
                    inputName="user-email"
                    isRequired="true"
                    emoji="👏"
                    textType="email"
                    outlineColor="#ce9535"
                    sign="📧"
                />
                <DateComponent />
            </div>
        </FormViewer>
    </Router>
</div>
<style>

</style>