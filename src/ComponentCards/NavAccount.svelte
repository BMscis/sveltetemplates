<script>
import { afterUpdate } from "svelte";
import { navbarHeight } from "../functions/formAccumulator";


  export let windowWidth
  export let image;
  export let avatar;
  export let heading;
  export let subHeading;

  let translateRightEnd = windowWidth - 44
  let translateRightNext = translateRightEnd - 44
  let translateTitleCenter = (windowWidth/2) - 50
  navbarHeight.set(56)
  afterUpdate(() => {
      translateRightEnd = windowWidth - 44
      translateRightNext = translateRightEnd - 44
      translateTitleCenter = (windowWidth/2) - 50
    })
</script>
<svg id="navbar-component" xmlns="http://www.w3.org/2000/svg" width="{windowWidth}" height="56" viewBox="0 0 {windowWidth} 56">
  <rect id="navbar-rectangle" width="{windowWidth}" height="56"/>
  <g id="nav-icons">
    <g id="icon_navigation_menu_24px" data-name="icon/navigation/menu_24px" transform="translate(20 16)">
      <rect id="Boundary" width="24" height="24" fill="none"/>
      <path id="_Color" data-name=" ↳Color" d="M18,12H0V10H18v2Zm0-5H0V5H18V7Zm0-5H0V0H18V2Z" transform="translate(3 6)" fill="#fff"/>
    </g>
    <g id="icon_social_notifications_none_24px" data-name="icon/social/notifications_none_24px" transform="translate({translateRightNext} 16)">
      <rect id="Boundary-2" data-name="Boundary" width="24" height="24" fill="none"/>
      <path id="_Color-2" data-name=" ↳Color" d="M8,19.5a2,2,0,0,1-2-2h4A2,2,0,0,1,8,19.5Zm8-3H0v-1l2-2v-5A7.086,7.086,0,0,1,3.177,4.44,5.529,5.529,0,0,1,6.5,2.18V1.5a1.5,1.5,0,0,1,3,0V2.18a5.522,5.522,0,0,1,3.326,2.264A7.093,7.093,0,0,1,14,8.5v5l2,2v1ZM8,4A3.717,3.717,0,0,0,5.066,5.32,4.907,4.907,0,0,0,4,8.5v6h8v-6a4.908,4.908,0,0,0-1.066-3.18A3.716,3.716,0,0,0,8,4Z" transform="translate(4 2)" fill="#fff"/>
    </g>
    <g id="icon_action_settings_24px" data-name="icon/action/settings_24px" transform="translate({translateRightEnd} 16)">
      <rect id="Boundary-3" data-name="Boundary" width="24" height="24" fill="none"/>
      <path id="_Color-3" data-name=" ↳Color" d="M10.851,19h-3.7a.474.474,0,0,1-.463-.4l-.347-2.518a6.712,6.712,0,0,1-1.562-.926l-2.3.95a.494.494,0,0,1-.16.027.455.455,0,0,1-.407-.24L.055,12.6a.5.5,0,0,1,.116-.606l1.955-1.568A6.172,6.172,0,0,1,2.057,9.5a6.06,6.06,0,0,1,.081-.926L.182,7.007A.468.468,0,0,1,.067,6.4l1.851-3.29a.459.459,0,0,1,.4-.245.444.444,0,0,1,.165.032l2.3.95A6.934,6.934,0,0,1,6.35,2.921L6.7.4A.454.454,0,0,1,7.148,0h3.7a.467.467,0,0,1,.463.4l.347,2.518a6.745,6.745,0,0,1,1.562.926l2.3-.95a.494.494,0,0,1,.16-.027.455.455,0,0,1,.407.24L17.945,6.4a.5.5,0,0,1-.116.606L15.873,8.574a6.069,6.069,0,0,1,.069.926,7.949,7.949,0,0,1-.058.926l1.933,1.568a.468.468,0,0,1,.115.606l-1.851,3.289a.459.459,0,0,1-.4.245.444.444,0,0,1-.165-.032l-2.3-.95a6.869,6.869,0,0,1-1.562.926L11.3,18.6A.443.443,0,0,1,10.851,19ZM9,5.938a3.564,3.564,0,0,0,0,7.125A3.564,3.564,0,0,0,9,5.938Z" transform="translate(3 2.5)" fill="#fff"/>
    </g>
  </g>
  <text id="Title" transform="translate({translateTitleCenter} 15)" fill="#fff" font-size="20" font-family="SegoeUI, Segoe UI"><tspan x="0" y="22">{heading}</tspan></text>
</svg>