<script>
	import PageWelcome from "./Form/Pages/PageWelcome.svelte";
	import PageFamilyInfo from "./Form/Pages/PageFamilyInfo.svelte";
	import PageBasicInformation from "./Form/Pages/PageBasicInformation.svelte";
	import FamilyAllergies from "./Form/Pages/FamilyAllergies.svelte";
	import PersonalAllergies from "./Form/Pages/personalAllergies.svelte";
	import PageFamilyHealthHistory from "./Form/Pages/PageFamilyHealthHistory.svelte";
	import PagePersonalHealthHistory from "./Form/Pages/PagePersonalHealthHistory.svelte";
	import PageAnthropometricMeasurments from "./Form/Pages/PageAnthropometricMeasurments.svelte";
	
	import PageRecipe from "./Ingredients/PageRecipe.svelte";
	import { uploadIngredients } from "./Ingredients/ingredientsBook";
	import RecipeContainer from "./Ingredients/RecipeContainer.svelte";

	import Profile from "./Personal/Profile.svelte";
	import LoadingPage from "./Utilities/LoadingPage.svelte";
	import NanjuNavbar from "./Navigation/NanjuNavbar.svelte";

	import { onMount } from "svelte";
	import { Router, Route} from "svelte-routing";
	import { setNavigateTo } from "./functions/setNavigateTo";
	import {accumulator,navigatorCount,windowSize,} from "./functions/formAccumulator";

	let isFormReady = false;
	let url = "/";
	let navCount = 0;
	const rdc = (x, y) => {
		return x && y;
	};
	let readyComponents;
	let navCollection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	let windowWidth = window.innerWidth;
	let windowHeight = window.innerHeight;
	const [windowSizeSub, windowValidate] = windowSize();
	onMount(() => {
		uploadIngredients();
		accumulator.subscribe((value) => {
			//console.log("ACC VAL:", value);
			readyComponents = value.map((comp) => comp.ready);
			try {
				isFormReady = value.map((comp) => comp.ready).reduce(rdc);
			} catch (error) {
				isFormReady = false;
			}
			//console.log("READY: ", isFormReady);
		});
		navigatorCount.subscribe((value) => {
			navCount = value;
		});
		windowValidate();
		return setNavigateTo("/");
	});
	window.addEventListener("resize", (e) => {
		windowHeight = window.innerHeight;
		windowWidth = window.innerWidth;
		//console.log("VALIDATE PLEASE")
		windowValidate();
	});
</script>

<NanjuNavbar {isFormReady} {windowWidth} />
<main style="height:{windowHeight - 104}px">
	<Router {url} basepath={url}>
		<Route path="/loading">
			<LoadingPage />
		</Route>
		<Route path="/">
			<PageWelcome {isFormReady} height={windowHeight} />
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
		<Route path="/page-recipes">
			<PageRecipe {windowWidth} height={windowHeight} />
		</Route>
		<Route path="/recipe">
			<RecipeContainer {windowWidth} {windowHeight} />
		</Route>
	</Router>
</main>

<!-- <div id="page_link">
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
</div> -->
<style>
</style>
