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
                navigate(`step${page + 1}`, { replace: false });
            } else {
                [userName,age,email,totalIncome] = setProfile()
                navigate("welcome-page", { replace: false });
            }
        }
    });
</script>

<Router basepath="/diet" url="/diet">
    <FormContainer>
        <h2 slot="heading">Dietary Plan</h2>
        <p slot="paragraph">Get your personalized diet plan.</p>
        <div class="inner-form" slot="forms">
            <Route path="/">
                <h3>
                    Hello {userName},
                    <p>please enter your email</p>
                </h3>
                <div class="empty-input" />
                <div class="empty-input" />
                <div class="empty-input" />
                <div class="empty-input" />
                <InputText
                    inputName="user-email"
                    inputPlaceholder="Enter Email"
                    isRequired="true"
                    emoji="👏"
                    textType="email"
                />
                <div class="empty-input" />
            </Route>
            <Route path="step3">
                <h3>
                    Yo {userName},
                    <br />
                    <p>are you comfortable with giving us your age?</p>
                    <br />
                    <InputNumber
                        inputPlaceholder="How old are you"
                        inputName="age"
                        isRequired="true"
                        levelRange="18"
                        emoji="👍"
                        hasHelp="true"
                    />
                    <br />
                    <p>or are you more comfortable with a range?</p>
                    <br />
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
                </h3>
            </Route>
            <Route path="welcome-page">
                <Profile {age} {userName} income={totalIncome} {email} />
            </Route>
        </div>
    </FormContainer>
</Router>
