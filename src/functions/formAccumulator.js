import { writable, get, derived } from 'svelte/store'

export const accumulator = writable([])
export const foodAlergies = writable([])
export const medicalAlergies = writable([])