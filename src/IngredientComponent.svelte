<script>
    export let ingredients = []
    export let preparation = []
    export let info = ["Easy", "Prep 20m", "Cook 5m"]
</script>
<div class="Mycontainer">
    <div id=recipe-information>
        <div id="ingredients">
            <span id="ingredient-text">Ingredients</span>
            {#each ingredients as ing}
                <div id="ingredient-list-container">
                    <span id="ingredient-checked"></span>
                    <span id = "ingredient-name"> {ing}</span>
                </div>
            {/each}
        </div>
    </div>
    <div id="instructions" >
        <span id="ingredient-text">Preparation</span>
        <ol>
            {#each preparation as ins}
                <li id="preparation" >{ins}</li>
            {/each}
        </ol>
    </div>
</div>

<style>
    #instructions{
        margin-top: 27px;
    }
    #preparation{
        
    width: 318px;
    text-align: left;
    font-family: Adobe Clean;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    color: rgba(116,138,157,1);
    letter-spacing: -0.1px;
    }
    #ingredient-text{
    white-space: nowrap;
    text-align: left;
    font-family: Adobe Clean;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    color: rgba(123,237,141,1);
    letter-spacing: -0.1px;
    display: block;
    }

    #ingredient-info{
    white-space: nowrap;
    line-height: 30px;
    text-align: left;
    font-family: Adobe Clean;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    color: rgba(116,138,157,1);
    letter-spacing: -0.1px;
    margin-left: 40px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-content: flex-end;
    }

    #recipe-information {
        width: 317px;
        display: flex;
        flex-direction: column-reverse;
        margin: auto;
}
#ingredients {
    display: flex;
    flex-direction: column;
}
#ingredient-name{
    width: 92px;
    line-height: 36px;
    margin-top: -10px;
    text-align: left;
    font-family: Adobe Clean;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    color: rgba(116,138,157,1);
    letter-spacing: -0.1px;
    white-space: nowrap;
}
#ingredient-list-container{
    display: flex;
    flex-direction: row;
    height: fit-content;
    margin-bottom: 20px;
    align-items: flex-end;
}
</style>