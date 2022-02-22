<script>
    import InputContainer from "./InputContainer.svelte";
    import { createFieldValidator } from "./functions/validation.js";
    import { expandMore } from "./functions/validators";
    import { mountComponent, typeOfInput } from "./functions/mountComponent";
    import { onMount } from "svelte";
    export let extracheckboxtext = "";
    export let extracheckbox = false;
    export let inputValue = undefined;
    export let isRequired = false;
    export let checkboxtext = "";
    export let inputName = "";
    let checkable = false;
    let validity;
    let validate;
    onMount(() => {
        if(mountComponent(inputName)){
            typeOfInput(inputValue,mountComponent(inputName)) ? 
            inputValue = typeOfInput(inputValue,mountComponent(inputName)) : (() => {return})
        }
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
			<svg id="switch-active" xmlns="http://www.w3.org/2000/svg" width="90" height="45" viewBox="0 0 90 45">
				<g id="input-checked-container" fill="#748a9d">
				  <path d="M 68.75 44.5 L 21.25 44.5 C 18.44855308532715 44.5 15.73116493225098 43.95144653320312 13.17331790924072 42.86956405639648 C 10.70248222351074 41.82449340820312 8.483341217041016 40.32826995849609 6.577541351318359 38.42247009277344 C 4.671729564666748 36.51665878295898 3.175505876541138 34.29751586914062 2.130435228347778 31.82668304443359 C 1.048552989959717 29.26884651184082 0.5 26.55145835876465 0.5 23.75 L 0.5 21.25 C 0.5 18.44855308532715 1.048552989959717 15.73116493225098 2.130435228347778 13.17331790924072 C 3.175505876541138 10.70248222351074 4.671729564666748 8.483341217041016 6.577541351318359 6.577541351318359 C 8.483341217041016 4.671729564666748 10.70248222351074 3.175505876541138 13.17331790924072 2.130435228347778 C 15.73116493225098 1.048552989959717 18.44855308532715 0.5 21.25 0.5 L 68.75 0.5 C 71.55146026611328 0.5 74.26884460449219 1.048552989959717 76.82668304443359 2.130435228347778 C 79.29751586914062 3.175505876541138 81.51666259765625 4.671729564666748 83.42247009277344 6.577541351318359 C 85.32826995849609 8.483341217041016 86.82449340820312 10.70248222351074 87.86956787109375 13.17331790924072 C 88.95144653320312 15.73116493225098 89.5 18.44855308532715 89.5 21.25 L 89.5 23.75 C 89.5 26.55145835876465 88.95144653320312 29.26884651184082 87.86956787109375 31.82668304443359 C 86.82449340820312 34.29751586914062 85.32826995849609 36.51665878295898 83.42247009277344 38.42247009277344 C 81.51666259765625 40.32826995849609 79.29751586914062 41.82449340820312 76.82668304443359 42.86956405639648 C 74.26884460449219 43.95144653320312 71.55146026611328 44.5 68.75 44.5 Z" stroke="none"/>
				</g>
				<g id="input-checked">
					<g id="circle-checked" >
					  <circle id ="circle-clr"cx="22.5" cy="22.5" r="22" fill="#a6bcd0"/>
					  <g id="cross" transform="translate(17.55 17.55)">
						<path id="line" d="M0,0V14" transform="translate(9.9) rotate(45)" fill="#a6bcd0" stroke="#fff" stroke-linecap="round" stroke-width="1"/>
						<line id="line-2" data-name="line" x1="14" transform="translate(0) rotate(45)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
					  </g>
					  <path id="tick" d="M1440.356,4367.538l4.512,4.512,9.488-9.487" transform="translate(-1425.39 -4344.806)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
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