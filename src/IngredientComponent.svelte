<script>
    export let preparation = []
</script>
    <div id=recipe-information>
        <span id="ingredient-text">Preparation</span>
        <div id="instructions" >
            <ol>
                {#each preparation as ins}
                    <li id="preparation" >{ins}</li>
                {/each}
            </ol>
        </div>
    </div>

<style>
    ol {
    padding: 0;
}
    #ingredient-text {
  white-space: nowrap;
  text-align: left;
  font-family: Adobe Clean;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  color: rgba(123,237,141,1);
  letter-spacing: -0.1px;
  display: block;
  border-radius: 0;
    height: 45px;
    margin-left: 20px;
}
    li#preparation {
    max-width: 100%;
    margin-bottom: 20px;
    line-height: 24px;
}
    #instructions{
        margin-top: 27px;
        z-index: -2;
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
        flex-direction: column;
        margin: auto;
}
#ingredients {
    display: flex;
    flex-direction: column;
    z-index: -2;
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