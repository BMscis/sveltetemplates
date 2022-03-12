<script>
    import {
        emailValidator,
        nameValidator,
        heightValidator,
        chekiSaa
    } from "../../functions/validators.js";
    import { createFieldValidator } from "../../functions/validation.js";
    import { afterUpdate, onMount } from "svelte";
    import InputContainer from "./InputContainer.svelte";
    import PopDialog from "./PopDialog.svelte";
    import { mountComponent, typeOfInput } from "../../functions/mountComponent";
    import {setDimensions} from "../../dimensions/svgSettings"
    export let inputPlaceholder = "";
    export let helpTextHeading = "";
    export let isRequired = false;
    export let textType = "name";
    export let inputType = "text";
    export let inputValue = "";
    export let inputName = "";
    export let helpText = "";
    export let emoji = "";
    export let sign = "";
    let svgWidth
    let svgHeight
    let svgRx
    let svgTranslate
    let validity;
    let validate;
    const placeHolder = inputPlaceholder;
    const backSlash = "'";
    onMount(() => {
        if (mountComponent(inputName)) {
            typeOfInput(inputValue, mountComponent(inputName))
                ? (inputValue = typeOfInput(
                      inputValue,
                      mountComponent(inputName)
                  ))
                : () => {
                      return;
                  };
        }
    [svgWidth, svgHeight, svgRx, svgTranslate] = setDimensions()
    });
    afterUpdate(()=> {
        $validity.value ? inputValue = $validity.value : inputValue

    })
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
        case "date":
        [validity, validate] = createFieldValidator(
        "",
        inputName,
        isRequired,
        true,
        chekiSaa()
    );
    break
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
</script>

<InputContainer>
    <span slot="input-slot" class="input-slot">
        {#if inputType === "text"}
        <input
        class="input-rect-input"
        name={inputName}
        id={inputName}
        bind:value={inputValue}
        placeholder={inputPlaceholder}
        isinputok={$validity.valid}
        onscreenvalue={inputValue}
        use:validate={inputValue}
        type="text"
    />
        {:else}
        <input
        class="input-rect-input"
        name={inputName}
        id={inputName}
        bind:value={inputValue}
        placeholder={inputPlaceholder}
        isinputok={$validity.valid}
        onscreenvalue={inputValue}
        use:validate={inputValue}
        type="date"
    />
        {/if}
        <sub
        isinputok={$validity.valid}
        class="top-label-slot"
        >{inputPlaceholder}</sub
    >
    </span>
    <label for={inputName}
        isinputok={$validity.valid}
        class="outline-symbol-slot"
        disabled={!(sign.length > 0)}
        slot="outline-symbol-slot"
        >{@html sign}
    </label>
    <PopDialog
        popupHeading={helpTextHeading}
        popupText={helpText}
        visibility={false}
    />
    <PopDialog
        popupText={$validity.message != undefined ? $validity.message : "cool"}
        slot="outline-dialog-slot"
        visibility={$validity.dirty && !$validity.valid}
    />
    <slot slot="outline-help-slot" name="container-help-slot" />
    <span
        class="outline-emoji"
        isinputok={$validity.valid}
        slot="outline-emoji-slot">{emoji}</span
    >
    <slot slot="extra-dialog-slot" name="extra-dialog" />
</InputContainer>

<style>

</style>
