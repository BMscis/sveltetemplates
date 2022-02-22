<script>
    export let ingredientName
    export let imgSource
</script>
<div id=ingredient-header>
    <div id="food-ingredient-name">
        <span id="in-name">{ingredientName}</span>
    </div>
    <div id="photo" style="background-image:{imgSource};" alt="pic"/>
</div>
<style>
        #photo{
    width: 315px;
    height: 212px;
    margin: 35px auto;
    }
    #food-ingredient-name{
    white-space: nowrap;
    text-align: center;
    font-family: Adobe Clean;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    color: rgba(116,138,157,1);
    letter-spacing: -0.1px;
    }
    #in-name{
        margin: 35px auto;
    }
</style>