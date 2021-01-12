const {Router} = require('express')
const {register}=require('../controllers/register')
const {login,searchUser,allUsers,singleUser,allUsersParam,settings}=require('../controllers/login')
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

.post( '/searchForUser' ,tokenChecker , searchUser )

.get( '/messages' ,tokenChecker, main_controller.message_render)

.get( '/users', allUsers , tokenChecker, main_controller.users)

.get( '/users/:id', singleUser , tokenChecker, main_controller.users_by_id)

.get( '/followers/:ids',tokenChecker,allUsersParam)

.get( '/following/:ids',tokenChecker,allUsersParam)

.post( '/follow' , tokenChecker, main_controller.follow)

.post( '/unfollow' ,tokenChecker, main_controller.unfollow)

event_1.on( 'confirm' , data =>{
  
    route.get( `/confirm/${data.adress}`,(req,res,next)=>{
        req.user=data
        return next()  
    } ,main_controller.confirm_user)

})

module.exports = route