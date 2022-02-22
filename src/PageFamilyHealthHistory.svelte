<script>
    import { Router } from "svelte-routing";
    import { setNavigateTo } from "./functions/setNavigateTo";
    import InputCheckbox from "./InputCheckbox.svelte";
    import InputText from "./InputText.svelte";
    import {
        famFoodAlergies,
        famMedicalAlergies,
        navigatorCount,
    } from "./functions/formAccumulator";
    import {setDimensions} from "./dimensions/svgSettings"
    import { afterUpdate, onMount } from "svelte";
    import FormViewer from "./FormViewer.svelte";
    export let isFormReady = false;
    let foodCount = 0;
    let medCount = 0;
    let bgColor = "#1d6dea";
    let svgWidth1
    let svgHeight1
    let svgRx1
    let svgWidth2
    let svgHeight2
    let svgRx2
    let svgTranslate1
    let svgTranslate2
    let svgTranslate3
    onMount(() => {
        document.body.scrollIntoView();
        isFormReady = false;
        navigatorCount.update((n) => n + 1);
        [svgWidth1,svgHeight1,svgRx1,svgWidth2,svgHeight2,svgRx2,svgTranslate1,svgTranslate2,svgTranslate3] = setDimensions(true)
        console.log(svgHeight1)
        return setNavigateTo("/page-ingredients", true);
    });
    afterUpdate(() => {
        if (isFormReady) {
        }
    });
    const addAlergie = (alergy) => {
        switch (alergy) {
            case "food":
                foodCount += 1;
                famFoodAlergies.update((n) =>
                    n.concat([
                        {
                            inputName: "fam-food-alergies-" + foodCount,
                            inputPlaceholder: "Any Food Alergies?",
                            isRequired: "false",
                        },
                    ])
                );
                //console.log(get(famFoodAlergies));
                break;
            case "med":
                medCount += 1;
                famMedicalAlergies.update((n) =>
                    n.concat([
                        {
                            inputName: "fam-med-alergies-" + medCount,
                            inputPlaceholder: "Any Medical Alergies?",
                            isRequired: "false",
                        },
                    ])
                );
                //console.log(get(famMedicalAlergies));
                break;
        }
    };
</script>

<div class="Mycontainer">
    <Router url="family-health-history" basepath="family-health-history">
        <FormViewer
            header="Family Health History"
            onboardingText="Has any member of your family experienced any of these afflictions?"
        >
            <div id="content" slot="slot1">
                <InputCheckbox
                    inputName="fam-asthma"
                    checkboxtext="Asthma"
                    isRequired="false"
                />
                <InputCheckbox
                    inputName="fam-hypertension"
                    checkboxtext="Hypertension"
                    isRequired="false"
                />
                <InputCheckbox
                    inputName="fam-diabetes"
                    checkboxtext="Diabetes"
                    isRequired="false"
                />
                <InputCheckbox
                    inputName="fam-heartdisease"
                    checkboxtext="Heart Disease"
                    isRequired="false"
                />
                <div class="input-container">
                    <div class="input-slot">
                        <p>Do you have any medical alergies?</p>
                        <button
                            class="add-button"
                            on:click={() => addAlergie("med")}
                        >
                        <svg id="button-circle-add" xmlns="http://www.w3.org/2000/svg" width={svgHeight1} height={svgHeight1} viewBox="0 0 {svgHeight1} {svgHeight1}">
                            <g id="button-round-active">
                              <circle id="button-round-active-2" data-name="button-round-active" cx={svgRx1} cy={svgRx1} r={svgRx1} fill="#7bed8d"/>
                            </g>
                            <g id="add" transform={svgTranslate3}>
                              <line id="p2" y2="14" transform="translate(359.5 644.5)" fill="none" stroke="#fff" stroke-width="1"/>
                              <line id="p1" y2="14" transform="translate(366.5 651.5) rotate(90)" fill="none" stroke="#fff" stroke-width="1"/>
                            </g>
                          </svg>
                    </button>
                    </div>
                </div>
                {#each $famMedicalAlergies as item}
                    <svelte:component this={InputText} {...item} />
                {/each}
                <div class="input-container">
                    <div class="input-slot">
                        <p>Do you have any food alergies?</p>
                        <button
                            class="add-button"
                            on:click={() => addAlergie("food")}
                        >
                        <svg id="button-circle-add" xmlns="http://www.w3.org/2000/svg" width={svgHeight1} height={svgHeight1} viewBox="0 0 {svgHeight1} {svgHeight1}">
                            <g id="button-round-active">
                              <circle id="button-round-active-2" data-name="button-round-active" cx={svgRx1} cy={svgRx1} r={svgRx1} fill="#7bed8d"/>
                            </g>
                            <g id="add" transform={svgTranslate3}>
                              <line id="p2" y2="14" transform="translate(359.5 644.5)" fill="none" stroke="#fff" stroke-width="1"/>
                              <line id="p1" y2="14" transform="translate(366.5 651.5) rotate(90)" fill="none" stroke="#fff" stroke-width="1"/>
                            </g>
                          </svg>
                    </button>
                    </div>
                </div>
                {#each $famFoodAlergies as item}
                    <svelte:component this={InputText} {...item} />
                {/each}
            </div>
        </FormViewer>
    </Router>
</div>
<style>
	.Mycontainer{
        top:203px;
        height: calc(100% - 203px);
    }
        .input-slot{
        background:transparent;
    }
    button.navbutton:not(:disabled) {
        text-align: center;
        background-color: #fd8f02;
        color: white;
        border-radius: 4px;
        box-shadow: 1px 1px 5px #00000087;
        grid-column-start: 1;
    }
    *:global(.outline-text-slot) {
        background-color: #bb974a;
    }
</style>
