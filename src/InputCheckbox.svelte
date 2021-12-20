<script>
    import InputContainer from "./InputContainer.svelte";
    import { expandMore, requiredRange } from "./functions/validators";
    import { createFieldValidator } from "./functions/validation.js";
    export let inputValue = 1;
    export let inputId = "";
    export let inputName = "";
    export let checkboxtext = "";
    export let extracheckboxfocus = false;
    export let extracheckboxtext = "";
    export let extracheckbox = false;

    let [validityCheck, validateCheck] = createFieldValidator(
        expandMore(extracheckboxfocus)
    );
    console.log(extracheckboxfocus);
    console.log($validityCheck.valid);
</script>

    <InputContainer>
        <div
            class="checkbox-container"
            slot="inputslot"
            class:has-checkboxes={extracheckbox}
        >
            <input
                type="checkbox"
                name={inputName}
                id={inputId}
                on:change={() => {
                    validateCheck(this, extracheckboxfocus);
                    extracheckboxfocus = $validityCheck.valid;
                }}
                bind:value={extracheckboxfocus}
                isvalid={$validityCheck.valid}
            />
            <div class="checkbox-text">{checkboxtext}</div>
        </div>
        <div
            slot="extrainput"
            class="checkbox-container"
            id="morecheckbox"
            name="morecheckbox"
            visible={$validityCheck.valid && extracheckbox}
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
