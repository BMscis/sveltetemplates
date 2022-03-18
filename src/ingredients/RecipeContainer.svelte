<script>
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { Router } from "svelte-routing";
    import { setPageName } from "../functions/setNavigateTo";
    import {isRecipeCardNavButtonActive} from "../ComponentCards/ActiveButton"
    import {
        ingredientBook,
        instructionParameter,
        navbarHeight,
    } from "../functions/formAccumulator";
    export let windowWidth;
    export let windowHeight;
    let activateIngredient = get(ingredientBook)[0];
    setPageName([activateIngredient.name, "recipe"],activateIngredient.subHeading,activateIngredient.pic);
    const recipeContainerTop = () => {return get(navbarHeight);};
    const listHeight = () => { return Math.ceil((windowHeight - recipeContainerTop() - 36)/36) * 36 }
    const listWidth = () => { return windowWidth/2.7}
    const foreignObjectWidth = () => {return windowWidth - 108}
    const svgHeight = () => {return window.innerHeight - recipeContainerTop();}
    let listheight = listHeight()
    let listwidth = listWidth()
    let foreignobjectwidth = foreignObjectWidth()
    let svgheight = svgHeight();
    let isLarge = true
    let showList = false
    onMount(() => {
        return [
            instructionParameter.subscribe((value) => {
                isLarge = value.isLarge;
                windowWidth = value.width;
                windowHeight = value.height;
                listheight = listHeight();
                listwidth = listWidth();
                foreignobjectwidth = foreignObjectWidth();
                svgheight=svgHeight()
            }),
            ingredientBook.subscribe((value) => {let isTrue = (element) => element.active == true || element.active == "true";let activeIng = value.findIndex(isTrue);activateIngredient = value[activeIng];setPageName([activateIngredient.name, "recipe"],activateIngredient.subHeading,activateIngredient.pic);console.log("VAL: ", value);console.log("activeIng", activeIng);console.log("ACC: ", activateIngredient.ingredients);}),
            isRecipeCardNavButtonActive.subscribe((value) => {
                showList = value
      })
        ];
    });
