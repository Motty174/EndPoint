const socket= io()

socket.on('online',value => {
    document.getElementById('online').innerText='Online: ' + value
})
socket.on('offline',value =>{
    document.getElementById('online').innerText='Online: ' + value
})