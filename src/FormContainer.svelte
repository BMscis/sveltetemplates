<script>
    import InputContainer from "./InputContainer.svelte";
    import FormInput from "./FormInput.svelte";
    import DialogButton from "./DialogButton.svelte";
    import help from "../public/assets/help.svg";
    import PopDialog from "./PopDialog.svelte";
    let monthlyIncome;
    let incomeLevel;
    let downPayment;
    let dialogVisible = false;
    const checkInput = (output) => {
        console.log(output);
    };
</script>

<div class="formcontainer">
    <h2>Mortgage Accesibility</h2>
    <p>Get to know the type of mortgages that you can access.</p>
    <slot name="inputslot"></slot>
</div>
