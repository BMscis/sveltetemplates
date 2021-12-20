<script>
    import InputContainer from "./InputContainer.svelte";
    import { requiredRange,timeConverter }from "./functions/validators.js";
    import { createFieldValidator } from "./functions/validation.js";
    export let inputValue = 0;
    export let inputMin = 0;
    export let inputMax = 0;
    export let inputName = "";
    export let rangeText = "";
    export let sign = "";
    export let isTimeBound = false

    const [validity, validate] = createFieldValidator(
       timeConverter(inputMax)
    );
    validate(0)
</script>

<InputContainer>
    <div slot="inputslot" class="input-range-container">
        <progress value={inputValue} min={inputMin} max={inputMax} />
        <input
            bind:value={inputValue}
            min={inputMin}
            max={inputMax}
            name={inputName}
            type="range"
            on:input={() => {
                validate(this,inputValue)
            }}
            isinputok={$validity.message.response}
        />
    </div>
</InputContainer>
<InputContainer>
    <div slot="inputslot" class="input-range-container">
        <span class="checkbox-text">{rangeText}</span>
        {#if isTimeBound}
        <span isinputok={$validity.message.response} class="inputsign">{$validity.message.reply}</span>
        {:else}
        <span isinputok={$validity.message.response} class="inputsign">{sign} {inputValue * 1000}</span>
        {/if}
    </div>
</InputContainer>

<style>
    .input-range-container {
        margin: 0;
        padding: 0;
        width: 250px;
        height: 56px;
    }
</style>
