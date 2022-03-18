<script>
import { onMount } from "svelte";

import { isRecipeCardNavButtonActive } from "./ActiveButton";


    export let buttonName
    export let transform
    export let isActive
    let setCardActive
    
    onMount(() => {
      return isRecipeCardNavButtonActive.subscribe((value) => {
        setCardActive = value
        console.log(setCardActive)
      })
    })
</script>
<foreignObject requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" width="120" height="32" transform="translate({transform})">
    <button class:active={isActive} on:click={() => {isRecipeCardNavButtonActive.set(!setCardActive)}}>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="120" height="32" viewBox="0 0 120 32">
            <g id="tab-bar">
                <rect id="tab-square-bg" width="120" height="32" transform="translate(0 1.5)" fill="none"/>
                <rect id="tab-square" width="120" height="32" fill="none"/>
                <text id="_Dark_Theme_2._Subtitle_Subtitle_1" data-name="🌑 Dark Theme/2. Subtitle/Subtitle 1" transform="translate(20 23)" font-size="16" font-family="Roboto-Regular, Roboto" letter-spacing="0.009em"><tspan x="0" y="0">{buttonName}</tspan></text>
                <g transform="matrix(1, 0, 0, 1, -75, -93)" filter="url(#hover-line)">
                  <path id="hover-line-3" data-name="hover-line" d="M0,0H120" transform="translate(75 126.5)" fill="none" stroke="#000" stroke-linecap="round" stroke-width="2"/>
                </g>
              </g>   
        </svg>
    </button>
</foreignObject>
<style>
    button{
        margin:0;
        padding: 0;
        background-color: var(--indicator-color-disabled);
    }
    button.active{
        background-color: var(--primary-color-mono-3);
    }
</style>