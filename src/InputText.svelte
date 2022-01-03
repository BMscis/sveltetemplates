<script>
    import InputContainer from "./InputContainer.svelte"
    import PopDialog from "./PopDialog.svelte"
    import { nameValidator } from "./functions/validators.js";
    import { createFieldValidator } from "./functions/validation.js";
    import { get, derived } from "svelte/store";
    import {accumulator} from "./functions/formAccumulator"
    export let inputValue = ""
    export let helpText = ""
    export let helpTextHeading = ""
    export let inputName = ""
    export let inputId = ""
    export let inputPlaceholder = ""
    export let emoji = ""
    export let isRequired = false
    const [validity, validate] = createFieldValidator(
        inputName,
        isRequired,
        nameValidator()
    );
    if(isRequired === true ||  isRequired === "true"){
        const derivedClass = derived(validity, ($validity, set)=>{
        set($validity)
    })
    derivedClass.subscribe(value =>{
        let accum = get(accumulator)
        let thisAccum = accum.find(v => v.component === inputName)
        thisAccum.ready = $validity.valid
        accumulator.update(n => n = n)
    })
    }
</script>
<InputContainer>
    <input
        slot="input-slot"
        type="text"
        name={inputName}
        id={inputId}
        bind:value={inputValue}
        placeholder={inputPlaceholder}
        class:activated={$validity.valid}
        onscreenvalue={inputValue}
        use:validate={inputValue}
        pullupdialog={$validity.dirty && !$validity.valid}
        isinputok={$validity.valid}
    >
    <PopDialog popupHeading={helpTextHeading} popupText={helpText} visibility={false} >
    </PopDialog>
    <PopDialog popupText={$validity.message != undefined ? $validity.message : "cool"} slot="outline-dialog-slot" />
    <span class="outline-text-slot" slot="outline-text-slot">{inputPlaceholder}</span>
    <span class="outline-emoji" isinputok={$validity.valid} slot="outline-emoji-slot">{emoji}</span>
</InputContainer>