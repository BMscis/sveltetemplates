<script>
    import {
        emailValidator,
        nameValidator,
        heightValidator,
    } from "./functions/validators.js";
    import { createFieldValidator } from "./functions/validation.js";
    import { validityCheck } from "./functions/validCheck";
    import { onMount } from "svelte";
    import InputContainer from "./InputContainer.svelte";
    import PopDialog from "./PopDialog.svelte";
    import { mountComponent,typeOfInput } from "./functions/mountComponent";
    export let inputPlaceholder = "";
    export let helpTextHeading = "";
    export let isRequired = false;
    export let textType = "name";
    export let inputValue = "";
    export let inputName = "";
    export let helpText = "";
    export let emoji = "";
    export let sign = "";
    export let outlineColor = "";
    let validity;
    let validate;
    const placeHolder = inputPlaceholder;
    const backSlash = "'";
    onMount(() => {
        if(mountComponent(inputName)){
            typeOfInput(inputValue,mountComponent(inputName)) ? 
            inputValue = typeOfInput(inputValue,mountComponent(inputName)) : (() => {return})
        }
    });
    switch (textType) {
        case "email":
            [validity, validate] = createFieldValidator(
                "",
                inputName,
                isRequired,
                true,
                emailValidator()
            );
            break;
        case "name":
            [validity, validate] = createFieldValidator(
                "",
                inputName,
                isRequired,
                true,
                nameValidator()
            );
            break;
        case "height":
            [validity, validate] = createFieldValidator(
                "",
                inputName,
                isRequired,
                false,
                heightValidator()
            );
            break;
        default:
            [validity, validate] = createFieldValidator(
                "",
                inputName,
                isRequired,
                true,
                nameValidator()
            );
            break;
    }
    $: try {
        $validity.valid ? accumulatorCheck() : accumulatorCheck();
    } catch (error) {}
    const accumulatorCheck = () => {
        validityCheck(inputName, $validity.value, $validity.valid);
        textType == "height"
            ? inputValue != undefined && inputValue != null
                ? (inputValue = $validity.response)
                : inputValue
            : inputValue;
        setPlaceHolder();
    };
    const setPlaceHolder = () => {
        let checkVal =
            $validity.value != null &&
            $validity.value != undefined &&
            $validity.value.length > 0;
        checkVal
            ? (inputPlaceholder = $validity.value)
            : (inputPlaceholder = placeHolder);
    };
</script>

<InputContainer>
    <!-- <svg slot="backdrop"class="Rectangle_1525">
        <rect id="Rectangle_1525" rx="18" ry="18" x="0" y="0" width="315" height="60">
        </rect>
    </svg> -->
    <input
        slot="input-slot"
        type="text"
        name={inputName}
        id={inputName}
        bind:value={inputValue}
        placeholder={inputPlaceholder}
        class:activated={$validity.valid}
        onscreenvalue={inputValue}
        use:validate={inputValue}
        pullupdialog={$validity.dirty && !$validity.valid}
        isinputok={$validity.valid}
    />
    <span
        isinputok={$validity.valid}
        class="outline-symbol-slot"
        disabled={!(sign.length > 0)}
        slot="outline-symbol-slot"
        >{@html sign}
    </span>
    <PopDialog
        popupHeading={helpTextHeading}
        popupText={helpText}
        visibility={false}
    />
    <PopDialog
        isSide="true"
        popupText={$validity.message != undefined ? $validity.message : "cool"}
        slot="outline-dialog-slot"
    />
    <span class="outline-text-slot" slot="outline-text-slot" style="background-color:#404e5a;" 
        >{inputPlaceholder}</span
    >
    <slot slot="outline-help-slot" name="container-help-slot" />
    <span
        class="outline-emoji"
        isinputok={$validity.valid}
        slot="outline-emoji-slot">{emoji}</span
    >
    <slot slot="extra-dialog-slot" name="extra-dialog" />
</InputContainer>
<style>
        *:global(.outline-text-slot){
        background-color:#4aaabb ;
    }
</style>