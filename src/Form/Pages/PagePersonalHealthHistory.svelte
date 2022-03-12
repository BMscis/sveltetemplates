<script>
    import { Router } from "svelte-routing";
    import InputCheckbox from "../Inputs/InputCheckbox.svelte";
    import { setNavigateTo,setPageName } from "../../functions/setNavigateTo";
    import {onMount } from "svelte";
    import FormViewer from "../../Utilities/FormViewer.svelte";
    export let isFormReady = false;

    onMount(() => {
        document.body.scrollIntoView();
        isFormReady = true;
        setPageName(["Personal Health History","Form"],"Does you suffer from any of these?","allergy")
        return setNavigateTo("/personal-allergies", true);
    });
</script>

<div class="MainContainer">
    <Router url="personal-health-history" basepath="personal-health-history">
        <FormViewer
            
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
