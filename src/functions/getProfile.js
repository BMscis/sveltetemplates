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
        (v) => v.component === "dob"
    ).value;
    let accum_bmi = get(accumulator).find(
        (v) => v.component === "bmi"
    ).value;
    let accum_married = get(accumulator).find(
        (v) => v.component === "married"
    ).value;
    let accum_employ = get(accumulator).find(
        (v) => v.component === "employed"
    ).value;

    return [accum_name,accum_age,accum_email,accum_bmi,accum_married,accum_employ]
})