<script>
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import butterChickenImage from "../docs/assets/butterChiken.jpg";
    import { butterChickenIngredient } from "./ingredients/ingredientsBook";
    import titleCardImage from "../docs/assets/title-rect.png";
    import {
        instructionParameter,
        instructionSize,
    } from "./functions/formAccumulator";
    export let windowWidth = window.innerWidth;
    export let windowHeight = window.outerHeight;
    let instructiontCount = 0;
    let ingredientMap = butterChickenIngredient.ingredients.map((x,i) => (i * 27)+ 189)
    let ingredientMapSize = butterChickenIngredient.ingredients.length * 27
    let iinstructionMap = butterChickenIngredient.preparation.map((x,i) => (i * 27)+ 189)
    let instructionMapSize = butterChickenIngredient.ingredients.length * 40
    let buttonActive = true;
    let isLarge = windowWidth > 600;
    let hoverLine = {
        large: { x: 0, y: 20.5 },
        small: { x: 0, y: 20.5 },
    };
    let hoverLine2 = {
        large: { x: 679, y: 745 },
        small: { x: 191, y: 823.5 },
    };
    let titleCard = { large: 81, small: 81 };
    let imageHeight = {
        large: windowWidth,
        small: Math.floor(windowHeight / 4 / 27) * 27 * 3,
    };
    let directive = {
        large: 400 - 30,
        small: windowWidth / 2 > 300 ? windowWidth / 2 - 30 : windowWidth - 30,
    };
    let svgHeight = 0;
    let gsvgHeight = 0;
    let isvgHeight = 0;
    const recipeContainerTop = () => {
        return Math.floor(window.outerHeight / 4 / 27) * 27;
    };
    onMount(() => {
        svgHeight = window.outerHeight - recipeContainerTop();
        gsvgHeight = ingredientMapSize + 189 + 40
        isvgHeight = instructionMapSize + 189 + 40
        gsvgHeight > isvgHeight? svgHeight = gsvgHeight : svgHeight = isvgHeight
        
        return instructionParameter.subscribe((value) => {
                isLarge = value.isLarge;
                windowWidth = value.width;
                windowHeight = value.height;
            })
    });
</script>

