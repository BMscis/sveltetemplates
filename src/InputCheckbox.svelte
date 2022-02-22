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
        <div id="checkbox-label">
            <span>{checkboxtext}</span>
        </div>
        <div id="switch-body" >
			<input 
            class="switch-body"
            type="checkbox"
            name={inputName}
            id={inputName}
            bind:checked={inputValue}
            use:validate={inputValue}
            isinputok={$validity?.valid}
            disabled={checkable}
            >
			<svg id="switch-active" xmlns="http://www.w3.org/2000/svg" width={svgWidth1} height={svgHeight1} viewBox="0 0 {svgWidth1} {svgHeight1}">
				<g id="input-checked-container" fill="#748a9d" stroke="#707070" stroke-width="1">
                    <rect width={svgWidth1} height={svgHeight1} rx={svgRx1} stroke="none"/>
                    <rect x="0.5" y="0.5" width={svgWidth2} height={svgHeight2} rx={svgRx2} fill="none"/>
				</g>
				<g id="input-checked">
					<g id="circle-checked" >
					  <circle id ="circle-clr"cx={svgRx1} cy={svgRx1} r={svgRx2} fill="#a6bcd0"/>
					  <g id="cross" transform={svgTranslate1}>
						<path id="line" d="M0,0V14" transform="translate(9.9) rotate(45)" fill="#a6bcd0" stroke="#fff" stroke-linecap="round" stroke-width="1"/>
						<line id="line-2" data-name="line" x1="14" transform="translate(0) rotate(45)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
					  </g>
					  <path id="tick" d="M1440.356,4367.538l4.512,4.512,9.488-9.487" transform={svgTranslate2} fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
					</g>
				  </g>
			  </svg>
        </div>
    </div>
    <div
        slot="extra-input-slot"
        class="checkbox-container"
        id="morecheckbox"
        name="morecheckbox"
        visible={$validity?.valid && extracheckbox}
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
<style>
	.input-slot{
		background: transparent;
	}

</style>