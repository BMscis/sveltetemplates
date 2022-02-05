<script>
    import FormContainer from "./FormContainer.svelte";
    import InputCheckbox from "./InputCheckbox.svelte";
    import InputNumber from "./InputNumber.svelte";
    import { Router, navigate } from "svelte-routing";
    import { afterUpdate, onMount } from "svelte";
    export let isFormReady;
    export let userName
    
    onMount(() => {
        isFormReady = false
    })
    afterUpdate(()=>{
        if(isFormReady){
        navigate("/anthro-measurements", { replace: true });
    }
    })
</script>

<Router basepath="/user-age" url="/user-age">
    <FormContainer>
        <div class="inner-form" slot="forms">
            <h4>
                Yo {userName},

                <p>are you comfortable with giving us your age?</p>

                <InputNumber
                    inputPlaceholder="How old are you"
                    inputName="age"
                    isRequired="true"
                    levelRange="18"
                    emoji="👍"
                    hasHelp="true"
                    inputValue=0
                />

                <p>or are you more comfortable with a range?</p>

                <InputCheckbox
                    inputName="eighteen to twenty five"
                    checkboxtext="18 - 25"
                    isRequired="true;"
                />
                <InputCheckbox
                    inputName="twenty six to thirty five"
                    checkboxtext="26 - 35"
                    isRequired="true;"
                />
                <InputCheckbox
                    inputName="thirty six to forty five"
                    checkboxtext="36 - 45"
                    isRequired="true;"
                />
            </h4>
        </div>
    </FormContainer>
</Router>
