<script>
    import { Router, Route, Link } from "svelte-routing";
    import { navigate } from "svelte-routing";
    import {setProfile} from "./functions/getProfile"
    import FormContainer from "./FormContainer.svelte";
    import InputText from "./InputText.svelte";
    import InputCheckbox from "./InputCheckbox.svelte";
    import InputNumber from "./InputNumber.svelte";
    import { get } from "svelte/store";
    import { accumulator } from "./functions/formAccumulator";
    import { afterUpdate, onMount } from "svelte";
    import Profile from "./Profile.svelte";
    export let isFormReady = false;
    let page = 2;
    let userName;
    let email;
    let totalIncome;
    let age;
    onMount(() => {
        isFormReady = false;
        let accum = get(accumulator).find((v) => v.component === "user-name");
        if(accum){
            if (accum.value.length > 0) userName = accum.value;
        }
    });
    afterUpdate(() => {
        if (isFormReady) {
            //console.log("THIS IS DONE: ", isFormReady);
            if (get(accumulator).length < 10) {
                navigate(`diet/step${page + 1}`, { replace: false });
            } else {
                [userName,age,email,totalIncome] = setProfile()
                navigate("/diet/welcome-page", { replace: false });
            }
        }
    });
</script>

<Router basepath="/diet" url="/diet">
    <FormContainer>
        <h1 slot="heading">Dietary Plan</h1>
        <p slot="paragraph">Get your personalized diet plan.</p>
        <div class="inner-form" slot="forms">
            <Route path="/">
                <h4>
                    Hello {userName},
                    <p>please enter your email</p>
                </h4>
                <InputText
                    inputName="user-email"
                    inputPlaceholder="Enter Email"
                    isRequired="true"
                    emoji="👏"
                    textType="email"
                />
                <div class="empty-input" />
            </Route>
            <Route path="/diet/step3">
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
            </Route>
            <Route path="/diet/welcome-page">
                <Profile {age} {userName} income={totalIncome} {email} />
            </Route>
        </div>
    </FormContainer>
</Router>
