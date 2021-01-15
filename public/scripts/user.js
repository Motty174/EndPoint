let following=false
const follow = document.getElementById('follow')
const following_id = document.querySelector('h5').id //User id

const user_id = document.getElementById('info').innerHTML //myId

function userCheck(){

if(user_id==following_id){
    follow.remove()
    return false
}

fetch(`${local_host}checkForFollow/${user_id}/${following_id}`)
.then(res => res.json())
.then(result => {
    
    if(result.following==true){

        following=true
        follow.innerText='Unfollow'
            
        follow.classList.remove('btn-success')
        
        follow.classList.add('btn-danger')
    }else{
            following=false
        follow.innerText='Follow'
            
        follow.classList.remove('btn-danger')
        
        follow.classList.add('btn-success')

    }
  })


follow.onclick = function(event){
    
    event.preventDefault()
    
    if(following==false){
            
            fetch(`${local_host}follow/${user_id}/${following_id}`)
            .then(res => res.json() )
            .then(result => {

                following=true
                console.log(result)
                
                follow.innerText='Unfollow'
            
                follow.classList.remove('btn-success')
                
                follow.classList.add('btn-danger')

            })
        }else{
            fetch(`${local_host}unfollow/${user_id}/${following_id}`)
            .then( res => res.json() )
            .then( result => {
                
                following=false
             
                follow.innerText='Follow'
            
                follow.classList.remove('btn-danger')
                
                follow.classList.add('btn-success')
            })
        }

    }
}
userCheck()