<script>
    export let onboardingText;
    export let header;
</script>
<div id="main-content">
    <div id="bg-shadow">
        <svg class="ellipse">
            <ellipse id="ellipse" rx="149.5" ry="48.5" cx="149.5" cy="48.5">
            </ellipse>
        </svg>
        <svg class="rectangle">
            <rect id="rectangle" rx="0" ry="0" x="0" y="0" width="375" height="692">
            </rect>
        </svg>
        <div id="Basic_Information">
            <span>{header}</span>
        </div>
        <slot name="slot1"></slot>
        <div id="onboarding-text">
            <h3>{onboardingText}</h3>
        </div>
        <slot name="slot2"></slot>
        <slot name="slot3"></slot>
    </div>

</div>
<style></style>