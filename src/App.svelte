<script>
	import InputNumber from "./InputNumber.svelte";
	import { spring, tweened } from "svelte/motion";
	import InputRange from "./InputRange.svelte";
	import InputCheckbox from "./InputCheckbox.svelte";
	import InputText from "./InputText.svelte";
	import { get, writable } from "svelte/store";
	import { accumulator } from "./functions/formAccumulator";
	import { getClientStyle } from "./functions/getClientStyle";
	import PopDialog from "./PopDialog.svelte";
	import help from "../docs/assets/help.svg";
	import euro from "../docs/assets/eurosign.svg";

	let isFormReady;
	let pointer;
	let buttonPointer;
	let helpDialog = false;
	const pointerRotation = writable(0);
	accumulator.subscribe((value) => {
		isFormReady = !get(accumulator).find(
			(v) => v.ready === false || undefined
		);
	});
	const coordsX = writable(50);
	const coordsY = writable(50);
	let coords = tweened(
		{ x: 50, y: 50 },
		{
			stiffness: 0.1,
			damping: 0.1,
		}
	);
	let size = spring(10);
	function mouseR() {
		let pointerBox = buttonPointer.getBoundingClientRect();
		let centerPoint = getClientStyle(buttonPointer);
		let centers = centerPoint[0].split(" ");
		let centerY = pointerBox.top + parseInt(centers[1]) - centerPoint[1];
		let centerX = pointerBox.left + parseInt(centers[0]) - centerPoint[2];
		let radians = Math.atan2(e.clientX - centerX, e.clientY - centerY);
		pointerRotation.update((n) => radians * (180 / Math.PI) * -1);
		coordsY.update((n) => e.clientY);
		coordsX.update((n) => e.clientX);
		//coords.set({ x: e.clientX, y: e.clientY });
	}
</script>

<svelte:window />
<main>
	<div class="formcontainer">
		<div class="head">
			<h2>Mortgage Accesibility</h2>
			<p>Get to know the type of mortgages that you can access.</p>
		</div>
		<div class="inner-form">
			<InputText
				inputName="firstname"
				inputId="firstname"
				inputPlaceholder="Enter First Name"
				isRequired="true"
				emoji="👏"
			/>
			<div class="empty-input" />
			<InputNumber
				slot="input-slot"
				inputPlaceholder="Monthly Income"
				inputId="totalmonthlyincome"
				inputName="totalmonthlyincome"
				isRequired="true"
				levelRange="900"
				sign={euro}
				emoji="👍"
				hasHelp="true"
			>
				<PopDialog
					isExtra="true"
					slot="extra-dialog"
					popupHeading={"Down Payment"}
					popupText={"This is the Monthly Income slot"}
					visibility={helpDialog}
				>
				</PopDialog>
				<button
					on:click={() => {
						helpDialog = !helpDialog;
						console.log("help");
					}}
					slot="container-help-slot"
					class="outline-help-slot helper-button">{@html help}</button
				>
			</InputNumber>
			<div class="empty-input" />
			<InputNumber
				slot="input-slot"
				inputPlaceholder="Down Payment"
				inputId="downpayment"
				inputName="downpayment"
				isRequired="true"
				levelRange="900"
				sign={euro}
				emoji="👍"
			/>
			<div class="empty-input" />
			<InputCheckbox
				slot="input-slot"
				inputValue=""
				inputName="coapplicant"
				inputId="coapplicant"
				checkboxtext="Applying with a co-applicant?"
				extracheckboxtext=""
				isRequired="true"
			/>
			<InputCheckbox
				slot="input-slot"
				inputValue=""
				isRequired="true"
				inputName="dependants"
				inputId="dependants"
				checkboxtext="More than one dependant in the family?"
				extracheckboxtext="How Many Dependants"
				extracheckbox="true"
			/>
			<InputRange
				inputValue="1"
				inputMin="1"
				inputMax="25"
				inputName="loanamount"
				rangeText="Enter Loan Amount"
				isRequired="true"
				sign={euro}
			/>
			<InputRange
				inputValue="0"
				inputMin="0"
				inputMax="40"
				inputName="loanduration"
				rangeText="Choose loan term"
				isTimeBound="true"
				isRequired="true"
			/>
			<button
				bind:this={buttonPointer}
				disabled={!isFormReady}
				class="navbutton"
			>
				NEXT
			</button>
		</div>
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: auto;
		position: relative;
		max-width: calc(100vw - 1em);
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
	}
</style>
