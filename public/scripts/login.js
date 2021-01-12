
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

//Registration Fetch

document.getElementById('register').addEventListener('submit',(event) => {
event.preventDefault()
    //Error handle
    let errorHandle=document.getElementById('error_reg')
    errorHandle.innerText=''
    
    const user={
    name : document.getElementById('name').value,
    date : document.getElementById('date').value,
    gender : document.getElementById('gender').value,
    email : document.getElementById('email').value.toLowerCase(),
    password : document.getElementById('password').value,
    password2 : document.getElementById('password2').value
}
function isValid(user){
    if(user.name.length<=3 || !/^[a-z ,.'-]+$/i.test(user.name)){
        errorHandle.innerText='Pleas write valid name'
        return false
    }
    if(!user.date || user.date.length>11){
        errorHandle.innerText='Please choose Date of Birth.'
        return false
    }
    const userDate=user.date.split('-')
    if(userDate[0]<=new Date().getFullYear()-16){
        if(+userDate[1]<= new Date().getMonth()){
            if(+userDate[2]<= new Date().getDate()){
            }
        }
    }else{
        errorHandle.innerText='Sorry, You are too young.'
        return false
    }
    if(!user.gender){
        errorHandle.innerText="Please select gender"
        return false
    }
    if(!validateEmail(user.email) || !user.email){
        errorHandle.innerText='Please write valid email.'
        return false
    }
    if(user.password.length<7){
        errorHandle.innerText='Password should be at least 7 length'
        return false
    }
    if(!/(?=.*[0-9])/.test(user.password) || !/(?=.*[a-z])/i.test(user.password)){
        errorHandle.innerText='Password must contain at least one number and one alphabetical character.'
        return false
    }
    if(user.password!==user.password2){
        errorHandle.innerText='Passwords do not match'
        return false
    }
    return true
}
if(isValid(user)){
    fetch(`${local_host}register`,{
        method: "POST",
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.success){
                document.getElementById('success_reg').innerText=data.success
                setTimeout(()=>{
                        container.classList.remove("right-panel-active");
                },1700)
                document.getElementById('name').value=""
                document.getElementById('date').value=""
                document.getElementById('gender').value=""
                document.getElementById('email').value=""
                document.getElementById('password').value=""
                document.getElementById('password2').value=""  
            }else{
                errorHandle.innerText=data.error
            }
        })
    .catch(err=>{
        console.log(err)
        errorHandle.innerText = err
    })
}
})

// Login 
document.getElementById('login').onsubmit = (event)=>{
    event.preventDefault()
    const errorHandle=document.getElementById('login_error')
    errorHandle.innerText=''
    const user={
        email: document.getElementById('email_login').value.toLowerCase(),
        password: document.getElementById('password_login').value
    }
    if(!user.email || !user.password){
        errorHandle.innerText="Please fill in all fields."
        return false
    }
    if(!validateEmail(user.email)){
        errorHandle.innerText="Please write valid email."
        return false
    }
    fetch(`${local_host}login`,{
        method: "POST",
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(res => res.json() )
    .then(data => {
        console.log(data)
        if(data.error!=undefined){
           return  errorHandle.innerText=data.error
        }
     return  location.replace('/') 
    })
    .catch(err => console.log(err))
    
}

//Valid email
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

