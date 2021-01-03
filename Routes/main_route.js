const {Router} = require('express')
const {register}=require('../controllers/register')
const {login,searchUser}=require('../controllers/login')
const {tokenChecker,deleteMyToken}=require('../controllers/tokens')

const route = Router()

route
.get( '/' ,tokenChecker, (req,res) => {
    res.render( 'main' )
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

module.exports = route