<div id="div1" style="height:{recipeContainerTop()}px;">
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width={windowWidth}
        height={recipeContainerTop()}
        viewBox="0 0 {windowWidth} {recipeContainerTop()}"
    >
        <defs>
            <pattern
                id="pattern"
                preserveAspectRatio="xMidYMid slice"
                width="100%"
                height="100%"
                viewBox="0 0 1600 1066"
            >
                <image
                    width="1600"
                    height="1066"
                    href={butterChickenImage}
                />
            </pattern>
            <pattern
                id="patternX"
                width="1"
                height="1"
                viewBox="13.155 0 40 40"
            >
                <image
                    preserveAspectRatio="xMidYMid slice"
                    width="71.186"
                    height="40"
                    href={butterChickenImage}
                />
            </pattern>
            <filter
                id="hover-line"
                x={isLarge ? hoverLine.large.x : hoverLine.small.x}
                y={isLarge ? hoverLine.large.y : hoverLine.small.y}
                width="129"
                height="19"
                filterUnits="userSpaceOnUse"
            >
                <feOffset dy="3" input="SourceAlpha" />
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feFlood flood-opacity="0.161" />
                <feComposite operator="in" in2="blur" />
                <feComposite in="SourceGraphic" />
            </filter>
            <filter
                id="hover-line-2"
                x={isLarge ? hoverLine2.large.x : hoverLine2.small.x}
                y={isLarge ? hoverLine2.large.y : hoverLine2.small.y}
                width="129"
                height="19"
                filterUnits="userSpaceOnUse"
            >
                <feOffset dy="3" input="SourceAlpha" />
                <feGaussianBlur stdDeviation="3" result="blur-2" />
                <feFlood flood-opacity="0.161" />
                <feComposite operator="in" in2="blur-2" />
                <feComposite in="SourceGraphic" />
            </filter>
            <pattern
                id="patternY"
                width="1"
                height="1"
                viewBox="13.155 0 40 40"
            >
                <image
                    preserveAspectRatio="xMidYMid slice"
                    width="71.186"
                    height="40"
                    href={titleCardImage}
                />
            </pattern>
            <clipPath id="imageX">
                <rect width={windowWidth} height={svgHeight} />
            </clipPath>
        </defs>
        <rect
            id="butterChiken"
            width={windowWidth}
            height={recipeContainerTop()}
            fill="url(#pattern)"
        />
        <g
            id="title-card"
            transform="translate(0 {isLarge
                ? titleCard.large
                : titleCard.small})"
        >
            <g id="recipe">
                <path
                    id="title-rect"
                    d="M0,0H206a30,30,0,0,1,30,30V136a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z"
                    fill="rgba(255,255,255,0.43)"
                />
                <g
                    id="_Avatar"
                    data-name="👤 Avatar"
                    transform="translate(20 48)"
                >
                    <g
                        id="Dark_ΩElements_Avatar"
                        data-name="Dark 🌑/ ΩElements/Avatar"
                    >
                        <circle
                            id="butterChikenS"
                            cx="20"
                            cy="20"
                            r="20"
                            fill="url(#patternX)"
                        />
                    </g>
                </g>
                <text
                    id="_Headline_6"
                    data-name="✏️ Headline 6"
                    transform="translate(17 40)"
                    fill="rgba(255,255,255,0.87)"
                    font-size="24"
                    font-family="Roboto-Regular, Roboto"
                    letter-spacing="0.007em"
                    ><tspan x="0" y="0">Mixed Berries</tspan></text
                >
                <text
                    id="_Body_2"
                    data-name="✏️ Body 2"
                    transform="translate(78 60)"
                    fill="rgba(255,255,255,0.87)"
                    font-size="14"
                    font-family="Roboto-Regular, Roboto"
                    letter-spacing="0.018em"
                    ><tspan x="0" y="0">Main Course</tspan></text
                >
            </g>
        </g>
        <g
            id="icon_social_share_24px_"
            data-name="icon/social/share_24px "
            transform="translate({windowWidth - 54} 27)"
        >
            <rect id="Boundary" width="24" height="24" fill="none" />
            <path
                id="_Color"
                data-name=" ↳Color"
                d="M15,14.137a2.906,2.906,0,0,0-1.96.773L5.91,10.743a3.3,3.3,0,0,0,.09-.7,3.3,3.3,0,0,0-.09-.7l7.05-4.127A2.99,2.99,0,0,0,18,3.012a3,3,0,1,0-6,0,3.3,3.3,0,0,0,.09.7L5.04,7.841a3.012,3.012,0,1,0,0,4.4l7.12,4.177a2.843,2.843,0,0,0-.08.653A2.92,2.92,0,1,0,15,14.137Z"
                transform="translate(3 2)"
                fill="#fff"
            />
        </g>
        <g
            id="icon_navigation_chevron_left_24px"
            data-name="icon/navigation/chevron_left_24px"
            transform="translate(54 27)"
        >
            <rect
                id="Boundary-2"
                data-name="Boundary"
                width="24"
                height="24"
                fill="none"
            />
            <path
                id="_Color-2"
                data-name=" ↳Color"
                d="M7.4,1.41,5.992,0,0,6l5.992,6L7.4,10.59,2.826,6Z"
                transform="translate(8 6)"
                fill="#fff"
            />
        </g>
                        <g
                    id="difficulty"
                    transform="translate({windowWidth - 108} {windowHeight -
                        recipeContainerTop() -
                        189})"
                >
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
                            fill="rgba(0,0,0,0.6)"
                            font-size="12"
                            font-family="Roboto-Regular, Roboto"
                            letter-spacing="0.033em"
                        >
                            <tspan x="0" y="0">Easy</tspan>
                        </text>
                        <g id="icon-difficulty" transform="translate(14 11)">
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
                            fill="rgba(0,0,0,0.6)"
                            font-size="12"
                            font-family="Roboto-Regular, Roboto"
                            letter-spacing="0.033em"
                        >
                            <tspan x="0" y="0">Prep 20m</tspan>
                        </text>
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
                            fill="rgba(0,0,0,0.6)"
                            font-size="12"
                            font-family="Roboto-Regular, Roboto"
                            letter-spacing="0.033em"
                        >
                            <tspan x="0" y="0">Cook 5m</tspan>
                        </text>
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
                <g
                id="difficulty"
                transform="translate({windowWidth - 108} {recipeContainerTop() - 108})"
            >
                <path
                    id="difficulty-bg"
                    width="108"
                    height="108"
                    fill="rgba(255,255,255,1)"
                    opacity="0.76"
                    rx="10"
                    d="M0,0H108a30,30,0,0,1,30,30V108a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V30A30,30,0,0,1,30,0Z"
                />
                <g id="ease">
                    <text
                        id="Easy"
                        transform="translate(39 26)"
                        fill="rgba(0,0,0,0.6)"
                        font-size="12"
                        font-family="Roboto-Regular, Roboto"
                        letter-spacing="0.033em"
                    >
                        <tspan x="0" y="0">Easy</tspan>
                    </text>
                    <g id="icon-difficulty" transform="translate(14 11)">
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
                        fill="rgba(0,0,0,0.6)"
                        font-size="12"
                        font-family="Roboto-Regular, Roboto"
                        letter-spacing="0.033em"
                    >
                        <tspan x="0" y="0">Prep 20m</tspan>
                    </text>
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
                        fill="rgba(0,0,0,0.6)"
                        font-size="12"
                        font-family="Roboto-Regular, Roboto"
                        letter-spacing="0.033em"
                    >
                        <tspan x="0" y="0">Cook 5m</tspan>
                    </text>
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
    </svg>
