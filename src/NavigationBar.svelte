<script>
  import { navigate } from "svelte-routing";
  export let isFormReady;
  let page = "Welcome";
  let newPage
  let dropdown = false
  let inputValue = false

</script>

<nav id="navigation-bar">
  <div id="nav-bar">
    <svg
    id="sidebar"
    data-name="Dark 🌑/ App bar / 1. Top / A. Standard (4 States)"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width={window.innerWidth}
    height="56"
    viewBox="0 0 {window.innerWidth} 56">
    <defs>
      <clipPath id="clip-path">
        <rect id="Mask" width={window.innerWidth} height="56" fill="#6200ee" />
      </clipPath>
    </defs>
    <g id="Dark_Elevation_00dp" data-name="Dark 🌑/Elevation/00dp">
      <rect id="Shadow" width={window.innerWidth} height="56" fill="#fff" />
      <rect
        id="Rectangle"
        width={window.innerWidth}
        height="56"
        fill="#121212"
      />
      <rect
        id="On_Surface"
        data-name="On Surface"
        width={window.innerWidth}
        height="56"
        fill="rgba(18,18,18,0)"
      />
      <rect
        id="Rectangle-2"
        data-name="Rectangle"
        width={window.innerWidth}
        height="56"
        fill="#fff"
        style="mix-blend-mode: multiply;isolation: isolate"
      />
    </g>
    <rect id="Primary" width={window.innerWidth} height="56" fill="#121212" />
    <g id="Mask_Group" data-name="Mask Group" clip-path="url(#clip-path)">
      <text
        id="_Page_Title"
        data-name="✏️ Page Title"
        transform="translate(72 16)"
        fill="#fff"
        font-size="20"
        font-family="SegoeUI, Segoe UI"
        letter-spacing="0.008em"><tspan x="0" y="22">{page}</tspan></text
      >
      <g id="_Leading_Icon_l_Use_High_Emphasis" data-name="📍 Leading Icon l Use High Emphasis" transform="translate(16 16)" visibility={dropdown == true ? "hidden" : "visible"}>
        <rect id="Boundary" width="24" height="24" fill="none" />
        <path
          id="_Color"
          data-name=" ↳Color"
          d="M18,12H0V10H18v2Zm0-5H0V5H18V7Zm0-5H0V0H18V2Z"
          transform="translate(3 6)"
          fill="rgba(166,188,208)"
        />
        <foreignObject width="30" height="30" color="transparent" id="menu_button">
          <button style="width:30px; height:30px;" id="menu-button" on:click={() => {dropdown = !dropdown; console.log(dropdown)}}>MENUBUTTON</button>
        </foreignObject>
      </g>
      <foreignObject transform="translate({window.innerWidth - 40} 16)" width="30" height="30" color="transparent" id="frBtn" disabled={!isFormReady}>
        <button style="width:30px; height:30px;" on:click={() => {navigate("/loading", { replace: false });}}>
          MENUBUTTON
        </button>
      </foreignObject>
      <g id="icon_navigation_arrow_right_24px" data-name="icon/navigation/arrow_right_24px" transform="translate({window.innerWidth - 40} 16)">
        <rect id="menu" data-name="menu" width="24" height="24" fill="none" />
        <path id="↳Color" data-name=" ↳Color" d="M-5,0,0,5l-5,5Z" transform="translate(15 7)" fill="#fff"/>
      </g>
      <g id="close-button" width="24" height="24" transform="translate(16 16)"  visibility={dropdown == true ? "visible" : "hidden"}>
        <rect id="Boundary" width="24" height="24" fill="none" />
        <path id="_Color" data-name=" ↳Color" d="M14,1.41,12.59,0,7,5.59,1.41,0,0,1.41,5.59,7,0,12.59,1.41,14,7,8.41,12.59,14,14,12.59,8.41,7Z" transform="translate(5 5)" fill="rgba(255,255,255,0.87)"/>
        <foreignObject  width="30" height="30" color="transparent" id="close_button">
        <button style="width:30px; height:30px;" id="close-button" on:click={() => {
            dropdown = !dropdown}}>
          CLOSEBUTTON
        </button>
      </foreignObject>
      </g>
      <!-- <text id="Next" transform="translate({window.innerWidth - 51} 29)" fill="#707070" font-size="20" font-family="SegoeUI, Segoe UI"><tspan x="0" y="22">Next</tspan></text> -->
    </g>
  </svg>
  </div>
  <div id=side-bar  dropdown={dropdown}>
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="450" height="calc(100vh - 96px)" viewBox="0 0 450 calc(100vh - 96px)" id="sidebar">
      <defs>
        <filter id="Rectangle" x="30" y="32" width="390" height="calc(100vh - 96px)" filterUnits="userSpaceOnUse">
          <feOffset dy="8" input="SourceAlpha"/>
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feFlood flood-opacity="0.2"/>
          <feComposite operator="in" in2="blur"/>
          <feComposite in="SourceGraphic"/>
        </filter>
        <filter id="Rectangle-2" x="0" y="0" width="450" height="calc(100vh - 56px)" filterUnits="userSpaceOnUse">
          <feOffset dy="6" input="SourceAlpha"/>
          <feGaussianBlur stdDeviation="15" result="blur-2"/>
          <feFlood flood-opacity="0.122"/>
          <feComposite operator="in" in2="blur-2"/>
          <feComposite in="SourceGraphic"/>
        </filter>
        <filter id="Rectangle-3" x="9" y="19" width="432" height="calc(100vh - 56px)" filterUnits="userSpaceOnUse">
          <feOffset dy="16" input="SourceAlpha"/>
          <feGaussianBlur stdDeviation="12" result="blur-3"/>
          <feFlood flood-opacity="0.141"/>
          <feComposite operator="in" in2="blur-3"/>
          <feComposite in="SourceGraphic"/>
        </filter>
        <filter id="Rectangle-4" x="30" y="32" width="390" height="calc(100vh - 96px)" filterUnits="userSpaceOnUse">
          <feOffset dy="8" input="SourceAlpha"/>
          <feGaussianBlur stdDeviation="5" result="blur-4"/>
          <feFlood flood-opacity="0.2"/>
          <feComposite operator="in" in2="blur-4"/>
          <feComposite in="SourceGraphic"/>
        </filter>
        <filter id="Rectangle-5" x="0" y="0" width="450" height="calc(100vh - 56px)" filterUnits="userSpaceOnUse">
          <feOffset dy="6" input="SourceAlpha"/>
          <feGaussianBlur stdDeviation="15" result="blur-5"/>
          <feFlood flood-opacity="0.122"/>
          <feComposite operator="in" in2="blur-5"/>
          <feComposite in="SourceGraphic"/>
        </filter>
        <filter id="Rectangle-6" x="9" y="19" width="432" height="calc(100vh - 56px)" filterUnits="userSpaceOnUse">
          <feOffset dy="16" input="SourceAlpha"/>
          <feGaussianBlur stdDeviation="12" result="blur-6"/>
          <feFlood flood-opacity="0.141"/>
          <feComposite operator="in" in2="blur-6"/>
          <feComposite in="SourceGraphic"/>
        </filter>
      </defs>
      <g id="Light_Nav_Drawer_1._Group_B._Bottom_Scrolled" data-name="Light 🌕/ Nav Drawer/1. Group/B. Bottom/Scrolled">
        <rect id="Scrim" width="360" height="calc(100vh - 96px)" fill="rgba(0,0,0,0.32)"/>
        <g id="Dark_Elevation_00dp_9_States_" data-name="Dark 🌑/Elevation/00dp (9 States)">
          <g id="Shadow">
            <g transform="matrix(1, 0, 0, 1, -45, -39)" filter="url(#Rectangle)" style="mix-blend-mode: multiply;isolation: isolate">
              <rect id="Rectangle-7" data-name="Rectangle" width="360" height="calc(100vh - 96px)" transform="translate(45 39)" fill="#fff"/>
            </g>
            <g transform="matrix(1, 0, 0, 1, -45, -39)" filter="url(#Rectangle-2)" style="mix-blend-mode: multiply;isolation: isolate">
              <rect id="Rectangle-8" data-name="Rectangle" width="360" height="calc(100vh - 96px)" transform="translate(45 39)" fill="#fff"/>
            </g>
            <g transform="matrix(1, 0, 0, 1, -45, -39)" filter="url(#Rectangle-3)" style="mix-blend-mode: multiply;isolation: isolate">
              <rect id="Rectangle-9" data-name="Rectangle" width="360" height="calc(100vh - 96px)" transform="translate(45 39)" fill="#fff"/>
            </g>
          </g>
          <rect id="Rectangle-10" data-name="Rectangle" width="360" height="calc(100vh - 96px)" fill="#121212"/>
          <rect id="On_Surface" data-name="On Surface" width="360" height="calc(100vh - 96px)" fill="rgba(255,255,255,0.12)"/>
        </g>
        <g id="Shadow-2" data-name="Shadow" style="mix-blend-mode: multiply;isolation: isolate">
          <g transform="matrix(1, 0, 0, 1, -45, -39)" filter="url(#Rectangle-4)">
            <rect id="Rectangle-11" data-name="Rectangle" width="360" height="calc(100vh - 96px)" transform="translate(45 39)" fill="#fff"/>
          </g>
          <g transform="matrix(1, 0, 0, 1, -45, -39)" filter="url(#Rectangle-5)">
            <rect id="Rectangle-12" data-name="Rectangle" width="360" height="calc(100vh - 96px)" transform="translate(45 39)" fill="#fff"/>
          </g>
          <g transform="matrix(1, 0, 0, 1, -45, -39)" filter="url(#Rectangle-6)">
            <rect id="Rectangle-13" data-name="Rectangle" width="360" height="calc(100vh - 96px)" transform="translate(45 39)" fill="#fff"/>
          </g>
        </g>
        <g id="List">
          <g id="Dark_Nav_Drawer_ΩElements_2._Line_item" data-name="Dark 🌑 / Nav Drawer/ΩElements/2. Line item" transform="translate(0 56)">
            <g id="Dark_Elevation_00dp_Opacity_0_" data-name="Dark 🌑/Elevation/00dp (Opacity 0%)" opacity="0">
              <rect id="Shadow-3" data-name="Shadow" width="360" height="48" fill="#fff"/>
              <rect id="Rectangle-14" data-name="Rectangle" width="360" height="48" fill="#121212"/>
              <rect id="On_Surface-2" data-name="On Surface" width="360" height="48" fill="rgba(18,18,18,0)"/>
            </g>
            <g id="_Choose_to_use_Icon" data-name="👉 Choose to use 📍Icon" transform="translate(16 12)">
              <rect id="Boundary" width="24" height="24" fill="none"/>
              <path id="_Color" data-name=" ↳Color" d="M10,18,8.55,16.705C3.4,12.124,0,9.1,0,5.4A5.4,5.4,0,0,1,5.5,0,6.037,6.037,0,0,1,10,2.05,6.037,6.037,0,0,1,14.5,0,5.4,5.4,0,0,1,20,5.4c0,3.708-3.4,6.729-8.55,11.32Z" transform="translate(2 3)" fill="rgba(255,255,255,0.6)"/>
            </g>
            <text id="_Label" data-name="✏️ Label" transform="translate(72 30)" fill="rgba(255,255,255,0.6)" font-size="14" font-family="Roboto-Medium, Roboto" font-weight="500" letter-spacing="0.007em"><tspan x="0" y="0">Subtitle 2 </tspan></text>
            <rect id="_States" data-name="💡States" width="360" height="48" fill="none"/>
          </g>
          <g id="Dark_Nav_Drawer_ΩElements_2._Line_item-2" data-name="Dark 🌑 / Nav Drawer/ΩElements/2. Line item" transform="translate(0 104)">
            <g id="Dark_Elevation_00dp_Opacity_0_2" data-name="Dark 🌑/Elevation/00dp (Opacity 0%)" opacity="0">
              <rect id="Shadow-4" data-name="Shadow" width="360" height="48" fill="#fff"/>
              <rect id="Rectangle-15" data-name="Rectangle" width="360" height="48" fill="#121212"/>
              <rect id="On_Surface-3" data-name="On Surface" width="360" height="48" fill="rgba(18,18,18,0)"/>
            </g>
            <g id="_Choose_to_use_Icon-2" data-name="👉 Choose to use 📍Icon" transform="translate(16 12)">
              <rect id="Boundary-2" data-name="Boundary" width="24" height="24" fill="none"/>
              <path id="_Color-2" data-name=" ↳Color" d="M10,18,8.55,16.705C3.4,12.124,0,9.1,0,5.4A5.4,5.4,0,0,1,5.5,0,6.037,6.037,0,0,1,10,2.05,6.037,6.037,0,0,1,14.5,0,5.4,5.4,0,0,1,20,5.4c0,3.708-3.4,6.729-8.55,11.32Z" transform="translate(2 3)" fill="rgba(255,255,255,0.6)"/>
            </g>
            <text id="_Label-2" data-name="✏️ Label" transform="translate(72 30)" fill="rgba(255,255,255,0.6)" font-size="14" font-family="Roboto-Medium, Roboto" font-weight="500" letter-spacing="0.007em"><tspan x="0" y="0">Subtitle 2 </tspan></text>
            <rect id="_States-2" data-name="💡States" width="360" height="48" fill="none"/>
          </g>
          <g id="Dark_Nav_Drawer_ΩElements_2._Line_item-3" data-name="Dark 🌑 / Nav Drawer/ΩElements/2. Line item" transform="translate(0 152)">
            <g id="Dark_Elevation_00dp_Opacity_0_3" data-name="Dark 🌑/Elevation/00dp (Opacity 0%)" opacity="0">
              <rect id="Shadow-5" data-name="Shadow" width="360" height="48" fill="#fff"/>
              <rect id="Rectangle-16" data-name="Rectangle" width="360" height="48" fill="#121212"/>
              <rect id="On_Surface-4" data-name="On Surface" width="360" height="48" fill="rgba(18,18,18,0)"/>
            </g>
            <g id="_Choose_to_use_Icon-3" data-name="👉 Choose to use 📍Icon" transform="translate(16 12)">
              <rect id="Boundary-3" data-name="Boundary" width="24" height="24" fill="none"/>
              <path id="_Color-3" data-name=" ↳Color" d="M10,18,8.55,16.705C3.4,12.124,0,9.1,0,5.4A5.4,5.4,0,0,1,5.5,0,6.037,6.037,0,0,1,10,2.05,6.037,6.037,0,0,1,14.5,0,5.4,5.4,0,0,1,20,5.4c0,3.708-3.4,6.729-8.55,11.32Z" transform="translate(2 3)" fill="rgba(255,255,255,0.6)"/>
            </g>
            <text id="_Label-3" data-name="✏️ Label" transform="translate(72 30)" fill="rgba(255,255,255,0.6)" font-size="14" font-family="Roboto-Medium, Roboto" font-weight="500" letter-spacing="0.007em"><tspan x="0" y="0">Subtitle 2 </tspan></text>
            <rect id="_States-3" data-name="💡States" width="360" height="48" fill="none"/>
          </g>
          <g id="Dark_Nav_Drawer_ΩElements_2._Line_item-4" data-name="Dark 🌑 / Nav Drawer/ΩElements/2. Line item" transform="translate(0 200)">
            <g id="Dark_Elevation_00dp_Opacity_0_4" data-name="Dark 🌑/Elevation/00dp (Opacity 0%)" opacity="0">
              <rect id="Shadow-6" data-name="Shadow" width="360" height="48" fill="#fff"/>
              <rect id="Rectangle-17" data-name="Rectangle" width="360" height="48" fill="#121212"/>
              <rect id="On_Surface-5" data-name="On Surface" width="360" height="48" fill="rgba(18,18,18,0)"/>
            </g>
            <g id="_Choose_to_use_Icon-4" data-name="👉 Choose to use 📍Icon" transform="translate(16 12)">
              <rect id="Boundary-4" data-name="Boundary" width="24" height="24" fill="none"/>
              <path id="_Color-4" data-name=" ↳Color" d="M10,18,8.55,16.705C3.4,12.124,0,9.1,0,5.4A5.4,5.4,0,0,1,5.5,0,6.037,6.037,0,0,1,10,2.05,6.037,6.037,0,0,1,14.5,0,5.4,5.4,0,0,1,20,5.4c0,3.708-3.4,6.729-8.55,11.32Z" transform="translate(2 3)" fill="rgba(255,255,255,0.6)"/>
            </g>
            <text id="_Label-4" data-name="✏️ Label" transform="translate(72 30)" fill="rgba(255,255,255,0.6)" font-size="14" font-family="Roboto-Medium, Roboto" font-weight="500" letter-spacing="0.007em"><tspan x="0" y="0">Subtitle 2 </tspan></text>
            <rect id="_States-4" data-name="💡States" width="360" height="48" fill="none"/>
          </g>
          <g id="Dark_Nav_Drawer_ΩElements_2._Line_item-5" data-name="Dark 🌑 / Nav Drawer/ΩElements/2. Line item" transform="translate(0 248)">
            <g id="Dark_Elevation_00dp_Opacity_0_5" data-name="Dark 🌑/Elevation/00dp (Opacity 0%)" opacity="0">
              <rect id="Shadow-7" data-name="Shadow" width="360" height="48" fill="#fff"/>
              <rect id="Rectangle-18" data-name="Rectangle" width="360" height="48" fill="#121212"/>
              <rect id="On_Surface-6" data-name="On Surface" width="360" height="48" fill="rgba(18,18,18,0)"/>
            </g>
            <g id="_Choose_to_use_Icon-5" data-name="👉 Choose to use 📍Icon" transform="translate(16 12)">
              <rect id="Boundary-5" data-name="Boundary" width="24" height="24" fill="none"/>
              <path id="_Color-5" data-name=" ↳Color" d="M10,18,8.55,16.705C3.4,12.124,0,9.1,0,5.4A5.4,5.4,0,0,1,5.5,0,6.037,6.037,0,0,1,10,2.05,6.037,6.037,0,0,1,14.5,0,5.4,5.4,0,0,1,20,5.4c0,3.708-3.4,6.729-8.55,11.32Z" transform="translate(2 3)" fill="rgba(255,255,255,0.6)"/>
            </g>
            <text id="_Label-5" data-name="✏️ Label" transform="translate(72 30)" fill="rgba(255,255,255,0.6)" font-size="14" font-family="Roboto-Medium, Roboto" font-weight="500" letter-spacing="0.007em"><tspan x="0" y="0">Subtitle 2 </tspan></text>
            <rect id="_States-5" data-name="💡States" width="360" height="48" fill="none"/>
          </g>
          <g id="Dark_Nav_Drawer_ΩElements_2._Line_item-6" data-name="Dark 🌑 / Nav Drawer/ΩElements/2. Line item" transform="translate(0 296)">
            <g id="Dark_Elevation_00dp_Opacity_0_6" data-name="Dark 🌑/Elevation/00dp (Opacity 0%)" opacity="0">
              <rect id="Shadow-8" data-name="Shadow" width="360" height="48" fill="#fff"/>
              <rect id="Rectangle-19" data-name="Rectangle" width="360" height="48" fill="#121212"/>
              <rect id="On_Surface-7" data-name="On Surface" width="360" height="48" fill="rgba(18,18,18,0)"/>
            </g>
            <g id="_Choose_to_use_Icon-6" data-name="👉 Choose to use 📍Icon" transform="translate(16 12)">
              <rect id="Boundary-6" data-name="Boundary" width="24" height="24" fill="none"/>
              <path id="_Color-6" data-name=" ↳Color" d="M10,18,8.55,16.705C3.4,12.124,0,9.1,0,5.4A5.4,5.4,0,0,1,5.5,0,6.037,6.037,0,0,1,10,2.05,6.037,6.037,0,0,1,14.5,0,5.4,5.4,0,0,1,20,5.4c0,3.708-3.4,6.729-8.55,11.32Z" transform="translate(2 3)" fill="rgba(255,255,255,0.6)"/>
            </g>
            <text id="_Label-6" data-name="✏️ Label" transform="translate(72 30)" fill="rgba(255,255,255,0.6)" font-size="14" font-family="Roboto-Medium, Roboto" font-weight="500" letter-spacing="0.007em"><tspan x="0" y="0">Subtitle 2 </tspan></text>
            <rect id="_States-6" data-name="💡States" width="360" height="48" fill="none"/>
          </g>
          <g id="Dark_Nav_Drawer_ΩElements_2._Line_item-7" data-name="Dark 🌑 / Nav Drawer/ΩElements/2. Line item" transform="translate(0 344)">
            <g id="Dark_Elevation_00dp_Opacity_0_7" data-name="Dark 🌑/Elevation/00dp (Opacity 0%)" opacity="0">
              <rect id="Shadow-9" data-name="Shadow" width="360" height="48" fill="#fff"/>
              <rect id="Rectangle-20" data-name="Rectangle" width="360" height="48" fill="#121212"/>
              <rect id="On_Surface-8" data-name="On Surface" width="360" height="48" fill="rgba(18,18,18,0)"/>
            </g>
            <g id="_Choose_to_use_Icon-7" data-name="👉 Choose to use 📍Icon" transform="translate(16 12)">
              <rect id="Boundary-7" data-name="Boundary" width="24" height="24" fill="none"/>
              <path id="_Color-7" data-name=" ↳Color" d="M10,18,8.55,16.705C3.4,12.124,0,9.1,0,5.4A5.4,5.4,0,0,1,5.5,0,6.037,6.037,0,0,1,10,2.05,6.037,6.037,0,0,1,14.5,0,5.4,5.4,0,0,1,20,5.4c0,3.708-3.4,6.729-8.55,11.32Z" transform="translate(2 3)" fill="rgba(255,255,255,0.6)"/>
            </g>
            <text id="_Label-7" data-name="✏️ Label" transform="translate(72 30)" fill="rgba(255,255,255,0.6)" font-size="14" font-family="Roboto-Medium, Roboto" font-weight="500" letter-spacing="0.007em"><tspan x="0" y="0">Subtitle 2 </tspan></text>
            <rect id="_States-7" data-name="💡States" width="360" height="48" fill="none"/>
          </g>
          <g id="Dark_Nav_Drawer_ΩElements_2._Line_item-8" data-name="Dark 🌑 / Nav Drawer/ΩElements/2. Line item" transform="translate(0 392)">
            <g id="Dark_Elevation_00dp_Opacity_0_8" data-name="Dark 🌑/Elevation/00dp (Opacity 0%)" opacity="0">
              <rect id="Shadow-10" data-name="Shadow" width="360" height="48" fill="#fff"/>
              <rect id="Rectangle-21" data-name="Rectangle" width="360" height="48" fill="#121212"/>
              <rect id="On_Surface-9" data-name="On Surface" width="360" height="48" fill="rgba(18,18,18,0)"/>
            </g>
            <g id="_Choose_to_use_Icon-8" data-name="👉 Choose to use 📍Icon" transform="translate(16 12)">
              <rect id="Boundary-8" data-name="Boundary" width="24" height="24" fill="none"/>
              <path id="_Color-8" data-name=" ↳Color" d="M10,18,8.55,16.705C3.4,12.124,0,9.1,0,5.4A5.4,5.4,0,0,1,5.5,0,6.037,6.037,0,0,1,10,2.05,6.037,6.037,0,0,1,14.5,0,5.4,5.4,0,0,1,20,5.4c0,3.708-3.4,6.729-8.55,11.32Z" transform="translate(2 3)" fill="rgba(255,255,255,0.6)"/>
            </g>
            <text id="_Label-8" data-name="✏️ Label" transform="translate(72 30)" fill="rgba(255,255,255,0.6)" font-size="14" font-family="Roboto-Medium, Roboto" font-weight="500" letter-spacing="0.007em"><tspan x="0" y="0">Subtitle 2 </tspan></text>
            <rect id="_States-8" data-name="💡States" width="360" height="48" fill="none"/>
          </g>
          <g id="Dark_Nav_Drawer_ΩElements_2._Line_item-9" data-name="Dark 🌑 / Nav Drawer/ΩElements/2. Line item" transform="translate(0 440)">
            <g id="Dark_Elevation_00dp_Opacity_0_9" data-name="Dark 🌑/Elevation/00dp (Opacity 0%)" opacity="0">
              <rect id="Shadow-11" data-name="Shadow" width="360" height="48" fill="#fff"/>
              <rect id="Rectangle-22" data-name="Rectangle" width="360" height="48" fill="#121212"/>
              <rect id="On_Surface-10" data-name="On Surface" width="360" height="48" fill="rgba(18,18,18,0)"/>
            </g>
            <g id="_Choose_to_use_Icon-9" data-name="👉 Choose to use 📍Icon" transform="translate(16 12)">
              <rect id="Boundary-9" data-name="Boundary" width="24" height="24" fill="none"/>
              <path id="_Color-9" data-name=" ↳Color" d="M10,18,8.55,16.705C3.4,12.124,0,9.1,0,5.4A5.4,5.4,0,0,1,5.5,0,6.037,6.037,0,0,1,10,2.05,6.037,6.037,0,0,1,14.5,0,5.4,5.4,0,0,1,20,5.4c0,3.708-3.4,6.729-8.55,11.32Z" transform="translate(2 3)" fill="rgba(255,255,255,0.6)"/>
            </g>
            <text id="_Label-9" data-name="✏️ Label" transform="translate(72 30)" fill="rgba(255,255,255,0.6)" font-size="14" font-family="Roboto-Medium, Roboto" font-weight="500" letter-spacing="0.007em"><tspan x="0" y="0">Subtitle 2 </tspan></text>
            <rect id="_States-9" data-name="💡States" width="360" height="48" fill="none"/>
          </g>
        </g>
        <g id="Dark_Nav_Drawer_ΩElements_2._Line_item-10" data-name="Dark 🌑 / Nav Drawer/ΩElements/2. Line item" transform="translate(0 56)">
          <g id="Dark_Elevation_00dp_Opacity_0_10" data-name="Dark 🌑/Elevation/00dp (Opacity 0%)" opacity="0">
            <rect id="Shadow-12" data-name="Shadow" width="360" height="48" fill="#fff"/>
            <rect id="Rectangle-23" data-name="Rectangle" width="360" height="48" fill="#121212"/>
            <rect id="On_Surface-11" data-name="On Surface" width="360" height="48" fill="rgba(18,18,18,0)"/>
          </g>
          <g id="_Choose_to_use_Icon-10" data-name="👉 Choose to use 📍Icon" transform="translate(16 12)">
            <rect id="Boundary-10" data-name="Boundary" width="24" height="24" fill="none"/>
            <path id="_Color-10" data-name=" ↳Color" d="M10,18,8.55,16.705C3.4,12.124,0,9.1,0,5.4A5.4,5.4,0,0,1,5.5,0,6.037,6.037,0,0,1,10,2.05,6.037,6.037,0,0,1,14.5,0,5.4,5.4,0,0,1,20,5.4c0,3.708-3.4,6.729-8.55,11.32Z" transform="translate(2 3)" fill="rgba(255,255,255,0.6)"/>
          </g>
          <text id="_Label-10" data-name="✏️ Label" transform="translate(72 30)" fill="#bb86fc" font-size="14" font-family="Roboto-Medium, Roboto" font-weight="500" letter-spacing="0.007em"><tspan x="0" y="0">Subtitle 2 </tspan></text>
          <rect id="_States-10" data-name="💡States" width="360" height="48" fill="rgba(187,134,252,0.08)"/>
          <g id="_Choose_to_use_Icon-11" data-name="👉 Choose to use 📍Icon" transform="translate(16 12)">
            <rect id="Boundary-11" data-name="Boundary" width="24" height="24" fill="none"/>
            <path id="_Color-11" data-name=" ↳Color" d="M10,18,8.55,16.705C3.4,12.124,0,9.1,0,5.4A5.4,5.4,0,0,1,5.5,0,6.037,6.037,0,0,1,10,2.05,6.037,6.037,0,0,1,14.5,0,5.4,5.4,0,0,1,20,5.4c0,3.708-3.4,6.729-8.55,11.32Z" transform="translate(2 3)" fill="#bb86fc"/>
          </g>
        </g>
      </g>
    </svg>
  </div>
  <div id="recipes">
        <svg id="navigation-tab" xmlns="http://www.w3.org/2000/svg" width="380" height="48.5" viewBox="0 0 380 48.5"  z-index="12">
            <g id="Light_Tabs_ΩElements_6_States_Text_Icon_Active" data-name="Light 🌕/Tabs/ΩElements/(6 States) Text + Icon /Active" transform="translate(10)">
              <g id="Light_Elevation_00dp" data-name="Light 🌕/Elevation/00dp">
                <rect id="highlighter" width="120" height="48" fill="#a6bcd0" opacity="0" style="mix-blend-mode: multiply;isolation: isolate"/>
              </g>
              <rect id="Primary" width="120" height="48" fill="none"/>
              <foreignObject width="120" height="48" color="transparent" id="TAB_button">
                <input type=radio style = "width:120px; height:48px;" name ="tab-button" id="tab-button" group:checked={inputValue} />
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="48.5">
                  <rect id="Indicator" width="120" height="2" active={inputValue} transform="translate(0 46)" />
                  <text id="_Caption" data-name="✏️ Caption" transform="translate(60 29)" active={inputValue} font-size="14" font-family="Roboto-Medium, Roboto" font-weight="500" letter-spacing="0.089em"><tspan x="-14.159" y="0">TAB</tspan></text>
                </svg>
              </foreignObject>
            </g>
            <g id="Light_Tabs_ΩElements_6_States_Text_Icon_Active-2" data-name="Light 🌕/Tabs/ΩElements/(6 States) Text + Icon /Active" transform="translate(130)">
              <g id="Light_Elevation_00dp-2" data-name="Light 🌕/Elevation/00dp">
                <rect id="highlighter-2" data-name="highlighter" width="120" height="48" fill="#a6bcd0" opacity="0" style="mix-blend-mode: multiply;isolation: isolate"/>
              </g>
              <rect id="Primary" data-name="Primary" width="120" height="48" fill="none"/>
              <foreignObject width="120" height="48" color="transparent" id="TAB_button">
                <input type=radio name ="tab-button" style = "width:120px; height:48px;" id="tab-button" />
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="48.5">
                  <rect id="Indicator" width="120" height="2" active={inputValue} transform="translate(0 46)" />
                  <text id="_Caption" data-name="✏️ Caption" transform="translate(60 29)" active={inputValue} font-size="14" font-family="Roboto-Medium, Roboto" font-weight="500" letter-spacing="0.089em"><tspan x="-14.159" y="0">TAB</tspan></text>
                  </svg>
              </foreignObject>
            </g>
            <g id="single-tab" transform="translate(250)">
              <g id="Light_Elevation_00dp-3" data-name="Light 🌕/Elevation/00dp">
                <rect id="highlighter-3" data-name="highlighter" width="120" height="48" fill="#a6bcd0" opacity="0" style="mix-blend-mode: multiply;isolation: isolate"/>
              </g>
              <rect id="Primary" data-name="Primary" width="120" height="48" fill="none"/>
              <foreignObject width="120" height="48" color="transparent" id="TAB_button">
                <input type=radio name ="tab-button" style = "width:120px; height:48px;" id="tab-button" />
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="48.5">
                  <text id="_Caption" data-name="✏️ Caption" transform="translate(60 29)" active={inputValue} font-size="14" font-family="Roboto-Medium, Roboto" font-weight="500" letter-spacing="0.089em"><tspan x="-14.159" y="0">TAB</tspan></text>
                    <rect id="Indicator" width="120" height="2" active={inputValue} transform="translate(0 46)" />
                  </svg>
              </foreignObject>
            </g>
          </svg>
                  
  </div>

  
</nav>

<style>
  #_Caption{
    fill:rgba(255,255,255,0.6)
  }
  #Indicator{
    fill:#a6bcd0;
  }
  input:checked ~ svg #Indicator,
  input:checked ~ svg #_Caption{
    fill: #bb86fc;
  }
  #tab-button{
    cursor: pointer;
  }
  main{
    position:absolute;
    top:108px;
  }
  #recipes{
    position: relative;
    height: 48px;
    background-color: black;
  }
  #side-bar {
    position: absolute;
    left: 0;
    height: calc(100vh - 96px);
    width: 360px;
}
  #sidebar{
    position: absolute;
    top:0;
    left:0;
  }
  #frBtn {
    pointer-events: all;
    z-index: 11;
    cursor: pointer;
  }
  button {
    color: transparent;
  }
  #icon_navigation_arrow_right_24px {
    pointer-events: none;
  }
  text {
    pointer-events: none;
  }
  #menu-button{
    cursor: pointer;
  }
  #close-button{
    cursor: pointer;
  }
</style>
