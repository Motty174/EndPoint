const User=require('../Models/user')
const bcrypt =require('bcrypt')
const valid=require('validator').default
const {getTokens}=require('../controllers/tokens')
const { Password_Salt } = require('../config/keys')

class Login{

    login(req,res){
       
        console.time()      
       
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
                
                getTokens( tokens_user )
                    .then( data => {
                        
                        res.cookie('tokens',data,{signed:true,httpOnly:true,maxAge: 2*60*60*1000})
                        console.timeEnd()
                        require('../app').emit('login',tokens_user._id)
                        return res.json({ success: "Logged in" })
                        
                    })
                    .catch(err=>console.log(err))
                    
                }else{
                    res.json({ error: 'Email or password is false.'})
                }

            })
            .catch(err => res.json({ error : err.message }))
    }
    
    allUsers(req,res,next){

        User.find( {}, {password:0}, (err,data) => {
            
            if(err){
             
                return res.status(404).send('Page is not working.')
            
            }
            
            req.users=data
            
            next()
        
        })
    }
    
    singleUser(req,res,next){
       
        User.findById(req.params.id,{password:0},(err,data)=>{
            
            if(err){
                return res.status(500).send('Error occured')
            }
            
            if(!data){
                    req.foundUser={}
            return    next()
            }
            
                req.foundUser=data
                next()
        
            })
    }

    settings(req,res){
        
        if( req.file!=undefined ){
            const image_ext = ["image/jpg", "image/jpeg", "image/bmp", "image/gif", "image/png"]; 
            
            if( image_ext.indexOf(req.file.mimetype)==-1 ){
                return res.redirect('/settings')
            }
           
            User.findByIdAndUpdate(req.user._id,{image: `/uploads/${req.user._id}/${req.file.filename}`}, (err,data) => {
             
                if(err){
             
                    return res.status(500).send('Server error')
             
                }
             
                return res.redirect('/settings')
          
            })  
        
        }else if(req.body.name || req.body.date || req.body.bio ){
          
            if(req.body.name && (req.body.name.length<=3 || !/^[a-z ,.'-]+$/i.test(req.body.name))){
              
                return res.status(400).send('Minimum required length 4')        
            
            }
            if(req.body.date){
                
                if(!valid.isDate(req.body.date)){
                
                    return res.status(400).send('Not valid Date')
                
                }
                else if(valid.isDate(req.body.date)) {
                
                    const date=new Date()
                    date.setFullYear(new Date().getFullYear()-16)
                
                    if(!valid.isBefore(req.body.date,date.toString())){
                
                        return res.status(400).send('Can no do that.Age minimum required 16')   
                
                    }
                }
            } 
            
            const changes={
                name: req.body.name || req.user.name,
                dateOfBirth: req.body.date || req.user.dateOfBirth,
                bio: req.body.bio || req.user.bio
                }
            
                User.findByIdAndUpdate(req.user._id,changes,(err,data)=>{
               
                res.redirect('/settings')
            
            })
          }else{
            
            res.redirect('/settings')
          
        }
    }
}

module.exports=new Login()