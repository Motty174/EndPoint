fetch( `${local_host}allposts/${document.getElementById('current_user_id').innerText}`)
.then(res => res.json())
.then(result => {

    result.forEach(value => {

        let post = document.createElement('div')
        post.classList.add('text-black','d-flex','border','border-outline-primary','p-3')
            //Image 
                    let location_replace=document.createElement('a')
                    location_replace.href=`/users/${value.user_id}`
                        let image = document.createElement('img')
                        image.src = value.user_image
                        image.classList.add('p-2','border','border-outline-dark')
                        image.setAttribute('style','width:50px;height:50px;border-radius: 50%;cursor: pointer;')
                       
                    location_replace.appendChild(image)
                    post.appendChild(location_replace)
            //Posting info
            let post_info=document.createElement('div')
            post_info.classList.add('d-flex','flex-column','p-0','m-0','w-100')
        
                    let name_and_date=document.createElement('div')
                    name_and_date.classList.add('d-flex','flex-column','p-2','m-0')
                    
                        let name=document.createElement('p')
                        name.classList.add('m-0','p-0')
                        name.innerHTML='<b>'+value.user_name+'</b>'
                        name_and_date.appendChild(name)
                    
                        let post_date=document.createElement('span')
                        value.date=new Date(value.date)
                        post_date.innerText=`${value.date.getHours()}:${value.date.getMinutes()}  ${value.date.getDate()}.${value.date.getMonth()}.${value.date.getFullYear()}`
                        name_and_date.appendChild(post_date)
                
                    post_info.appendChild(name_and_date)
    
                    let context = document.createElement('p')
                    context.setAttribute('style','word-break: break-all; word-wrap: break-word;')
                    context.classList.add('m-4')
                    context.innerText = value.text
                    post_info.appendChild(context)
    
            post.appendChild(post_info)
    
            //Some buttons to comment like or share
            let controllers=document.createElement('div')
            controllers.classList.add('d-flex','justify-content-between')
    
                    let like=document.createElement('button')
                    like.innerText='Like'
                    like.classList.add('btn','btn-outline-success')
                    controllers.appendChild(like)
    
                    let comment=document.createElement('button')
                    comment.innerText='Comment'
                    comment.classList.add('btn','btn-outline-primary')
                    controllers.appendChild(comment)
    
                    let share=document.createElement('button')
                    share.innerText='Share'
                    share.classList.add('btn','btn-outline-warning')
                    controllers.appendChild(share)
    
            post_info.appendChild(controllers)
    
    
        document.getElementById('post_handler').append(post)
    })

})

const socket= io()
//Online users



socket.on('online_count', value => {
    document.getElementById('online').innerText='Online: ' + value
})


//Post event
document.getElementById('main_post').onsubmit= (event) => {
    
    event.preventDefault()
    
    const data={
        post_text: document.getElementById('textarea_post').value,
        user_name: document.getElementById('user_name').innerText,
        user_image: document.getElementById('user_image').src,
        user_id: document.getElementById('current_user_id').innerText,
        date: new Date(),
      }

    socket.emit('post',data)
    document.getElementById('textarea_post').value=""  
}

socket.on('post_get',value => {

    console.log(value.date,typeof value.date)
    let post = document.createElement('div')
    post.classList.add('text-black','d-flex','border','border-outline-primary','p-3')
        //Image 
                let location_replace=document.createElement('a')
                location_replace.href=`/users/${value.user_id}`
                    let image = document.createElement('img')
                    image.src = value.user_image
                    image.classList.add('p-2','border','border-outline-dark')
                    image.setAttribute('style','width:50px;height:50px;border-radius: 50%;cursor: pointer;')
                   
                location_replace.appendChild(image)
                post.appendChild(location_replace)
        //Posting info
        let post_info=document.createElement('div')
        post_info.classList.add('d-flex','flex-column','p-0','m-0','w-100')
    
                let name_and_date=document.createElement('div')
                name_and_date.classList.add('d-flex','flex-column','p-2','m-0')
                
                    let name=document.createElement('p')
                    name.classList.add('m-0','p-0')
                    name.innerHTML='<b>'+value.user_name+'</b>'
                    name_and_date.appendChild(name)
                
                    let post_date=document.createElement('span')
                    value.date=new Date(value.date)
                    post_date.innerText=`${value.date.getHours()}:${value.date.getMinutes()}  ${value.date.getDate()}.${value.date.getMonth()}.${value.date.getFullYear()}`
                    name_and_date.appendChild(post_date)
            
                post_info.appendChild(name_and_date)

                let context = document.createElement('p')
                context.setAttribute('style','word-break: break-all; word-wrap: break-word;')
                context.classList.add('m-4')
                context.innerText = value.post_text
                post_info.appendChild(context)

        post.appendChild(post_info)

        //Some buttons to comment like or share
        let controllers=document.createElement('div')
        controllers.classList.add('d-flex','justify-content-between')

                let like=document.createElement('button')
                like.innerText='Like'
                like.classList.add('btn','btn-outline-success')
                controllers.appendChild(like)

                let comment=document.createElement('button')
                comment.innerText='Comment'
                comment.classList.add('btn','btn-outline-primary')
                controllers.appendChild(comment)

                let share=document.createElement('button')
                share.innerText='Share'
                share.classList.add('btn','btn-outline-warning')
                controllers.appendChild(share)

        post_info.appendChild(controllers)


    document.getElementById('post_handler').append(post)
})