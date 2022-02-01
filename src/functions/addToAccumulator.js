import { accumulator } from "./formAccumulator";
import { get } from 'svelte/store'
export const addToAccumulator = ((componentName,isRequired,values) => {
    let accum = get(accumulator);
    let accumComponent = accum.find((v) => v.component === componentName);
    let accumCase = accumComponent === undefined ? true : false;
    if (isRequired == "true") {
        if (accumCase === true) {
          let val = values
          accumulator.update((n) =>n.concat([{ component: componentName, ready: false, value: val }]));
        }
      }
   else{
        if (accumCase === true) {
          let val = values
          accumulator.update((n) =>n.concat([{ component: componentName, ready: true, value: val }]));
        }
      }
})