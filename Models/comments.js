const mongoose = require('mongoose')

const comment=mongoose.Schema({

    user: {type: mongoose.Types.ObjectId, ref: "User"},
    text: String
})

const Comment=mongoose.model('Comment',comment)
module.exports=Comment