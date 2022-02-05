import { accumulator } from "./formAccumulator";
import { get } from "svelte/store";
export const getAccumulator = ((componentName) => {
    let accum = get(accumulator);
    let thisAccum = accum.find((v) => v.component === componentName);
    let val = false
    try {
        val = thisAccum.value
    } catch (error) {
        val = false
    }
    return [thisAccum,thisAccum !== undefined && thisAccum !== null,val]
} )