<script>
    import { Router, navigate } from "svelte-routing";
    import FormContainer from "./FormContainer.svelte";
    import InputCheckbox from "./InputCheckbox.svelte";
    import { afterUpdate, onMount } from "svelte";
    export let isFormReady = false;
    const bgColor = "#a300f5"
    onMount(() => {
        isFormReady = false
    })
    afterUpdate(()=>{
        if(isFormReady){
        navigate("/anthro-measurements", { replace: false });
    } 
    })
</script>

<div class="container">
    <Router basepath="/family-information" url="/family-information">
        <FormContainer bgColor={bgColor}>
            <div class="inner-shadow" slot="extra"></div>
            <h1 slot="heading">Family Information</h1>
            <p slot="paragraph">
                We are going to collect basic Information to prepare a diet plan
            </p>
            <div class="inner-form" slot="forms">
                <h4>Maritial Status</h4>
                <InputCheckbox
                    checkboxtext="Married"
                    isRequired="true"
                    inputName="married"
                    
                />
                <InputCheckbox
                    checkboxtext="Single"
                    isRequired="true"
                    inputName="not-married"
                    
                />
                <h4>Do you have children?</h4>
                <InputCheckbox
                    checkboxtext="Yes"
                    isRequired="true"
                    inputName="children"
                    
                />
                <InputCheckbox
                    checkboxtext="No"
                    isRequired="true"
                    inputName="not-children"
                    
                />
                <h4>Employment Status</h4>
                <InputCheckbox
                    checkboxtext="Employed"
                    isRequired="true"
                    inputName="employed"
                    
                />
                <InputCheckbox
                    checkboxtext="Self-Employed"
                    isRequired="true"
                    inputName="not-employed"
                    
                />
    
            </div>
        </FormContainer>
        <div  class="steps">
            <h1>STEP 0<span style="color: {bgColor};">2</span></h1>
            <p>Tell us abit about your family.</p>
        </div>
    </Router>
</div>

<style>
    .container{
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        align-items: flex-start;
    }

</style>