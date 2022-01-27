import { get_current_component } from "svelte/internal";
import { get } from "svelte/store"
import { accumulator } from "./formAccumulator"
export const validityCheck = ((componentName, validValue, validValid) => {
    let accum = get(accumulator)
    let thisAccum = accum.find((v) => v.component === componentName);
    thisAccum.value = validValue;
    thisAccum.ready = validValid;
    validValue ? accumulator.update((n) => (n = n)) : doNothing()
})
const doNothing = (() => { return })
export const validityRangeCheck = ((componentName, validValue,validValid) => {
    try {
        switch (componentName) {
            case "age":
                 get(accumulator)[9].ready = validValid;
                 get(accumulator)[9].value = validValue;
                get(accumulator)[10].ready = validValid;
                get(accumulator)[10].value = validValue;
                get(accumulator)[11].ready = validValid;
                get(accumulator)[11].value = validValue;
                accumulator.update((n) => (n = n))
                console.log("age changed");
                break;
            case "eighteen to twenty five":
                 get(accumulator)[8].ready = validValid;
                 get(accumulator)[8].value = validValue;
                get(accumulator)[10].ready = validValid;
                get(accumulator)[10].value = validValue;
                get(accumulator)[11].ready = validValid;
                get(accumulator)[11].value = validValue;
                accumulator.update((n) => (n = n))
                console.log("25 changed");
                break;
            case "twenty six to thirty five":
                 get(accumulator)[8].ready = validValid;
                 get(accumulator)[8].value = validValue;
                 get(accumulator)[9].ready = validValid;
                 get(accumulator)[9].value = validValue;
                get(accumulator)[11].ready = validValid;
                get(accumulator)[11].value = validValue;
                accumulator.update((n) => (n = n))
                console.log("35 changed");
                break;
            case "thirty six to forty five":
                 get(accumulator)[8].ready = validValid;
                 get(accumulator)[8].value = validValue;
                 get(accumulator)[9].ready = validValid;
                 get(accumulator)[9].value = validValue;
                get(accumulator)[10].ready = validValid;
                get(accumulator)[10].value = validValue;
                accumulator.update((n) => (n = n))
                console.log("45 changed");
                break;
        }
    } catch (error) {
        return false
    }
})
export const validityOr = ((componentName, validValue,validValid) => {
    const checkNot = /([a-z])+(-)+([a-z])+\w/g
    const married = /^married$/g
    const children = /^children$/g
    const addNot = (() => {
        try {
            let accum = get(accumulator)
            let not = "not-"
            let addComp = not.concat("",componentName)
            let trueComp = accum.find((v) => v.component === addComp)
            trueComp.ready = validValid
            trueComp.value = validValue
            accumulator.update((n) => (n = n))
            
        } catch (error) {
            return false
        }
    })
    const removeNot = (() => {
        try {
            let accum = get(accumulator)
            let splitComponent = componentName.split("-")
            let trueComp = accum.find((v) => v.component === splitComponent[1])
            trueComp.ready = validValid
            trueComp.value = validValue
            accumulator.update((n) => (n = n))
        } catch (error) {
            return false
        }
    })
    const matchPositive = (() => {
        componentName.match(checkNot) ? removeNot():addNot()
    })
    componentName.match(checkNot) || componentName.match(married) || componentName.match(children) ? matchPositive() : doNothing()


})