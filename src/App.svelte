<script>
	import InputNumber from "./InputNumber.svelte";
	import InputRange from "./InputRange.svelte";
	import InputCheckbox from "./InputCheckbox.svelte";
</script>

<main>
	<div class="formcontainer">
		<h2>Mortgage Accesibility</h2>
		<p>Get to know the type of mortgages that you can access.</p>
		<slot name="inputslot" />
		<InputNumber
			slot="inputslot"
			inputPlaceholder="Total Monthly Income"
			inputId="totalmonthlyincome"
			inputName="totalmonthlyincome"
			isRequired="true"
			levelRange="900"
			sign="€"
		/>
		<InputCheckbox
			slot="inputslot"
			inputValue=""
			inputName="coapplicant"
			inputId="coapplicant"
			checkboxtext="Applying with a co-applicant?"
			extracheckboxtext=""
		/>
		<InputCheckbox
			slot="inputslot"
			inputValue=""
			inputName="dependants"
			inputId="dependants"
			checkboxtext="More than one dependant in the family?"
			extracheckboxtext="How Many Dependants"
			extracheckbox="true"
		/>
		<InputRange
			inputValue=1
			inputMin=1
			inputMax=25
			inputName="loanamount"
			rangeText="Enter Loan Amount"
			sign="€"
		/>
		<InputRange
			inputValue=0
			inputMin=0
			inputMax=40
			inputName="loanduration"
			rangeText="Choose loan term"
			sign="Years"
			isTimeBound=true
		/>
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
