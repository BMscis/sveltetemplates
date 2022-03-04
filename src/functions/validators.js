import { accumulator } from "./formAccumulator"
import dayjs from 'dayjs';
import { get } from "svelte/store"
import { bodyMassIndex } from "./converter";
const checkNot = /(not)+(-)+([a-z])+\w/g
const thisYear = (new Date().getFullYear()) - 17;
const reg = /(\')/g
const checkDash = /(\-)/g

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
    if (value) {
      let setVal = null
      let accum = get(accumulator)
      let heightComp = accum.find(v => v.component === "atr-height")
      let hadValue = !!heightComp.value
      let hasValue = !!value
        if((hadValue || hasValue) && !(hadValue && hasValue)){
          value.match(reg) ? setVal = value : setVal = value + "\'"
        }
      return setVal != null && setVal != undefined ? setVal : value
    }else{
      return ""
    }
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
function checkRNot(component) {

  return component.match(checkDash)
}
function chekiSaa() {
  return function checkTime(value){
    let dateTime = dayjs(value,"mm/dd/yyyy")
    let birthYear = parseInt(dayjs(dateTime).format("YYYY"))
    return (thisYear > birthYear &&  birthYear > 1945) || "Must be 18 and above"
  }
}
function calculateBMI(){
  return function checkiBMI(value){
    if(value){
      if(value > 50){
        let accum = get(accumulator) 
        let heightComp = accum.find(v => v.component === "atr-height")
        let bmi = bodyMassIndex(heightComp.value, value);
        let thisAccum = accum.find((v) => v.component === "bmi");
        thisAccum.value = !parseFloat(bmi) ? 1 : parseFloat(bmi)
      }
    }
      return (value > 50) || "Weight must be greater than 50kg"
  }
}
export {
  emailValidator,
  requiredValidator,
  requiredRange,
  expandMore,
  timeConverter,
  nameValidator,
  heightValidator,
  checkRNot,
  chekiSaa,
  calculateBMI
}
