<script>
	import { Router, Route, Link } from "svelte-routing";
	import logo from "../docs/assets/NanjuLogo.svg"
	import {get} from "svelte/store"
	import PageBasicInformation from "./PageBasicInformation.svelte";
	import { accumulator, navigatorCount } from "./functions/formAccumulator";
	import { onMount } from "svelte";
	import PageAnthropometricMeasurments from "./PageAnthropometricMeasurments.svelte";
	import PageFamilyHealthHistory from "./PageFamilyHealthHistory.svelte";
	import PagePersonalHealthHistory from "./PagePersonalHealthHistory.svelte";
	import PageWelcome from "./PageWelcome.svelte";
	import Profile from "./Profile.svelte";
	import PageFamilyInfo from "./PageFamilyInfo.svelte";
	import LoadingPage from "./LoadingPage.svelte";
	import NavigationBar from "./NavigationBar.svelte";
import PageIngredients from "./PageIngredients.svelte";
import PersonalAllergies from "./personalAllergies.svelte";
import FamilyAllergies from "./FamilyAllergies.svelte";
	let isFormReady = false;
	let url = "/";
	let navCount = 0;
	let navCollection = [0, 1, 2, 3, 4, 5, 6,7,8];
	const rdc = (x, y) => {
		return x && y;
	};
	let readyComponents;
	onMount(() => {
		accumulator.subscribe((value) => {
			//console.log("ACC VAL:", value);
			readyComponents = value.map((comp) => comp.ready);
			console.log(get(accumulator));
			try {
				isFormReady = value.map((comp) => comp.ready).reduce(rdc);
			} catch (error) {
				isFormReady = false;
			}
			//console.log("READY: ", isFormReady);
		});
		navigatorCount.subscribe((value) => {
			console.log("NAVCOUNT: ", value);
			navCount = value;
		});
	});
	</script>

<NavigationBar {isFormReady} />
<main>
    <!-- <div id="nanjulogo">{@html logo}</div> -->
	<Router {url} basepath={url}>
		<Route path="/loading">
			<LoadingPage />
		</Route>
		<Route path="/">
			<PageWelcome {isFormReady} />
		</Route>
		<Route path="/basic-information">
			<PageBasicInformation {isFormReady} />
		</Route>
		<Route path="/family-information">
			<PageFamilyInfo {isFormReady} />
		</Route>
		<Route path="/anthro-measurements">
			<PageAnthropometricMeasurments {isFormReady} />
		</Route>
		<Route path="/personal-health-history">
			<PagePersonalHealthHistory {isFormReady} />
		</Route>
		<Route path="/personal-allergies">
			<PersonalAllergies {isFormReady} />
		</Route>
		<Route path="/family-health-history">
			<PageFamilyHealthHistory {isFormReady} />
		</Route>
		<Route path="/family-allergies">
			<FamilyAllergies {isFormReady} />
		</Route>
		<Route path="/user-profile">
			<Profile />
		</Route>
		<Route path="/page-ingredients">
			<PageIngredients></PageIngredients>
		</Route>
	</Router>
</main>
<div id="page_link">
	{#each navCollection as nav}
		<span id="nav-dot" class="nav_dot">
			<svg class="nav-dot" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
				<ellipse
					active={nav == navCount}
					id="nav-dot"
					rx="5"
					ry="5"
					cx="5"
					cy="5"
				/>
			</svg>
		</span>
	{/each}
</div>
<style>

</style>
