import {navigateTo,navigatorPage} from "./formAccumulator"
import { navigate } from "svelte-routing";
import { navigatorCount } from "./formAccumulator";
export const setNavigateTo = ((lok,dirty = false) => {
    //console.log("SET NAV")
    navigateTo.set({location:lok})
    navigateTo.update((n) => (n = n))
    switch (dirty) {
        case false:
            navigatorCount.update((n) => n + 1);
            return navigate("/loading", { replace: false}); 
            case true:
            navigatorCount.update((n) => n + 1);
            return
    }
})
export const setPageName = ((name, subHeading, avatar) => {
    navigatorPage.set({ page: name, subHeading:subHeading, avatar:avatar });
})