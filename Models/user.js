const mongoose=require('mongoose')

const user=mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    dateOfBirth:{
        type: Date,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    bio:{
        type: String,
        default: "Hey.I just joined Hooks."
    },
    password:{
        type: String,
        required: true
    },
    image:{type: String,default: '/images/user.png'},
    registerDate: {
        type: Date,
        default: new Date()
    }
  })
const User=mongoose.model( 'User' , user )
module.exports=User