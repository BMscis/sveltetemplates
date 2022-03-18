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
	import {accumulator,navbarHeight,navigatorCount,windowSize,} from "./functions/formAccumulator";
import { get } from "svelte/store";

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
	let appHeight = windowHeight - get(navbarHeight)
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
		navbarHeight.subscribe((value) => {
			appHeight = windowHeight - value
		})
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
<main style="height:{appHeight}px">
	<Router {url} basepath={url}>
		<Route path="/loading">
			<LoadingPage />
		</Route>
		<Route path="/">
			<PageWelcome {isFormReady} height={appHeight} />
		</Route>
		<Route path="/basic-information">
			<PageBasicInformation {isFormReady} windowHeight={appHeight}/>
		</Route>
		<Route path="/family-information" windowHeight={appHeight}>
			<PageFamilyInfo {isFormReady} />
		</Route>
		<Route path="/anthro-measurements" windowHeight={appHeight}>
			<PageAnthropometricMeasurments {isFormReady} />
		</Route>
		<Route path="/personal-health-history" windowHeight={appHeight}>
			<PagePersonalHealthHistory {isFormReady} />
		</Route>
		<Route path="/personal-allergies" windowHeight={appHeight}>
			<PersonalAllergies {isFormReady} />
		</Route>
		<Route path="/family-health-history" windowHeight={appHeight}>
			<PageFamilyHealthHistory {isFormReady} />
		</Route>
		<Route path="/family-allergies" windowHeight={appHeight}>
			<FamilyAllergies {isFormReady} />
		</Route>
		<Route path="/user-profile" windowHeight={appHeight}>
			<Profile />
		</Route>
		<Route path="/page-recipes">
			<PageRecipe {windowWidth} windowHeight={appHeight} />
		</Route>
		<Route path="/recipe">
			<RecipeContainer {windowWidth} windowHeight={appHeight} />
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
