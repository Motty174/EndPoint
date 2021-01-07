const User=require('../Models/user')
const valid=require('validator').default
const bcrypt=require('bcrypt')
const {Password_Salt}=require('../config/keys')

class Register{

    register(req,res){
       
        const user=req.body

        if(!user.name || !user.email || !user.password || !user.password2){
            return res.json({ error: "Please fill in all fields"})
        }
        if(user.name.length<=3 || !/^[a-z ,.'-]+$/i.test(user.name)){
            return res.json({ error: 'Pleas write valid name' })        
        }
        if(!user.date || !valid.isDate(user.date)){
            return res.json({ error : 'Please choose Date of Birth.' })
        }
        const date=new Date()
        date.setFullYear(new Date().getFullYear()-16)
        if(!valid.isBefore(user.date,date.toString())){
             return res.json({ error : 'Sorry, You are too young.' })   
        }  
        if(!valid.isEmail(user.email)){
           return res.json({ error : 'Please write valid email.' })
        }
        if(user.password.length<7){
            return res.json({ error :'Password should be at least 7 length' })
        }
        if(!/(?=.*[0-9])/.test(user.password) || !/(?=.*[a-z])/i.test(user.password)){
            return res.json({ error : 'Password must contain at least one number and one alphabetical character.' })
        }
        if(user.password!==user.password2){
            return res.json({ error : 'Passwords do not match' })
        }
        User.findOne({email : user.email}).exec()
        .then(data=>{
            if(data){
                return res.json({error: "That email is already taken"})
            }
            const newUser={
                name:user.name,
                email: user.email,
                password: user.password,
                dateOfBirth: valid.toDate(user.date),
                gender :user.gender
               }
            newUser.password=bcrypt.hashSync(newUser.password,Password_Salt)
            User.create(newUser)
            .then(data=>{
                return res.json({ success: 'User created. \n Now you can log in.'})
            })
            .catch(err=>console.log(err))
        })
        .catch(err=>res.json({error : err.message}))  
    }


}
module.exports=new Register()