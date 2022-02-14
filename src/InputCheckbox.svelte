<script>
    import InputContainer from "./InputContainer.svelte";
    import { createFieldValidator } from "./functions/validation.js";
    import { expandMore } from "./functions/validators";
    import { mountComponent, typeOfInput } from "./functions/mountComponent";
    import { onMount } from "svelte";
    export let extracheckboxtext = "";
    export let extracheckbox = false;
    export let inputValue = undefined;
    export let isRequired = false;
    export let checkboxtext = "";
    export let inputName = "";
    let checkable = false;
    let validity;
    let validate;
    onMount(() => {
        if(mountComponent(inputName)){
            typeOfInput(inputValue,mountComponent(inputName)) ? 
            inputValue = typeOfInput(inputValue,mountComponent(inputName)) : (() => {return})
        }
        return;
    });
    [validity, validate] = createFieldValidator(
            undefined,
            inputName,
            isRequired,
            true,
            expandMore(inputName)
        );
</script>

<InputContainer>
    <div slot="input-slot" id="married_input">
        <div id="switch-off_mb" class="switch_off">
            <svg class="switch-cover_mc">
                <rect id="switch-cover_mc" rx="12" ry="12" x="0" y="0" width="37" height="24">
                </rect>
            </svg>
            <input 
            class="switch-body_md"
            type="checkbox"
            name={inputName}
            id={inputName}
            bind:checked={inputValue}
            use:validate={inputValue}
            isinputok={$validity?.valid}
            disabled={checkable}
            >
            <rect id="switch-body_md" rx="12" ry="12" x="0" y="0" width="37" height="24">
            </rect>
            <svg class="switch-circle_me">
                <rect id="switch-circle_me" rx="12" ry="12" x="0" y="0" width="24" height="24">
                </rect>
            </svg>
        </div>
        <div id="Are_you_Married">
            <span>{checkboxtext}</span>
        </div>
    </div>
    <div
        slot="extra-input-slot"
        class="checkbox-container"
        id="morecheckbox"
        name="morecheckbox"
        visible={$validity?.valid && extracheckbox}
    >
        <input
            type="checkbox"
            name={inputName}
            id={inputName}
            on:input
            bind:value={inputValue}
        />
        <div class="checkbox-text">{extracheckboxtext}</div>
    </div>
