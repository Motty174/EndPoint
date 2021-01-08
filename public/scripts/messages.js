const socket= io()
const send_btn=document.getElementById('send')
const text=document.getElementById('text')
const my_id=document.getElementById('myInfo').innerText
const my_image=document.getElementById('myImage').innerText
console.log(my_image)

const rooms=[]
let currentRoom;
document.querySelectorAll('li').forEach(li => {
    if(li.id){
        li.addEventListener('click',clicked)
    }
})
function clicked(event){
    if(event.target.id){
        currentRoom=event.target.id
        // if(rooms.indexOf(currentRoom)==-1){
        // rooms.push(currentRoom)}
    }else {
        currentRoom=event.target.parentNode.id
    //     if(rooms.indexOf(currentRoom)==-1){
    //         rooms.push(currentRoom)}
    }

}
socket.emit('join','piew')

send_btn.onsubmit=(e) =>{
    e.preventDefault()
    if(text.value.length>0){
        socket.emit('message',{value: text.value,from: my_id,my_image:my_image})
        text.value=""
        
    }
}

socket.on('broadcast',(data)=>{
    const newLi=document.createElement('li')
    newLi.innerHTML=`<a href="/users/${data.from}" ><img src=${data.my_image} alt="User" class="rounded-circle"  width="50px" height="50px"></a> `+"   " + data.value
    newLi.id=data.from
    newLi.classList.add('list-group-item')
    document.getElementById('message_list').append(newLi)   
    document.getElementById('chat_main_place').scrollTo(0,document.getElementById('chat_main_place').scrollHeight)
})