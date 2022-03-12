<script>
    import { Router } from "svelte-routing";
    import InputText from "../Inputs/InputText.svelte";
    import { setNavigateTo,setPageName } from "../../functions/setNavigateTo";
    import {
        famFoodAlergies,
        famMedicalAlergies,
        navigatorCount,
    } from "../../functions/formAccumulator";
    import { setDimensions } from "../../dimensions/svgSettings";
    import { afterUpdate, onMount } from "svelte";
    import FormViewer from "../../Utilities/FormViewer.svelte";
    export let isFormReady = false;
    let foodCount = 0;
    let medCount = 0;
    let svgTranslate3;

    onMount(() => {
        document.body.scrollIntoView();
        isFormReady = true;
        setPageName(["Family Alergies","Form"],"List down any family allergies.","allergy")
        return setNavigateTo("/page-recipes", true);
    });
    const addAlergie = (alergy) => {
        switch (alergy) {
            case "food":
                foodCount += 1;
                famFoodAlergies.update((n) =>
                    n.concat([
                        {
                            inputName: "fam-food-alergies-" + foodCount,
                            inputPlaceholder: "Food Alergies?",
                            isRequired: "false",
                        },
                    ])
                );
                //console.log(get(foodAlergies));
                break;
            case "med":
                medCount += 1;
                famMedicalAlergies.update((n) =>
                    n.concat([
                        {
                            inputName: "fam-med-alergies-" + medCount,
                            inputPlaceholder: "Medical Alergies?",
                            isRequired: "false",
                        },
                    ])
                );
                //console.log(get(medicalAlergies));
                break;
        }
    };
</script>

