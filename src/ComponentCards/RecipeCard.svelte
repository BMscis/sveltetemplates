<script>
    import { navigate } from "svelte-routing";
    export let image = "";
    export let page = "";
    export let ingredientName
    export let ingredientText
</script>
<div id="nanju-recipes">
    <svg id="recipe-card" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="280" height="395" viewBox="0 0 280 395">
        <defs>
          <pattern id="{image}" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" viewBox="0 0 1600 1066">
            <image width="1600" height="1066" href={image} >
          </pattern>
        </defs>
        <g id="expand">
          <g id="Container" transform="translate(0.5 158)">
            <rect id="recipe-card-rect" width="279.894" height="395" rx="8" transform="translate(-0.394 -158)" fill="#121212"/>
            <g id="Button" transform="translate(-0.5 185)">
              <path id="button-container" d="M0,0H280a0,0,0,0,1,0,0V48a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V0A0,0,0,0,1,0,0Z" fill="#121212" opacity="0.004"/>
              <g id="text-button" transform="translate(196 8)">
                <g id="Container-2" data-name="Container">
                  <rect id="_Color" data-name="↳ 🎨 Color" width="75" height="36" rx="4" fill="none"/>
                  <g id="_States" data-name="↳ 💡States">
                    <rect id="Surface" width="75" height="36" rx="4" fill="#121212" opacity="0"/>
                    <rect id="States_Light_Surface_containers_Primary_Content" data-name="States/Light 🌕/Surface containers/Primary Content" width="75" height="36" rx="4" fill="rgba(187,134,252,0)"/>
                  </g>
                </g>
                <text id="_Label" data-name="↳ ✏️ Label" transform="translate(8 23)" fill="#bb86fc" font-size="14" font-family="Roboto-Medium, Roboto" font-weight="500" letter-spacing="0.089em"><tspan x="0" y="0">EXPAND</tspan></text>
              </g>
            </g>
            <path id="image-rect" d="M30,0H250a30,30,0,0,1,30,30V178a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V30A30,30,0,0,1,30,0Z" transform="translate(-0.5 -158)" fill="url(#{image})"/>
          </g>
          <foreignObject transform="translate(24 220)" width="250" height="120" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
            <div
                id="food-text"
                data-name="food-text"
                style="width:230px;height:100px;color:var(--indicator-color-disabled);padding:10px;border-radius:10px;"
            >
                <p>
                    {ingredientText}
                </p>
            </div>
        </foreignObject>
          <text id="Subtitle_1" data-name="Subtitle 1" transform="translate(24 183)" fill="rgba(255,255,255,0.87)" font-size="16" font-family="Roboto-Regular, Roboto" letter-spacing="0.009em"><tspan x="0" y="17">{ingredientName}</tspan></text>
        </g>
      </svg>
</div>
<style>
    ul {
    display: block;
    width: 100%;
    list-style: none;
}
li {
    margin: 10px;
    width: 280px;
    float: left;
}
#recipe-card{
    cursor: pointer;
}
</style>
