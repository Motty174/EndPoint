const User=require('../Models/user')
const bcrypt =require('bcrypt')
const valid=require('validator').default
const {getTokens}=require('../controllers/tokens')

class Login{

    login(req,res){
            const user={
                email: req.body.email,
                password : req.body.password
            }
            if(!user.email || !user.password){
                return res.json({ error: 'Please fill in all fields '})
            }
            if(!valid.isEmail(user.email)){
                return res.json({ error: 'Pleas write valid email' })
            }
            if(user.password.length<7){
                return res.json({ error: 'Password length must be at least 7.'})
            }
            User.findOne({ email: user.email }).exec()
            .then(data => {
                if(!data){
                    return res.json({ error: 'Email is not registered '})
                }
                else if(bcrypt.compareSync(user.password,data.password)){
                    const tokens_user={
                                    name: data.name,
                                    email: data.email,
                                    _id: `${data._id}`
                                    }
                   getTokens(tokens_user)
                    .then(data=>{
                        res.cookie('tokens',data,{signed:true,httpOnly:true,maxAge: 2*60*60*1000})
                        return res.json({ success: "Logged in" })
                    })
                    .catch(err=>console.log(err))
                    
                }else{
                    res.json({ error: 'Email or password is false.'})
                }

            })
            .catch(err => res.json({ error : err.message }))
    }
    
    searchUser(req,res){
        const user_name=req.body.name
        const regex = new RegExp(user_name, 'gi')
        User.find({ name: regex},(err,data) => {
            if(err){
                return res.sendStatus(404)
            }else if(!data){
                return res.json({ name: 'Not found' })
            }else{
                return res.json({ array: data})
            }
        })
    }
    

}

module.exports=new Login()