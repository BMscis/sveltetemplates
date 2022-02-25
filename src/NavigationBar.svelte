<script>
    import { navigate } from "svelte-routing";
    export let isFormReady;
</script>

<nav id="navigation-bar">
  <button
  id = "navigation-button-menu"
  >
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <rect width="24" height="24" fill="none" />
    <path d="M18,12H0V10H18v2Zm0-5H0V5H18V7Zm0-5H0V0H18V2Z" transform="translate(3 6)" />
</svg>
</button>
    <button
        id ="navigation-button-next-right"
        on:click={() => {
            navigate("/loading", { replace: false });
        }}
        disabled={!isFormReady}>
        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="54" viewBox="0 0 45 54">
            <rect width="45" height="45" fill="none" />
            <path id="next-right" d="M-5,0,5,10-5,20Z" transform="translate(22.5 12.5)" fill="#121212"/>
            <text transform="translate(7 50)" fill="#121212" >
                <tspan x="0" y="0">next</tspan>
            </text>
        </svg>
    </button>
</nav>
