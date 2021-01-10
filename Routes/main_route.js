const fs=require('fs')
const {Router} = require('express')
const {register}=require('../controllers/register')
const {login,searchUser,allUsers,singleUser,allUsersParam,settings}=require('../controllers/login')
const {tokenChecker,deleteMyToken}=require('../controllers/tokens')
const User = require('../Models/user')
const multer=require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,`../public/uploads/${req.user._id}`))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })

const upload=multer({storage: storage})
const path=require('path')


const route = Router()

route
.get( '/' ,tokenChecker, (req,res) => {
         if(!fs.existsSync(path.join(__dirname,`../public/uploads/${req.user._id}`))){
            fs.mkdirSync(path.join(__dirname,`../public/uploads/${req.user._id}`))
        }
        res.render( 'main' , {data: req.user,title: "Hooks"})
}) 
.get( '/login' ,tokenChecker, (req,res) => {
    res.render('login',{title: "Welcome to Hooks"})
})

.post( '/register' , (req,res) => {
    register(req,res)
})

.post( '/login' , (req,res) => {
  login( req, res )
})

.get( '/deleteMyCookie' , (req,res) => {
    deleteMyToken(req,res)
})

.get( '/settings' , tokenChecker , (req,res) => {
    res.render('settings',{data: req.user,title: 'Settings'})
})

.post( '/settings' , tokenChecker, upload.single('image') , (req,res) => {
    settings(req,res)
}) 

.post( '/searchForUser' , (req,res) => {
    searchUser(req,res)
})

.get( '/messages' ,tokenChecker, (req,res) => {
    const ids=req.user.followers.concat(req.user.following) 
    // Not working should install babel.Look !!!!!!=========
    // const newIds=[...new Set(ids)]
    User.find().select('name image ').where('_id').in(ids).exec((err, records) => {
        res.render('messages',{title:'Messages',rec: records,data: req.user})
    });
})
.get( '/users', allUsers , tokenChecker, (req,res) => {
    res.render('users',{title: 'All users in Hooks',data: req.users})
})
// .post( '/users' ,tokenChecker, (req,res) =>{
//     
// })
.get( '/users/:id', singleUser , tokenChecker, (req,res) => {
    res.render('user',{title: req.foundUser.name+' | Hooks',data: req.foundUser,id: req.user._id,
                                                    followers: req.user.followers,
                                                    following: req.user.following})
})
.get( '/followers/:ids',tokenChecker,allUsersParam)
.get( '/following/:ids',tokenChecker,allUsersParam)
.post( '/follow' , tokenChecker,(req,res) => {
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
})
.post( '/unfollow' ,tokenChecker, (req,res) => {
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
})

module.exports = route