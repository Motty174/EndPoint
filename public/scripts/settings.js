let clickNum=0
document.getElementById('change').onclick=(e) => {
    if(clickNum==1){
        clickNum=0
        return document.getElementById('image_change').hidden=true
    }
    clickNum=1
    document.getElementById('image_change').hidden=false
}