</div>
<div id="container" style="height:{window.innerHeight - recipeContainerTop() - 50}px">
    <div id="div2" style="height:{svgHeight}px;">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width={windowWidth}
            height={svgHeight}
            viewBox="0 0 {windowWidth} {svgHeight}"
        >
            <g id="recipe-container" width={windowWidth} height={svgHeight}>
                <rect
                    id="bg"
                    width={windowWidth}
                    height={svgHeight}
                    rx="30"
                    fill="whitesmoke"
                />
                <g
                    id="food-card"
                    transform="translate({windowWidth / 2 - 116} {isLarge
                        ? 108
                        : 81})"
                >
                    <text
                        id="food-text"
                        data-name="food-text"
                        transform="translate(0)"
                        fill="rgba(0,0,0,0.6)"
                        font-size="12"
                        font-family="Roboto-Regular, Roboto"
                    >
                        <tspan x="0" y="13" xml:space="preserve"
                            >Broccoli is a green vegetable that vaguely
                        </tspan>
                        <tspan x="0" y="29"
                            >nutritional Powerhouse of vitamin,fiber and
                        </tspan>
                        <tspan x="0" y="45" xml:space="preserve"
                            >antioxidents.Broccoli contains lutein and
                        </tspan>
                        <tspan x="0" y="61"
                            >which mayPrevent from stress and cellular
                        </tspan>
                        <tspan x="0" y="77">damage in yourEyes.</tspan>
                    </text>
                </g>
                <g
                    id="instruction"
                    transform="translate({isLarge ? windowWidth - 400 : 0})"
                    opacity={isLarge? 1 :!buttonActive ? 1 : 0}
                >
                <path
                        id="bg-2"
                        data-name="bg"
                        d="M30,0H{isLarge
                            ? directive.large
                            : directive.small}a30,30,0,0,1,30,30V{svgHeight}a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V00A30,30,0,0,1,30,0Z"
                        fill="#e2e2e2"
                        opacity={isLarge ? 1 : 0}
                    />
                    <g id="instruction-list" transform="translate(0 0)">
                        {#each butterChickenIngredient.preparation as prep, i}
                        <foreignObject  transform="translate(26 {iinstructionMap[i]})" width="{isLarge? 300:windowWidth - 30}"  height="40" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                            <div id=text-container style="height: 40px;display: flex;align-items: center;justify-content: center;">
                                <span style="height:24px; width:24px; margin:0 10px 0 0;">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                                        <g id="icon_toggle_radio_button_checked_24px" data-name="icon/toggle/radio_button_checked_24px">
                                            <rect id="Boundary-3" data-name="Boundary" width="24" height="24" fill="none"/>
                                            <path id="_Color-3" data-name=" ↳Color" d="M10,20A10,10,0,1,1,20,10,10.011,10.011,0,0,1,10,20ZM10,2a8,8,0,1,0,8,8A8.009,8.009,0,0,0,10,2Zm0,13a5,5,0,1,1,5-5A5.006,5.006,0,0,1,10,15Z" transform="translate(2 2)" fill="#dcb6a9"/>
                                        </g>
                                    </svg>
                                </span>
                                <span style="height: 24px;width: 270px;margin: 0px;display: flex;align-content: center;align-items: flex-end;">
                                <p style="height: 24px;width: 270px;margin: 0px;font: var(--font-ingredient-font);text-align: left;display: flex;align-items: center;">{prep}</p>
                            </span>
                            </div>
                        </foreignObject>
                    {/each}
                    </g>
                    <text
                        id="Instructions"
                        transform="translate({isLarge
                            ? 400 / 2 - 40
                            : windowWidth / 2 - 40} 54)"
                        fill="#dcb6a9"
                        font-size="16"
                        font-family="Roboto-Regular, Roboto"
                        letter-spacing="0.009em"
                    >
                        <tspan x="0" y="17">Instructions</tspan>
                    </text>
                </g>
                <g
                    id="ingredients"
                    width="300"
                    transform="translate(0 0)"
                    opacity={isLarge?1:buttonActive ? 1 : 0}
                >
                    <path
                        id="bg-2"
                        data-name="bg"
                        d="M30,0H{isLarge
                            ? directive.large
                            : directive.small}a0,0,0,0,1,0,0V{svgHeight}a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V30A30,30,0,0,1,30,0Z"
                        fill="#e2e2e2"
                        opacity={isLarge ? 1 : 0}
                    />
                    {#each butterChickenIngredient.ingredients as ing, i}
                        <foreignObject  transform="translate(26 {ingredientMap[i]})" width="{isLarge? 400:windowWidth - 30}"  height="40" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                            <div id=text-container style="height: 40px;display: flex;align-items: center;justify-content: center;">
                                <span style="height:24px; width:24px; margin:0 10px 0 0;">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                                        <g id="icon_toggle_radio_button_checked_24px" data-name="icon/toggle/radio_button_checked_24px">
                                            <rect id="Boundary-3" data-name="Boundary" width="24" height="24" fill="none"/>
                                            <path id="_Color-3" data-name=" ↳Color" d="M10,20A10,10,0,1,1,20,10,10.011,10.011,0,0,1,10,20ZM10,2a8,8,0,1,0,8,8A8.009,8.009,0,0,0,10,2Zm0,13a5,5,0,1,1,5-5A5.006,5.006,0,0,1,10,15Z" transform="translate(2 2)" fill="#dcb6a9"/>
                                        </g>
                                    </svg>
                                </span>
                                <span style="height: 24px;width: 270px;margin: 0px;display: flex;align-content: center;align-items: flex-end;">
                                <p style="height: 24px;width: 270px;margin: 0px;font: var(--font-ingredient-font);text-align: left;display: flex;align-items: center;">{ing}</p>
                            </span>
                            </div>
                        </foreignObject>
                    {/each}
                    <text
                        id="Ingredients-2"
                        data-name="Ingredients"
                        transform="translate({isLarge
                            ? 300 / 2 - 40
                            : windowWidth / 2 - 40} 54)"
                        fill="#dcb6a9"
                        font-size="16"
                        font-family="Roboto-Regular, Roboto"
                        letter-spacing="0.009em"
                    >
                        <tspan x="0" y="17">Ingredients</tspan>
                    </text>
                </g>
                <rect
                    id="handle"
                    width="72"
                    height="12"
                    rx="6"
                    transform="translate({windowWidth / 2 - 36} 27)"
                    fill="#a6bcd0"
                />
            </g>
        </svg>
    </div>
