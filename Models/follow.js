const mongoose = require('mongoose')


const follow=mongoose.Schema({
    followerId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    followingId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    date: {type: Date, default: new Date()}
})


const Follow=mongoose.model('Follow',follow)

module.exports=Follow