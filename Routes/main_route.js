const {Router} = require('express')
const {register}=require('../controllers/register')
const {login,allUsers,singleUser,settings}=require('../controllers/login')
const {tokenChecker,deleteMyToken}=require('../controllers/tokens')
const main_controller=require('../controllers/main_controller')
const multer = require('multer')
const event_1 = require('../app')
const path=require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,`../public/uploads/${req.user._id}`))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })

const upload=multer({storage: storage})

//Confirm adress

const route = Router()

route
.get( '/' ,tokenChecker, main_controller.main) 

.get( '/login' ,tokenChecker, main_controller.login)

.post( '/register' , register)

.post( '/login' , login)

.get( '/deleteMyCookie',tokenChecker, deleteMyToken)

.get( '/settings' , tokenChecker , main_controller.settings)

.post( '/settings' , tokenChecker, upload.single('image') , settings) 

.get( '/searchForUser/:name' ,tokenChecker , main_controller.searchUser )

.get( '/messages' ,tokenChecker, main_controller.message_render)

.get( '/users', allUsers , tokenChecker, main_controller.users)

.get( '/users/:id', singleUser , tokenChecker, main_controller.users_by_id)

.get( '/followerInfo/:id' , tokenChecker, main_controller.followerInfo)

.get( '/follow/:myId/:followId' , tokenChecker, main_controller.follow)

.get( '/unfollow/:myId/:followId' ,tokenChecker, main_controller.unfollow)

.get( '/checkForFollow/:myId/:followId' , tokenChecker , main_controller.check_for_follow)

.get( '/followers/:id', tokenChecker, main_controller.followersList)

.get( '/followings/:id' , tokenChecker, main_controller.followingsList)

.get( '/allposts/:id', tokenChecker, main_controller.allPosts)

event_1.on( 'confirm' , data =>{
  
    route.get( `/confirm/${data.adress}`,(req,res,next)=>{
        req.user=data
        return next()  
    } ,main_controller.confirm_user)

})

module.exports = route