<script>
    import { Router } from "svelte-routing";
    import InputCheckbox from "./InputCheckbox.svelte";
    import InputText from "./InputText.svelte";
    import { setNavigateTo } from "./functions/setNavigateTo";
    import {
        myFoodAlergies,
        myMedicalAlergies,
        navigatorCount,
    } from "./functions/formAccumulator";
    import {setDimensions} from "./dimensions/svgSettings"
    import { afterUpdate, onMount } from "svelte";
    import FormViewer from "./FormViewer.svelte";
    export let isFormReady = false;

    onMount(() => {
        document.body.scrollIntoView();
        isFormReady = true;
        navigatorCount.update((n) => n + 1);
        return setNavigateTo("/personal-allergies", true);
    });
</script>

<div class="MainContainer">
    <Router url="personal-health-history" basepath="personal-health-history">
        <FormViewer
            header="Personal Health History"
            onboardingText="Does you suffer from any of these?"
            avatar="allergy"
        >
            <div id="content" slot="slot1">
                <InputCheckbox
                    inputName="my-asthma"
                    checkboxtext="Asthma"
                    isRequired="false"
                />
                <InputCheckbox
                    inputName="my-hypertension"
                    checkboxtext="Hypertension"
                    isRequired="false"
                />
                <InputCheckbox
                    inputName="my-diabetes"
                    checkboxtext="Diabetes"
                    isRequired="false"
                />
                <InputCheckbox
                    inputName="my-heartdisease"
                    checkboxtext="Heart Disease"
                    isRequired="false"
                />
            </div>
        </FormViewer>
    </Router>
</div>
