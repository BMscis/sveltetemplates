<script>
    import butterChickenImage from "../docs/assets/butterChiken.jpg"
    import IngredientComponent from "./IngredientComponent.svelte";
    import IngredientsHeader from "./IngredientsHeader.svelte";
    import { butterChickenIngredient } from "./ingredients/ingredientsBook";
    import { Router } from "svelte-routing";
    import FormViewer from "./FormViewer.svelte";
    import { afterUpdate, onMount } from "svelte";
    import {setNavigateTo,setPageName} from "./functions/setNavigateTo"

    let ingredientCount = 0
    for(let i = 0; i < butterChickenIngredient.ingredients.length; i++){
      ingredientCount = i * 30
    }
    ingredientCount += 422
    onMount(() =>{
      setPageName("Ingredients")
      return 
    })
    afterUpdate(() =>{
      console.log("IC: ", ingredientCount)
    })
</script>
<div class="MainContainer">
<Router basepath="/page-ingredients" url="page-ingredients">
    <FormViewer 
    isIngredients = true
    avatar="ingredients"
    header="Refreshing Ingredients"
    onboardingText="Eat healthy, eat tasty!"
    >
        <div slot = "ingredient-slot" id="ingredient-info">
          <svg id="content" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="319" height={ingredientCount}  viewBox="0 0 319 {ingredientCount}">
            <clipPath id=clip-path-im >
            <rect  width="315" height="212" rx="15" ry="15" fill="black" stroke="black"/>
            </clipPath>
            <g id="recipe-information" transform="translate(-30 -62)">
              <g id="difficulty" transform="translate(35)">
                <text id="Easy" transform="translate(247 432)" fill="#748a9d" font-size="16" font-family="SegoeUI, Segoe UI" letter-spacing="-0.01em"><tspan x="0" y="0">{butterChickenIngredient.estimation[0]}</tspan></text>
                <text id="Prep_20m" data-name="Prep 20m" transform="translate(247 468)" fill="#748a9d" font-size="16" font-family="SegoeUI, Segoe UI" letter-spacing="-0.01em"><tspan x="0" y="0">{butterChickenIngredient.estimation[1]}</tspan></text>
                <text id="Cook_5m" data-name="Cook 5m" transform="translate(247 504)" fill="#748a9d" font-size="16" font-family="SegoeUI, Segoe UI" letter-spacing="-0.01em"><tspan x="0" y="0">{butterChickenIngredient.estimation[2]}</tspan></text>
                <g id="icon-difficulty" transform="translate(217 418)">
                  <line id="line" y2="8" transform="translate(0 8)" fill="none" stroke="#748a9d" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
                  <line id="line-2" data-name="line" y2="12" transform="translate(7 4)" fill="none" stroke="#748a9d" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
                  <line id="line-3" data-name="line" y2="16" transform="translate(14)" fill="none" stroke="#748a9d" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
                </g>
                <g id="icon-clock" transform="translate(216 454)">
                  <circle id="ellipse" cx="7.5" cy="7.5" r="7.5" fill="none" stroke="#748a9d" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
                  <path id="path" d="M477,742v3.783l2.722,2.025" transform="translate(-470.121 -738)" fill="none" stroke="#748a9d" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
                </g>
                <g id="icon-cook" transform="translate(217 490)">
                  <path id="path-2" data-name="path" d="M512.46,761.238a6.694,6.694,0,0,1-13.388,0c0-3.7,3-12.107,6.694-12.107S512.46,757.541,512.46,761.238Z" transform="translate(-499.072 -749.131)" fill="none" stroke="#748a9d" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
                  <path id="path-3" data-name="path" d="M509.37,764.275a3.6,3.6,0,0,1-7.208,0c0-1.99,1.614-6.518,3.6-6.518S509.37,762.285,509.37,764.275Z" transform="translate(-499.072 -749.131)" fill="none" stroke="#748a9d" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
                </g>
              </g>
              {#each butterChickenIngredient.ingredients as ingredient ,i}
              <g id="ingredients" transform="translate(0 {i * 30})">
                <g id="ingredient-slot">
                  <text id="Ingredient_1" data-name="Ingredient 1" transform="translate(71 420)" fill="#748a9d" font-size="16" font-family="AdobeClean-SemiLight, Adobe Clean SemiLight" font-weight="300" letter-spacing="-0.01em"><tspan x="0" y="16">{ingredient}</tspan></text>
                  <g id="checkbox" transform="translate(32 415)">
                    <rect id="rectangle" width="24" height="24" rx="12" fill="#7bed8d"/>
                    <path id="path-4" data-name="path" d="M1440.355,4365.126l2.325,2.325,4.89-4.89" transform="translate(-1432 -4352.519)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
                  </g>
                </g>
              </g>
              {/each}
              <text id="Ingredients-2" data-name="Ingredients" transform="translate(30 391)" fill="#7bed8d" font-size="20" font-family="SegoeUI, Segoe UI" letter-spacing="-0.01em"><tspan x="0" y="0">Ingredients</tspan></text>
            </g>
            <g id="photo-2" data-name="photo" transform="translate(0 50)" clip-path="url(#clip-path-im)">
                <image href={butterChickenImage} x="0" y="0" width="315" height="212" />
            </g>
            <text id="Mixed_Berry_Melody" data-name="Mixed Berry Melody" transform="translate(94.53 22)" fill="#748a9d" font-size="20" font-family="SegoeUI, Segoe UI" letter-spacing="-0.01em"><tspan x="-86.86" y="0">{butterChickenIngredient.ingredientName}</tspan></text>
          </svg>
          
        </div>
        <IngredientComponent
        slot="slot2"
        ingredients={butterChickenIngredient.ingredients}
        preparation={butterChickenIngredient.preparation}
    />
    </FormViewer>
</Router>
</div>
