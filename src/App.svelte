<script>
	import { Router, Route, Link } from "svelte-routing";
	import MortgageForm from "./MortgageForm.svelte";
	import HealthForm from "./HealthForm.svelte";
	import PageBasicInformation from "./PageBasicInformation.svelte";
	import { accumulator } from "./functions/formAccumulator";
	import { get } from "svelte/store";
	import { onMount } from "svelte";
import PageAnthropometricMeasurments from "./PageAnthropometricMeasurments.svelte";
	let isFormReady = false;
	let url = "/";

	onMount(() => {
		accumulator.subscribe((value) => {
			console.log(get(accumulator));
			isFormReady =
				!get(accumulator).find((v) => v.ready === false || undefined) &&
				get(accumulator).length > 0
					? true
					: false;
		});
	});
	$: isFormReady = !get(accumulator).find((v) => v.ready === false || undefined) &&
				get(accumulator).length > 0
					? true
					: false;
</script>

<Router basepath={url}>
	<nav>
		<Link to="/">Home</Link>
		<Link to="mortgages">Mortgages</Link>
		<Link to="diet">Diet Plan</Link>
		<Link to="basic-information"> Basic Information</Link>
		<Link to="anthro-measurements"> Anthro</Link>
	</nav>
	<main>
		<Route path="diet/*">
			<HealthForm {isFormReady} />
		</Route>
		<Route path="mortgages">
			<MortgageForm {isFormReady} />
		</Route>
		<Route path="/basic-information">
			<PageBasicInformation {isFormReady}></PageBasicInformation>
		</Route>
		<Route path="/anthro-measurements">
			<PageAnthropometricMeasurments></PageAnthropometricMeasurments>

		</Route>
	</main>
</Router>

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
