<script>
    import InputContainer from "./InputContainer.svelte";
    import { expandMore } from "./functions/validators";
    import { createFieldValidator } from "./functions/validation.js";
    import { get, derived } from "svelte/store";
    import { accumulator } from "./functions/formAccumulator";
    export let inputValue = 1;
    export let inputId = "";
    export let inputName = "";
    export let checkboxtext = "";
    export let isRequired = false;
    export let extracheckboxfocus = false;
    export let extracheckboxtext = "";
    export let extracheckbox = false;

    let [validity, validate] = createFieldValidator(
        inputName,
        isRequired,
        expandMore(extracheckboxfocus)
    );
    if(isRequired === true ||  isRequired === "true"){
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
    <div
        class="checkbox-container"
        slot="input-slot"
        class:has-checkboxes={extracheckbox}
    >
        <input
            type="checkbox"
            name={inputName}
            id={inputId}
            on:change={() => {
                validate(this, extracheckboxfocus);
                extracheckboxfocus = $validity.valid;
            }}
            bind:value={extracheckboxfocus}
            isinputok={$validity.valid}
        />
        <div class="checkbox-text">{checkboxtext}</div>
    </div>
    <div
        slot="extra-input-slot"
        class="checkbox-container"
        id="morecheckbox"
        name="morecheckbox"
        visible={$validity.valid && extracheckbox}
    >
        <input
            type="checkbox"
            name={inputName}
            id={inputId}
            on:input
            bind:value={inputValue}
        />
        <div class="checkbox-text">{extracheckboxtext}</div>
    </div>
</InputContainer>
