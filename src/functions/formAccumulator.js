import { writable} from 'svelte/store'

export const accumulator = writable([])
export const navigateTo = writable({location:""})
export const navigatorCount = writable(0)
export const myFoodAlergies = writable([])
export const myMedicalAlergies = writable([])
export const famFoodAlergies = writable([])
export const famMedicalAlergies = writable([])