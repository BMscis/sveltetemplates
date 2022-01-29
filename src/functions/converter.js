export const convertFeetToCM = ((combineFeet) =>{
    const feetToInches = 12
    const inchesToCm = 2.54
    let splitFeet = combineFeet.split("\'")
    let convertFtoI = parseInt(splitFeet[0]) * feetToInches
    let totalInches = convertFtoI + parseInt(splitFeet[1])
    let convertToCM = totalInches * inchesToCm

    return convertToCM/100
})