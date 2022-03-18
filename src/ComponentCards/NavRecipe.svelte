<script>
import { afterUpdate } from "svelte";
import { navbarHeight } from "../functions/formAccumulator";


    export let image;
    export let avatar;
    export let heading;
    export let subHeading;
    export let title;
    export let windowWidth;

    let translateRightEnd = windowWidth - 44
    let translateRightNext = translateRightEnd - 44
    let translateTitleCenter = (windowWidth/2) - (174.8/2)
    let translateExtendedNavCenter = (windowWidth/2) - (360/2)
    navbarHeight.set(126)
    afterUpdate(() => {
      translateRightEnd = windowWidth - 44
      translateRightNext = translateRightEnd - 44
      translateTitleCenter = (windowWidth/2) - (174.8/2)
      translateExtendedNavCenter = (windowWidth/2) - (360/2)
    })
</script>
<svg id="navbar-component" xmlns="http://www.w3.org/2000/svg" width="{windowWidth}" height="126" viewBox="0 0 {windowWidth} 126">
  <rect id="navbar-rectangle" width="{windowWidth}" height="126"/>
  <g id="nav-icons">
    <g id="icon_navigation_menu_24px" data-name="icon/navigation/menu_24px" transform="translate(20 16)">
      <rect id="Boundary" width="24" height="24" fill="none"/>
      <path id="_Color" data-name=" ↳Color" d="M18,12H0V10H18v2Zm0-5H0V5H18V7Zm0-5H0V0H18V2Z" transform="translate(3 6)" fill="#fff"/>
    </g>
    <g id="account_circle_black_24dp" transform="translate({translateRightEnd} 16)">
      <path id="Path_3" data-name="Path 3" d="M0,0H24V24H0Z" fill="none"/>
      <path id="Path_4" data-name="Path 4" d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,3A3,3,0,1,1,9,8,3,3,0,0,1,12,5Zm0,14.2a7.2,7.2,0,0,1-6-3.22c.03-1.99,4-3.08,6-3.08s5.97,1.09,6,3.08A7.2,7.2,0,0,1,12,19.2Z" fill="#fff"/>
    </g>
  </g>
  <g id="title-card" transform="translate(0 56)">
    <rect id="title-rect" width="195" height="70" fill="rgba(255,255,255,0)"/>
    <g id="_Avatar" data-name="👤 Avatar" transform="translate(20.82 15)">
      <g id="Dark_ΩElements_Avatar" data-name="Dark 🌑/ ΩElements/Avatar">
        <g id="ingredients" transform="translate(0.001)">
          <path id="Path_5" data-name="Path 5" d="M189.92,87.733c-.907,2.133-1.831,4.249-2.773,6.364-.409.889-.907,1.049-1.884.622-1.564-.64-3.093-1.351-4.64-2.009a8.729,8.729,0,0,0-1.849-4.231,8.906,8.906,0,0,0-1.938-1.724,2.525,2.525,0,0,1,.178-1.227c.356-.907.764-1.8,1.173-2.684a1.352,1.352,0,0,1,2.044-.8c2.382,1.013,4.729,2.062,7.093,3.093.622.267,1.262.533,1.867.836C190.116,86.4,190.311,86.827,189.92,87.733Z" transform="translate(-151.751 -76.089)" fill="#00e516"/>
          <path id="Path_6" data-name="Path 6" d="M180.587,101.156c-1.049.693-2.222,1.156-3.111.729-1.227-.569-1.156-2.489-2.08-2.631s-1.618,2.222-3.253,3.324c-1.316.871-3.787,1.227-8.836-1.422h7.5c1.476,0,1.529-.053,1.991-1.476a25.183,25.183,0,0,1,4.853-9.387,1.489,1.489,0,0,0-.071-2.276,1.938,1.938,0,0,1-.747-1.262,8.907,8.907,0,0,1,1.938,1.724,8.729,8.729,0,0,1,1.849,4.231l-.587-.249c-1.049-.444-1.227-.356-1.671.693a23.751,23.751,0,0,0-1.6,6.9c-.071.8.267,1.1,1.013,1.1S179.662,101.138,180.587,101.156Z" transform="translate(-151.751 -76.089)" fill="#ff00c9"/>
          <path id="Path_7" data-name="Path 7" d="M179.68,114.436c0,.924-.622,1.333-1.369,1.653H161.778c-.551-.267-1.191-.409-1.44-1.084a1.511,1.511,0,0,1,.871-1.973c.907-.3.622-.6.142-1.031a12.285,12.285,0,0,1-3.716-5.956,13.3,13.3,0,0,1-.444-2.88c-.071-1.387.516-1.991,1.884-1.991h4.231c5.049,2.649,7.52,2.293,8.836,1.422,1.636-1.1,2.2-3.484,3.253-3.324s.853,2.062,2.08,2.631c.889.427,2.062-.036,3.111-.729h.391c1.28.036,1.778.533,1.76,1.813a11.982,11.982,0,0,1-3.591,8.444l-.889.871c-.249.267-.267.5.124.587A1.455,1.455,0,0,1,179.68,114.436Z" transform="translate(-151.751 -76.089)" fill="#ff7300"/>
          <path id="Path_8" data-name="Path 8" d="M164.32,82.471a1.564,1.564,0,0,0-.587.942,7.11,7.11,0,0,0-2.773,3.876l-4.071,1.8c-1.316.551-1.813.356-2.364-.924-.836-1.938-1.689-3.858-2.524-5.8-.48-1.12-.3-1.511.818-2.009l9.671-4.267h.178a2.329,2.329,0,0,1,.978,1.12c.391.96.853,1.884,1.227,2.844A1.924,1.924,0,0,1,164.32,82.471Z" transform="translate(-151.751 -76.089)" fill="#e5e500"/>
          <path id="Path_9" data-name="Path 9" d="M167.556,97.529A2.079,2.079,0,0,1,165,95.5a38.826,38.826,0,0,0-1.209-6.987c-.729-2.276-.658-2.151-2.667-1.3l-.16.071a7.11,7.11,0,0,1,2.773-3.876,1.422,1.422,0,0,0,.427,1.156c2.542,2.916,3.8,6.453,4.924,10.062A2.091,2.091,0,0,1,167.556,97.529Z" transform="translate(-151.751 -76.089)" fill="#1e9ce2"/>
        </g>
      </g>
    </g>
    <text id="_Headline_6" data-name="✏️ Headline 6" transform="translate(75 36)" fill="#fff" font-size="20" font-family="Roboto-Medium, Roboto" font-weight="500" letter-spacing="0.008em"><tspan x="0" y="0">{heading}</tspan></text>
    <text id="_Body_2" data-name="✏️ Body 2" transform="translate(75 56)" fill="rgba(255,255,255,0.6)" font-size="14" font-family="Roboto-Regular, Roboto" letter-spacing="0.018em"><tspan x="0" y="0">{subHeading}</tspan></text>
  </g>
  <g id="icon_social_share_24px_" data-name="icon/social/share_24px " transform="translate(316 80)">
    <rect id="Boundary-2" data-name="Boundary" width="24" height="24" fill="none"/>
    <path id="_Color-2" data-name=" ↳Color" d="M15,14.137a2.906,2.906,0,0,0-1.96.773L5.91,10.743a3.3,3.3,0,0,0,.09-.7,3.3,3.3,0,0,0-.09-.7l7.05-4.127A2.99,2.99,0,0,0,18,3.012a3,3,0,1,0-6,0,3.3,3.3,0,0,0,.09.7L5.04,7.841a3.012,3.012,0,1,0,0,4.4l7.12,4.177a2.843,2.843,0,0,0-.08.653A2.92,2.92,0,1,0,15,14.137Z" transform="translate(3 2)" fill="#fff"/>
  </g>
  <text id="Title" transform="translate({translateTitleCenter} 15)" fill="#e1886a" font-size="20" font-family="SegoeUI, Segoe UI"><tspan x="0" y="22">Nourish With Nanju</tspan></text>
</svg>

