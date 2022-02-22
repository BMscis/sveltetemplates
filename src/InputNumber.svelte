<script>
    import {
        requiredRange,
        requiredValidator,
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
    const [validity, validate] = createFieldValidator(
        0,
        inputName,
        isRequired,
        true,
        requiredValidator(),
        requiredRange(levelRange)
    );
</script>

<InputContainer>
    <div slot="input-slot" class="input-slot">
        <svg
            id="input-rect"
            xmlns="http://www.w3.org/2000/svg"
            width="216"
            height={svgHeight}
            viewBox="0 0 216 {svgHeight}"
        >
            <rect
                isinputok={$validity.valid}
                id="text-input-rect"
                data-name="input-rect"
                width="216"
                height={svgHeight}
                rx={svgRx}
                fill="#a6bcd0"
            />
        </svg>
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
    />
    <span class="outline-text-slot" slot="outline-text-slot" style="background-color:#404e5a;"
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
