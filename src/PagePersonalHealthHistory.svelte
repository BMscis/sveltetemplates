<script>
    import { Router } from "svelte-routing";
    import InputCheckbox from "./InputCheckbox.svelte";
    import InputText from "./InputText.svelte";
    import { setNavigateTo } from "./functions/setNavigateTo";
    import {
        myFoodAlergies,
        myMedicalAlergies,
        navigatorCount,
    } from "./functions/formAccumulator";
    import { afterUpdate, onMount } from "svelte";
    import FormViewer from "./FormViewer.svelte";
    export let isFormReady = false;
    let foodCount = 0;
    let medCount = 0;
    let bgColor = "#1d6dea";

    onMount(() => {
        document.body.scrollIntoView();
        isFormReady = false;
        navigatorCount.update((n) => n + 1);
        return setNavigateTo("/family-health-history", true);
    });
    afterUpdate(() => {
        if (isFormReady) {
        }
    });
    const addAlergie = (alergy) => {
        switch (alergy) {
            case "food":
                foodCount += 1;
                myFoodAlergies.update((n) =>
                    n.concat([
                        {
                            inputName: "my-food-alergies-" + foodCount,
                            inputPlaceholder: "Any Food Alergies?",
                            isRequired: "false",
                        },
                    ])
                );
                //console.log(get(foodAlergies));
                break;
            case "med":
                medCount += 1;
                myMedicalAlergies.update((n) =>
                    n.concat([
                        {
                            inputName: "my-med-alergies-" + medCount,
                            inputPlaceholder: "Any Medical Alergies?",
                            isRequired: "false",
                        },
                    ])
                );
                //console.log(get(medicalAlergies));
                break;
        }
    };
</script>

<div class="Mycontainer">
    <Router url="personal-health-history" basepath="personal-health-history">
        <FormViewer
            header="Personal Health History"
            onboardingText="Does you have any experience with any of these afflictions?"
        >
            <div id="content" slot="slot1">
                <InputCheckbox
                    inputName="my-asthma"
                    checkboxtext="Asthma"
                    isRequired="false"
                />
                <InputCheckbox
                    inputName="my-hypertension"
                    checkboxtext="Hypertension"
                    isRequired="false"
                />
                <InputCheckbox
                    inputName="my-diabetes"
                    checkboxtext="Diabetes"
                    isRequired="false"
                />
                <InputCheckbox
                    inputName="my-heartdisease"
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
                        <svg id="button-circle-add" xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45">
                            <g id="button-round-active">
                              <circle id="button-round-active-2" data-name="button-round-active" cx="22.5" cy="22.5" r="22.5" fill="#7bed8d"/>
                            </g>
                            <g id="add" transform="translate(-337 -629)">
                              <line id="p2" y2="14" transform="translate(359.5 644.5)" fill="none" stroke="#fff" stroke-width="1"/>
                              <line id="p1" y2="14" transform="translate(366.5 651.5) rotate(90)" fill="none" stroke="#fff" stroke-width="1"/>
                            </g>
                          </svg>
                    </button>
                    </div>
                </div>
                {#each $myMedicalAlergies as item}
                    <svelte:component this={InputText} {...item} />
                {/each}
                <div class="input-container">
                    <div class="input-slot">
                        <p>Do you have any food alergies?</p>
                        <button
                            class="add-button"
                            on:click={() => addAlergie("food")}
                        >
                        <svg id="button-circle-add" xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45">
                            <g id="button-round-active">
                              <circle id="button-round-active-2" data-name="button-round-active" cx="22.5" cy="22.5" r="22.5" fill="#7bed8d"/>
                            </g>
                            <g id="add" transform="translate(-337 -629)">
                              <line id="p2" y2="14" transform="translate(359.5 644.5)" fill="none" stroke="#fff" stroke-width="1"/>
                              <line id="p1" y2="14" transform="translate(366.5 651.5) rotate(90)" fill="none" stroke="#fff" stroke-width="1"/>
                            </g>
                          </svg>
                    </button>
                    </div>
                </div>
                {#each $myFoodAlergies as item}
                    <svelte:component this={InputText} {...item} />
                {/each}
            </div>
        </FormViewer>
    </Router>
</div>
<style>
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
    #n_FAB_Color {
    fill: rgba(3,218,197,1);
    }
    svg.n_FAB_Color {
    height: 48px;
    width: 126px;
    justify-self: center;
    align-self: center;
    }
</style>
