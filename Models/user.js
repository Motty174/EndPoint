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
    password:{
        type: String,
        required: true
    },
    followers:[{type: mongoose.Schema.Types.ObjectId,unique: true}],
    following:[{type: mongoose.Schema.Types.ObjectId,unique: true}]
})
const User=mongoose.model( 'User' , user )
module.exports=User