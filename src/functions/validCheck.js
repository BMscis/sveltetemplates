import { accumulator } from "./formAccumulator"
import { convertFeetToCM } from "./converter";
import {getAccumulator} from "./getAccumulator"
import { get } from "svelte/store"

const checkNot = /(not)+(-)+([a-z])+\w/g
const married = /^married$/g
const employed = /^employed$/g
const children = /^children$/g
const ageRanges = ["age","eighteen to twenty five","twenty six to thirty five","thirty six to forty five"]
const dualComponentList = [checkNot,children, married, employed]

export const validityCheck = ((componentName, validValue, validValid) => {
    let [thisAccum, isValid, hasVal] = getAccumulator(componentName);
    if (isValid ) {
        if (dualComponentList.find(v => componentName.match(v) != null)) {
            thisAccum.value = validValue ? "yes" : "no";
            thisAccum.ready = validValid
        }
        else {
            if (validValue){
                    if (ageRanges.find(v => componentName.match(v) != null)) {
                        let ageVal = ageRanges.find(v => componentName.match(v) != null)
                        switch (ageVal) {
                            case "age":
                                thisAccum.value = validValue
                                thisAccum.ready = validValid
                                break
                            case "eighteen to twenty five":
                                thisAccum.value = "18 - 25"
                                thisAccum.ready = validValid
                                break
                            case "twenty six to thirty five":
                                thisAccum.value = "26 - 35"
                                thisAccum.ready = validValid
                                break
                            case "thirty six to forty five":
                                thisAccum.value = "36 - 45"
                                thisAccum.ready = validValid
                                break
                        }
                    }else{
                        thisAccum.value = validValue
                        thisAccum.ready = validValid
                    }
            }
        }
        validValue ? accumulator.update((n) => (n = n)) : doNothing()
    }
    return
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
    let accum = get(accumulator)
    let [thisAccum, isValid, hasVal] = getAccumulator(componentName);
    let ageVisible = ageRanges.map((rang) => accum.find((y) => y.component === rang) !=undefined);
    const rdc = ((x, y) => { return x && y})
    //console.log("RDC: ",ageVisible.reduce(rdc) )
    if (ageRanges.find(v => componentName.match(v) != null)){
        if(ageVisible.reduce(rdc)){
            let ageList = ageRanges.map((rang) => accum.find((y) => y.component === rang));
            ageList.map((val) => {val.ready = validValid; val.value = thisAccum.value})
            accumulator.update((n) => (n = n))
        }
    }
    return
})
export const validityOr = ((componentName, validValue, validValid) => {
    let validLen = tryValLen(validValue)
    let validBool = tryValBool(validValue)
    if ( validLen ||  validBool) {
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
        dualComponentList.find(v => componentName.match(v) != null) ? matchPositive() : doNothing()
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
export const accumulatorCheck = ((name, value, valid) => {
    validityCheck(name, value, valid)
    validityRangeCheck(name, value, valid)
    validityOr(name, value, valid)
    return
})