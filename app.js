const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser') 
const cookieParser=require('cookie-parser') 
const expressEjsLayouts = require('express-ejs-layouts')
const helmet=require('helmet') 
const rateLimit=require('express-rate-limit') 

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
    socket.on('message',message=>{
        console.log(message,socket.id)
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
})


mongoose.connect(config.MongoURI,err=>{
    if(err) throw err
    server.listen(config.PORT,err=>{
        if(err) throw err
        console.log('MongoDB and Server: Connected')
    })
})
