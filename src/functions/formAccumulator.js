import { writable} from 'svelte/store'

export const accumulator = writable([])
export const ingredientSize = writable(0)
export const instructionSize = writable(0)
export const instructionParameter = writable({width:0,height:0,isLarge:false})
export const windowSize = (() =>{
    const {subscribe,set} = instructionParameter
    function action(node, binding) {
        function validate(value, dirty) {
            set({width:value[0],height:value[1],isLarge:value[0] > 732})
          return
        }
    
        validate([window.innerWidth,window.outerHeight],false)
    
        return {
          update(value) {
            validate(value,true)
          }
        }
      }
    return [{subscribe},action]
})
export const navigateTo = writable({location:""})
export const navigatorCount = writable(0)
export const navigatorPage = writable({page:["","Welcome"],subHeading:"Nourish with Nanju.",avatar:""})
export const myFoodAlergies = writable([])
export const myMedicalAlergies = writable([])
export const famFoodAlergies = writable([])
export const famMedicalAlergies = writable([])
export const ingredientBook = writable([])