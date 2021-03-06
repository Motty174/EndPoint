const arr=document.querySelectorAll('input')

arr.forEach(elem => {

elem.addEventListener('input', (e) => {
    e.preventDefault()
    const search_value = {
        name: arr[0].value || arr[1].value
    }
   
    document.getElementById('found_users').innerHTML=""

    fetch(`${local_host}searchForUser/${search_value.name}`)
    .then(res => res.json() )
    .then(data => {

        if(screen.width>800){

                    document.getElementById('found_users').innerHTML=""
       
                    if(data.array.length>=5){
                      
                        const found_user=document.createElement('li')
                        found_user.innerHTML= "<a href='/users' > See all results </a>"
                        found_user.classList.add('list-group-item')
                        document.getElementById('found_users').append(found_user)
                 
                    }else{
                 
                    data.array.forEach((element) => {
                        const found_user=document.createElement('li')
                        found_user.innerText=element.name
                        found_user.setAttribute('id',element._id)
                        found_user.setAttribute('style','cursor: pointer;')
                        found_user.classList.add('list-group-item')
                        found_user.addEventListener('click',(event)=>{
                            location.replace(`/users/${element._id}`)
                        })
                        document.getElementById('found_users').append(found_user)
                    })}
                }else{

                    document.getElementById('found_users_mobile').innerHTML=''
       
                    if(data.array.length>=5){
                      
                        const found_user=document.createElement('li')
                        found_user.innerHTML= "<a href='/users' > See all results </a>"
                        found_user.classList.add('list-group-item')
                        document.getElementById('found_users_mobile').append(found_user)
                 
                    }else{
                 
                    data.array.forEach((element) => {
                        const found_user=document.createElement('li')
                        found_user.innerText=element.name
                        found_user.setAttribute('id',element._id)
                        found_user.setAttribute('style','cursor: pointer;')
                        found_user.classList.add('list-group-item')
                        found_user.addEventListener('click',(event)=>{
                            location.replace(`/users/${element._id}`)
                        })
                        document.getElementById('found_users_mobile').append(found_user)
                    })}
                }

        })
})
})