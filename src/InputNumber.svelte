<script>
    import {
        requiredRange,
        requiredValidator,
    } from "./functions/validators.js";
    import { validityCheck, validityRangeCheck } from "./functions/validCheck";
    import { createFieldValidator } from "./functions/validation.js";
    import { mountComponent,typeOfInput } from "./functions/mountComponent";
    import { onMount } from "svelte";
    import InputContainer from "./InputContainer.svelte";
    import PopDialog from "./PopDialog.svelte";
    export let isRequired = false;
    export let inputPlaceholder;
    export let levelRange = 0;
    export let inputValue;
    export let emoji = "";
    export let sign = "";
    export let inputName;
    let addVal = "";
    const placeHolder = inputPlaceholder;
    onMount(() => {
        if(mountComponent(inputName)){
            typeOfInput(0,mountComponent(inputName)) ? 
            inputValue = typeOfInput(0,mountComponent(inputName)) : (() => {return})
        }
    });
    const [validity, validate] = createFieldValidator(
        0,
        inputName,
        isRequired,
        true,
        requiredValidator(),
        requiredRange(levelRange)
    );
    try {
    } catch (error) {}
    $: try {
        $validity.valid
            ? (inputPlaceholder = $validity.value)
            : (inputPlaceholder = placeHolder);
    } catch (error) {}
    $: try {
        $validity.valid ? accumulatorCheck() : accumulatorCheck();
    } catch (error) {}
    const accumulatorCheck = () => {
        validityCheck(
            inputName,
            $validity.value == null ? 0 : $validity.value,
            $validity.valid
        );
        validityRangeCheck(inputName, $validity.value, $validity.valid);
    };
</script>

<InputContainer>
    <input
        slot="input-slot"
        type="number"
        name={inputName}
        id={inputName}
        bind:value={inputValue}
        placeholder={inputPlaceholder}
        class:activated={$validity.valid}
        onscreenvalue={inputValue}
        use:validate={inputValue}
        pullupdialog={$validity.dirty && !$validity.valid && inputValue > 0}
        isinputok={$validity.valid}
    />
    <span
        isinputok={$validity.valid}
        class="outline-symbol-slot"
        slot="outline-symbol-slot"
        >{@html sign}
    </span>
    <PopDialog
        popupText={$validity.message != undefined ? $validity.message : "cool"}
        slot="outline-dialog-slot"
        isExtra="false"
        isSide="true"
    />
    <span class="outline-text-slot" slot="outline-text-slot"
        >{$validity.valid && inputValue > 0
            ? inputPlaceholder
            : placeHolder}</span
    >
    <slot slot="outline-help-slot" name="container-help-slot" />

    <span
        class="outline-emoji"
        isinputok={$validity.valid}
        slot="outline-emoji-slot">{emoji}</span
    >
    <slot slot="extra-dialog-slot" name="extra-dialog" />
</InputContainer>
