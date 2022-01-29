import { accumulator } from "./formAccumulator"
import { get } from "svelte/store"
function emailValidator() {
  return function email(value) {
    return (value && !!value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+(com)))$/)) || 'Please enter a valid email'
  }
}
function nameValidator() {
  return function name(value) {
    return (value && !!value.match(/[^0-9]+[^<>()[\]\\.,;:\s@"]/) || "Enter a valid name.")
  }
}
function heightValidator() {
  return function name(value) {
    if (value != null) {
      const reg = /(\')/g
      let setVal = null
      let accum = get(accumulator)
      let heightComp = accum.find(v => v.component === "atr-height")
      if (heightComp.value != null && heightComp.value != undefined) {
        if (heightComp.value.length > 0) {
          heightComp.value.match(reg) ? setVal = value : setVal
        }
        else {
          value.match(reg) ? setVal = value : setVal = value + "\'"

        }
      }
      else {
        if (value != null && value != undefined) {
          value.match(reg) ? setVal = value : setVal = value + "\'"
        }

      }
      setVal != null && setVal != undefined ? value = setVal : value
      return setVal != null && setVal != undefined ? value = setVal : value
    }
    return
  }
}
function requiredValidator() {
  return function required(value) {
    return (value !== undefined && value !== null && value !== '') || 'This field is required'
  }
}
function requiredRange(levelRange) {
  return function range(value) {
    return (value > parseInt(levelRange)) || `The amount must be above ${levelRange}`
  }
}
function expandMore() {
  return function more(value) {
    return (value == true) || "You need to check this box."
  }
}
function timeConverter(inputMin) {
  return function convertToTime(value) {
    let setVal = "one year"
    if (value > inputMin) {
      value == undefined ? value = setVal : value = value
      let checkVal = value % 2 == 0
      checkVal ? (
        setVal = (value - (value / 2).toString() + " Years" + " 6 months")) : (setVal = (value - ((value - 1) / 2)).toString() + " Years")
    }
    return setVal = ! null ? setVal : "Must be above 1 month"
  }
}
export {
  emailValidator,
  requiredValidator,
  requiredRange,
  expandMore,
  timeConverter,
  nameValidator,
  heightValidator
}
