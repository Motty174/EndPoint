document.getElementById('main_post').addEventListener('submit',(event) => {
    event.preventDefault()
    let x=document.createElement('div')
    x.innerText=document.getElementById('textarea_post').value
    document.getElementById('main_post').append(x)
    document.getElementById('textarea_post').value=""    
})

//For messages
    // fetch('http://localhost:8080/users',{
    //     method: "POST",
    //     headers: {
    //         'Content-Type':'application/json'
    //     },
    //     body: JSON.stringify({name:"Onik"})
    // })
    // .then(res=> res.json())
    // .then(data => console.log(data))
