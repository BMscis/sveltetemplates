<script>
    import { navigate, Router } from "svelte-routing";
    import butterChickenImage from "../docs/assets/butterChiken.jpg"
    import {
      butterChickenIngredient,
      macaroniWithWhiteSauce,
      fishFilet,
      panGrilledChicken,
      tropicalBellPepperSalad
    } from "./ingredients/ingredientsBook"
    import FormViewer from "./FormViewer.svelte";
    import { setPageName } from "./functions/setNavigateTo";
    import RecipeCard from "./ComponentCards/RecipeCard.svelte"
    export let isFormReady
    export let windowHeight
    setPageName("Recipes","Explore Recipes.","ingredients")
</script>

<div class="Maincontainer" style="height: {windowHeight};">
    <Router basepath="/page-recipes" url="/page-recipes">
        <FormViewer
        header="Recipes"
        onboardingText="Explore Recipes."
        avatar="ingredients"
        >
        <div slot="slot1">
          <RecipeCard image={butterChickenIngredient.pic} ingredientName={butterChickenIngredient.ingredientName} ingredientText={butterChickenIngredient.tip} ></RecipeCard>
          <RecipeCard image={macaroniWithWhiteSauce.pic} ingredientName={macaroniWithWhiteSauce.ingredientName} ingredientText={macaroniWithWhiteSauce.tip} ></RecipeCard>
          <RecipeCard image={fishFilet.pic} ingredientName={fishFilet.ingredientName} ingredientText={fishFilet.tip}></RecipeCard>
          <RecipeCard image={panGrilledChicken.pic} ingredientName={panGrilledChicken.ingredientName} ingredientText={panGrilledChicken.tip} ></RecipeCard>
          <RecipeCard image={tropicalBellPepperSalad.pic} ingredientName={tropicalBellPepperSalad.ingredientName} ingredientText={tropicalBellPepperSalad.tip} ></RecipeCard>
        </div>
        </FormViewer>
    </Router>
</div>
