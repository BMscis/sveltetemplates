<script>
    import { Router } from "svelte-routing";
    import { setNavigateTo,setPageName } from "../../functions/setNavigateTo";
    import InputCheckbox from "../Inputs/InputCheckbox.svelte";
    import { onMount } from "svelte";
    import FormViewer from "../../Utilities/FormViewer.svelte";
    export let isFormReady = false;
    const bgColor = "#a300f5";

    onMount(() => {
        document.body.scrollIntoView();
        isFormReady = false;
        setPageName(["Family Information","Form"],"Tell us abit about your family.","nucleus")
        return setNavigateTo("/anthro-measurements", true);
    });
</script>

<div class="MainContainer">
    <Router basepath="/family-information" url="/family-information">
        <FormViewer
            
        >
            <div id="content" slot="slot1">
                <InputCheckbox
                    checkboxtext="Are you Married?"
                    isRequired="false"
                    inputName="married"
                />

                <InputCheckbox
                    checkboxtext="Do you have children?"
                    isRequired="false"
                    inputName="children"
                />
                <InputCheckbox
                    checkboxtext="Are you employed?"
                    isRequired="false"
                    inputName="employed"
                />
            </div>
        </FormViewer>
    </Router>
</div>

