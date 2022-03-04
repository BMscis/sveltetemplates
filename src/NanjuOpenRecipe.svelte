<script>
    import butterChickenImage from "../docs/assets/butterChiken.jpg"
    import { butterChickenIngredient } from "./ingredients/ingredientsBook";
    import {ingredientSize,instructionSize} from "./functions/formAccumulator"
import { get } from "svelte/store";
    let recip = [1,2,3,4,5,6,7]
    let ingredienTran = 0
    let instructionTran = 0
    ingredientSize.subscribe((value) => {
      ingredienTran = value + 100
    })
    instructionSize.subscribe((value) => {
      instructionTran = value + 100
    })
</script>
<div id="preparation" style="width: {(window.innerWidth/2) - 120}px;">
  <svg id="difficulty" xmlns="http://www.w3.org/2000/svg" width="{(window.innerWidth/2) - 120}" height="108" viewBox="0 0 {(window.innerWidth/2) - 120} 108">
    <rect id="difficulty-bg" width="{(window.innerWidth/2) - 120}" height="108" fill="rgba(255,255,255,0)" opacity="0.1"/>
    <g id="ease">
      <text id="Easy" transform="translate(39 26)" fill="#309af1" font-size="14" font-family="AdobeClean-Regular, Adobe Clean" letter-spacing="-0.01em"><tspan x="0" y="0">Easy</tspan></text>
      <g id="icon-difficulty" transform="translate(14 11)">
        <line id="line" y2="8" transform="translate(0 7)" fill="none" stroke="#ff5a00" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <line id="line-2" data-name="line" y2="12" transform="translate(7.5 3)" fill="none" stroke="#ff5a00" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <line id="line-3" data-name="line" y2="15" transform="translate(15)" fill="none" stroke="#ff5a00" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      </g>
    </g>
    <g id="prep">
      <text id="Prep_20m" data-name="Prep 20m" transform="translate(39 60)" fill="#309af1" font-size="14" font-family="AdobeClean-Regular, Adobe Clean" letter-spacing="-0.01em"><tspan x="0" y="0">Prep 20m</tspan></text>
      <g id="icon-clock" transform="translate(14 47)">
        <circle id="ellipse" cx="7.5" cy="7.5" r="7.5" fill="none" stroke="#ff5a00" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <path id="path" d="M477,742v3.783l2.722,2.025" transform="translate(-470.121 -738)" fill="none" stroke="#7bed8d" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      </g>
    </g>
    <g id="cook">
      <text id="Cook_5m" data-name="Cook 5m" transform="translate(40 96)" fill="#309af1" font-size="14" font-family="AdobeClean-Regular, Adobe Clean" letter-spacing="-0.01em"><tspan x="0" y="0">Cook 5m</tspan></text>
      <g id="icon-cook" transform="translate(14 83)">
        <path id="path-2" data-name="path" d="M514.072,758.791c0,2.949-3.358,5.34-7.5,5.34s-7.5-2.391-7.5-5.34,3.358-9.66,7.5-9.66S514.072,755.841,514.072,758.791Z" transform="translate(-499.072 -749.131)" fill="none" stroke="#ff5a00" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <path id="path-3" data-name="path" d="M510.982,764.275c0,1.991-1.974,3.6-4.41,3.6s-4.41-1.613-4.41-3.6,1.975-6.518,4.41-6.518S510.982,762.285,510.982,764.275Z" transform="translate(-499.072 -752.931)" fill="none" stroke="#309af1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      </g>
    </g>
  </svg>
