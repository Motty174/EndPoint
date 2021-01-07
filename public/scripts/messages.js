const myInfo=document.getElementById('myInfo').innerText
console.log(myInfo)
const send_btn=document.getElementById('send')
const text=document.getElementById('text')

document.querySelectorAll('li').forEach(li => {
    if(li.id){
        li.addEventListener('click',clicked)
    }
})
function clicked(event){
    console.log(event.target.innerText)
document.getElementById('toWhom').innerHTML=`<img src="${event.target.children[0].src}" alt="User" class="rounded-circle border border-success" width="80px" height="80px">`
}
send_btn.onsubmit=(e) =>{
    e.preventDefault()
    if(text.value.length>0){
        const newLi=document.createElement('li')
        newLi.innerText=text.value
        newLi.classList.add('list-group-item')
        text.value=""
        document.getElementById('message_list').append(newLi)
    }
}