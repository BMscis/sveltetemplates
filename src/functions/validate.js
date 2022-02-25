import { accumulator } from "./formAccumulator"
import { get } from "svelte/store"
function buildValidator (validators,isValidation) {
    return function validate (value, dirty) {
      if (!validators || validators.length === 0) {
        return { dirty, valid: true }
      }
      
      const failing = validators.find(v => v(value) !== true)
      
      const checkFallingLength = ((val) => {
        let isVal = false
        let message = ""
        let accum = get(accumulator)
        try {
          //let timeComp = accum.find(v => v.component === "time")
          val.length > 0 ? isVal = true : message = "We need your height"
        } catch (error) {
          if(accum.find(v => v.component === "atr-height")){
            message = "We need your height"
          }
          isVal = false
        }
        return [isVal,message]
      })
      if(isValidation){
        return {
          dirty,
          valid: !failing ,
          message: failing && failing(value),
          state: !!failing,
          response: failing && failing(value),
          value:value
        }
      }else{
        return {
          dirty,
          valid: checkFallingLength(failing(value))[0] ,
          message: checkFallingLength(failing(value))[1],
          state: !!failing,
          response: failing && failing(value),
          value:failing && failing(value)
        }
      }
    }
  }
  
  export { buildValidator }