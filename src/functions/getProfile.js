import { accumulator } from "./formAccumulator"
import { get } from "svelte/store";
export const setProfile = (() =>{
    let accum_name = get(accumulator).find(
        (v) => v.component === "user-name"
    ).value;
    let accum_email = get(accumulator).find(
        (v) => v.component === "user-email"
    ).value;
    let accum_age = get(accumulator).find(
        (v) => v.component === "age"
    ).value;
    let accum_income = get(accumulator).find(
        (v) => v.component === "totalmonthlyincome"
    ).value;

    return [accum_name,accum_age,accum_email,accum_income]
})