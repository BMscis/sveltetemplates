import { getAccumulator } from "./getAccumulator";
export const mountComponent = ((inputName) => {
    let [thisAccum, isValid, hasVal] = getAccumulator(inputName)
    if (isValid) {
        if (hasVal) return thisAccum.value;
    }
    else{
        return false
    }
})
export const typeOfInput = ((inputValue, accumValue) => {
    if(typeof(inputValue) == typeof(accumValue)){
        return accumValue
    }
    return false
})