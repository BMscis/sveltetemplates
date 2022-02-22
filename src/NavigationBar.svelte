<script>
    import { navigate } from "svelte-routing";
    export let isFormReady;
</script>

<div id="navigation-bar">
    <svg id="navigation-bar-svg" xmlns="http://www.w3.org/2000/svg" height="80">
        <rect
            id="navigation-bar-rec"
            data-name="navigation-bar"
            width="100%"
            height="80"
            fill="#4e5d6a"
        />
    </svg>
    <button
        id="button-round-next"
        on:click={() => {
            navigate("/loading", { replace: false });
        }}
        disabled={!isFormReady}
    >
        <svg id="button-round-next-active" xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45">
          <g id="button-round-active">
            <circle id="button-round-active-2" data-name="button-round-active" cx="22.5" cy="22.5" r="22.5" fill="#7bed8d"/>
          </g>
          <g id="Group_1" data-name="Group 1" transform="translate(-17 -13)">
            <line id="arrow" x2="14" transform="translate(29 36)" fill="none" stroke="#fff" stroke-width="1"/>
            <g id="direciction" transform="translate(50 29) rotate(90)" fill="rgba(255,255,255,0)">
              <path d="M 13.19098472595215 13.5 L 0.8090149760246277 13.5 L 7 1.118029952049255 L 13.19098472595215 13.5 Z" stroke="none"/>
              <path d="M 7 2.236069679260254 L 1.618035316467285 13 L 12.38196468353271 13 L 7 2.236069679260254 M 7 0 L 14 14 L 0 14 L 7 0 Z" stroke="none" fill="#fff"/>
            </g>
          </g>
        </svg>
    </button>
</div>
