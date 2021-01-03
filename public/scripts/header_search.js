document.getElementById('header_search').oninput=(e) => {
    e.preventDefault()
    const search_value = {
        name: document.getElementById('header_search').value
    }
    fetch('http://localhost:8080/searchForUser',{
        method: "POST",
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(search_value)
    })
    .then(res => res.json() )
    .then(data => {
        setTimeout(()=>{
            document.getElementById('found_users').innerHTML=""
            if(data.array.length>=5){
                const found_user=document.createElement('li')
                found_user.innerHTML= "<a href='/' > See all results </a>"
                document.getElementById('found_users').append(found_user)
            }else{
            data.array.forEach((element) => {
                const found_user=document.createElement('li')
                found_user.innerText=element.name
                found_user.setAttribute('id',element._id)
                found_user.addEventListener('click',(event)=>{
                    location.replace(`/${element._id}`)
                })
                document.getElementById('found_users').append(found_user)
            })}
        },400)})
}
