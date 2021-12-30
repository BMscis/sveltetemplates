export function getClientStyle(component){
    return [window.getComputedStyle(component).transformOrigin, window.pageYOffset,window.pageXOffset]
}