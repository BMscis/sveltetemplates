<script>
    import { Router, navigate } from "svelte-routing";
    import FormContainer from "./FormContainer.svelte";
    import InputCheckbox from "./InputCheckbox.svelte";
    import { afterUpdate, onMount } from "svelte";
import FormViewer from "./FormViewer.svelte";
    export let isFormReady = false;
    const bgColor = "#a300f5"

    onMount(() => {
        document.body.scrollIntoView()
        isFormReady = false
    })
    afterUpdate(()=>{
        if(isFormReady){
        navigate("/anthro-measurements", { replace: false });
    } 
    })
    
</script>

<div class="Mycontainer">
    <Router basepath="/family-information" url="/family-information">
        <FormViewer header="Family Information" onboardingText="We also need to get some basic information about your family.">
            <div id="content"   slot="slot1">
                <InputCheckbox
                    checkboxtext="Are you Married?"
                    isRequired="true"
                    inputName="married"
                />

                <InputCheckbox
                    checkboxtext="Do you have children?"
                    isRequired="true"
                    inputName="children"
                    
                />
                <InputCheckbox
                    checkboxtext="Are you employed?"
                    isRequired="true"
                    inputName="employed"
                    
                />
            </div>
        </FormViewer>
    </Router>
</div>
<div  class="steps">
    <h1>STEP 0<span style="color: {bgColor};">2</span></h1>
    <p>Tell us abit about your family.</p>
</div>

<style>
</style>