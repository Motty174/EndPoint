const mongoose = require('mongoose')

const message = mongoose.Schema({

    sendingId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    receiveId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    text: String
})

const Message = mongoose.model('Message',message)
module.exports = Message