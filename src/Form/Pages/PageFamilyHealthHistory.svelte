<script>
    import { Router } from "svelte-routing";
    import { setNavigateTo,setPageName } from "../../functions/setNavigateTo";
    import InputCheckbox from "../Inputs/InputCheckbox.svelte"
    import { onMount } from "svelte";
    import FormViewer from "../../Utilities/FormViewer.svelte";
    export let isFormReady = false;
    let svgHeight1
    onMount(() => {
        document.body.scrollIntoView();
        isFormReady = true;
        setPageName(["Family Health History","Form"],"Anyone in your family have any of these ?","allergy")
        return setNavigateTo("/family-allergies", true);
    });
</script>

<div class="MainContainer">
    <Router url="family-health-history" basepath="family-health-history">
        <FormViewer
            
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
