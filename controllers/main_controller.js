const fs = require('fs')
const path = require('path')
const User = require('../Models/user')
const bcrypt = require('bcrypt')
const valid = require('validator').default
const {Password_Salt}=require('../config/keys')


class MainController{

    main(req,res){   
        
        if(!fs.existsSync(path.join(__dirname,`../public/uploads/${req.user._id}`))){
               fs.mkdirSync(path.join(__dirname,`../public/uploads/${req.user._id}`))
           }
         return  res.render( 'main' , {data: req.user,title: "Hooks"})
    
        }

    login(req,res){
    
        res.render('login',{title: "Welcome to Hooks", success: ''})
    
    }

    settings(req,res){
        
            res.render('settings',{data: req.user,title: 'Settings'})
        
    }

    message_render(req,res){
            const ids=req.user.followers.concat(req.user.following) 
            // Not working should install babel.Look !!!!!!=========
            // const newIds=[...new Set(ids)]
            User.find().select('name image ').where('_id').in(ids).exec((err, records) => {
             if(err){
                 return res.status(500).send('Server error occured,sorry')
             }
                return  res.render('messages',{title:'Messages',rec: records,data: req.user})
            });
        
    }
 
    users(req,res){
        
        res.render('users',{title: 'All users in Hooks',data: req.users})
        
    }
    
    users_by_id(req,res){
      
        res.render('user',{title: req.foundUser.name+' | Hooks',data: req.foundUser,id: req.user._id,
                                                            followers: req.user.followers,
                                                            following: req.user.following})
        
    }

    follow(req,res){
        
        User.findByIdAndUpdate(req.user._id,{$push: {"following": req.body.id}},(err,myUser)=>{
                if(err){
                    return res.statusCode(500)
                }
                User.findByIdAndUpdate(req.body.id, {$push: {"followers" : req.user._id}},(err,data) => {
                    if(err){
                        return res.statusCode(500)
                    }
                    return res.json({success: 'Added',followers: myUser.followers,following: myUser.following })
                })  
            })    
    }

    unfollow(req,res){
       
        User.findByIdAndUpdate(req.user._id, {$pull: {"following" :req.body.id}},(err,myUser) => {
            if(err){
                return res.statusCode(500)
            }
            User.findByIdAndUpdate(req.body.id, {$pull: {"followers": req.user._id}},(err,data) =>{
                if(err){
                    return res.statusCode(500)
                }
                return res.json({success: "Deleted", followers: myUser.followers, following: myUser.following})
            })
        })
    
    }

    confirm_user(req,res){
        const newUser={
                        name:  req.user.user.name,
                        email:  req.user.user.email.toLowerCase(),
                        password: req.user.user.password,
                        dateOfBirth: valid.toDate(req.user.user.date),
                        gender : req.user.user.gender, 
                       }
                    
                    newUser.password=bcrypt.hashSync( newUser.password, Password_Salt ) 
                    
                    User.create( newUser )
                    .then( data => {
                
                        return res.render('login',{title: "Welcome to Hooks", success: "Your email has been verified.Now you can log in."})
                
                    })
                    .catch( err => res.status(423).send('User already exits.') )
        
    }
}

module.exports=new MainController()