<div class="MainContainer">
    <Router url="family-allergies" basepath="family-allergies">
        <FormViewer
        >
            <div id="content" slot="slot1">
                <div id="allergy-slot">
                    <div class="input-container">
                        <div class="input-slot">
                            <svg
                                id="add_food_allergy_button"
                                data-name="Dark 🌑 / Lists/Two-line (5 States)"
                                xmlns="http://www.w3.org/2000/svg"
                                width="300"
                                height="64"
                                viewBox="0 0 300 64"
                            >
                                <rect
                                    id="_Elevation"
                                    data-name="☁️ Elevation"
                                    width="300"
                                    height="64"
                                    fill="none"
                                />
                                <rect
                                    id="_States"
                                    data-name="💡States"
                                    width="300"
                                    height="64"
                                    fill="none"
                                />
                                <g
                                    id="Dark_Devider"
                                    data-name="Dark 🌑 / Devider"
                                    transform="translate(16 63)"
                                >
                                    <rect
                                        id="Dark_Devider-2"
                                        data-name="Dark 🌑/ Devider"
                                        width="300"
                                        height="1"
                                        fill="rgb(0 0 0 / 12%)"
                                    />
                                </g>
                                <g
                                    id="add_icon"
                                    data-name="📍Icon"
                                    transform="translate(250 20)"
                                >
                                    <rect
                                        id="Boundary"
                                        width="24"
                                        height="24"
                                        fill="none"
                                    />
                                    <circle
                                        id="button-round-active-2"
                                        data-name="button-round-active"
                                        cx="11.25"
                                        cy="11.25"
                                        r="11.25"
                                        fill="#7bed8d"
                                    />
                                    <circle
                                        id="button-round-hover"
                                        data-name="button-round-hover"
                                        cx="15.5"
                                        cy="15.5"
                                        r=" 15.5"
                                        transform="translate(-4, -4)"
                                        fill="#7bed8c93"
                                        opacity= "0"
                                    />
                                    <line
                                        id="p2"
                                        y2="14"
                                        transform="translate(11.5, 4)"
                                        fill="none"
                                        stroke="#fff"
                                        stroke-width="1"
                                    />
                                    <line
                                        id="p1"
                                        y2="14"
                                        transform="translate(18, 11) rotate(90)"
                                        fill="none"
                                        stroke="#fff"
                                        stroke-width="1"
                                    />
                                    <foreignObject
                                    width="24"
                                    height="24"
                                    color="transparent"
                                >
                                    <html:button width="24" height="24" on:click={() => addAlergie("med")}>bUTTON</html:button>
                                </foreignObject>
                                </g>
                                <text
                                    id="_Secondary_text"
                                    data-name="✏️Secondary text"
                                    transform="translate(16 45)"
                                    fill="rgba(255,255,255,0.6)"
                                    font-size="14"
                                    font-family="Roboto-Regular, Roboto"
                                    letter-spacing="0.018em"
                                    ><tspan x="0" y="0"
                                        >Do you have any medical allergies?</tspan
                                    ></text
                                >
                                <text
                                    id="_Subtitle_1"
                                    data-name="✏️ Subtitle 1"
                                    transform="translate(16 27)"
                                    fill="rgba(255,255,255,0.87)"
                                    font-size="16"
                                    font-family="Roboto-Regular, Roboto"
                                    letter-spacing="0.031em"
                                    ><tspan x="0" y="0"
                                        >Medical Alergies
                                    </tspan></text
                                >

                            </svg>
                        </div>
                    </div>
                </div>
                <div id="allergy-slot">
                    <div class="input-container">
                        <div class="input-slot">
                            <svg
                                id="add_food_allergy_button"
                                data-name="Dark 🌑 / Lists/Two-line (5 States)"
                                xmlns="http://www.w3.org/2000/svg"
                                width="300"
                                height="64"
                                viewBox="0 0 300 64"
                            >
                                <rect
                                    id="_Elevation"
                                    data-name="☁️ Elevation"
                                    width="300"
                                    height="64"
                                    fill="none"
                                />
                                <rect
                                    id="_States"
                                    data-name="💡States"
                                    width="300"
                                    height="64"
                                    fill="none"
                                />
                                <g
                                    id="Dark_Devider"
                                    data-name="Dark 🌑 / Devider"
                                    transform="translate(16 63)"
                                >
                                    <rect
                                        id="Dark_Devider-2"
                                        data-name="Dark 🌑/ Devider"
                                        width="300"
                                        height="1"
                                        fill="rgb(0 0 0 / 12%)"
                                    />
                                </g>
                                <g
                                    id="add_icon"
                                    data-name="📍Icon"
                                    transform="translate(250 20)"
                                >
                                    <rect
                                        id="Boundary"
                                        width="24"
                                        height="24"
                                        fill="none"
                                    />
                                    <circle
                                        id="button-round-active-2"
                                        data-name="button-round-active"
                                        cx="11.25"
                                        cy="11.25"
                                        r="11.25"
                                        fill="#7bed8d"
                                    />
                                    <circle
                                        id="button-round-hover"
                                        data-name="button-round-hover"
                                        cx="15.5"
                                        cy="15.5"
                                        r=" 15.5"
                                        transform="translate(-4, -4)"
                                        fill="#7bed8c93"
                                        opacity= "0"
                                    />
                                    <line
                                        id="p2"
                                        y2="14"
                                        transform="translate(11.5, 4)"
                                        fill="none"
                                        stroke="#fff"
                                        stroke-width="1"
                                    />
                                    <line
                                        id="p1"
                                        y2="14"
                                        transform="translate(18, 11) rotate(90)"
                                        fill="none"
                                        stroke="#fff"
                                        stroke-width="1"
                                    />
                                    <foreignObject
                                    width="24"
                                    height="24"
                                    color="transparent"
                                >
                                    <html:button width="24" height="24" on:click={() => addAlergie("food")}>bUTTON</html:button>
                                </foreignObject>
                                </g>
                                <text
                                    id="_Secondary_text"
                                    data-name="✏️Secondary text"
                                    transform="translate(16 45)"
                                    fill="rgba(255,255,255,0.6)"
                                    font-size="14"
                                    font-family="Roboto-Regular, Roboto"
                                    letter-spacing="0.018em"
                                    ><tspan x="0" y="0"
                                        >Any family food allergies?</tspan
                                    ></text
                                >
                                <text
                                    id="_Subtitle_1"
                                    data-name="✏️ Subtitle 1"
                                    transform="translate(16 27)"
                                    fill="rgba(255,255,255,0.87)"
                                    font-size="16"
                                    font-family="Roboto-Regular, Roboto"
                                    letter-spacing="0.031em"
                                    ><tspan x="0" y="0"
                                        >Food Alergies
                                    </tspan></text
                                >

                            </svg>
                        </div>
                    </div>
                </div>
                {#each $famMedicalAlergies as item}
                <svelte:component this={InputText} {...item} />
                {/each}
                {#each $famFoodAlergies as item}
                    <svelte:component this={InputText} {...item} />
                {/each}
            </div>
        </FormViewer>
    </Router>
</div>
<style>
    text,
    path#_Color {
        fill: black;
    }
    #add_icon {
        cursor: pointer;
    }
    #add_icon:hover #button-round-hover{
        opacity: 1;
    }
    button{
        width: 24px;
        height: 24px;
    }
</style>
