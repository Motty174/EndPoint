
const myId=document.getElementById('current_user_id').innerText

//Function for creating posts
function createPostFunction(value,fromSocket){
    //Main body
    let post = document.createElement('div')
    post.classList.add('text-black','d-flex','border','border-outline-primary','p-3')
                //Go to profile a tag
            let location_replace=document.createElement('a')
                location_replace.href=`/users/${value.user_id}`
                //Image 
            
                let image = document.createElement('img')
                    image.src = value.user_image
                    image.classList.add('p-2','border','border-outline-dark')
                    image.setAttribute('style','width:50px;height:50px;border-radius: 50%;cursor: pointer;')
                   
                location_replace.appendChild(image)
                post.appendChild(location_replace)
        //Posting info
        let post_info=document.createElement('div')
        post_info.classList.add('d-flex','flex-column','p-0','m-0','w-100')
    
        //name and date
                let name_and_date=document.createElement('div')
                name_and_date.classList.add('d-flex','flex-column','p-2','m-0')
                
                //name
                    let name=document.createElement('p')
                    name.classList.add('m-0','p-0')
                    name.innerHTML='<b>'+value.user_name+'</b>'
                    name_and_date.appendChild(name)
                

                    //date
                    let post_date=document.createElement('span')
                    value.date=new Date(value.date)
                    post_date.innerText=`${value.date.getHours()}:${value.date.getMinutes()}  ${value.date.getDate()}.${value.date.getMonth()}.${value.date.getFullYear()}`
                    name_and_date.appendChild(post_date)
            
                post_info.appendChild(name_and_date)

                //text
                let context = document.createElement('p')
                context.setAttribute('style','word-break: break-all; word-wrap: break-word;')
                context.classList.add('m-4')
                context.innerText = value.text
                post_info.appendChild(context)

        post.appendChild(post_info)
        
        //like count and icon
        let likeCount=document.createElement('div')
            //icon
            let icon=document.createElement('span')
            icon.innerHTML=`<i class="fas fa-fire fa-2x" style="color:green;"></i> `
            likeCount.appendChild(icon)
            
            //like count
            let likeCounts=document.createElement('p')
            likeCounts.innerText=value.likes.length
            likeCounts.classList.add('text-center')
            likeCount.appendChild(likeCounts)
        post.appendChild(likeCount)

        //Some buttons to comment like or share
        let controllers=document.createElement('div')
        controllers.id=value._id
        controllers.classList.add('d-flex','justify-content-between')

        //like button
                let like=document.createElement('button')
                like.innerText='Like'
                like.classList.add('btn','btn-outline-success')
                if(value.likes.includes(myId)){
                    like.innerText='Forget'
                    like.classList.remove('btn-outline-success')
                    like.classList.add('btn-outline-dark')
                    
                    like.addEventListener('click',deleteLikeFunction)
                }else{
                    like.addEventListener('click',likeFunction)
                }
                
                controllers.appendChild(like)

        //comment button
                let comment=document.createElement('button')
                comment.innerText='Comment'
                comment.classList.add('btn','btn-outline-primary')
                comment.addEventListener('click',function(){
                        let doc=this
                            commentFunction(value,commentField,doc)})
                controllers.appendChild(comment)

                //Comment field 
                let commentField=document.createElement('div')
                    commentField.classList.add("overlayForComments")
                    commentField.hidden=true
                    
                    
                    //X mark for closing 
                    let xMark=document.createElement('div')
                    xMark.innerHTML='<i class="fas fa-times fa-2x "></i>'
                    xMark.classList.add('p-0','m-0','float-right')
                    xMark.setAttribute('style','cursor: pointer;')
                    xMark.onclick=function(){
                        commentField.hidden=true
                    }
                    commentField.appendChild(xMark)       

                    //Comments all
                    let commentsBlock=document.createElement('div')
                    commentsBlock.classList.add('p-0','m-0','text-center')
                    commentsBlock.setAttribute('style','overflow:auto;width:100%;height:80vh;background-color:blue;')
                    commentsBlock.innerText=`padding: 0;
                    border: none;
                    background: none;padding: 0;
                    border: none;
                    background: none;padding: 0;
                    border: none;
                    background: none;padding: 0;
                    border: none;
                    background: none;padding: 0;
                    border: none;
                    background: none;padding: 0;
                    border: none;
                    background: none;padding: 0;
                    border: none;
                    background: none;padding: 0;
border: none;
background: none;padding: 0;
border: none;
background: none;padding: 0;
border: none;
background: none;padding: 0;
border: none;
background: none;padding: 0;
border: none;
background: none;padding: 0;
border: none;
background: none;padding: 0;
border: none;
background: none;padding: 0;
border: none;
background: none;padding: 0;
border: none;
background: none;padding: 0;
border: none;
background: none;`
                    commentField.appendChild(commentsBlock)

                    //Write comment
                    let commentWrite=document.createElement('div')
                    commentWrite.classList.add('p-0','m-0','position-relative')
                        //Form for comment
                        let form=document.createElement('form')
                        form.classList.add('position-relative','p-0','m-0')
                            //Input
                            let inputDiv=document.createElement('div')    
                                inputDiv.classList.add('position-relative')
                                    let inputField=document.createElement('input')
                                    inputField.type="text"
                                    inputField.classList.add('w-100','form-control')
                                    inputField.placeholder="Write a comment..."
                                    inputDiv.appendChild(inputField)

                                let button_send=document.createElement('button')
                                button_send.type="submit"
                                button_send.classList.add('position-absolute')
                                button_send.innerHTML=`<i class="fas fa-chevron-right fa-2x"></i>`
                                button_send.setAttribute('style','top:2px;right:5px;padding: 0;border: none;background: none;')
                                
                                inputDiv.appendChild(button_send)
    
                                form.appendChild(inputDiv)
                            //Button for sending
                            
                        commentWrite.appendChild(form)

                    commentField.appendChild(commentWrite)


                controllers.appendChild(commentField)
        //share button
                let share=document.createElement('button')
                share.innerText='Share'
                share.classList.add('btn','btn-outline-warning')
                controllers.appendChild(share)

        post_info.appendChild(controllers)
      
     if(fromSocket){
      return document.getElementById('post_handler').prepend(post)   
     }
    document.getElementById('post_handler').append(post)

}

