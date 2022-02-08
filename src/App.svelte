<script>
	import { Router, Route, Link } from "svelte-routing";
	import MortgageForm from "./MortgageForm.svelte";
	import HealthForm from "./HealthForm.svelte";
	import PageBasicInformation from "./PageBasicInformation.svelte";
	import { accumulator } from "./functions/formAccumulator";
	import { get } from "svelte/store";
	import { afterUpdate, onMount } from "svelte";
	import PageAnthropometricMeasurments from "./PageAnthropometricMeasurments.svelte";
	import PageHealthHistory from "./PageHealthHistory.svelte";
	import PageWelcome from "./PageWelcome.svelte";
	import Profile from "./Profile.svelte";
	import PageAge from "./PageAge.svelte";
import PageFamilyInfo from "./PageFamilyInfo.svelte";
	let isFormReady = false;
	let url = "/";
	const rdc = (x, y) => {
		return x && y;
	};
	let readyComponents;
	onMount(() => {
		accumulator.subscribe((value) => {
			let accum = get(accumulator);
			readyComponents = accum.map((comp) => comp.ready);
			console.log(get(accumulator));
			try {
				isFormReady = get(accumulator).map((comp) => comp.ready).reduce(rdc);
			} catch (error) {
				isFormReady = false
			}
			console.log("READY: ", isFormReady);
		});
	});
</script>

<main>
	<Router url={url} basepath={url}>
		<Route path="/">
			<PageWelcome {isFormReady} />
		</Route>
		<Route path="/basic-information">
			<PageBasicInformation {isFormReady} />
		</Route>
		<Route path="/family-information">
			<PageFamilyInfo {isFormReady} />
		</Route>
		<Route path="/user-age">
			<PageAge {isFormReady} />
		</Route>
		<Route path="/anthro-measurements">
			<PageAnthropometricMeasurments {isFormReady} />
		</Route>
		<Route path="/health-history">
			<PageHealthHistory {isFormReady} />
		</Route>
		<Route path="/user-profile">
			<Profile />
		</Route>
		<Route path="diet/*">
			<HealthForm {isFormReady} />
		</Route>
		<Route path="mortgages">
			<MortgageForm {isFormReady} />
		</Route>
	</Router>
</main>

<style>


	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
	}
</style>
