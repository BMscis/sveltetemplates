<script>
    import InputNumber from "./InputNumber.svelte";
    import PopDialog from "./PopDialog.svelte";
    import { Route, Router } from "svelte-routing";
    import FormContainer from "./FormContainer.svelte";
import InputText from "./InputText.svelte";
    let bmi = 0;
    let helpDialog1 = false;
    let helpDialog2 = false;
    </script>

<Router url="/anthro-measurements" basepath="/anthro-measurements">
    <FormContainer>
        <h1 slot="heading">Anthroprometric Information</h1>
        <p slot="paragraph">
            Let's calculate your body mass index.
        </p>
        <div class="inner-form" slot="forms">
            <InputText
            inputName = "text-height"
            helpText="Please enter your height in feet and inches"
            inputPlaceholder="Enter your height"
            isRequired=true
            textType="height"

            ></InputText>
            <InputNumber
            inputName="height"
            inputPlaceholder="Height"
            isRequired="true"
            hasHelp="true"
            sign="feet"
        >
            <PopDialog
                isExtra="true"
                slot="extra-dialog"
                popupHeading={"Height"}
                popupText={"This is your height in feet"}
                visibility={helpDialog1}
            />
            <button
                on:click={() => {
                    helpDialog1 = !helpDialog1;
                }}
                slot="container-help-slot"
                class="outline-help-slot helper-button"></button
            >
        </InputNumber>
        <br />
        <InputNumber
            inputName="weight"
            inputPlaceholder="Weight"
            isRequired="true"
            hasHelp="true"
            sign="kg"
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
                class="outline-help-slot helper-button"></button
            >
        </InputNumber>
        <br />
        <p>Body Mass Index: {bmi}</p>
    </div>
    </FormContainer>
</Router>
