<script>
  import { navigatorPage } from "../functions/formAccumulator";
  import { onMount } from "svelte";
  import NavRecipe from "../ComponentCards/NavRecipe.svelte";
  import NavForm from "../ComponentCards/NavForm.svelte";
  import NavRecipeCard from "../ComponentCards/NavRecipeCard.svelte";
  import NavAccount from "../ComponentCards/NavAccount.svelte";
  import {instructionParameter} from "../functions/formAccumulator";
  export let windowWidth;
	let page = [0,"Welcome"];
  let subHeading="";
  let avatar="";
  let isLarge = false
  export let windowHeight
  onMount(() => {
    return [
    navigatorPage.subscribe((value) => {
			console.log("NAV: ", value)
			page = value.page
      subHeading = value.subHeading
      avatar = value.avatar
		}),
    instructionParameter.subscribe((value) => {
                isLarge = value.isLarge;
                windowWidth = value.width;
                windowHeight = value.height;
            })
  ]
  })
</script>
<div id="nanju-nav-container" >
  {#if page[1] == "Recipes"}
  <NavRecipe 
    title="Recipes"
    heading={page[1]}
    {subHeading}
    {windowWidth}
  ></NavRecipe>
  {:else if page[1] == "recipe"}
  <NavRecipeCard
    image={avatar}
    heading={page[0]}
    {subHeading}
    {windowWidth}
  ></NavRecipeCard>
  {:else if page[1] == "Form"}
  <NavForm
  avatar={avatar}
  heading={page[0]}
  {subHeading}
  {windowWidth}
></NavForm>
  {:else}
  <NavAccount
    heading={page[1]}
    {windowWidth}
  ></NavAccount>
  {/if}
</div>
<style>
    div#nanju-nav-container {
    position: sticky;
    top:0;
    z-index: 200;
}
</style>