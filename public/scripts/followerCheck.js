
fetch(`${local_host}followerInfo`)
.then(res => res.json())
.then(result => {
   
    document.getElementById('following').innerText=result.followings.length
    document.getElementById('followers').innerText=result.followers.length
    
})