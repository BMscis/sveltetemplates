<script>
    import InputContainer from "./InputContainer.svelte";
    import { timeConverter }from "./functions/validators.js";
    import { get, derived } from "svelte/store";
    import {accumulator} from "./functions/formAccumulator"
    import { createFieldValidator } from "./functions/validation.js";
    export let isRequired = false;
    export let inputValue = 0;
    export let inputMin = 0;
    export let inputMax = 0;
    export let inputName = "";
    export let rangeText = "";
    export let sign = "";
    export let isTimeBound = false

    const [validity, validate] = createFieldValidator(
        inputName,
        isRequired,
       timeConverter(inputMax)
    );
    if(isRequired === true ||  isRequired === "true"){
        const derivedClass = derived(validity, ($validity, set)=>{
        set($validity)
    })
    derivedClass.subscribe(value =>{
        let accum = get(accumulator)
        let thisAccum = accum.find(v => v.component === inputName)
        thisAccum.ready = $validity.state
        accumulator.update(n => n = n)
    })
    }
</script>

<InputContainer>
    <div slot="input-slot" class="input-range-container">
        <progress value={inputValue} min={inputMin} max={inputMax} />
        <input
            bind:value={inputValue}
            min={inputMin}
            max={inputMax}
            name={inputName}
            type="range"
            use:validate={inputValue}
            isinputok={$validity.state}
        />
    </div>
</InputContainer>
<InputContainer>
    <div slot="input-slot" class="input-range-container">
        <span class="checkbox-text">{rangeText}</span>
        {#if isTimeBound}
        <span isinputok={$validity.state} class="outline-symbol-text">{$validity.response}</span>
        {:else}
        <span isinputok={$validity.state} class="outline-symbol-text">{@html sign} {inputValue * 1000}</span>
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
