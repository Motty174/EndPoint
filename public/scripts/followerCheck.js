const id=document.getElementById('current_user_id').innerText

fetch(`${local_host}followerInfo/${id}`)
.then(res => res.json())
.then(result => {
    console.log(result)
    document.getElementById('following').innerText=result.followings.length
    document.getElementById('followers').innerText=result.followers.length
    
})