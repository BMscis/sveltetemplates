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
        return setNavigateTo("/user-profile", true);
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
                <div class="p-button">
                    <p>Do you have any medical alergies?</p>
                    <button
                        class="add-button"
                        on:click={() => addAlergie("med")}
                    />
                </div>
                {#each $famMedicalAlergies as item}
                    <svelte:component this={InputText} {...item} />
                {/each}
                <div class="p-button">
                    <p>Do you have any food alergies?</p>
                    <button
                        class="add-button"
                        on:click={() => addAlergie("food")}
                    />
                </div>
                {#each $famFoodAlergies as item}
                    <svelte:component this={InputText} {...item} />
                {/each}
            </div>
        </FormViewer>
    </Router>
</div>
<style>
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
