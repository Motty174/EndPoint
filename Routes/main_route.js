const {Router} = require('express')
const {register}=require('../controllers/register')
const {login,searchUser,allUsers,singleUser}=require('../controllers/login')
const {tokenChecker,deleteMyToken}=require('../controllers/tokens')
const User = require('../Models/user')

const route = Router()

route
.get( '/' ,tokenChecker, (req,res) => {
    User.findById(req.user._id,{password:0},(err,data)=>{
        res.render( 'main' , {data})
    })
}) 
.get( '/login' ,tokenChecker, (req,res) => {
    res.render('login')
})
.post( '/register' , (req,res) => {
    register(req,res)
})
.post( '/login' , (req,res) => {
  login(req,res)
})
.get( '/deleteMyCookie' , (req,res) => {
    deleteMyToken(req,res)
})
.post( '/searchForUser' , (req,res) => {
    searchUser(req,res)
})
.get( '/users', allUsers , tokenChecker, (req,res) => {
    console.log(req.users)
    res.render('users',{data: req.users})
})
.get( '/users/:id', singleUser , tokenChecker, (req,res) => {
    res.render('user',{data: req.foundUser})
})
.get( '/followerslist' , tokenChecker , (req,res) => {
    User.findById(req.user._id,{followers:1,following:1},(err,data)=>{
        if(err){
            res.sendStatus(500)
        }
        res.json(data)
    })
} )
.post( '/follow' , tokenChecker,(req,res) => {
    User.findByIdAndUpdate(req.user._id,{$push: {"following": req.body.id}},(err,data)=>{
        if(err){
            return res.statusCode(500)
        }
        User.findByIdAndUpdate(req.body.id, {$push: {"followers" : req.user._id}},(err,data) => {
            if(err){
                return res.statusCode(500)
            }
            return res.json({success: 'Added' })
        })  
    })
})
.post( '/unfollow' ,tokenChecker, (req,res) => {
    User.findByIdAndUpdate(req.user._id, {$pull: {"following" :req.body.id}},(err,data) => {
        if(err){
            return res.statusCode(500)
        }
        User.findByIdAndUpdate(req.body.id, {$pull: {"followers": req.user._id}},(err,data) =>{
            if(err){
                return res.statusCode(500)
            }
            return res.json({success: "Deleted"})
        })
    })
})
module.exports = route