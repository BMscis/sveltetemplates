export const setDimensions = ((checkbox=false) => {

    if(checkbox == true){
        let width1
        let width2
        let height1
        let height2
        let rx1
        let rx2
        let translate1
        let translate2
        let translate3
        if(window.innerWidth > 800){
            width1 = 90
            width2 = 89
            height1 = 45
            height2 = 44
            rx1 = 22.5
            rx2 = 22
            translate1="translate(17.55 17.55)"
            translate2="translate(-1425.39 -4344.806)"
            translate3="translate(-337 -629)"
        }else{
            width1 = 45
            width2 = 44
            height1 = 22.5
            height2 = 21.5
            rx1 = 11.25
            rx2 = 10.75
            translate1="translate(6.3 6.3)"
            translate2="translate(-1436.252 -4356.056)"
            translate3="translate(-348.25 -640.25)"
        }
        return [width1,height1,rx1,width2,height2,rx2,translate1,translate2,translate3]
    }
    else{
        let width
        let height
        let rx
        let translate
        if(window.innerWidth > 800){
            width = 216
            height = 72
            rx = 30
            translate = "translate(83 42)"
        }
        else{
            width = 216/2
            height = 72/2
            rx = 30/2
            translate = "translate(29 23.673)"
        }
        return [width,height,rx,translate]
    }
})