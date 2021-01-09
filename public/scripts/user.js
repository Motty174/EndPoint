const follow = document.getElementById('follow')
const following_id = document.querySelector('h5').id
const x = document.getElementById('info').innerHTML
const spliting=x.split('|')

const user = {
    id: spliting[1],
    followers: spliting[3].split(','),
    following: spliting[5].split(',')
}

if( user.following.includes(following_id) ){
    
    follow.innerText="Unfollow"

    follow.classList.remove('btn-success')

    follow.classList.add('btn-danger')

}

if( user.id==following_id ){

    follow.remove()

}

follow.onclick = function(event){
    
    event.preventDefault()
    
    const body={
        id: document.querySelector('h5').id
    }
    
    if( !user.following.includes(document.querySelector('h5').id )){   
        fetch('https://endpointweb.herokuapp.com/follow',{
        
        method: "POST",
        
        headers:{
            "Content-Type":"application/json"
        },
        
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(data => {
        if( data.success ){

            user.following.push(following_id)
            
            follow.innerText='Unfollow'
            
            follow.classList.remove('btn-success')
            
            follow.classList.add('btn-danger')
        
        }
    })
    }else{
        fetch('https://endpointweb.herokuapp.com/unfollow',{
           
            method: "POST",
            
            headers:{
                "Content-Type":"application/json"
            },
            
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(data => {
            
            if( data.success ){
                
                user.following.splice(user.followers.indexOf(following_id),1)
                
                follow.innerText='Follow'
                
                follow.classList.remove('btn-danger')
                
                follow.classList.add('btn-success')
                
            }
        })       
    }
}