</div>
<footer style="height:50px">
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width={windowWidth}
        height="34"
        viewBox="0 0 {windowWidth} 34"
    >
        <g id="extended-navbar" transform="translate({windowWidth / 2 - 120} )">
            <rect
                id="navbar-rectangle-extended"
                width="240"
                height="34"
                fill="rgba(54,54,54,0)"
            />
            <g id="tab-bar">
                <foreignObject
                    id="foreign-tab-button"
                    width="120"
                    height="32"
                    fill="none"
                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                >
                    <button
                        id="tab-button"
                        style="width:120px; height:32px; padding:0; border-radius:2px;"
                        fill="none"
                        on:click={() => {
                            buttonActive = !buttonActive;
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                        >
                            <rect
                                id="tab-square-bg"
                                width="120"
                                height="32"
                                transform="translate(0 8.5)"
                                fill="none"
                            />
                            <rect
                                id="tab-square"
                                width="120"
                                height="32"
                                transform="translate(4)"
                                fill="none"
                            />
                            <text
                                id="tab-text"
                                transform="translate(24 19)"
                                fill={isLarge?"#e1886a":buttonActive ? "#e1886a" : "#a6bcd0"}
                                font-size="16"
                                font-family="Roboto-Regular, Roboto"
                                letter-spacing="0.009em"
                                ><tspan x="0" y="0">Ingredients</tspan></text
                            >
                            <g
                                transform="matrix(1, 0, 0, 1, -4, 0)"
                                filter="url(#hover-line)"
                            >
                                <line
                                    id="hover-line-3"
                                    data-name="hover-line"
                                    x2="110"
                                    transform="translate(9.5 27)"
                                    fill="none"
                                    stroke={isLarge?"#e1886a":buttonActive ? "#e1886a" : "#a6bcd0"}
                                    stroke-linecap="round"
                                    stroke-width="1"
                                />
                            </g>
                        </svg>
                    </button>
                </foreignObject>
                <foreignObject
                    id="foreign-tab-button"
                    width="120"
                    height="32"
                    fill="none"
                    transform="translate(120)"
                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                >
                    <button
                        id="tab-button"
                        style="width:120px; height:32px; padding:0; border-radius:2px;"
                        fill="none"
                        on:click={() => {
                            buttonActive = !buttonActive;
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                        >
                            <rect
                                id="tab-square-bg"
                                width="120"
                                height="32"
                                transform="translate(0 8.5)"
                                fill="none"
                            />
                            <rect
                                id="tab-square"
                                width="120"
                                height="32"
                                transform="translate(4)"
                                fill="none"
                            />
                            <text
                                id="tab-text"
                                transform="translate(17 17.5)"
                                fill={isLarge?"#e1886a":!buttonActive ? "#e1886a" : "#a6bcd0"}
                                font-size="16"
                                font-family="Roboto-Regular, Roboto"
                                letter-spacing="0.009em"
                                ><tspan x="0" y="0">Instructions</tspan></text
                            >
                            <g
                                transform="matrix(1, 0, 0, 1, -4, 0)"
                                filter="url(#hover-line)"
                            >
                                <line
                                    id="hover-line-3"
                                    data-name="hover-line"
                                    x2="110"
                                    transform="translate(9.5 27)"
                                    fill="none"
                                    stroke={isLarge?"#e1886a" :!buttonActive ?"#e1886a" : "#a6bcd0"}
                                    stroke-linecap="round"
                                    stroke-width="1"
                                />
                            </g>
                        </svg>
                    </button>
                </foreignObject>
            </g>
        </g>
    </svg>
</footer>

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
</style>
