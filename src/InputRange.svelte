<script>
    import { timeConverter, requiredRange } from "./functions/validators.js";
    import { createFieldValidator } from "./functions/validation.js";
    import { accumulatorCheck } from "./functions/validCheck";
    import InputContainer from "./InputContainer.svelte";
    import PopDialog from "./PopDialog.svelte";
    import { mountComponent, typeOfInput } from "./functions/mountComponent";
    import { afterUpdate, onMount } from "svelte";
    export let isTimeBound = false;
    export let isRequired = false;
    export let rangeType = "";
    export let inputName = "";
    export let rangeText = "";
    export let inputValue = 0;
    export let inputMin = 0;
    export let inputMax = 0;
    export let sign = "";

    let validate;
    let validity;
    onMount(() => {
        if (mountComponent(inputName)) {
            typeOfInput(parseInt(inputValue), mountComponent(inputName))
                ? (inputValue = typeOfInput(
                      parseInt(inputValue),
                      mountComponent(inputName)
                  ))
                : 1;
        }
    });
    switch (rangeType) {
    case "time":
        [validity, validate] = createFieldValidator(
            "",
            inputName,
            isRequired,
            false,
            timeConverter(inputMin)
        );
        break;
    default:
        [validity, validate] = createFieldValidator(
            0,
            inputName,
            isRequired,
            true,
            requiredRange(parseInt(inputMin))
        );
        break;
}


    afterUpdate(() => {
        accumulatorCheck(
            inputName,
            $validity?.value,
            rangeType == "time" ? $validity.state : $validity?.valid
        );
    });
</script>

<div class="range-pocket">
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
                isinputok={rangeType == "time"
                    ? $validity.state
                    : $validity?.valid}
                pullupdialog={rangeType == "time"
                    ? !$validity.state
                    : !$validity?.valid}
            />
            <PopDialog
                popupText={$validity?.message != undefined
                    ? $validity?.message
                    : "cool"}
                slot="outline-dialog-slot"
                isExtra="false"
                isSide="true"
            />
        </div>
    </InputContainer>
    <InputContainer>
        <div slot="input-slot" class="input-range-container">
            <h4 class="checkbox-text">{rangeText}</h4>
            {#if isTimeBound}
                <span
                    isinputok={rangeType == "time"
                        ? $validity.state
                        : $validity?.valid}
                    class="outline-symbol-text">{$validity?.response}</span
                >
            {:else}
                <span
                    isinputok={rangeType == "time"
                        ? $validity.state
                        : $validity?.valid}
                    class="outline-symbol-text"
                    >{@html sign} {inputValue * 1000}</span
                >
            {/if}
        </div>
    </InputContainer>
</div>

<style>
</style>
