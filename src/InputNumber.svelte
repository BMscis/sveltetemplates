<script>
    import InputContainer from "./InputContainer.svelte"
    import PopDialog from "./PopDialog.svelte"
    import { requiredRange, requiredValidator } from "./functions/validators.js";
    import { createFieldValidator } from "./functions/validation.js";
    export let inputValue;
    export let inputName;
    export let inputId;
    export let inputPlaceholder;
    export const isRequired = false
    export let levelRange = 0
    export let sign = ''
    const [validity, validate] = createFieldValidator(
       requiredValidator(),requiredRange(levelRange)
    );
</script>

    <InputContainer>
    <input
        slot="inputslot"
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
    <span isinputok={$validity.valid} class="inputsign" slot="taglogoslot">{sign}</span>
    <PopDialog popupText={$validity.message} slot="dialogslot" />
    <span class="inputtext" slot="inputtext">{inputPlaceholder}</span>
</InputContainer>
