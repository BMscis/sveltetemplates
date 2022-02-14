import { writable,get } from 'svelte/store'
import { addToAccumulator } from './addToAccumulator.js'
import { accumulator } from './formAccumulator.js'
import { buildValidator } from './validate.js'
export function createFieldValidator(values = false,componentName, isRequired,isValidation, ...validators) {
  const { subscribe, set } = writable({ dirty: false, valid: false, message: null, response: null, state: false, value: null })
  const validator = buildValidator(validators,isValidation)
  isRequired == "false" || isRequired == false ? isRequired = false : isRequired = true
  addToAccumulator(componentName, isRequired,values)

  function action(node, binding) {
    function validate(value, dirty) {
      const result = validator(value, dirty)
      set(result)
      if(dirty){
        let accum = get(accumulator);
        let thisAccum = accum.find((v) => v.component === componentName);
        thisAccum.ready = result.valid
        thisAccum.value = result.value
        accumulator.update((n) => (n = n))
      }
      return
    }

    validate(binding, false)

    return {
      update(value) {
        validate(value, true)
      }
    }
  }

  return [{ subscribe }, action]
}