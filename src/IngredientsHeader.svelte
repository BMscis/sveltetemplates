<script>
    export let ingredientName
    export let imgSource
</script>
<div id=ingredient-header>
    <div id="food-ingredient-name">
        <span id="ingredient-text">{ingredientName}</span>
    </div>
    <img id="photo" src={imgSource} alt="pic"/>
</div>
<style>

    #food-ingredient-name{
    white-space: nowrap;
    text-align: center;
    font-family: Adobe Clean;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    color: rgba(116,138,157,1);
    letter-spacing: -0.1px;
    width: fit-content;
    margin: auto;
    }
    #in-name{
        margin: 35px auto;
    }
    #ingredient-header{
        position: sticky;
        top: 0;
        background: #404e5a;
    }
</style>