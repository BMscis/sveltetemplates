<script>
  import tropicalBellPepperSaladImage from "../docs/assets/tropicalBellPepper.jpg"
  import butterChickenImage from "../docs/assets/butterChiken.jpg"
  import { navigatorPage } from "./functions/formAccumulator";
import { onMount } from "svelte";
  let newPage
	let page = "Welcome";
  let subheading="";
  let avatar="";
  export let isFormReady
  let isPageRecipe = page == "recipe"
  onMount(() => {
    return navigatorPage.subscribe((value) => {
			console.log("NAV: ", value)
			page = value.page
      subheading = value.subHeading
      avatar = value.avatar
		});
  })
</script>
<div id="nanju-nav-container" >
  <svg id="navbar-component" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{window.innerWidth}" height="116.25" viewBox="0 0 {window.innerWidth} 116.25">
    <defs>
      <filter id="hover-line" x="50.25" y="96.75" width="139.5" height="19.5" filterUnits="userSpaceOnUse">
        <feOffset dy="3" input="SourceAlpha"/>
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feFlood flood-opacity="0.161"/>
        <feComposite operator="in" in2="blur"/>
        <feComposite in="SourceGraphic"/>
      </filter>
      <filter id="hover-line-2" x="50.25" y="96.75" width="139.5" height="19.5" filterUnits="userSpaceOnUse">
        <feOffset dy="3" input="SourceAlpha"/>
        <feGaussianBlur stdDeviation="3" result="blur-2"/>
        <feFlood flood-opacity="0.161"/>
        <feComposite operator="in" in2="blur-2"/>
        <feComposite in="SourceGraphic"/>
      </filter>
      <filter id="tab-square-bg" x="171" y="65.5" width="138" height="50" filterUnits="userSpaceOnUse">
        <feOffset dy="3" input="SourceAlpha"/>
        <feGaussianBlur stdDeviation="3" result="blur-3"/>
        <feFlood flood-opacity="0.741"/>
        <feComposite operator="in" in2="blur-3"/>
        <feComposite in="SourceGraphic"/>
      </filter>
      <filter id="hover-line-3" x="170.25" y="96.75" width="139.5" height="19.5" filterUnits="userSpaceOnUse">
        <feOffset dy="3" input="SourceAlpha"/>
        <feGaussianBlur stdDeviation="3" result="blur-4"/>
        <feFlood flood-opacity="0.161"/>
        <feComposite operator="in" in2="blur-4"/>
        <feComposite in="SourceGraphic"/>
      </filter>
      <pattern id="nav-pattern" width="1" height="1" viewBox="13.155 0 40 40">
        <image preserveAspectRatio="xMidYMid slice" width="71.186" height="40" href={butterChickenImage}/>
      </pattern>
      <pattern id="nav-pattern-wide" width="100%" height="100%"  viewBox="0 0 {window.innerWidth} 70">
        <image preserveAspectRatio="xMidYMid slice" width="{window.innerWidth}" height="70"  href={tropicalBellPepperSaladImage}/>
      </pattern>
    </defs>
    <path id="extended-rectangle" d="M0,0H{window.innerWidth}a0,0,0,0,1,0,0V26a8,8,0,0,1-8,8H8a8,8,0,0,1-8-8V0A0,0,0,0,1,0,0Z" transform="translate(0 70)" fill="#fff"/>
    <rect id="navbar-rectangle" width="{window.innerWidth}" height="70" fill={isPageRecipe ? "url(#nav-pattern-wide)" : "white"}/>
    <g id="extended-navbar" transform="translate({(window.innerWidth/2) - 120} 70)" opacity={isPageRecipe ? 1 : 0}>
      <rect id="navbar-rectangle-extended" width="240" height="34" fill="rgba(54,54,54,0)"/>
      <g id="tabs">
        <g id="tab-bar">
          <path id="tab-square-bg-2" data-name="tab-square-bg" d="M0,0H120a0,0,0,0,1,0,0V24a8,8,0,0,1-8,8H8a8,8,0,0,1-8-8V0A0,0,0,0,1,0,0Z" transform="translate(0 1.5)" fill="rgba(225,136,106,0)"/>
          <path id="tab-square" d="M0,0H120a0,0,0,0,1,0,0V24a8,8,0,0,1-8,8H8a8,8,0,0,1-8-8V0A0,0,0,0,1,0,0Z" fill="#fff"/>
          <text id="_Dark_Theme_2._Subtitle_Subtitle_1" data-name="🌑 Dark Theme/2. Subtitle/Subtitle 1" transform="translate(20 23)" fill="rgba(225,136,106,0.87)" font-size="16" font-family="Roboto-Regular, Roboto" letter-spacing="0.009em"><tspan x="0" y="0">Ingredients</tspan></text>
          <g transform="matrix(1, 0, 0, 1, -60, -70)" filter="url(#hover-line)">
            <line id="hover-line-4" data-name="hover-line" x2="120" transform="translate(60 103.5)" fill="none" stroke="#a6bcd0" stroke-linecap="round" stroke-width="1.5"/>
          </g>
          <g transform="matrix(1, 0, 0, 1, -60, -70)" filter="url(#hover-line-2)">
            <line id="hover-line-5" data-name="hover-line" x2="120" transform="translate(60 103.5)" fill="none" stroke="#e1886a" stroke-linecap="round" stroke-width="1.5"/>
          </g>
        </g>
        <g id="tab-bar-2" data-name="tab-bar" transform="translate(120)">
          <g transform="matrix(1, 0, 0, 1, -180, -70)" filter="url(#tab-square-bg)">
            <path id="tab-square-bg-3" data-name="tab-square-bg" d="M0,0H120a0,0,0,0,1,0,0V24a8,8,0,0,1-8,8H8a8,8,0,0,1-8-8V0A0,0,0,0,1,0,0Z" transform="translate(180 71.5)" fill="rgba(64,63,63,0)"/>
          </g>
          <path id="tab-square-2" data-name="tab-square" d="M0,0H120a0,0,0,0,1,0,0V24a8,8,0,0,1-8,8H8a8,8,0,0,1-8-8V0A0,0,0,0,1,0,0Z" fill="rgba(54,54,54,0)"/>
          <text id="_Dark_Theme_2._Subtitle_Subtitle_1-2" data-name="🌑 Dark Theme/2. Subtitle/Subtitle 1" transform="translate(17 23)" fill="rgba(166,188,208,0.87)" font-size="16" font-family="Roboto-Regular, Roboto" letter-spacing="0.009em"><tspan x="0" y="0">Instructions</tspan></text>
          <g transform="matrix(1, 0, 0, 1, -180, -70)" filter="url(#hover-line-3)">
            <line id="hover-line-6" data-name="hover-line" x2="120" transform="translate(180 103.5)" fill="none" stroke="#a6bcd0" stroke-linecap="round" stroke-width="1.5"/>
          </g>
        </g>
      </g>
    </g>
    <g id="title-card">
      <rect id="title-rect" width="195" height="70" fill="rgba(255,255,255,0)"/>
      <g id="_Avatar" data-name="👤 Avatar" transform="translate(20 15)">
        <g id="Dark_ΩElements_Avatar" data-name="Dark 🌑/ ΩElements/Avatar">
          <circle id="butterChikenS" cx="20" cy="20" r="20" fill="url(#nav-pattern)"/>
        </g>
      </g>
      <text id="_Headline_6" data-name="✏️ Headline 6" transform="translate(75 43)" fill="rgba(0,0,0,0.87)" font-size="20" font-family="Roboto-Medium, Roboto" font-weight="500" letter-spacing="0.008em"><tspan x="0" y="0">{page}</tspan></text>
      <text id="_Body_2" data-name="✏️ Body 2" transform="translate(75 61)" fill="rgba(0,0,0,0.6)" font-size="14" font-family="Roboto-Regular, Roboto" letter-spacing="0.018em"><tspan x="0" y="0">{subheading} </tspan></text>
      <line id="hover-line-7" data-name="hover-line" x2="97.5" transform="translate(48.75 70)" fill="none" stroke="#a6bcd0" stroke-linecap="round" stroke-width="1.5"/>
    </g>
    <g id="icon_social_share_24px_" data-name="icon/social/share_24px " transform="translate({window.innerWidth - 40} 23)">
      <rect id="Boundary" width="24" height="24" fill="none"/>
      <path id="_Color" data-name=" ↳Color" d="M15,14.137a2.906,2.906,0,0,0-1.96.773L5.91,10.743a3.3,3.3,0,0,0,.09-.7,3.3,3.3,0,0,0-.09-.7l7.05-4.127A2.99,2.99,0,0,0,18,3.012a3,3,0,1,0-6,0,3.3,3.3,0,0,0,.09.7L5.04,7.841a3.012,3.012,0,1,0,0,4.4l7.12,4.177a2.843,2.843,0,0,0-.08.653A2.92,2.92,0,1,0,15,14.137Z" transform="translate(3 2)"/>
    </g>
  </svg>
  
  
</div>
<style>
    div#nanju-nav-container {
    height: 104px;
    position: sticky;
    top:0;
    z-index: 200;
}
</style>