const mongoose = require('mongoose')

const comment=mongoose.Schema({

    postId: {type: mongoose.Types.ObjectId, ref: "Post"},
    user: {type: mongoose.Types.ObjectId, ref: "User"},
    text: String,
    date: {
        type: Date,
        defalut: new Date()
    }
})

const Comment=mongoose.model('Comment',comment)
module.exports=Comment