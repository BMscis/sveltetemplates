<script>
    import dayjs from 'dayjs';
    import { Datepicker } from "svelte-calendar";
    import InputContainer from "./InputContainer.svelte";
    import { createFieldValidator } from "./functions/validation.js";
    import { validityCheck, validityRangeCheck } from "./functions/validCheck";
    const format = "DD/MM/YYYY";
    let inputName = "dob";
    let isRequired = true;
    let store;
    const theme = {
        calendar: {
            width: "100%",
            maxWidth: "100%",
            height: "100%",
            minWidth:"unset",
            minHeight:"unset",
            colors: {
                background: {
                    highlight: "purple",
                },
            },
        },
    };
    const [validity, validate] = createFieldValidator(
        0,
        inputName,
        isRequired,
        true
    );
    $: try {
        validityCheck(inputName, dayjs($store.selected).format("DD/MM/YYYY"), $store.hasChosen);
    } catch (error) {}
</script>

<InputContainer popover=true>
    <Datepicker bind:store slot="input-slot" {format} {theme} />
</InputContainer>
