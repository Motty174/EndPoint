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
    if(event.target.id && currentRoom!=event.target.id){
        currentRoom=event.target.id
        socket.emit( 'create_room', Date.now() )   

        // if(rooms.indexOf(currentRoom)==-1){
        // rooms.push(currentRoom)}
    }else {
        if(currentRoom!=event.target.parentNode.id){
        currentRoom=event.target.parentNode.id
        socket.emit( 'create_room', Date.now() )   
    }
    //     if(rooms.indexOf(currentRoom)==-1){
    //         rooms.push(currentRoom)}
    }

}
socket.emit( 'join' , 'piew' )

send_btn.oninput=(e) => {
    socket.emit('typing')
}

send_btn.onsubmit= (e) => {
    
    e.preventDefault()
    
    if(text.value.length>0){
        socket.emit('end_typing')
        socket.emit('message',{ value: text.value, from: my_id, to: currentRoom, my_image:my_image })
        text.value=""
        
    }

}

socket.on( 'broadcast' ,(data) => {
    const newLi = document.createElement( 'li' )
    
    const image=document.createElement('a')
    image.href=`/users/${data.from}`
    image.innerHTML=`<img src=${data.my_image} alt="User" class="rounded-circle"  width="50px" height="50px">`
    newLi.appendChild(image)
    
    const content=document.createElement('p')
    content.innerText = data.value.toString()
    newLi.appendChild(content)
    
    newLi.id = data.from
    newLi.classList.add( 'list-group-item','d-flex','text-break' )
    
    document.getElementById( 'message_list' ).append( newLi )   
   
    document.getElementById( 'chat_main_place' ).scrollTo( 0,document.getElementById('chat_main_place').scrollHeight)
})

socket.on('hi',()=>{
    console.log('Hi')
})


// socket.on( 'message_to' ,(data) => {
//     const newLi = document.createElement( 'li' )
    
//     const image=document.createElement('a')
//     image.href=`/users/${data.from}`
//     image.innerHTML=`<img src=${data.my_image} alt="User" class="rounded-circle"  width="50px" height="50px">`
//     newLi.appendChild(image)
    
//     const content=document.createElement('p')
//     content.innerText = data.value.toString()
//     newLi.appendChild(content)
    
//     newLi.id = data.from
//     newLi.classList.add( 'list-group-item','d-flex','text-break' )
    
//     document.getElementById( 'message_list' ).append( newLi )   
   
//     document.getElementById( 'chat_main_place' ).scrollTo( 0,document.getElementById('chat_main_place').scrollHeight)
// })

socket.on('typing_on',()=>{
    document.getElementById('type').innerText='Typing....'
    })
socket.on('typing_end',() => {
    document.getElementById('type').innerText=''
})