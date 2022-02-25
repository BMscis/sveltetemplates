<script>
    import {
        requiredRange,
        requiredValidator,
        calculateBMI
    } from "./functions/validators.js";
    import { createFieldValidator } from "./functions/validation.js";
    import { mountComponent,typeOfInput } from "./functions/mountComponent";
    import { onMount } from "svelte";
    import InputContainer from "./InputContainer.svelte";
    import PopDialog from "./PopDialog.svelte";
    import {setDimensions} from "./dimensions/svgSettings"
    export let isRequired = false;
    export let inputPlaceholder;
    export let levelRange = 0;
    export let inputValue;
    export let emoji = "";
    export let sign = "";
    export let inputName;
    export let numberType;
    export let disabled
    let validity
    let validate
    let svgWidth
    let svgHeight
    let svgRx
    let svgTranslate
    const placeHolder = inputPlaceholder;
    onMount(() => {
        if(mountComponent(inputName)){
            typeOfInput(0,mountComponent(inputName)) ? 
            inputValue = typeOfInput(0,mountComponent(inputName)) : (() => {return})
        }
        [svgWidth, svgHeight, svgRx, svgTranslate] = setDimensions()
    });
    switch (numberType) {
        case "weight":
        [validity, validate] = createFieldValidator(
        0,
        inputName,
        isRequired,
        true,
        calculateBMI(levelRange)
    );
            break;
    
        default:
        [validity, validate] = createFieldValidator(
        0,
        inputName,
        isRequired,
        true,
        requiredValidator(),
        requiredRange(levelRange)
    );
            break;
    }

</script>

<InputContainer disabled={disabled}>
    <div slot="input-slot" class="input-slot" >
    <input
        type="number"
        name={inputName}
        id={inputName}
        bind:value={inputValue}
        placeholder={inputPlaceholder}
        class="input-rect-input"
        class:activated={$validity.valid}
        onscreenvalue={inputValue}
        use:validate={inputValue}
        pullupdialog={$validity.dirty && !$validity.valid && inputValue > 0}
        isinputok={$validity.valid}
    />
    </div>
    <label for={inputName}
        isinputok={$validity.valid}
        class="outline-symbol-slot"
        slot="outline-symbol-slot"
        >{@html sign}
    </label>
    <PopDialog
        popupText={$validity.message != undefined ? $validity.message : "cool"}
        slot="outline-dialog-slot"
        isExtra="false"
    />
    <span class="top-label-slot" slot="top-label-slot" style="background-color:#404e5a;"
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
