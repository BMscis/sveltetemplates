<script>
    import { Router, navigate } from "svelte-routing";
    import FormContainer from "./FormContainer.svelte";
    import InputText from "./InputText.svelte";
    import DateComponent from "./DateComponent.svelte";
    export let isFormReady;
    $: if(isFormReady){
        navigate("/family-information", { replace: false });
    }
</script>

<div class="container">
    <Router basepath="/basic-information" url="/basic-information">
        <FormContainer bgColor="#21aaf5">
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
                <InputText
                inputPlaceholder="what is your email? "
                    helpTextHeading="Client Email."
                    inputName="user-email"
                    isRequired="true"
                    emoji="👏"
                    textType="email"
                />
                <h4>Date of Birth</h4>
                <DateComponent/>   
            </div>
        </FormContainer>
    </Router>
</div>

<style>
    .container{
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        align-items: flex-start;
    }
    .form-container{
        background: #c1cbb4;
    }
</style>