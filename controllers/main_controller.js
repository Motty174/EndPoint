const fs = require('fs')
const path = require('path')
const User = require('../Models/user')
const bcrypt = require('bcrypt')
const valid = require('validator').default
const {Password_Salt}=require('../config/keys')
const Follow= require('../Models/follow')
const Post = require('../Models/post')
const Comment = require('../Models/comments')

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

    async message_render(req,res){
     
            const followers=await Follow.find({followingId: req.user._id},{followerId: 1, _id:0})
            const newFollowersList=followers.map(elem => elem.followerId)
            const ids=newFollowersList.concat(req.user._id) 
         
            // Not working should install babel. Look !!!!!!=========
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
      
        res.render('user',{title: req.foundUser.name+' | Hooks',
                        data: req.foundUser,
                        id: req.user._id})
        
    }
    
    check_for_follow(req,res){
        Follow.findOne({followerId: req.params.myId,followingId: req.params.followId},(err,data) => {
            if(err){
                return res.status(500).send('Server error occured')
            }
            if(!data){
                return res.json({following: false})
            }
            return res.json({following: true})
        })
    }

    follow(req,res){
        
        if(req.params.myId==req.params.followId){
            return res.json({error: "Cant follow or unfollow to this id"})
        }
        
        Follow.findOne({followerId: req.params.myId,followingId: req.params.followId},(err,data) => {
            if(err){
                return res.status(500).send('Server error occured')
            }
           if(data){
                return res.json({following: false,text: 'Cant follow because exists'})
            }
           
        Follow.create({followerId: req.params.myId,followingId: req.params.followId},(err,data) => {
            if(err) throw err
            return res.json({follow:true,data: data})
        })

       }) 
    }

    unfollow(req,res){
        
        if(req.params.myId==req.params.followId){
            return res.json({error: "Cant follow or unfollow to this id"})
        }

        Follow.findOne({followerId: req.params.myId,followingId: req.params.followId},(err,data) => {
            if(err){
                return res.status(500).send('Server error occured')
            }
           if(!data){
                return res.json({following: false,text: 'Cant unfollow because does not exist'})
            }
       Follow.deleteOne({followerId: req.params.myId,followingId: req.params.followId},(err,data) => {
           if(err) throw err
           return res.json({follow: false,data: data})
       })
     })
    }

    followerInfo(req,res){
        const id = req.params.id
        Follow.find({followerId: id},(err,followings) => {
            if(err) {
                return res.sendStatus(500)
            }

            Follow.find({followingId: id},(err,followers) => {
                if(err) {
                    return res.sendStatus(500)
                }
                return res.json({followers,followings})
            })
        })
    }

    
    followersList(req,res){
        const id = req.params.id
        Follow.find({followingId: id}).populate("followerId").exec((err,data) => {
        if(err) throw err
        data=data.map(elem => elem.followerId)
        if(data.length==0){
            data=0
        }
        return res.render('users',{title: "Followers list",data: data, error: "No followers found."})
        
        })

    }

    followingsList(req,res){
            const id = req.params.id
        Follow.find({followerId: id}).populate("followingId").exec((err,data) => {
            if(err) throw err
           data=data.map(elem => elem.followingId)
            if(data.length==0){
                data=0
            }
            return res.render('users',{title: "Followings list",data: data, error: "No followings found."})
            
        })

    }

    allPosts(req,res){
            const id=req.params.id
        Post.find({permission: id})
        .sort({date: "desc"})
        .exec((err,data) =>{
            return res.json(data)
        })

    }

   async postComments(req,res){
        const postId = req.params.id
        const comments = await Comment.find({postId: postId}).lean().populate('user',{name:1 ,image: 1})
        return res.json(comments)
    }

    async addComment(postId,user,text){
     
      const data=  await  Comment.create({postId,user,text})
        const comment=await Comment.find({_id: data._id}).lean().populate('user',{name:1 ,image: 1})
        return comment
    }
    //All about posts

  async savePost(value){
        
        const followers =await Follow.find({followingId: value.user_id},{followerId:1, _id:0})
        const ids = followers.map(elem => elem.followerId)
        ids.push(value.user_id)

        const post={
            text: value.post_text,
            user_name: value.user_name,
            user_image: value.user_image,
            user_id: value.user_id,
            date: value.date,
            permission: ids,
        }
      const newValue=await Post.create(post)
      return newValue 
    }

    async likePost(myId,postId){
    
    const data= await   Post.findByIdAndUpdate(postId,{$addToSet: {likes: myId}})
    return +data.likes.length +1
    }

    async deleteLikePost(myId,postId){
        
     const data = await Post.findByIdAndUpdate(postId,{$pull: {likes: myId}})
        return +data.likes.length-1
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

    searchUser(req,res){

        const user_name = req.params.name
        const regex = new RegExp(user_name, 'gi')
        
    User.find({ name: regex},{name: 1},(err,data) => {
            
            if(err){
              
                return res.sendStatus(404)
            
            }else if( !data ){
                
                return res.json({ name: 'Not found' })
            
            }else{
               
                return res.json({ array: data})
            
            }
        })
    }
    
}

module.exports=new MainController()
