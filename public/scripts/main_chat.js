  var socket = io();
document.getElementById('send').onclick=(event)=>{
    socket.emit('message',document.getElementById('message').value)
}