<script>
    import { Datepicker } from "svelte-calendar";
    import InputContainer from "./InputContainer.svelte";
    import {chekiSaa} from "./functions/validators.js";
	import { createFieldValidator } from "./functions/validation.js";
    const format = "DD/MM/YYYY";
    let inputName = "dob";
    let isRequired = true;
    let store;
    let selected;
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
        "",
        inputName,
        isRequired,
        true,
        chekiSaa()
    );
    $: try {
        if($store.hasChosen){
            selected = $store.selected
        }
    } catch (error) {}
</script>

<InputContainer popover=true>
    <Datepicker bind:store slot="input-slot" {format} {theme} />
    <input slot="outline-symbol-slot" name="dob" id="dob" type="text" bind:value={selected} use:validate={selected}>
</InputContainer>
<style>
    input#dob {
    display: none;
}
</style>