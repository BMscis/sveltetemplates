<script>
    import { Router, Route, Link } from "svelte-routing";
    import InputNumber from "./InputNumber.svelte";
    import FormContainer from "./FormContainer.svelte";
    import FormSlot from "./FormSlot.svelte";
    import InputRange from "./InputRange.svelte";
    import InputCheckbox from "./InputCheckbox.svelte";
    import InputText from "./InputText.svelte";
    import PopDialog from "./PopDialog.svelte";
    import euro from "../docs/assets/eurosign.svg";
    import { accumulator } from "./functions/formAccumulator";
    import { afterUpdate, onMount } from "svelte";
    import { get } from "svelte/store";
    import { navigate } from "svelte-routing";
    export let isFormReady = false;
    let helpDialog = false;
    let page = 0;
    onMount(() => {
        isFormReady = false;
    });
    afterUpdate(() => {
        if (isFormReady) {
            //console.log("THIS IS DONE: ", isFormReady);
            navigate(`diet/`, { replace: false });
        }
    });
</script>

<Router basepath="/mortgages" url="/mortgages">
    <FormContainer>
        <h2 slot="heading">Mortgage Accesibility</h2>
        <p slot="paragraph">
            Get to know the type of mortgages that you can access.
        </p>
        <div class="inner-form" class:next={isFormReady} slot="forms">
            <InputText
                inputName="user-name"
                inputPlaceholder="Enter First Name"
                isRequired="true"
                emoji="👏"
                slot="slot1"
            />
            <br />
            <InputNumber
                slot="slot2"
                inputPlaceholder="Monthly Income"
                inputName="totalmonthlyincome"
                isRequired="true"
                levelRange="900"
                sign={euro}
                emoji="👍"
                hasHelp="true"
            >
                <PopDialog
                    isExtra="true"
                    slot="extra-dialog"
                    popupHeading={"Down Payment"}
                    popupText={"This is the Monthly Income slot"}
                    visibility={helpDialog}
                />
                <button
                    on:click={() => {
                        helpDialog = !helpDialog;
                    }}
                    slot="container-help-slot"
                    class="outline-help-slot helper-button"></button
                >
            </InputNumber>
            <br>
            <InputNumber
                slot="slot3"
                inputPlaceholder="Down Payment"
                inputName="downpayment"
                isRequired="true"
                levelRange="900"
                sign={euro}
                emoji="👍"
            />
            <br>
            <InputCheckbox
                slot="slot4"
                inputName="coapplicant"
                checkboxtext="Applying with a co-applicant?"
                extracheckboxtext=""
                isRequired="true"
            />
            <br>
            <InputCheckbox
                slot="slot5"
                isRequired="true"
                inputName="dependants"
                checkboxtext="More than one dependant in the family?"
                extracheckboxtext="How Many Dependants"
                extracheckbox="true"
            />
            <br>
            <InputRange
                rangeText="Enter Loan Amount"
                inputName="loanamount"
                rangeType="number"
                isRequired="true"
                inputValue=1
                inputMax="25"
                inputMin="0"
                slot="slot6"
                sign={euro}
            />
            <br>
            <InputRange
                slot="slot7"
                inputValue= 0
                inputMin="1"
                inputMax="40"
                inputName="loanduration"
                rangeText="Choose loan term"
                isTimeBound="true"
                isRequired="true"
                rangeType="time"
            />
        </div>
    </FormContainer>
</Router>
