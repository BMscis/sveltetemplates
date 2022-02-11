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
    </div>
    <div id="Basic_Information">
        <span>{header}</span>
    </div>
    <slot name="slot1"></slot>
    <div id="onboarding-text">
        <span>{onboardingText}</span>
    </div>
    <slot name="slot2"></slot>
    <div id="page_link">
        <div id="nav-dot_n" class="nav_dot">
            <svg class="Ellipse_442">
                <ellipse id="Ellipse_442" rx="5" ry="5" cx="5" cy="5">
                </ellipse>
            </svg>
        </div>
        <div id="nav-dot_oa" class="nav_dot">
            <svg class="Ellipse_442">
                <ellipse id="Ellipse_442" rx="5" ry="5" cx="5" cy="5">
                </ellipse>
            </svg>
        </div>
        <div id="nav-dot_oc" class="nav_dot">
            <svg class="Ellipse_442">
                <ellipse id="Ellipse_442" rx="5" ry="5" cx="5" cy="5">
                </ellipse>
            </svg>
        </div>
        <div id="nav-dot_oe" class="nav_dot">
            <svg class="Ellipse_442">
                <ellipse id="Ellipse_442" rx="5" ry="5" cx="5" cy="5">
                </ellipse>
            </svg>
        </div>
        <div id="nav-dot_og" class="nav_dot">
            <svg class="Ellipse_442">
                <ellipse active id="Ellipse_442" rx="5" ry="5" cx="5" cy="5">
                </ellipse>
            </svg>
        </div>
    </div>
    <slot name="slot3"></slot>

</div>
<style></style>