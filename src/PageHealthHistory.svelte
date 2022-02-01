<script>
    import { Router } from "svelte-routing";
    import FormContainer from "./FormContainer.svelte";
    import InputCheckbox from "./InputCheckbox.svelte";
    import InputText from "./InputText.svelte";
    import { get } from "svelte/store";
    import { foodAlergies, medicalAlergies } from "./functions/formAccumulator";
    import { onMount } from "svelte";
    export let isFormReady = false;
    let foodCount = 0;
    let medCount = 0;

    const addAlergie = (alergy) => {
        switch (alergy) {
            case "food":
                foodCount += 1;
                foodAlergies.update((n) =>
                    n.concat([
                        {
                            inputName: "alergies-" + foodCount,
                            inputPlaceholder: "Any Food Alergies?",
                            isRequired: "true",
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
                            isRequired: "true",
                        },
                    ])
                );
                //console.log(get(medicalAlergies));
                break;
        }
    };

</script>

<Router url="health-history" basepath="health-history">
    <FormContainer>
        <h1 slot="heading">Health History</h1>
        <div class="inner-form" slot="forms">
            <p>
                Do you have or have currently experienced the following
                underlying conditions?
            </p>
            <InputCheckbox
                inputName="my-asthma"
                checkboxtext="Asthma"
                isRequired=false
            />
            <InputCheckbox
                inputName="my-hypertension"
                checkboxtext="Hypertension"
                isRequired=false
            />
            <InputCheckbox
                inputName="my-diabetes"
                checkboxtext="Diabetes"
                isRequired=false
            />
            <InputCheckbox
                inputName="my-heartdisease"
                checkboxtext="Heart Disease"
                isRequired=false
            />
            <p>
                Do you have a family history of any of the following underlying
                conditions?
            </p>
            <InputCheckbox
                inputName="fam-asthma"
                checkboxtext="Asthma"
                isRequired=false
            />
            <InputCheckbox
                inputName="fam-hypertension"
                checkboxtext="Hypertension"
                isRequired=false
            />
            <InputCheckbox
                inputName="fam-diabetes"
                checkboxtext="Diabetes"
                isRequired=false
            />
            <InputCheckbox
                inputName="fam-heartdisease"
                checkboxtext="Heart Disease"
                isRequired=false
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
                <button class="add-button" on:click={() => addAlergie("food")} />
            </div>

            {#each $foodAlergies as item}
                <svelte:component this={InputText} {...item} />
            {/each}
            <br>
        </div>
    </FormContainer>
</Router>
