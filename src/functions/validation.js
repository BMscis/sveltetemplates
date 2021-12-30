import { writable } from 'svelte/store'
import { buildValidator } from './validate.js'
import { accumulator } from "./formAccumulator";
export function createFieldValidator(componentName, isRequired, ...validators) {
  const { subscribe, set } = writable({ dirty: false, valid: false, message: null, response: null, state: false })
  const validator = buildValidator(validators)
  if (isRequired || isRequired === "true") {
    accumulator.update((n) =>
      n.concat([{ component: componentName, ready: false }])
    );
  }
  function action(node, binding) {
    function validate(value, dirty) {
      const result = validator(value, dirty)
      set(result)
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