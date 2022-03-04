<script>
    import { navigate, Router } from "svelte-routing";
    import butterChickenImage from "../docs/assets/butterChiken.jpg"
    import FormViewer from "./FormViewer.svelte";
    import { setPageName } from "./functions/setNavigateTo";
    export let isFormReady

    setPageName("Recipes")
</script>

<div class="Maincontainer">
    <Router basepath="/page-recipes" url="/page-recipes">
        <FormViewer
        header="Recipes"
        onboardingText="Explore Recipes."
        avatar="ingredients"
        >
        <div  slot = "slot1" id="ingredient-info">
          <svg id="recipe-card" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="315" height="320" viewBox="0 0 315 320">
            <defs>
              <pattern id="pattern" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" viewBox="0 0 1600 1066">
                <image width="1600" height="1066" href={butterChickenImage}/>
              </pattern>
            </defs>
            <g id="bg"  fill="url(#pattern)">
              <rect width="315" height="320" rx="30" stroke="none"/>
              <rect x="0.5" y="0.5" width="314" height="319" rx="30" fill="none"/>
            </g>
            <g id="card" transform="translate(0 230)">
              <path id="card-bg" d="M2,0H313a2,2,0,0,1,2,2V60a30,30,0,0,1-30,30H30A30,30,0,0,1,0,60V2A2,2,0,0,1,2,0Z" fill="#f0f4f8"/>
              <text id="Berries_mixed_together_to_make_a_tasty_dish." data-name="Berries mixed together to make a tasty dish." transform="translate(29 63)" fill="#a6bcd0" font-size="14" font-family="SegoeUI, Segoe UI"><tspan x="0" y="0">Berries mixed together to make a tasty dish.</tspan></text>
              <text id="Mixed_Berry_Melody" data-name="Mixed Berry Melody" transform="translate(29 46)" fill="#748a9d" font-size="16" font-family="SegoeUI, Segoe UI" letter-spacing="-0.01em"><tspan x="0" y="0">Mixed Berry Melody</tspan></text>
            </g>
            <foreignObject width="315" height="320" color="transparent" id="recipe_button">
              <button style="width:315px; height:320px;" id="recipe-button" on:click={() => {navigate("/page-ingredients",true)}}>RECIPEBUTTON</button>
              <svg width="315" height="320" rx="30" xmlns="http://www.w3.org/2000/svg">
                <rect id="hover-card" width="315" height="320" rx="30" fill="#81b1ef" opacity="0"/>
              </svg>
            </foreignObject>
          </svg>
          <svg id="recipe-card" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="315" height="320" viewBox="0 0 315 320">
            <defs>
              <pattern id="pattern" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" viewBox="0 0 1600 1066">
                <image width="1600" height="1066" href={butterChickenImage}/>
              </pattern>
            </defs>
            <g id="bg"  fill="url(#pattern)">
              <rect width="315" height="320" rx="30" stroke="none"/>
              <rect x="0.5" y="0.5" width="314" height="319" rx="30" fill="none"/>
            </g>
            <g id="card" transform="translate(0 230)">
              <path id="card-bg" d="M2,0H313a2,2,0,0,1,2,2V60a30,30,0,0,1-30,30H30A30,30,0,0,1,0,60V2A2,2,0,0,1,2,0Z" fill="#f0f4f8"/>
              <text id="Berries_mixed_together_to_make_a_tasty_dish." data-name="Berries mixed together to make a tasty dish." transform="translate(29 63)" fill="#a6bcd0" font-size="14" font-family="SegoeUI, Segoe UI"><tspan x="0" y="0">Berries mixed together to make a tasty dish.</tspan></text>
              <text id="Mixed_Berry_Melody" data-name="Mixed Berry Melody" transform="translate(29 46)" fill="#748a9d" font-size="16" font-family="SegoeUI, Segoe UI" letter-spacing="-0.01em"><tspan x="0" y="0">Mixed Berry Melody</tspan></text>
            </g>
            <foreignObject width="315" height="320" color="transparent" id="recipe_button">
              <button style="width:315px; height:320px;" id="recipe-button" on:click={() => {navigate("/page-ingredients",true)}}>RECIPEBUTTON</button>
              <svg width="315" height="320" rx="30" xmlns="http://www.w3.org/2000/svg">
                <rect id="hover-card" width="315" height="320" rx="30" fill="#81b1ef" opacity="0"/>
              </svg>
            </foreignObject>
          </svg>
            
        </div>
        </FormViewer>
    </Router>
</div>
<style>
  #ingredient-info{
    display: flex;
    flex-direction: column;
    width: 315px;
    float: right;
    margin: 20px;
  }
#recipe-button:hover ~ svg #hover-card{
  opacity: .5;
  cursor: pointer;
  transition: .3s cubic-bezier(0.4,0,0.2,1);;
}
#recipe-card{
  box-shadow: 0 2px 5px 1px rgb(64 60 67 / 16%);
  border-radius: 30px;
  position: relative;
  left: 0;
  right: 0;
  margin-bottom: 40px;
}
#recipe-button{
  position: absolute;
  color:transparent
}
</style>