</script>
<Router basepath="/recipe" url="/recipe">
    <div id="container"style="height:{svgheight}px">
        <div id="div2" style="height:{svgheight}px;">
            <svg id="recipe-card" xmlns="http://www.w3.org/2000/svg" width={windowWidth} height="{svgheight}" viewBox="0 0 {windowWidth} {svgheight}">
                <g id="instructions" transform="translate(0 0)">
                    <g id="Container" transform="translate(0 0)">
                        <rect
                            id="recipe-card-rect"
                            width={windowWidth}
                            height="{svgheight}"
                            rx="8"
                            transform="translate(0.106)"
                            fill="#121212"
                        />
                        <g id="Button" transform="translate(0 {listheight})">
                            <path
                                id="button-container"
                                d="M0,0H360a0,0,0,0,1,0,0V48a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V0A0,0,0,0,1,0,0Z"
                                fill="#121212"
                                opacity="0.004"
                            />
                            <g id="text-button" transform="translate(276 8)">
                                <g id="Container-2" data-name="Container">
                                    <rect
                                        id="_Color"
                                        data-name="↳ 🎨 Color"
                                        width="63"
                                        height="36"
                                        rx="4"
                                        fill="none"
                                    />
                                    <g id="_States" data-name="↳ 💡States">
                                        <rect
                                            id="Surface"
                                            width="63"
                                            height="36"
                                            rx="4"
                                            fill="#121212"
                                            opacity="0"
                                        />
                                        <rect
                                            id="States_Light_Surface_containers_Primary_Content"
                                            data-name="States/Light 🌕/Surface containers/Primary Content"
                                            width="63"
                                            height="36"
                                            rx="4"
                                            fill="rgba(187,134,252,0)"
                                        />
                                    </g>
                                </g>
                                <text
                                    id="_Label"
                                    data-name="↳ ✏️ Label"
                                    transform="translate(8 23)"
                                    fill="#bb86fc"
                                    font-size="14"
                                    font-family="Roboto-Medium, Roboto"
                                    font-weight="500"
                                    letter-spacing="0.089em"
                                    ><tspan x="0" y="0">CLOSE</tspan></text
                                >
                            </g>
                        </g>
                    </g>
                    <g id="ingredients-set" transform="translate(0 0)">
                        <g id="Ingredient-list" transform="translate(0 0)">
                            <foreignObject transform="translate(0)"
                                requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                width="{isLarge? foreignobjectwidth : windowWidth}"
                                height="{listheight}">
                                <div style="display: flex;flex-wrap:wrap;background-image:{isLarge? `url(${activateIngredient.pic})`: `linear-gradient(-90deg, #04ff0014, transparent)`};background-repeat:no-repeat;background-size:50%;background-position:top right;">
                                    <div class:hide={!showList} style="width: {isLarge? foreignobjectwidth : windowWidth}px;">
                                        <ul id="instruction-list" 
                                            style="list-style:none;height:{listheight}px;overflow:auto;margin-left:0;">
                                            {#each activateIngredient.ingredients as ing, i}
                                                <li style="width:100%;height:36px;margin-left:0;display:flex;">
                                                    <span style="width: 24px;height:24px;margin: auto 0;">
                                                        <svg id="radio-button-container"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                                            width="24"
                                                            height="24">
                                                            <g id="radio-icon">
                                                                <rect id="Boundary"
                                                                    width="24"
                                                                    height="24"
                                                                    fill="none"/>
                                                                <path id="_Color-2"
                                                                    data-name=" ↳Color"
                                                                    d="M10,20A10,10,0,1,1,20,10,10.011,10.011,0,0,1,10,20ZM10,2a8,8,0,1,0,8,8A8.009,8.009,0,0,0,10,2Zm0,13a5,5,0,1,1,5-5A5.006,5.006,0,0,1,10,15Z"
                                                                    transform="translate(2 2)"
                                                                    fill="#7bed8d"/>
                                                            </g>
                                                        </svg>
                                                    </span>
                                                    <span style="margin: auto 10px;">
                                                        <p style="color: white;">
                                                            {ing}
                                                        </p>
                                                    </span>
                                                </li>
                                            {/each}
                                        </ul>
                                    </div>
                                    <div class:hide={showList} style="width: {isLarge? foreignobjectwidth : windowWidth}px;">
                                        <ul id="instruction-list"
                                            style="list-style:none;height:{listheight}px;overflow:auto;margin-left:0;">
                                            {#each activateIngredient.preparation as prep, i}
                                                <li style="width:100%;height:36px;margin-left:0;display:flex;">
                                                    <span style="width: 24px;height:24px;margin: auto 0;">
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                                            width="24"
                                                            height="24">
                                                            <g id="radio-icon">
                                                                <rect id="Boundary"
                                                                    width="24"
                                                                    height="24"
                                                                    fill="none"/>
                                                                <path id="_Color-2"
                                                                    data-name=" ↳Color"
                                                                    d="M10,20A10,10,0,1,1,20,10,10.011,10.011,0,0,1,10,20ZM10,2a8,8,0,1,0,8,8A8.009,8.009,0,0,0,10,2Zm0,13a5,5,0,1,1,5-5A5.006,5.006,0,0,1,10,15Z"
                                                                    transform="translate(2 2)"
                                                                    fill="#7bed8d"/>
                                                            </g>
                                                        </svg>
                                                    </span>
                                                    <span style="margin: auto 10px;"
                                                    >
                                                        <p style="color: white;">
                                                            {prep}
                                                        </p>
                                                    </span>
                                                </li>
                                            {/each}
                                        </ul>
                                    </div>
                                </div>
                            </foreignObject>
                        </g>
                    </g>
                    <g id="difficulty"
                        transform="translate({foreignobjectwidth} -3)" opacity={isLarge? 1:0} >
                        <rect
                            id="difficulty-bg"
                            width="108"
                            height="108"
                            fill="rgba(255,255,255,0)"
                            opacity="0.1"
                        />
                        <g id="ease">
                            <text
                                id="Easy"
                                transform="translate(39 26)"
                                fill="#a6bcd0"
                                font-size="14"
                                font-family="AdobeClean-Regular, Adobe Clean"
                                letter-spacing="-0.01em"
                                ><tspan x="0" y="0">Easy</tspan></text
                            >
                            <g
                                id="icon-difficulty"
                                transform="translate(14 11)"
                            >
                                <line
                                    id="line"
                                    y2="8"
                                    transform="translate(0 7)"
                                    fill="none"
                                    stroke="rgba(255,90,0,0.44)"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                />
                                <line
                                    id="line-2"
                                    data-name="line"
                                    y2="12"
                                    transform="translate(7.5 3)"
                                    fill="none"
                                    stroke="rgba(255,90,0,0.44)"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                />
                                <line
                                    id="line-3"
                                    data-name="line"
                                    y2="15"
                                    transform="translate(15)"
                                    fill="none"
                                    stroke="rgba(255,90,0,0.44)"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                />
                            </g>
                        </g>
                        <g id="prep">
                            <text
                                id="Prep_20m"
                                data-name="Prep 20m"
                                transform="translate(39 60)"
                                fill="#a6bcd0"
                                font-size="14"
                                font-family="AdobeClean-Regular, Adobe Clean"
                                letter-spacing="-0.01em"
                                ><tspan x="0" y="0">Prep 20m</tspan></text
                            >
                            <g id="icon-clock" transform="translate(14 47)">
                                <circle
                                    id="ellipse"
                                    cx="7.5"
                                    cy="7.5"
                                    r="7.5"
                                    fill="none"
                                    stroke="rgba(255,90,0,0.45)"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                />
                                <path
                                    id="path"
                                    d="M477,742v3.783l2.722,2.025"
                                    transform="translate(-470.121 -738)"
                                    fill="none"
                                    stroke="#7bed8d"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                />
                            </g>
                        </g>
                        <g id="cook">
                            <text
                                id="Cook_5m"
                                data-name="Cook 5m"
                                transform="translate(40 96)"
                                fill="rgba(48,154,241,0.48)"
                                font-size="14"
                                font-family="AdobeClean-Regular, Adobe Clean"
                                letter-spacing="-0.01em"
                                ><tspan x="0" y="0">Cook 5m</tspan></text
                            >
                            <g id="icon-cook" transform="translate(14 83)">
                                <path
                                    id="path-2"
                                    data-name="path"
                                    d="M514.072,758.791c0,2.949-3.358,5.34-7.5,5.34s-7.5-2.391-7.5-5.34,3.358-9.66,7.5-9.66S514.072,755.841,514.072,758.791Z"
                                    transform="translate(-499.072 -749.131)"
                                    fill="none"
                                    stroke="rgba(255,90,0,0.45)"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                />
                                <path
                                    id="path-3"
                                    data-name="path"
                                    d="M510.982,764.275c0,1.991-1.974,3.6-4.41,3.6s-4.41-1.613-4.41-3.6,1.975-6.518,4.41-6.518S510.982,762.285,510.982,764.275Z"
                                    transform="translate(-499.072 -752.931)"
                                    fill="none"
                                    stroke="rgba(48,154,241,0.45)"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                />
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    </div>
</Router>

<style>
    #container {
        overflow: auto;
    }
    #tab-button:active,
    #foreign-tab-button:active {
        background-color: #a6bcd085;
    }
    #div1 {
        position: sticky;
        top: 0;
        z-index: 11;
        box-shadow: 0 2px 7px 5px #0000008a;
        border-radius: 50%;
    }
    #div2 {
        position: relative;
        z-index: 1;
    }
    footer {
        position: absolute;
        bottom: 0;
        z-index: 11;
        width: 100%;
        background: #5c4c47;
    }
    #instruction-list::-webkit-scrollbar {
        width: 2px;
        background-color: #5c4c47;
    }
    #instruction-list::-webkit-scrollbar-thumb {
        background-color: rgba(0, 255, 255, 0.329);
    }
    div{
        margin-left: 0;
    }
    div.hide{
        visibility: hidden;
        position: absolute;
    }
</style>
