const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser') 
const cookieParser=require('cookie-parser') 
const expressEjsLayouts = require('express-ejs-layouts')
const helmet=require('helmet') 
const rateLimit=require('express-rate-limit') 
const Post = require('./Models/post')
const User = require('./Models/user')
const config=require('./config/keys')
const {EventEmitter}=require('events')
const main_controller = require('./controllers/main_controller')

const app=express()
const server=require('http').Server(app)
const io=require('socket.io')(server)
const event_1=new EventEmitter()
module.exports=event_1

//Mongoose settings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


//Some security
app.use(helmet())

const limiter=new rateLimit({
    windowMs: 15*60*100,
    max:100,
    delayMs:0
})

//Connecting cookies
app.use(cookieParser(config.cookieSecret))

//Body Parser
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

//Connecting ejs and static files
app.use(express.static( __dirname + '/public' ))
app.set('view engine','ejs')
app.use(expressEjsLayouts)

//Connecting routes
app.use( '/' , require('./Routes/main_route') )

const online=[]
event_1.on('login',(id) => {
if(online.indexOf(id)==-1){
   online.push(id)
}
})
event_1.on('logout',(id) => {
    if(online.indexOf(id)!=-1){
    online.splice(online.indexOf(id),1)
}})

io.on('connection',socket=>{
    
    //Online 
     io.emit('online_count',online.length)
//All about posts
    //Listening on post
    socket.on('post',value => {
       
        main_controller.savePost(value)
        .then(result => io.emit('post_get',result))
            
    })

    socket.on('like',(myId,postId) => {

        main_controller.likePost(myId,postId)
        .then(data => io.emit('liked_post',postId,data))

    })

    socket.on('deleteLike',(myId,postId) => {

        main_controller.deleteLikePost(myId,postId)
        .then( data => io.emit('disLiked_post',postId,data))

    })

    socket.on('comment_written',(postId,user,text) => {
        
        if(text.trim().length==0){
            return false
        }
        main_controller.addComment(postId,user,text)
        .then(data => io.emit('comment_sending',data))
    })

    socket.on('typing',()=>{
        socket.broadcast.emit('typing_on', "Typing...")
        })
    socket.on('end_typing',()=>{
        socket.broadcast.emit('typing_end', "Typing...")
        })

    socket.on('message',(data)=>{
          
        io.to().emit('broadcast',data)
        
    })
       
})
// mongoose.connection.once('open',()=>{

    
// var fs = require('fs');
// var Grid = require('gridfs-stream');
// var GridFS = Grid(mongoose.connection.db, mongoose.mongo);

// function putFile(path, name, callback) {
//     var writestream = GridFS.createWriteStream({
//         filename: name
//     });
//     writestream.on('close', function (file) {
//       callback(null, file);
//     });
//     fs.createReadStream(path).pipe(writestream);
// }    
// putFile('package.json','Onik_File',()=>{
//     console.log("done")
// })    
// })

mongoose.connect(config.MongoURI,err=>{
    if(err) throw err
    server.listen(config.PORT,err=>{
        if(err) throw err
        console.log('MongoDB and Server: Connected')
    })
})
