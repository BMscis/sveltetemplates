<script>
    import InputContainer from "./InputContainer.svelte";
    import { createFieldValidator } from "./functions/validation.js";
    import { mountComponent, typeOfInput } from "./functions/mountComponent";
    import { onMount } from "svelte";
    import {setDimensions} from "./dimensions/svgSettings"
    export let extracheckboxtext = "";
    export let extracheckbox = false;
    export let inputValue = undefined;
    export let isRequired = false;
    export let checkboxtext = "";
    export let inputName = "";
    let checkable = false;
    let validity;
    let validate;
    let svgWidth1
    let svgHeight1
    let svgRx1
    let svgWidth2
    let svgHeight2
    let svgRx2
    let svgTranslate1
    let svgTranslate2
    let svgTranslate3
    onMount(() => {
        if(mountComponent(inputName)){
            typeOfInput(inputValue,mountComponent(inputName)) ? 
            inputValue = typeOfInput(inputValue,mountComponent(inputName)) : (() => {return})
        }
        [svgWidth1,svgHeight1,svgRx1,svgWidth2,svgHeight2,svgRx2,svgTranslate1,svgTranslate2,svgTranslate3] = setDimensions(true)
        return;
    });
    [validity, validate] = createFieldValidator(
            undefined,
            inputName,
            isRequired,
            true
        );
</script>

<InputContainer>
    <div slot="input-slot" class="input-slot">
        <span id="checkbox-label">
            <label for={inputName}>{checkboxtext}</label>
        </span>
        <span id="checkbox-container" >
			<input 
            type="checkbox"
            name={inputName}
            id={inputName}
            bind:checked={inputValue}
            use:validate={inputValue}
            disabled={checkable}
            >
            <svg id="checkbox-switch" xmlns="http://www.w3.org/2000/svg" width="40" height="26" viewBox="0 0 40 26">
                <rect id="checkbox-track" width="34" height="14" rx="7" transform="translate(3 6)" fill="rgba(166,188,208,0.48)"/>
                <g id="checkbox-button" transform="translate(-11)">
                  <circle id="checkbox-thumb-hover" cx="13" cy="13" r="13" transform="translate(11)" fill="rgba(123,237,141,0)"/>
                  <rect id="s4" width="20.5" height="20.5" rx="10" transform="translate(13.5 2.5)" fill="#727272" opacity="0.26"/>
                  <rect id="s3" width="20.5" height="20.5" rx="10" transform="translate(14.25 3)" fill="#727272" opacity="0.23"/>
                  <circle id="checkbox-thumb" cx="10" cy="10" r="10" transform="translate(14 3)" fill="#a6bcd0"/>
                </g>
              </svg>
            </span>
    </div>
</InputContainer>
<style>

	.input-slot{
		background: transparent;
	}

</style>
  