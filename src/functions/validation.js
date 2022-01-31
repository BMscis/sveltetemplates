import { writable, get } from 'svelte/store'
import { buildValidator } from './validate.js'
import { accumulator } from "./formAccumulator";
export function createFieldValidator(values = false,componentName, isRequired,isValidation, ...validators) {
  const { subscribe, set } = writable({ dirty: false, valid: false, message: null, response: null, state: false, value: null })
  const validator = buildValidator(validators,isValidation)
  let accum = get(accumulator);
  let accumComponent = accum.find((v) => v.component === componentName);
  let accumCase = accumComponent === undefined ? true : false;
  if (isRequired || isRequired === "true") {
    if (accumCase === true) {
      let val = values
      //console.log("Created: ", componentName)
      accumulator.update((n) =>n.concat([{ component: componentName, ready: false, value: val }]));
    }
  }
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