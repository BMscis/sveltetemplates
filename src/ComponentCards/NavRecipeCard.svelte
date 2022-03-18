<script>
import { afterUpdate, onMount } from "svelte";
import TabBarButton from "./TabBarButton.svelte";
import { navbarHeight } from "../functions/formAccumulator";
import { isRecipeCardNavButtonActive } from "./ActiveButton";

    export let windowWidth
    export let image;
    export let avatar;
    export let heading;
    export let subHeading;
    let isButtonActive = true
    let translateRightEnd = windowWidth - 44
    let translateRightNext = translateRightEnd - 44
    let translateTitleCenter = (windowWidth/2) - 50
    let translateExtendedNavCenter = windowWidth/2 - 120
    navbarHeight.set(127)
    afterUpdate(() => {
      translateRightEnd = windowWidth - 44
      translateRightNext = translateRightEnd - 44
      translateTitleCenter = (windowWidth/2) - 50
      translateExtendedNavCenter = windowWidth/2 - 120
    })
    onMount(() => {
      return isRecipeCardNavButtonActive.subscribe((value) => {
        isButtonActive = value
        console.log(isButtonActive)
      })
    })
</script>
<svg id="navbar-component" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{windowWidth}" height="127" viewBox="0 0 {windowWidth} 127">
    <defs>
      <filter id="extended-rectangle" x="0" y="93" width="{windowWidth}" height="34" filterUnits="userSpaceOnUse">
        <feOffset dy="3" input="SourceAlpha"/>
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feFlood flood-opacity="0.201" result="color"/>
        <feComposite operator="out" in="SourceGraphic" in2="blur"/>
        <feComposite operator="in" in="color"/>
        <feComposite operator="in" in2="SourceGraphic"/>
      </filter>
      <filter id="hover-line" x="65" y="119.5" width="140" height="20" filterUnits="userSpaceOnUse">
        <feOffset dy="3" input="SourceAlpha"/>
        <feGaussianBlur stdDeviation="3" result="blur-2"/>
        <feFlood flood-opacity="0.161"/>
        <feComposite operator="in" in2="blur-2"/>
        <feComposite in="SourceGraphic"/>
      </filter>
      <filter id="hover-line-2" x="193" y="120" width="129" height="19" filterUnits="userSpaceOnUse">
        <feOffset dy="3" input="SourceAlpha"/>
        <feGaussianBlur stdDeviation="3" result="blur-3"/>
        <feFlood flood-opacity="0.161"/>
        <feComposite operator="in" in2="blur-3"/>
        <feComposite in="SourceGraphic"/>
      </filter>
      <pattern id="nav-card-recipe-pattern" width="1" height="1" viewBox="13.155 0 40 40">
        <image preserveAspectRatio="xMidYMid slice" width="71.186" height="40" href={image}>
      </pattern>
    </defs>
    <g data-type="innerShadowGroup">
      <rect id="extended-rectangle-2" data-name="extended-rectangle" width={windowWidth} height=34 transform="translate(0 93)" fill="rgba(225,136,106,0.87)"/>
    </g>
    <rect id="navbar-rectangle" width="{windowWidth}" height="93" fill="#e1886a"/>
    <g id="extended-navbar" transform="translate(0 93)">
      <g id="tabs" transform="translate({translateExtendedNavCenter})">
        <TabBarButton buttonName="Ingredients" isActive={isButtonActive}></TabBarButton>
        <TabBarButton buttonName="Instructions" transform=120 isActive={!isButtonActive}></TabBarButton>
      </g>
    </g>
    <g id="title-card" transform="translate(0 23)">
      <rect id="title-rect" width="195" height="70" fill="rgba(255,255,255,0)"/>
      <g id="_Avatar" data-name="👤 Avatar" transform="translate(20 15)">
        <g id="Dark_ΩElements_Avatar" data-name="Dark 🌑/ ΩElements/Avatar">
          <circle id="butterChikenS" cx="20" cy="20" r="20" fill="url(#nav-card-recipe-pattern)"/>
        </g>
      </g>
      <text id="_Headline_6" data-name="✏️ Headline 6" transform="translate(75 43)" font-size="24" font-family="Roboto-Regular, Roboto" letter-spacing="0.007em"><tspan x="0" y="0">{heading}</tspan></text>
      <text id="_Body_2" data-name="✏️ Body 2" transform="translate(75 61)" fill="rgba(0,0,0,0.6)" font-size="14" font-family="Roboto-Regular, Roboto" letter-spacing="0.018em"><tspan x="0" y="0">{subHeading}</tspan></text>
    </g>
    <g id="icon_social_share_24px_" data-name="icon/social/share_24px " transform="translate({translateRightEnd} 23)">
      <rect id="Boundary" width="1" height="1" fill="none"/>
      <path id="_Color" data-name=" ↳Color" d="M15,14.137a2.906,2.906,0,0,0-1.96.773L5.91,10.743a3.3,3.3,0,0,0,.09-.7,3.3,3.3,0,0,0-.09-.7l7.05-4.127A2.99,2.99,0,0,0,18,3.012a3,3,0,1,0-6,0,3.3,3.3,0,0,0,.09.7L5.04,7.841a3.012,3.012,0,1,0,0,4.4l7.12,4.177a2.843,2.843,0,0,0-.08.653A2.92,2.92,0,1,0,15,14.137Z" transform="translate(3 2)"/>
    </g>
  </svg>
  