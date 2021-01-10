const socket= io()

socket.on('online_count', value => {
    document.getElementById('online').innerText='Online: ' + value
})

document.getElementById('main_post').onsubmit= (event) => {
    event.preventDefault()
   
    socket.emit('post',document.getElementById('textarea_post').value)
    document.getElementById('textarea_post').value=""  
}

socket.on('post_get',value => {
    console.log(value)
    let post=document.createElement('p')
    post.classList.add('text-black')
    post.innerText=value
    document.getElementById('post_handler').append(post)
})