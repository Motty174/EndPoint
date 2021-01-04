const follow=document.getElementById('follow')
//Check if I follow him?
fetch('http://localhost:8080/followerslist')
.then(res => res.json())
.then(data => {
    console.log(data)
    if(!data.following.includes(document.querySelector('h5').id)){
console.log(true)
        follow.onclick=function(event){
            event.preventDefault()
            const body={
                id: document.querySelector('h5').id
            }
            fetch('http://localhost:8080/follow',{
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(body)
            })
            .then(res => res.json())
            .then(data => {
                if(data.success){
                    follow.innerText='Unfollow'
                    follow.classList.remove('bg-success')
                    follow.classList.add('bg-danger')
                }
            })
        }

    }else{
        follow.innerText='Unfollow'
        follow.classList.add('bg-danger')
        follow.onclick=function(event){
            event.preventDefault()
        const body={
            id: document.querySelector('h5').id
        }
        fetch('http://localhost:8080/unfollow',{
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(data => {
            if(data.success){
                follow.innerText='Follow'
                follow.classList.remove('bg-danger')
                follow.classList.add('bg-success')        
            }
        })
        }
    }
})

