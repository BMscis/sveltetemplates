<script>
    export let onboardingText='';
    export let header='';
</script>
<div id="form-header">
    <span>{header}</span>
</div>
<div id="onboarding-text">
    <h3>{onboardingText}</h3>
</div>
<div id="ingredient-slot">
    <slot name="ingredient-slot"></slot>
</div>
<div id="main-content">
    <div id="bg-shadow">
    </div>
    <slot name="slot1"></slot>
    <slot name="slot2"></slot>
    <slot name="slot3"></slot>

</div>
<style></style>