</InputContainer>
<style id="applicationStylesheet" type="text/css">
	.mediaViewInfo {
		--web-view-name: Family-Information (dark);
		--web-view-id: Family-Information_dark;
		--web-scale-on-resize: true;
		--web-enable-deep-linking: true;
	}
	:root {
		--web-view-ids: Family-Information_dark;
	}
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		border: none;
	}
	#Family-Information_dark {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: rgba(64,78,90,1);
		
		--web-view-name: Family-Information (dark);
		--web-view-id: Family-Information_dark;
		--web-scale-on-resize: true;
		--web-enable-deep-linking: true;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: default;
	}
	#fixed_k {
		position: absolute;
		width: 990.977px;
		height: 20px;
		left: 15.5px;
		top: 12px;
		display: none;
		
	}
	#right_k {
		position: absolute;
		width: 103.477px;
		height: 15px;
		left: 887.5px;
		top: 2px;
		
	}
	#cellular_k {
		fill: rgba(0,0,0,1);
	}
	.cellular_k {
		
		position: absolute;
		width: 16.5px;
		height: 10px;
		left: 0px;
		top: 3px;
		transform: matrix(1,0,0,1,0,0);
	}
	#Wifi_k {
		fill: rgba(0,0,0,1);
	}
	.Wifi_k {
		
		position: absolute;
		width: 14.053px;
		height: 10px;
		left: 22.475px;
		top: 2.333px;
		transform: matrix(1,0,0,1,0,0);
	}
	#n_00_k {
		left: 46px;
		top: 0px;
		position: absolute;
		
		width: 27px;
		white-space: nowrap;
		text-align: right;
		font-family: Adobe Clean;
		font-style: normal;
		font-weight: normal;
		font-size: 12px;
		color: rgba(0,0,0,1);
		letter-spacing: -0.08333333015441895px;
	}
	#battery_k {
		position: absolute;
		width: 27px;
		height: 12px;
		left: 76.477px;
		top: 2px;
		
	}
	#battery_la {
		opacity: 0.4;
		fill: rgba(0,0,0,0);
		stroke: rgba(0,0,0,1);
		stroke-width: 1px;
		stroke-linejoin: miter;
		stroke-linecap: butt;
		stroke-miterlimit: 10;
		shape-rendering: auto;
	}
	.battery_la {
		
		position: absolute;
		width: 27px;
		height: 12px;
		left: 0px;
		top: 0px;
		transform: matrix(1,0,0,1,0,0);
	}
	#capacity_k {
		fill: rgba(0,0,0,1);
	}
	.capacity_k {
		position: absolute;
		
		width: 20px;
		height: 8px;
		left: 2px;
		top: 2px;
	}
	#date_k {
		position: absolute;
		width: 59px;
		height: 20px;
		left: 25.5px;
		top: 0px;
		
	}
	#rectangle_k {
		fill: transparent;
	}
	.rectangle_k {
		position: absolute;
		
		width: 7px;
		height: 20px;
		left: 0px;
		top: 0px;
	}
	#Date_la {
		left: 9px;
		top: 2px;
		position: absolute;
		
		width: 51px;
		white-space: nowrap;
		text-align: left;
		font-family: Adobe Clean;
		font-style: normal;
		font-weight: normal;
		font-size: 12px;
		color: rgba(0,0,0,1);
	}
	#Time_lb {
		left: 0px;
		top: 2px;
		position: absolute;
		
		width: 20px;
		white-space: nowrap;
		text-align: left;
		font-family: Adobe Clean;
		font-style: normal;
		font-weight: normal;
		font-size: 12px;
		color: rgba(0,0,0,1);
		letter-spacing: -0.0023999999463558195px;
	}
	#main-content_lc {
		position: absolute;
		width: 375px;
		height: 692px;
		left: 0;
		top: 0;
		
		right: 0;
		bottom: 0;
		margin: auto;
		max-height: 70%;
	}
	#bg-shadow_ld {
		position: absolute;
		width: 375px;
		height: 692px;
		left: 0px;
		top: 0px;
		
	}
	#ellipse_le {
		opacity: 0.15;
		filter: blur(20.281px);
		fill: rgba(0,0,0,1);
	}
	.ellipse_le {
		position: absolute;
		
		width: 420.684px;
		height: 218.684px;
		left: 38px;
		top: 595px;
	}
	#rectangle_lf {
		fill: rgba(64,78,90,1);
	}
	.rectangle_lf {
		filter: drop-shadow(0px 5px 30px rgba(0, 0, 0, 0.051));
		position: absolute;
		
		width: 465px;
		height: 100;
		left: 0px;
		top: 0px;
	}
	#page_link_lg {
		position: absolute;
		width: 90px;
		height: 10px;
		left: 0;
		top: unset;
		
		padding: 0px;
		right: 0;
		bottom: 0px;
		margin: auto;
	}
	#nav-dot_lh {
		position: absolute;
		width: 10px;
		height: 10px;
		left: 80px;
		top: 0px;
		
	}
	#Ellipse_442_li {
		fill: rgba(166,184,201,0.302);
	}
	.Ellipse_442_li {
		position: absolute;
		
		width: 10px;
		height: 10px;
		left: 0px;
		top: 0px;
	}
	#nav-dot_lj {
		position: absolute;
		width: 10px;
		height: 10px;
		left: 60px;
		top: 0px;
		
	}
	#Ellipse_442_lk {
		fill: rgba(166,184,201,0.302);
	}
	.Ellipse_442_lk {
		position: absolute;
		
		width: 10px;
		height: 10px;
		left: 0px;
		top: 0px;
	}
	#nav-dot_ll {
		position: absolute;
		width: 10px;
		height: 10px;
		left: 40px;
		top: 0px;
		
	}
	#Ellipse_442_lm {
		fill: rgba(166,184,201,0.302);
	}
	.Ellipse_442_lm {
		position: absolute;
		
		width: 10px;
		height: 10px;
		left: 0px;
		top: 0px;
	}
	#nav-dot_ln {
		position: absolute;
		width: 10px;
		height: 10px;
		left: 20px;
		top: 0px;
		
	}
	#Ellipse_442_lo {
		fill: rgba(166,188,208,1);
	}
	.Ellipse_442_lo {
		position: absolute;
		
		width: 10px;
		height: 10px;
		left: 0px;
		top: 0px;
	}
	#nav-dot_lp {
		position: absolute;
		width: 10px;
		height: 10px;
		left: 0px;
		top: 0px;
		
	}
	#Ellipse_442_lq {
		fill: rgba(166,184,201,0.302);
	}
	.Ellipse_442_lq {
		position: absolute;
		
		width: 10px;
		height: 10px;
		left: 0px;
		top: 0px;
	}
	#onboarding-text-3_lr {
		left: 0;
		top: 492px;
		position: absolute;
		
		width: 291px;
		height: 58px;
		text-align: center;
		font-family: Adobe Clean;
		font-style: normal;
		font-weight: lighter;
		font-size: 16px;
		color: rgba(69,161,84,1);
		letter-spacing: -0.1px;
		margin: auto;
		right: 0;
		bottom: 142px;
	}
	#onboarding-options_ls {
		position: absolute;
		width: 255px;
		height: 132px;
		left: 60px;
		top: 160px;
		
		padding: 0px;
	}
	#content_lt {
		position: absolute;
		width: 255px;
		height: 132px;
		left: 0px;
		top: 0px;
		
	}
	#children_input {
		position: absolute;
		width: 255px;
		height: 24px;
		left: 0px;
		top: 54px;
		
	}
	#switch-off_lv {
		position: absolute;
		width: 37px;
		height: 24px;
		left: 218px;
		top: 0px;
		
	}
	#switch-cover_lw {
		fill: transparent;
		stroke: rgba(123,237,141,1);
		stroke-width: 1px;
		stroke-linejoin: miter;
		stroke-linecap: butt;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.switch-cover_lw {
		width: 36px;
		height: 24px;
		position: absolute;
		
		transform: translate(0px, 0px) matrix(1,0,0,1,0,0) rotate(180deg);
		transform-origin: center;
	}
	#switch-body_lx {
		fill: transparent;
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: miter;
		stroke-linecap: butt;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.switch-body_lx {
		width: 37px;
		height: 24px;
		position: absolute;
		
		transform: translate(0px, 0px) matrix(1,0,0,1,0,0) rotate(180deg);
		transform-origin: center;
		appearance: none;
		cursor:  pointer;
	}
	#switch-circle_ly {
		fill: rgba(123,237,141,1);
	}
	.switch-circle_ly {
		position: absolute;
		
		width: 24px;
		height: 24px;
		left: 0px;
		top: 0px;
	}
	#switch-line-2_lz {
		fill: transparent;
		stroke: rgba(255,255,255,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.switch-line-2_lz {
		
		position: absolute;
		width: 6.652px;
		height: 6.65px;
		left: 10.586px;
		top: 9.748px;
		transform: matrix(1,0,0,1,0,0);
	}
	#switch-line-1_l {
		fill: transparent;
		stroke: rgba(255,255,255,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.switch-line-1_l {
		
		position: absolute;
		width: 2.5px;
		height: 2.5px;
		transform: translate(0px, 0px) matrix(1,0,0,1,8,12.54) rotate(90deg);
		transform-origin: center;
		left: 0px;
		top: 0px;
	}
	#Do_you_have_children {
		left: 0px;
		top: 1px;
		position: absolute;
		
		width: 144px;
		white-space: nowrap;
		text-align: left;
		font-family: Adobe Clean;
		font-style: normal;
		font-weight: normal;
		font-size: 16px;
		color: rgba(116,138,157,1);
		letter-spacing: -0.1px;
	}
	#employed_input {
		position: absolute;
		width: 255px;
		height: 24px;
		left: 0px;
		top: 108px;
		
	}
	#switch-off_l {
		position: absolute;
		width: 37px;
		height: 24px;
		left: 218px;
		top: 0px;
		
	}
	#switch-cover_l {
		fill: transparent;
		stroke: rgba(123,237,141,1);
		stroke-width: 1px;
		stroke-linejoin: miter;
		stroke-linecap: butt;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.switch-cover_l {
		width: 36px;
		height: 24px;
		position: absolute;
		
		transform: translate(0px, 0px) matrix(1,0,0,1,0,0) rotate(180deg);
		transform-origin: center;
	}
	#switch-body_l {
		fill: transparent;
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: miter;
		stroke-linecap: butt;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.switch-body_l {
		width: 37px;
		height: 24px;
		position: absolute;
		
		transform: translate(0px, 0px) matrix(1,0,0,1,0,0) rotate(180deg);
		transform-origin: center;
		appearance: none;
		cursor:  pointer;
	}
	#switch-circle_l {
		fill: rgba(123,237,141,1);
	}
	.switch-circle_l {
		position: absolute;
		
		width: 24px;
		height: 24px;
		left: 0px;
		top: 0px;
	}
	#switch-line-2_l {
		fill: transparent;
		stroke: rgba(255,255,255,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.switch-line-2_l {
		
		position: absolute;
		width: 6.652px;
		height: 6.65px;
		left: 10.586px;
		top: 9.748px;
		transform: matrix(1,0,0,1,0,0);
	}
	#switch-line-1_ma {
		fill: transparent;
		stroke: rgba(255,255,255,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.switch-line-1_ma {
		
		position: absolute;
		width: 2.5px;
		height: 2.5px;
		transform: translate(0px, 0px) matrix(1,0,0,1,8,12.54) rotate(90deg);
		transform-origin: center;
		left: 0px;
		top: 0px;
	}
	#Are_you_employed {
		left: 0px;
		top: 1px;
		position: absolute;
		
		width: 126px;
		white-space: nowrap;
		text-align: left;
		font-family: Adobe Clean;
		font-style: normal;
		font-weight: normal;
		font-size: 16px;
		color: rgba(116,138,157,1);
		letter-spacing: -0.1px;
	}
	#married_input {
		position: absolute;
		width: 255px;
		height: 24px;
		left: 0px;
		top: 0px;
		
	}
	#switch-off_mb {
		position: absolute;
		width: 37px;
		height: 24px;
		left: 218px;
		top: 0px;
		
	}
	#switch-cover_mc {
		fill: transparent;
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: miter;
		stroke-linecap: butt;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.switch-cover_mc {
		width: 37px;
		height: 24px;
		position: absolute;
		
		transform: translate(0px, 0px) matrix(1,0,0,1,0,0) rotate(180deg);
		transform-origin: center;
	}
	#switch-body_md {
		fill: transparent;
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: miter;
		stroke-linecap: butt;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.switch-body_md {
		width: 37px;
		height: 24px;
		position: absolute;
		
		transform: translate(0px, 0px) matrix(1,0,0,1,0,0) rotate(180deg);
		transform-origin: center;
		appearance: none;
        right: -20px;
	}
	#switch-circle_me {
		fill: rgba(116,138,157,1);
	}
	.switch-circle_me {
		position: absolute;
		
		width: 24px;
		height: 24px;
		left: 13px;
		top: 0px;
        
	}
	#switch-line-2_mf {
		fill: transparent;
		stroke: rgba(255,255,255,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.switch-line-2_mf {
		
		position: absolute;
		width: 6.898px;
		height: 6.898px;
		left: 22.086px;
		top: 9.5px;
		transform: matrix(1,0,0,1,0,0);
	}
	#switch-line-1_mg {
		fill: transparent;
		stroke: rgba(255,255,255,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.switch-line-1_mg {
		
		position: absolute;
		width: 5.484px;
		height: 5.484px;
		transform: translate(0px, 0px) matrix(1,0,0,1,22.0859,9.5) rotate(90deg);
		transform-origin: center;
		left: 0px;
		top: 0px;
	}
	#Are_you_Married {
		left: 0px;
		top: 0px;
		position: absolute;
		
		width: 112px;
		white-space: nowrap;
		text-align: left;
		font-family: Adobe Clean;
		font-style: normal;
		font-weight: normal;
		font-size: 16px;
		color: rgba(116,138,157,1);
		letter-spacing: -0.1px;
	}
	#Family_Information {
		left: 127px;
		top: 80px;
		position: absolute;
		
		width: 123px;
		white-space: nowrap;
		text-align: center;
		font-family: Adobe Clean;
		font-style: normal;
		font-weight: normal;
		font-size: 16px;
		color: rgba(123,237,141,1);
		letter-spacing: -0.1px;
	}
	#Scroll_Group_1 {
		mix-blend-mode: normal;
		position: absolute;
		width: 100%;
		height: 90px;
		left: 0px;
		top: 0px;
		
	}
	#nav-desktop_mk {
		position: absolute;
		width: 1920px;
		height: 90px;
		left: 0px;
		top: 0px;
		
	}
	#rectangle_ml {
		fill: rgba(78,93,106,1);
	}
	.rectangle_ml {
		position: absolute;
		
		width: 1920px;
		height: 90px;
		left: 0px;
		top: 0px;
	}
	#icon-store_mm {
		position: absolute;
		width: 20.648px;
		height: 18.273px;
		left: 238px;
		top: 36px;
		
	}
	#path_mn {
		fill: rgba(0,0,0,0);
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.path_mn {
		
		position: absolute;
		width: 21.646px;
		height: 15.557px;
		left: 0px;
		top: 3.716px;
		transform: matrix(1,0,0,1,0,0);
	}
	#path_mo {
		fill: rgba(0,0,0,0);
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.path_mo {
		position: absolute;
		
		width: 17.932px;
		height: 3.117px;
		left: 1.857px;
		top: 0px;
	}
	#icon-recipes_mp {
		position: absolute;
		width: 22.324px;
		height: 17.506px;
		left: 328px;
		top: 36px;
		
	}
	#path_mq {
		fill: rgba(0,0,0,0);
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.path_mq {
		position: absolute;
		
		width: 13.697px;
		height: 18.506px;
		left: 4.813px;
		top: 0px;
	}
	#path_mr {
		fill: rgba(0,0,0,0);
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.path_mr {
		position: absolute;
		
		width: 3.414px;
		height: 12.987px;
		left: 2.398px;
		top: 2.76px;
	}
	#path_ms {
		fill: rgba(0,0,0,0);
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.path_ms {
		position: absolute;
		
		width: 3.398px;
		height: 8.33px;
		left: 0px;
		top: 5.088px;
	}
	#path_mt {
		fill: rgba(0,0,0,0);
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.path_mt {
		width: 2.415px;
		height: 11.987px;
		position: absolute;
		
		transform: translate(0px, 0px) matrix(1,0,0,1,17.5107,2.7595) rotate(180deg);
		transform-origin: center;
	}
	#path_mu {
		fill: rgba(0,0,0,0);
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.path_mu {
		width: 2.399px;
		height: 7.33px;
		position: absolute;
		
		transform: translate(0px, 0px) matrix(1,0,0,1,19.9254,5.088) rotate(180deg);
		transform-origin: center;
	}
	#path_mv {
		fill: rgba(0,0,0,0);
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.path_mv {
		
		position: absolute;
		width: 8.332px;
		height: 7.973px;
		left: 7.496px;
		top: 5.088px;
		transform: matrix(1,0,0,1,0,0);
	}
	#icon-settings_mw {
		position: absolute;
		width: 21.752px;
		height: 21.752px;
		left: 1758px;
		top: 34px;
		
	}
	#ellipse_mx {
		fill: rgba(0,0,0,0);
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.ellipse_mx {
		position: absolute;
		
		width: 9.09px;
		height: 9.089px;
		left: 6.832px;
		top: 6.831px;
	}
	#path_my {
		fill: rgba(0,0,0,0);
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.path_my {
		
		position: absolute;
		width: 22.752px;
		height: 22.752px;
		left: 0px;
		top: 0px;
		transform: matrix(1,0,0,1,0,0);
	}
	#icon-cart_mz {
		position: absolute;
		width: 24.749px;
		height: 25.748px;
		left: 1669px;
		top: 31px;
		
	}
	#ellipse_m {
		fill: rgba(0,0,0,0);
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.ellipse_m {
		position: absolute;
		
		width: 5.537px;
		height: 5.538px;
		left: 15.902px;
		top: 21.211px;
	}
	#path_m {
		fill: rgba(0,0,0,0);
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.path_m {
		
		position: absolute;
		width: 23.242px;
		height: 17.674px;
		left: 0px;
		top: 4.537px;
		transform: matrix(1,0,0,1,0,0);
	}
	#path_na {
		fill: rgba(0,0,0,0);
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.path_na {
		
		position: absolute;
		width: 4.83px;
		height: 3.616px;
		left: 4.814px;
		top: 18.748px;
		transform: matrix(1,0,0,1,0,0);
	}
	#path_nb {
		fill: rgba(0,0,0,0);
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.path_nb {
		
		position: absolute;
		width: 3.27px;
		height: 3.269px;
		left: 17.564px;
		top: 2.268px;
		transform: matrix(1,0,0,1,0,0);
	}
	#ellipse_na {
		fill: rgba(0,0,0,0);
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.ellipse_na {
		position: absolute;
		
		width: 5.537px;
		height: 5.538px;
		left: 6.703px;
		top: 21.211px;
	}
	#line_m {
		fill: transparent;
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.line_m {
		
		position: absolute;
		width: 3.947px;
		height: 7.726px;
		left: 3.529px;
		top: 7.398px;
		transform: matrix(1,0,0,1,0,0);
	}
	#line_na {
		fill: transparent;
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.line_na {
		
		position: absolute;
		width: 3.947px;
		height: 7.726px;
		left: 7.1px;
		top: 7.398px;
		transform: matrix(1,0,0,1,0,0);
	}
	#line_nb {
		fill: transparent;
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.line_nb {
		
		position: absolute;
		width: 3.947px;
		height: 7.726px;
		left: 10.672px;
		top: 7.398px;
		transform: matrix(1,0,0,1,0,0);
	}
	#line_nc {
		fill: transparent;
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.line_nc {
		
		position: absolute;
		width: 3.947px;
		height: 7.726px;
		left: 14.242px;
		top: 7.398px;
		transform: matrix(1,0,0,1,0,0);
	}
	#line_nd {
		fill: transparent;
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.line_nd {
		
		position: absolute;
		width: 6.861px;
		height: 14.81px;
		left: 16.5px;
		top: 4.537px;
		transform: matrix(1,0,0,1,0,0);
	}
	#line_ne {
		fill: transparent;
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.line_ne {
		
		position: absolute;
		width: 11.516px;
		height: 1px;
		left: 4.852px;
		top: 10.608px;
		transform: matrix(1,0,0,1,0,0);
	}
	#path_nc {
		fill: rgba(0,0,0,0);
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.path_nc {
		
		position: absolute;
		width: 5.926px;
		height: 3.268px;
		left: 19.834px;
		top: 0px;
		transform: matrix(1,0,0,1,0,0);
	}
	#icon-search_nc {
		position: absolute;
		width: 17.626px;
		height: 18.714px;
		left: 1584px;
		top: 35px;
		
	}
	#ellipse_nd {
		fill: rgba(0,0,0,0);
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.ellipse_nd {
		position: absolute;
		
		width: 17.029px;
		height: 17.029px;
		left: 0px;
		top: 0px;
	}
	#line_nf {
		fill: transparent;
		stroke: rgba(116,138,157,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.line_nf {
		
		position: absolute;
		width: 5.928px;
		height: 5.928px;
		left: 13.111px;
		top: 14.2px;
		transform: matrix(1,0,0,1,0,0);
	}
	#icon-quick-shop-close-small_nf {
		position: absolute;
		width: 29px;
		height: 29px;
		left: 140px;
		top: 31px;
		
	}
	#ellipse_ng {
		fill: rgba(123,237,141,1);
	}
	.ellipse_ng {
		position: absolute;
		
		width: 29px;
		height: 29px;
		left: 0px;
		top: 0px;
	}
	#line_nh {
		fill: transparent;
		stroke: rgba(255,255,255,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.line_nh {
		
		position: absolute;
		width: 1px;
		height: 12.197px;
		transform: translate(0px, 0px) matrix(1,0,0,1,14.4092,8.3107) rotate(45deg);
		transform-origin: center;
		left: 0px;
		top: 0px;
	}
	#line_ni {
		fill: transparent;
		stroke: rgba(255,255,255,1);
		stroke-width: 1px;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-miterlimit: 4;
		shape-rendering: auto;
	}
	.line_ni {
		
		position: absolute;
		width: 12.197px;
		height: 1px;
		transform: translate(0px, 0px) matrix(1,0,0,1,8.311,14.4091) rotate(45deg);
		transform-origin: center;
		left: 0px;
		top: 0px;
	}
	#logo-small_nj {
		position: absolute;
		width: 43.783px;
		height: 43.783px;
		left: 938px;
		top: 23px;
		
	}
	#path_nk {
		fill: rgba(123,237,141,1);
	}
	.path_nk {
		
		position: absolute;
		width: 43.783px;
		height: 43.783px;
		left: 0px;
		top: 0px;
		transform: matrix(1,0,0,1,0,0);
	}
	#path_nl {
		opacity: 0.5;
		fill: rgba(123,237,141,1);
	}
	.path_nl {
		
		position: absolute;
		width: 21.893px;
		height: 21.892px;
		left: 21.891px;
		top: 0px;
		transform: matrix(1,0,0,1,0,0);
	}
    input[type="checkbox"]:checked  ~ svg.switch-circle_me #switch-circle_me{
        fill:rgba(123,237,141,1);
        transform: translateX(20px);
    }
</style>