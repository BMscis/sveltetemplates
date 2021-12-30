<script>
    import InputContainer from "./InputContainer.svelte";
    import PopDialog from "./PopDialog.svelte";
    import { get, derived } from "svelte/store";
    import { accumulator } from "./functions/formAccumulator";
    import {
        requiredRange,
        requiredValidator,
    } from "./functions/validators.js";
    import { createFieldValidator } from "./functions/validation.js";
    export let inputValue;
    export let inputName;
    export let inputId;
    export let inputPlaceholder;
    export let isRequired = false;
    export let levelRange = 0;
    export let sign = "";
    export let emoji = "";
    export let hasHelp = false;
    const [validity, validate] = createFieldValidator(
        inputName,
        isRequired,
        requiredValidator(),
        requiredRange(levelRange)
    );
    if (isRequired === true || isRequired === "true") {
        const derivedClass = derived(validity, ($validity, set) => {
            set($validity);
        });
        derivedClass.subscribe((value) => {
            let accum = get(accumulator);
            let thisAccum = accum.find((v) => v.component === inputName);
            thisAccum.ready = $validity.valid;
            accumulator.update((n) => (n = n));
        });
    }
</script>

<InputContainer>
    <input
        slot="input-slot"
        type="number"
        name={inputName}
        id={inputId}
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
        slot="outline-symbol-slot">{@html sign}</span
    >
    <PopDialog
        popupText={$validity.message != undefined ? $validity.message : "cool"}
        slot="outline-dialog-slot"
        isExtra=false
        isSide=true
    />
    <span class="outline-text-slot" slot="outline-text-slot"
        >{inputPlaceholder}</span
    >
    <slot slot=outline-help-slot name="container-help-slot"></slot>
    
    <span class="outline-emoji" isinputok={$validity.valid} slot="outline-emoji-slot">{emoji}</span>
    <slot  slot="extra-dialog-slot" name="extra-dialog"></slot>
</InputContainer>
