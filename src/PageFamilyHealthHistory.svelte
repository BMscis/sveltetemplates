<script>
    import { Router } from "svelte-routing";
    import { setNavigateTo,setPageName } from "./functions/setNavigateTo";
    import InputCheckbox from "./InputCheckbox.svelte";
    import InputText from "./InputText.svelte";
    import {
        famFoodAlergies,
        famMedicalAlergies,
        navigatorCount,
    } from "./functions/formAccumulator";
    import {setDimensions} from "./dimensions/svgSettings"
    import { afterUpdate, onMount } from "svelte";
    import FormViewer from "./FormViewer.svelte";
    export let isFormReady = false;
    let svgHeight1
    onMount(() => {
        document.body.scrollIntoView();
        isFormReady = true;
        setPageName("Family Health")
        return setNavigateTo("/family-allergies", true);
    });
</script>

<div class="MainContainer">
    <Router url="family-health-history" basepath="family-health-history">
        <FormViewer
            header="Family Health History"
            onboardingText="Anyone in your family have any of these ?"
            avatar="allergy"
        >
            <div id="content" slot="slot1">
                <InputCheckbox
                    inputName="fam-asthma"
                    checkboxtext="Asthma"
                    isRequired="false"
                />
                <InputCheckbox
                    inputName="fam-hypertension"
                    checkboxtext="Hypertension"
                    isRequired="false"
                />
                <InputCheckbox
                    inputName="fam-diabetes"
                    checkboxtext="Diabetes"
                    isRequired="false"
                />
                <InputCheckbox
                    inputName="fam-heartdisease"
                    checkboxtext="Heart Disease"
                    isRequired="false"
                />
            </div>
        </FormViewer>
    </Router>
</div>
