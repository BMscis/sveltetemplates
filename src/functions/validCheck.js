import { accumulator } from "./formAccumulator"
import { convertFeetToCM } from "./converter";
import {getAccumulator} from "./getAccumulator"
import { get } from "svelte/store"
export const validityCheck = ((componentName, validValue, validValid) => {
    let [thisAccum, isValid, hasVal] = getAccumulator(componentName);
    if (isValid ) {
        if (componentName == "married" || componentName == "not-married"
            || componentName == "children" || componentName == "not-children") {
            thisAccum.value = validValue ? "yes" : "no";
            thisAccum.ready = validValid
        }
        if(validValue) {
            thisAccum.value = validValue
            thisAccum.ready = validValid
        }
    }
    validValue ? accumulator.update((n) => (n = n)) : doNothing()
})
const doNothing = (() => { return })
const tryValLen = ((val) => {
    try {
        return val.length > 0
    } catch (error) {
        return false
    }
})
const tryValBool = ((val) => {
    try {
        return val
    } catch (error) {
        return false
    }
})
export const validityRangeCheck = ((componentName, validValue, validValid) => {
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
                //console.log("age changed");
                break;
            case "eighteen to twenty five":
                get(accumulator)[8].ready = validValid;
                get(accumulator)[8].value = validValue;
                get(accumulator)[10].ready = validValid;
                get(accumulator)[10].value = validValue;
                get(accumulator)[11].ready = validValid;
                get(accumulator)[11].value = validValue;
                accumulator.update((n) => (n = n))
                //console.log("25 changed");
                break;
            case "twenty six to thirty five":
                get(accumulator)[8].ready = validValid;
                get(accumulator)[8].value = validValue;
                get(accumulator)[9].ready = validValid;
                get(accumulator)[9].value = validValue;
                get(accumulator)[11].ready = validValid;
                get(accumulator)[11].value = validValue;
                accumulator.update((n) => (n = n))
                //console.log("35 changed");
                break;
            case "thirty six to forty five":
                get(accumulator)[8].ready = validValid;
                get(accumulator)[8].value = validValue;
                get(accumulator)[9].ready = validValid;
                get(accumulator)[9].value = validValue;
                get(accumulator)[10].ready = validValid;
                get(accumulator)[10].value = validValue;
                accumulator.update((n) => (n = n))
                //console.log("45 changed");
                break;
        }
    } catch (error) {
        return false
    }
})
export const validityOr = ((componentName, validValue, validValid) => {
    let validLen = tryValLen(validValue)
    let validBool = tryValBool(validValue)
    if ( validLen ||  validBool) {
        const checkNot = /([a-z])+(-)+([a-z])+\w/g
        const married = /^married$/g
        const children = /^children$/g
        const addNot = (() => {
            try {
                let accum = get(accumulator)
                let not = "not-"
                let addComp = not.concat("", componentName)
                let oldComp = accum.find((v) => v.component === componentName)
                let trueComp = accum.find((v) => v.component === addComp)
                trueComp.ready = validValid
                trueComp.value = oldComp.value == "yes" ? "no" : "yes"
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
                let oldComp = accum.find((v) => v.component === componentName)
                trueComp.ready = validValid
                trueComp.value = oldComp.value == "yes" ? "no" : "yes"
                accumulator.update((n) => (n = n))
            } catch (error) {
                return false
            }
        })
        const matchPositive = (() => {
            componentName.match(checkNot) ? removeNot() : addNot()
        })
        componentName.match(checkNot) || componentName.match(married) || componentName.match(children) ? matchPositive() : doNothing()
    }
    else {
        return
    }
})
export const bodyMassIndex = ((height, weight) => {
    let heightCM = convertFeetToCM(height)
    let bmi = (weight / Math.pow(heightCM, 2)).toFixed(2)
    let accum = get(accumulator)
    let thisAccum = accum.find((v) => v.component === "bmi");
    thisAccum.value = !parseFloat(bmi) ? 1 : parseFloat(bmi)
    accumulator.update((n) => (n = n))
    return bmi == "NaN" ? 1 : bmi
})
