const socket_post = io()

document.getElementById('main_post').onsubmit= (event) => {
    event.preventDefault()
   
    socket_post.emit('post',document.getElementById('textarea_post').value)
    document.getElementById('textarea_post').value=""  
}

socket_post.on('post_get',value => {
    console.log(value)
    let post=document.createElement('p')
    post.classList.add('text-black')
    post.innerText=value
    document.getElementById('post_handler').append(post)
})