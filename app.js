const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser') 
const cookieParser=require('cookie-parser') 
const expressEjsLayouts = require('express-ejs-layouts')
const helmet=require('helmet') 
const rateLimit=require('express-rate-limit') 
const Chat=require('./Models/main_chat')
const config=require('./config/keys')

const app=express()
const server=require('http').Server(app)
const io=require('socket.io')(server)

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


io.on('connection',socket=>{
    console.log('Connected')
       
    socket.on('message',(data)=>{
            io.emit('broadcast',data)
        })
        
        socket.on('disconnect',()=>{
            console.log('Disconnected')
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