fetch( `${local_host}allposts/${document.getElementById('current_user_id').innerText}`)
.then(res => res.json())
.then(result => {

    result.forEach(value => {
            
        createPostFunction(value)
    
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
    const fromSocket=true
    createPostFunction(value,fromSocket)

})

function likeFunction(){
        socket.emit('like',myId,this.parentNode.id)
        //Adding one like
        let currentLikesCount=this.parentNode.parentNode.nextSibling.children[1].innerHTML
        
        this.parentNode.parentNode.nextSibling.children[1].innerHTML=+currentLikesCount+1
        
        let button = this.parentNode.children[0]
        button.innerText="Forget"
        button.classList.remove('btn-outline-success')
        button.classList.add('btn-outline-dark')
        button.removeEventListener('click',likeFunction)
        button.addEventListener('click',deleteLikeFunction)
    }

function deleteLikeFunction(){
    socket.emit('deleteLike',myId,this.parentNode.id)
        //Adding one like
        let currentLikesCount=this.parentNode.parentNode.nextSibling.children[1].innerHTML
        
        this.parentNode.parentNode.nextSibling.children[1].innerHTML=+currentLikesCount-1
        
        let button = this.parentNode.children[0]
        button.innerText="Like"
        button.classList.remove('btn-outline-dark')
        button.classList.add('btn-outline-success')
        button.removeEventListener('click',deleteLikeFunction)
        button.addEventListener('click',likeFunction)
}

function commentFunction(value,commentField,doc){
    
    doc.nextSibling.hidden=false
    
}