</div>
<div id="open-recipe" style="height:{ingredienTran}px; width: {window.innerWidth - ((window.innerWidth/2) - 100)}px;">
   <div id="ingredient_set">
    <svg id="ingredients-set" xmlns="http://www.w3.org/2000/svg" width="240" height="{ingredienTran}" viewBox="0 0 240 {ingredienTran}">
      <g id="Ingredient-list" transform="translate(0 58)">
        {#each butterChickenIngredient.ingredients as ingredient, i}
        <g id="ingredient-slot" transform="translate(0 {i * 30})">
          {ingredientSize.set(i * 30)}
          <text id="Ingredient_1" data-name="Ingredient 1" transform="translate(42.5)" fill="#748a9d" font-size="16" font-family="AdobeClean-SemiLight, Adobe Clean SemiLight" font-weight="300" letter-spacing="-0.01em"><tspan x="0" y="16">{ingredient}</tspan></text>
          <g id="icon_toggle_radio_button_checked_24px" data-name="icon/toggle/radio_button_checked_24px">
            <rect id="Boundary" width="24" height="24" fill="none"/>
            <path id="_Color" data-name=" ↳Color" d="M10,20A10,10,0,1,1,20,10,10.011,10.011,0,0,1,10,20ZM10,2a8,8,0,1,0,8,8A8.009,8.009,0,0,0,10,2Zm0,13a5,5,0,1,1,5-5A5.006,5.006,0,0,1,10,15Z" transform="translate(2 2)" fill="#7bed8d"/>
          </g>
        </g>
        {/each}
      </g>
      <text id="Ingredients" fill="#7bed8d" font-size="20" font-family="SegoeUI, Segoe UI"><tspan x="0" y="22">Ingredients</tspan></text>
    </svg>
    
   </div>
   <div id="instruction_set">
    <svg id="instructions-set" xmlns="http://www.w3.org/2000/svg" width="{window.innerWidth - ((window.innerWidth/2) - 100)}" height="{instructionTran}" viewBox="0 0 {window.innerWidth - ((window.innerWidth/2) - 100)} {instructionTran}">
      <rect id="instruction-bg" width="{window.innerWidth - ((window.innerWidth/2) - 100)}" height="{instructionTran}" fill="rgba(255,255,255,0)"/>
      <g id="instructions-list" transform="translate(0 40)">
        {#each butterChickenIngredient.preparation as prep,i}
        {instructionSize.set(i * 100)}
        <foreignObject width="{window.innerWidth - ((window.innerWidth/2) - 100)}" height="100" transform="translate(0 {i * 100})">
          <p id="_1._Step_1" style="white-space:pre-wrap;width:{window.innerWidth - ((window.innerWidth/2) - 80)}px;" data-name="1. Step 1" fill="#748a9d" font-size="16" font-family="AdobeClean-SemiLight, Adobe Clean SemiLight" font-weight="300" letter-spacing="-0.01em">
            <span style="white-space:pre-wrap;width:{window.innerWidth - ((window.innerWidth/2) - 80)}px;" x="0" y="16">{i + 1}. {prep}</span></p>
        </foreignObject>
        {/each}
      </g>
      <text id="Instructions" fill="#7bed8d" font-size="20" font-family="SegoeUI, Segoe UI"><tspan x="0" y="22">Instructions</tspan></text>
    </svg>
    
   </div>
</div>
<div id="recipe-list" style="width: {(window.innerWidth/2) - 120}px;">
  <ul>
    <li id="active">
      <svg id="recipe-card" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="213" height="50" viewBox="0 0 213 50">
        <defs>
          <pattern id="pattern" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" viewBox="0 0 1600 1066">
            <image width="1600" height="1066" href={butterChickenImage}/>
          </pattern>
        </defs>
        <g id="minified">
          <rect id="mini-recipe-card" width="213" height="50" fill="rgba(0,0,0,0.7)"/>
          <path id="butterChiken" d="M0,0H69a0,0,0,0,1,0,0V50a0,0,0,0,1,0,0H30A30,30,0,0,1,0,20V0A0,0,0,0,1,0,0Z" transform="translate(28)" fill="url(#pattern)"/>
          <g id="text-button" transform="translate(21)">
            <rect id="text-button-container" width="126" height="50" transform="translate(66)" fill="rgba(18,18,18,0.93)"/>
            <text id="Subtitle_1" data-name="Subtitle 1" transform="translate(93 13)" fill="rgba(255,255,255,0.87)" font-size="16" font-family="Roboto-Regular, Roboto" letter-spacing="0.009em"><tspan x="0" y="17">Subtitle 1</tspan></text>
          </g>
        </g>
      </svg>
      
    </li>
      {#each recip as rep}
          <li>           
            <svg id="recipe-card" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="213" height="50" viewBox="0 0 213 50">
              <defs>
                <pattern id="pattern" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" viewBox="0 0 1600 1066">
                  <image width="1600" height="1066" href={butterChickenImage}/>
                </pattern>
              </defs>
              <g id="minified">
                <path id="butterChiken" d="M0,0H69a0,0,0,0,1,0,0V50a0,0,0,0,1,0,0H30A30,30,0,0,1,0,20V0A0,0,0,0,1,0,0Z" transform="translate(28)" fill="url(#pattern)"/>
                <g id="text-button" transform="translate(21)">
                  <rect id="text-button-container" width="126" height="50" transform="translate(66)" fill="rgba(18,18,18,0.93)"/>
                  <text id="Subtitle_1" data-name="Subtitle 1" transform="translate(93 13)" fill="rgba(255,255,255,0.87)" font-size="16" font-family="Roboto-Regular, Roboto" letter-spacing="0.009em"><tspan x="0" y="17">Subtitle 1</tspan></text>
                </g>
                <rect id="mini-recipe-card" width="213" height="50" fill="rgba(0,0,0,0.7)"/>
              </g>
            </svg>
            
          </li>
      {/each}
  </ul>
</div>
<style>

  #recipe-list {
    float: left;
    position: sticky;
    top:114px;
}
ul {
    list-style: none;
    padding: 0;
}
li {
}
li#active {
}
svg#recipe-card {
    float: right;
}
#ingredient_set{
  width: 240px;
  display: none;
  float: left;
}
#instruction_set{
  width: 240px;
  float: left;
}
#end{
  position: relative;
}
#preparation{
  float: left;
  position: sticky;
  top: 0;
}
#open-recipe{
  float: right;
  margin-right: 10px;
}
</style>