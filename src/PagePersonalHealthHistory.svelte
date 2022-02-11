<script>
    import { Router, navigate } from "svelte-routing";
    import FormContainer from "./FormContainer.svelte";
    import InputCheckbox from "./InputCheckbox.svelte";
    import InputText from "./InputText.svelte";
    import { get } from "svelte/store";
    import { foodAlergies, medicalAlergies } from "./functions/formAccumulator";
    import { afterUpdate, onMount } from "svelte";
import FormViewer from "./FormViewer.svelte";
    export let isFormReady = false;
    let foodCount = 0;
    let medCount = 0;
    let bgColor = "#1d6dea"
    
    onMount(() => {
        document.body.scrollIntoView()
        isFormReady = false;
    });
    afterUpdate(() => {
        if (isFormReady) {
            
        }
    });
    const addAlergie = (alergy) => {
        switch (alergy) {
            case "food":
                foodCount += 1;
                foodAlergies.update((n) =>
                    n.concat([
                        {
                            inputName: "alergies-" + foodCount,
                            inputPlaceholder: "Any Food Alergies?",
                            isRequired: "false",
                        },
                    ])
                );
                //console.log(get(foodAlergies));
                break;
            case "med":
                medCount += 1;
                medicalAlergies.update((n) =>
                    n.concat([
                        {
                            inputName: "med-alergies-" + medCount,
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
    <FormViewer header="Personal Health History" onboardingText="Does you have any experience with any of these afflictions?">
        <div id="content"   slot="slot1">
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
            <div class="p-button">
                <p>Do you have any medical alergies?</p>
                <button class="add-button" on:click={() => addAlergie("med")} />
            </div>
            {#each $medicalAlergies as item}
                <svelte:component this={InputText} {...item} />
            {/each}
            <div class="p-button">
                <p>Do you have any food alergies?</p>
                <button
                    class="add-button"
                    on:click={() => addAlergie("food")}
                />
            </div>
            {#each $foodAlergies as item}
                <svelte:component this={InputText} {...item} />
            {/each}
        </div>
        <button slot="slot2"
            on:click={() => {
                navigate("/family-health-history", { replace: false });
            }}
            class="navbutton">Let's Continue</button
        >
    </FormViewer>
</Router>
</div>
<div  class="steps">
    <h1>STEP 0<span style="color: {bgColor};">4</span></h1>
    <p>How about your health history?</p>
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
*:global(.outline-text-slot){
        background-color:#bb974a ;
    }
</style>
