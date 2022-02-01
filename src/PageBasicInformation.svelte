<script>
    import { Router, Route, Link } from "svelte-routing";
    import FormContainer from "./FormContainer.svelte";
    import InputCheckbox from "./InputCheckbox.svelte";
    import InputText from "./InputText.svelte";
    import {Datepicker} from "svelte-calendar"
import DateComponent from "./DateComponent.svelte";
    export let isFormReady;
    
</script>

<Router basepath="/basic-information" url="/basic-information">
    <FormContainer>
        <h1 slot="heading">Basic Information</h1>
        <p slot="paragraph">
            We are going to collect basic Information to prepare a diet plan
        </p>
        <div class="inner-form" slot="forms">
            <InputText
                inputPlaceholder="what is your name? "
                helpTextHeading="Client Name."
                isRequired="true"
                helpText="Please enter your first name."
                inputName="user-name"
            />
            <h4>Date of Birth</h4>
            <DateComponent/>
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
</Router>
