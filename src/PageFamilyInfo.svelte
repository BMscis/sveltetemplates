<script>
    import { Router } from "svelte-routing";
    import { setNavigateTo } from "./functions/setNavigateTo";
    import InputCheckbox from "./InputCheckbox.svelte";
    import { onMount } from "svelte";
    import FormViewer from "./FormViewer.svelte";
    import { navigatorCount } from "./functions/formAccumulator";
    export let isFormReady = false;
    const bgColor = "#a300f5";

    onMount(() => {
        document.body.scrollIntoView();
        isFormReady = false;
        navigatorCount.update((n) => n + 1);
        return setNavigateTo("/anthro-measurements", true);
    });
</script>

<div class="Mycontainer">
    <Router basepath="/family-information" url="/family-information">
        <FormViewer
            header="Family Information"
            onboardingText="We also need to get some basic information about your family."
        >
            <div id="content" slot="slot1">
                <InputCheckbox
                    checkboxtext="Are you Married?"
                    isRequired="false"
                    inputName="married"
                />

                <InputCheckbox
                    checkboxtext="Do you have children?"
                    isRequired="false"
                    inputName="children"
                />
                <InputCheckbox
                    checkboxtext="Are you employed?"
                    isRequired="false"
                    inputName="employed"
                />
            </div>
        </FormViewer>
    </Router>
</div>
<style>
	.Mycontainer{
        top:203px;
        height: calc(100% - 203px);
    }
</style>
