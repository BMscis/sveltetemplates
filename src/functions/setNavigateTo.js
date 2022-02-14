import {navigateTo} from "./formAccumulator"
import { navigate } from "svelte-routing";
export const setNavigateTo = ((lok,dirty = false) => {
    //console.log("SET NAV")
    navigateTo.set({location:lok})
    navigateTo.update((n) => (n = n))
    switch (dirty) {
        case false:
            return navigate("/loading", { replace: false}); 
        case true:
            return
    }
    
})