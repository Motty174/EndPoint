const mongoose = require('mongoose')


const post = mongoose.Schema({
  
    text: String,
    user_name: String,
    user_image: String,
    user_id: String,
    date: String,
    likes: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    comment: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    share: [{type: mongoose.Types.ObjectId, ref: 'User'}]

})

const Post = mongoose.model('Post',post)
module.exports = Post