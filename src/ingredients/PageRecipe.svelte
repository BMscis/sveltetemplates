<script>
  import { navigate, Router } from "svelte-routing";
  import FormViewer from "../Utilities/FormViewer.svelte";
  import recipeImage from "../../docs/assets/ingredients.png"
  import { setPageName } from "../functions/setNavigateTo";
  import RecipeCard from "../ComponentCards/RecipeCard.svelte";
  import { afterUpdate, onMount, xlink_attr } from "svelte/internal";
  import { instructionParameter, navbarHeight } from "../functions/formAccumulator";
  import { get } from "svelte/store";
  import { ingredientBook } from "../functions/formAccumulator";
  export let isFormReady;
  export let windowHeight;
  export let windowWidth;
  let isLarge = false;
  let ingredients = get(ingredientBook);
  console.log(ingredients);
  setPageName(["Recipe","Recipes"], "Explore Recipes.", recipeImage);
  const stile = (x, y) => {
    return x + `` + y;
  };
  let numberOfGrids = Math.floor(windowWidth / 280);
  let gridWidth = numberOfGrids * 280;
  let gridGap = numberOfGrids * 10;
  let margin = (windowWidth / 2 - (gridWidth + gridGap) / 2) / 2;
  let gridTemplateColumn = Array.from(Array(numberOfGrids).keys());
  let gridMap = gridTemplateColumn.map((x, i) => "280px ").reduce(stile);
  console.log("GD: ", `grid-template-columns: ${gridMap};`);

  onMount(() => {
    return instructionParameter.subscribe((value) => {
      isLarge = value.isLarge;
      windowWidth = value.width;
      windowHeight = value.height - get(navbarHeight);
    });
  });
  afterUpdate(() => {
    numberOfGrids = Math.floor(windowWidth / 280);
    gridWidth = numberOfGrids * 280;
    gridGap = numberOfGrids * 10;
    margin = (windowWidth / 2 - (gridWidth + gridGap) / 2) / 2;
    gridTemplateColumn = Array.from(Array(numberOfGrids).keys());
    gridMap = gridTemplateColumn.map((x, i) => "280px ").reduce(stile);
  });
</script>

<div class="Maincontainer" style="height:{windowHeight}px;">
  <Router basepath="/page-recipes" url="/page-recipes">
    <FormViewer
      header="Recipes"
      onboardingText="Explore Recipes."
      avatar="ingredients"
    >
      <div
        id="slot"
        slot="slot1"
        style="grid-template-columns: {gridMap};margin:auto;padding:10px;"
      >
        {#each ingredients as ing}
          <RecipeCard
            image={ing.pic}
            ingredientName={ing.name}
            ingredientText={ing.tip}
            ingredientRoute={ing.route}
          />
        {/each}
      </div>
    </FormViewer>
  </Router>
</div>

<style>
  div#slot {
    display: inline-grid;
    grid-auto-columns: 280px;
    grid-column-gap: 10px;
    margin: auto;
  }
</style>
