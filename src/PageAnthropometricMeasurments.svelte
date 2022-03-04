<script>
    import { accumulator, navigatorCount } from "./functions/formAccumulator";
    import { setNavigateTo,setPageName } from "./functions/setNavigateTo";
    import InputNumber from "./InputNumber.svelte";
    import PopDialog from "./PopDialog.svelte";
    import InputText from "./InputText.svelte";
    import { Router } from "svelte-routing";
    import { get } from "svelte/store";
    import { afterUpdate, onMount } from "svelte";
    import FormViewer from "./FormViewer.svelte";
    export let isFormReady = false;
    let bmi = 0;
    let helpDialog1 = false;
    let helpDialog2 = false;
    const bgColor = "#a3f501";
    onMount(() => {
        document.body.scrollIntoView();
        setPageName("BMI")
    });
    afterUpdate(() => {
        //console.log(isFormReady)
        if (isFormReady) {
            setNavigateTo("/personal-health-history");
        } else {
            return;
        }
    });
</script>

<div class="MainContainer">
    <Router url="/anthro-measurements" basepath="/anthro-measurements">
        <FormViewer
            header="Body Mass"
            onboardingText="This info is private and wil help alot."
            avatar="weights"
        >
            <div id="content" slot="slot1">
                <InputText
                    inputName="atr-height"
                    helpText="Please enter your height in feet and inches"
                    inputPlaceholder="Height"
                    isRequired="true"
                    textType="height"
                    sign="ft"
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
                    >
                    <svg id="icon_action_settings_24px" data-name="icon/action/settings_24px" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <rect id="Boundary" width="24" height="24" fill="none"/>
                        <path id="_Color" data-name=" ↳Color" d="M10.851,19h-3.7a.474.474,0,0,1-.463-.4l-.347-2.518a6.712,6.712,0,0,1-1.562-.926l-2.3.95a.494.494,0,0,1-.16.027.455.455,0,0,1-.407-.24L.055,12.6a.5.5,0,0,1,.116-.606l1.955-1.568A6.172,6.172,0,0,1,2.057,9.5a6.06,6.06,0,0,1,.081-.926L.182,7.007A.468.468,0,0,1,.067,6.4l1.851-3.29a.459.459,0,0,1,.4-.245.444.444,0,0,1,.165.032l2.3.95A6.934,6.934,0,0,1,6.35,2.921L6.7.4A.454.454,0,0,1,7.148,0h3.7a.467.467,0,0,1,.463.4l.347,2.518a6.745,6.745,0,0,1,1.562.926l2.3-.95a.494.494,0,0,1,.16-.027.455.455,0,0,1,.407.24L17.945,6.4a.5.5,0,0,1-.116.606L15.873,8.574a6.069,6.069,0,0,1,.069.926,7.949,7.949,0,0,1-.058.926l1.933,1.568a.468.468,0,0,1,.115.606l-1.851,3.289a.459.459,0,0,1-.4.245.444.444,0,0,1-.165-.032l-2.3-.95a6.869,6.869,0,0,1-1.562.926L11.3,18.6A.443.443,0,0,1,10.851,19ZM9,5.938a3.564,3.564,0,0,0,0,7.125A3.564,3.564,0,0,0,9,5.938Z" transform="translate(3 2.5)"/>
                      </svg>
                      
                    </button>
                </InputText>

                <InputNumber
                    inputName="atr-weight"
                    inputPlaceholder="Weight"
                    isRequired="true"
                    sign="kg"
                    levelRange="50"
                    numberType="weight"
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
                    >
                    <svg id="icon_action_settings_24px" data-name="icon/action/settings_24px" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <rect id="Boundary" width="24" height="24" fill="none"/>
                        <path id="_Color" data-name=" ↳Color" d="M10.851,19h-3.7a.474.474,0,0,1-.463-.4l-.347-2.518a6.712,6.712,0,0,1-1.562-.926l-2.3.95a.494.494,0,0,1-.16.027.455.455,0,0,1-.407-.24L.055,12.6a.5.5,0,0,1,.116-.606l1.955-1.568A6.172,6.172,0,0,1,2.057,9.5a6.06,6.06,0,0,1,.081-.926L.182,7.007A.468.468,0,0,1,.067,6.4l1.851-3.29a.459.459,0,0,1,.4-.245.444.444,0,0,1,.165.032l2.3.95A6.934,6.934,0,0,1,6.35,2.921L6.7.4A.454.454,0,0,1,7.148,0h3.7a.467.467,0,0,1,.463.4l.347,2.518a6.745,6.745,0,0,1,1.562.926l2.3-.95a.494.494,0,0,1,.16-.027.455.455,0,0,1,.407.24L17.945,6.4a.5.5,0,0,1-.116.606L15.873,8.574a6.069,6.069,0,0,1,.069.926,7.949,7.949,0,0,1-.058.926l1.933,1.568a.468.468,0,0,1,.115.606l-1.851,3.289a.459.459,0,0,1-.4.245.444.444,0,0,1-.165-.032l-2.3-.95a6.869,6.869,0,0,1-1.562.926L11.3,18.6A.443.443,0,0,1,10.851,19ZM9,5.938a3.564,3.564,0,0,0,0,7.125A3.564,3.564,0,0,0,9,5.938Z" transform="translate(3 2.5)"/>
                      </svg>
                      
                    </button>
                </InputNumber>

                <!-- <h3>Your Body Mass Index is : {bmi}</h3> -->
                    <InputNumber
                        inputName="bmi"
                        inputPlaceholder="bmi"
                        isRequired="false"
                        sign="bmi"
                        levelRange="-1"
                        inputValue={bmi}
                        disabled
                    />
            </div>
        </FormViewer>
    </Router>
</div>

<style>
</style>
