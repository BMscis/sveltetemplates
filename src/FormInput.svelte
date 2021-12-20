<script>
    export let inputValue = "";
    export let inputType = "";
    export let inputId = "";
    export let inputName = "";
    export let inputPlaceholder = "";
    export let inputMax = "";
    export let inputMin = "";
    export let inputed = false;
    export let isPullupDialog = false;
    export let isInputOk = false;
    export let flag = false;
    export let range = false;
    export let checkboxtext = "";
    export let extracheckboxtext = "";
    export let extracheckbox = false;
    let extracheckboxfocus = false
    const checkFocus = (content) => {
        let isContent = false;
        let pullDialog = false;
        console.log("range", range);
        content == null || undefined ? (isContent = false) : (isContent = true);
        console.log("content", content);
        if (isContent == true) {
            content >= range ? (pullDialog = false) : (pullDialog = true);
            content >= range ? (isInputOk = true) : (isInputOk = false);
            console.log("range", range);
            console.log("content", content);
            console.log("isok", isInputOk);
        } else {
            isInputOk = false;
            pullDialog = false;
        }
        console.log("iscontent", isContent);
        pullDialog ? (isPullupDialog = true) : (isPullupDialog = false);
        console.log("pullDialog", pullDialog);
        isContent ? (inputed = false) : (inputed = true);
    };
</script>

{#if inputType == "text"}
    <input
        type="text"
        name={inputName}
        id={inputId}
        on:input
        bind:value={inputValue}
    />
{/if}
{#if inputType == "checkbox"}
    <div class="checkbox-container" class:has-checkboxes={extracheckbox}>
        <input
            type="checkbox"
            name={inputName}
            id={inputId}
            on:input={() => {
                console.log("checked")
                console.log(extracheckboxfocus)
                extracheckboxfocus = !extracheckboxfocus
                console.log(extracheckboxfocus)
                }}
            bind:value={inputValue}
        />
        <div class="checkbox-text">{checkboxtext}</div>
    </div>
    {#if extracheckbox}
        <div class="checkbox-container" id="morecheckbox"name="morecheckbox">
            <input
                type="checkbox"
                name={inputName}
                id={inputId}
                on:input
                bind:value={inputValue}
                visible={extracheckboxfocus}
            />
            <div class="checkbox-text">{extracheckboxtext}</div>
        </div>
    {/if}
{/if}
{#if inputType == "number"}
    <input
        type="number"
        name={inputName}
        id={inputId}
        bind:value={inputValue}
        placeholder={inputPlaceholder}
        class:activated={inputed}
        onscreenvalue={inputValue}
        on:input={checkFocus(inputValue)}
        pullupdialog={isPullupDialog}
        isinputok={isInputOk}
    />
{/if}
{#if inputType == "range"}
    <progress value={inputValue} min={inputMin} max={inputMax} />

    <input
        bind:value={inputValue}
        min={inputMin}
        max={inputMax}
        name={inputName}
        type="range"
    />
    <span>{inputValue}</span>
{/if}

<style>
</style>
