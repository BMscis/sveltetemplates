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
    export let isFormReady = false;
    let bmi = 0;
    let helpDialog1 = false;
    let helpDialog2 = false;
    afterUpdate(() => {
        //console.log(isFormReady)
        getAccumulator();
        if (isFormReady) {
           navigate("/health-history", { replace: true });
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

<Router url="/anthro-measurements" basepath="/anthro-measurements">
    <FormContainer>
        <h1 slot="heading">Anthroprometric Information</h1>
        <h2 slot="paragraph">Let's calculate your body mass index.</h2>
        <div class="inner-form" slot="forms">
            <InputText
                inputName="atr-height"
                helpText="Please enter your height in feet and inches"
                inputPlaceholder="Enter your height"
                isRequired="true"
                textType="height"
                sign="''"
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
            
            <h3>Your Body Mass Index is : {bmi}</h3>
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
            </div>
        </div>
    </FormContainer>
</Router>
