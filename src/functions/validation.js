import { writable } from 'svelte/store'
import { addToAccumulator } from './addToAccumulator.js'
import { buildValidator } from './validate.js'
export function createFieldValidator(values = false,componentName, isRequired,isValidation, ...validators) {
  const { subscribe, set } = writable({ dirty: false, valid: false, message: null, response: null, state: false, value: null })
  const validator = buildValidator(validators,isValidation)
  addToAccumulator(componentName, isRequired,values)

  function action(node, binding) {
    function validate(value, dirty) {
      const result = validator(value, dirty)
      set(result)
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