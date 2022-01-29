<script>
    import { createFieldValidator } from "./functions/validation.js";
    import { accumulator } from "./functions/formAccumulator";
    import { validityCheck, validityRangeCheck, validityOr } from "./functions/validCheck";
    import InputContainer from "./InputContainer.svelte";
    import { expandMore } from "./functions/validators";
    import { afterUpdate, onMount } from "svelte";
    import { get, derived } from "svelte/store";
    export let extracheckboxfocus = false;
    export let extracheckboxtext = "";
    export let extracheckbox = false;
    export let inputValue = undefined;
    export let isRequired = false;
    export let checkboxtext = "";
    export let inputName = "";
    let checkable = false
    const [validity, validate] = createFieldValidator(
        undefined,
        inputName,
        isRequired,
        true,
        expandMore()
    );
    onMount(() => {
        let accum = get(accumulator);
        let thisAccum = accum.find((v) => v.component === inputName);
        if (thisAccum !== undefined && thisAccum !== null) {
            if (thisAccum.value) inputValue = thisAccum.value;
        }
    });
    $: $validity.valid ? accumulatorCheck() : accumulatorCheck();
    const accumulatorCheck = () => {
        validityCheck(inputName, $validity.value == null ? undefined : $validity.value, $validity.valid);
        validityRangeCheck(inputName, $validity.value == null ? undefined : $validity.value, $validity.valid);
        validityOr(inputName, $validity.value == null ? undefined : $validity.value, $validity.valid);
    };
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
            id={inputName}
            bind:checked={inputValue}
            use:validate={inputValue}
            isinputok={$validity.valid}
            disabled = {checkable}
        />
        <label for={inputName} class="checkbox-text">{checkboxtext}</label>
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
            id={inputName}
            on:input
            bind:value={inputValue}
        />
        <div class="checkbox-text">{extracheckboxtext}</div>
    </div>
</InputContainer>
