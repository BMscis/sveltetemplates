<script>
    import { Router, navigate } from "svelte-routing";
    import FormContainer from "./FormContainer.svelte";
    import InputCheckbox from "./InputCheckbox.svelte";
    import InputText from "./InputText.svelte";
    import { get } from "svelte/store";
    import { foodAlergies, medicalAlergies } from "./functions/formAccumulator";
    import { afterUpdate, onMount } from "svelte";
    export let isFormReady = false;
    let foodCount = 0;
    let medCount = 0;
    onMount(() => {
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
<div class="container"></div>
<Router url="health-history" basepath="health-history">
    <FormContainer bgColor="#1d6dea">
        <h1 slot="heading">Health History</h1>
        <div class="inner-form" slot="forms">
            <p>
                Do you have or have currently experienced the following
                underlying conditions?
            </p>
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
            <p>
                Do you have a family history of any of the following underlying
                conditions?
            </p>
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
                <button class="add-button" on:click={() => addAlergie("med")} />
            </div>

            {#each $medicalAlergies as item}
                <svelte:component this={InputText} {...item} />
            {/each}
            <div class="p-button">
                <p>Do you have any alergies?</p>
                <button
                    class="add-button"
                    on:click={() => addAlergie("food")}
                />
            </div>

            {#each $foodAlergies as item}
                <svelte:component this={InputText} {...item} />
            {/each}
            <button
                on:click={() => {
                    navigate("/user-profile", { replace: false });
                }}
                class="navbutton">Let's Continue</button
            >
            <br />
        </div>
    </FormContainer>
</Router>
<style>
    button.navbutton:not(:disabled) {
    text-align: center;
    background-color: #fd8f02;
    color: white;
    border-radius: 4px;
    box-shadow: 1px 1px 5px #00000087;
}
</style>
