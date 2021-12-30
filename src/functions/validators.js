function emailValidator() {
  return function email(value) {
    return (value && !!value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) || 'Please enter a valid email'
  }
}
function nameValidator(){
  return function name(value){
    return (value != undefined && value.length > 2) || "Enter a valid name."
  }
}
function requiredValidator() {
  return function required(value) {
    return (value !== undefined && value !== null && value !== '') || 'This field is required'
  }
}
function requiredRange(levelRange) {
  return function range(value) {
    return (value >= levelRange) || `The amount must be above ${levelRange}`
  }
}
function expandMore(expandCheck) {
  return function more(value) {
    //expandCheck == "false" ? (valCheck = "true") : (valCheck = "false")
    value == true || value == 'true' ? value = false : value = true
    return (value)
  }
}
function timeConverter() {
  return function convertToTime(value) {
    let setVal = 0.0
    value == undefined ? value = setVal : value = value
    let checkVal = value % 2 == 0
    checkVal ? (
      setVal = (value - (value / 2).toString() + " Years" + " 6 months")) : (setVal = (value - ((value - 1) / 2)).toString() + " Years")
      
    return setVal
  }
}
export {
  emailValidator,
  requiredValidator,
  requiredRange,
  expandMore,
  timeConverter,
  nameValidator
}
