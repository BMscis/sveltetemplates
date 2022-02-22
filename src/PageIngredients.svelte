<script>
    import butterChickenImage from "../docs/assets/butterChiken.jpg"
    import IngredientComponent from "./IngredientComponent.svelte";
    import IngredientsHeader from "./IngredientsHeader.svelte";
    import { butterChicken } from "./ingredients/ingredientsBook";
    import { Router } from "svelte-routing";
    import FormViewer from "./FormViewer.svelte";
</script>
<div class="Mycontainer">
<Router basepath="/page-ingredients" url="page-ingredients">
    <FormViewer isIngredients = true>
        <IngredientsHeader
            slot="slot1"
            imgSource={butterChickenImage}
            ingredientName={butterChicken.ingredientName}
        />
        <div slot = "ingredient-slot" id="ingredient-info">
            <span >Prep</span>
            <div id="ingredient-difficulty">
                <span>{butterChicken.estimation[0]}</span>
            </div>
            <div id="ingredient-prep">
                <span>{butterChicken.estimation[1]}</span>
            </div>
            <div id="ingredient-cook">
                <span>{butterChicken.estimation[2]}</span>
            </div>
        </div>
        <IngredientComponent
            slot="slot2"
            ingredients={butterChicken.ingredients}
            preparation={butterChicken.preparation}
        />
    </FormViewer>
</Router>
</div>
<style>
    .Mycontainer{
        top:81px;
        height: calc(100% - 81px);
    }
</style>