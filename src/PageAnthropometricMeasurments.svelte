<script>
    import { accumulator } from "./functions/formAccumulator";
    import { bodyMassIndex } from "./functions/validCheck";
    import FormContainer from "./FormContainer.svelte";
    import InputNumber from "./InputNumber.svelte";
    import PopDialog from "./PopDialog.svelte";
    import InputText from "./InputText.svelte";
    import { Router , navigate} from "svelte-routing";
    import { get } from "svelte/store";
    import { afterUpdate,beforeUpdate,onMount } from "svelte";
import FormViewer from "./FormViewer.svelte";
    export let isFormReady = false;
    let bmi = 0;
    let helpDialog1 = false;
    let helpDialog2 = false;
    const bgColor = "#a3f501"
    onMount(()=>{
        document.body.scrollIntoView()
    })
    afterUpdate(() => {
        //console.log(isFormReady)
        getAccumulator();
        if (isFormReady) {
           navigate("/personal-health-history", { replace: false });
        } else {
            return;
        }
    });
    function getAccumulator() {
        let accum = get(accumulator);
        try {
            let height = accum.find((v) => v.component === "atr-height");
            let weight = accum.find((v) => v.component === "atr-weight");
            bmi = bodyMassIndex(height.value, weight.value);
        } catch (error) {
            return;
        }
    }
</script>
<div class="Mycontainer">
<Router url="/anthro-measurements" basepath="/anthro-measurements">
    <FormViewer header="Family Information" onboardingText="Here we are going to calculate your Body Mass Index using your height and weight.">
        <div id="content"   slot="slot1">
            <InputText
                inputName="atr-height"
                helpText="Please enter your height in feet and inches"
                inputPlaceholder="Enter your height"
                isRequired="true"
                textType="height"
                sign="''"
                outlineColor="#e6a702"
            >
                <PopDialog
                    isExtra="true"
                    slot="extra-dialog"
                    popupHeading={"Height"}
                    popupText={"Enter your height in feet and inches."}
                    visibility={helpDialog1}
                />
                <button
                    on:click={() => {
                        helpDialog1 = !helpDialog1;
                    }}
                    slot="container-help-slot"
                    class="outline-help-slot helper-button"
                />
            </InputText>
            
            <InputNumber
                inputName="atr-weight"
                inputPlaceholder="Weight"
                isRequired="true"
                sign="kg"
                levelRange = 50
                outlineColor="#eba302"
            >
                <PopDialog
                    isExtra="true"
                    slot="extra-dialog"
                    popupHeading={"Height"}
                    popupText={"This is your weight in kg's"}
                    visibility={helpDialog2}
                />
                <button
                    on:click={() => {
                        helpDialog2 = !helpDialog2;
                    }}
                    slot="container-help-slot"
                    class="outline-help-slot helper-button"
                />
            </InputNumber>
            
            <!-- <h3>Your Body Mass Index is : {bmi}</h3>
            <div class="nextQuest" disabled=true>
                <InputNumber
                inputName="bmi"
                inputPlaceholder="bmi"
                isRequired="true"
                sign="bmi"
                levelRange = -1
                inputValue = {bmi}
            >
            </InputNumber>
            </div> -->
        </div>
    </FormViewer>
</Router>
</div>
<div  class="steps">
    <h1>STEP 0<span style="color: {bgColor};">3</span></h1>
    <p>Lets do some calculations.</p>
</div>
<style>
        .container{
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        align-items: flex-start;
    }
</style>
