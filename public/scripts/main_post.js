const socket = io()

document.getElementById('main_post').addEventListener('submit',(event) => {
    event.preventDefault()
    let x=document.createElement('div')
    x.innerText=document.getElementById('textarea_post').value
    document.getElementById('main_post').append(x)
    document.getElementById('textarea_post').value=""    
})
