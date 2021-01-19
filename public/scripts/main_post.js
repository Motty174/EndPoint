
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
                            commentFunction(value,commentField,doc)
                        })
                controllers.appendChild(comment)

                //Comment field 
                let commentField=document.createElement('div')
                    commentField.classList.add("overlayForComments")
                    commentField.hidden=true
                    // commentField.onclick=(e)=>{
                    //     console.log(e.target)
                    // }
                    
                    //X mark for closing 
                    let xMark=document.createElement('span')
                    xMark.innerHTML='Close'
                    xMark.classList.add('p-0','m-1','text-center','border','border-outline-light')
                    xMark.setAttribute('style','cursor: pointer;color: white;')
                    xMark.onclick=function(){
                        commentField.hidden=true
                    }
                    commentField.appendChild(xMark)       

                    //Comments all
                    let commentsBlock=document.createElement('div')
                    commentsBlock.classList.add('p-0','m-0','text-center')
                    commentsBlock.setAttribute('style','overflow:auto;width:100%;height:80vh;')
                    commentsBlock.innerText=`Text`
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
    
                                form.addEventListener('submit',(e) => {
                                    e.preventDefault()
                                    if(inputField.value.trim().length==0){
                                        return false
                                    }
                                    socket.emit('comment_written',controllers.id,myId,inputField.value)
                                    inputField.value=""
                                })

                                form.appendChild(inputDiv)
                            //Button for sending
                            
                        commentWrite.appendChild(form)

                    commentField.appendChild(commentWrite)


                controllers.appendChild(commentField)
        //share button
                let share=document.createElement('button')
                share.innerText='Share'
                share.classList.add('btn','btn-outline-warning')
                share.onclick = function(e){

                   e.target.parentNode.children[4].hidden = false
               
                }
                controllers.appendChild(share)

        //Share text overlay
            const question = document.createElement('div') 
             question.classList.add('overlayForComments','flex-column','p-0','bg-light','border')
             question.hidden = true

             question.setAttribute('style','height:150px;')
             

                 let question_text = document.createElement('div')
                 question_text.innerText = "Want to share ?"
                 question_text.classList.add('text-light','text-center','m-0','bg-warning','p-2') 

                 question.appendChild(question_text)

                 let yesOrNoButtons = document.createElement('div')
                     yesOrNoButtons.classList.add('d-flex','justify-content-around','m-3')

                     let yesButton = document.createElement('button')
                     yesButton.innerText = "Yes"
                     yesButton.classList.add('text-light','btn','btn-outline-success','p-2')
                     yesOrNoButtons.appendChild(yesButton)

                     let noButton = document.createElement('button')
                     noButton.innerText = "No"
                     noButton.classList.add('text-light','btn','btn-outline-danger','p-2')
                     yesOrNoButtons.appendChild(noButton)
                 question.append(yesOrNoButtons)
         
                     let closeButton = document.createElement('button')
                     closeButton.innerText = "Close"
                     closeButton.classList.add('btn','btn-dark','p-2')
                     closeButton.onclick =function (e){
                        const doc = e
                         closeShare(doc)
                     }
                question.appendChild(closeButton)

            controllers.appendChild(question)




        post_info.appendChild(controllers)
      
     if(fromSocket){
      return document.getElementById('post_handler').prepend(post)   
     }
    document.getElementById('post_handler').append(post)

}

fetch( `${local_host}allposts`)
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
    
        let button = this.parentNode.children[0]
        button.innerText="Forget"
        button.classList.remove('btn-outline-success')
        button.classList.add('btn-outline-dark')
        button.removeEventListener('click',likeFunction)
        button.addEventListener('click',deleteLikeFunction)
    }
socket.on('liked_post',(postId,data) => {
 
    document.getElementById(postId).parentNode.nextSibling.children[1].innerHTML=data

})

function deleteLikeFunction(){
    socket.emit('deleteLike',myId,this.parentNode.id)
        //Adding one like
        
        let button = this.parentNode.children[0]
        button.innerText="Like"
        button.classList.remove('btn-outline-dark')
        button.classList.add('btn-outline-success')
        button.removeEventListener('click',deleteLikeFunction)
        button.addEventListener('click',likeFunction)
}

socket.on('disLiked_post',(postId,data) => {
    document.getElementById(postId).parentNode.nextSibling.children[1].innerHTML=data
})

function commentFunction(value,commentField,doc){
    
    doc.nextSibling.hidden=false
    const comment_place = doc.parentNode.children[2].children[1]

    fetch(`${local_host}postComments/${doc.parentNode.id}`)
    .then(res => res.json())
    .then(result => {
       comment_place.innerHTML=""
        result.forEach(comment => {
       
            commentTemplate(comment,comment_place)
       
        })
    })
}

socket.on('comment_sending',comment =>{

    comment.forEach(elem => {

        const comment_place =document.getElementById(elem.postId).children[2].children[1]
        commentTemplate(elem,comment_place)
    })
})

function commentTemplate(comment,comment_place){
    const commentBody=document.createElement('div')
    commentBody.classList.add('d-flex','border','border-light','m-1','p-1')

        const image=document.createElement('a')
        image.href=`/users/${comment.user._id}`
        image.classList.add('m-2')
            const img=document.createElement('img')
            img.src=`${comment.user.image}`
            img.setAttribute('style','border-radius: 50%;width:40px;height:40px;')
            image.appendChild(img)
        commentBody.appendChild(image)

        const commentTextBody = document.createElement('div')
        commentTextBody.classList.add('d-flex','flex-column')

            const name = document.createElement('p')
            name.classList.add('text-light','float-left')
            name.innerText = comment.user.name
            commentTextBody.appendChild(name)

            const comment_text = document.createElement('p')
            comment_text.classList.add('text-light')
            comment_text.setAttribute('style','word-break: break-all; word-wrap: break-word;')
            comment_text.innerText = comment.text
            commentTextBody.appendChild(comment_text)
    
        commentBody.appendChild(commentTextBody)
comment_place.appendChild(commentBody)
comment_place.scrollTo( 0,comment_place.scrollHeight)
}

function closeShare(doc) {
    
doc.target.parentNode.classList.remove('d-flex')
doc.target.parentNode.hidden = true
console.log(doc.target.parentNode)
}