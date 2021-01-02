const mongoose=require('mongoose')

const token=mongoose.Schema({
    unique_id: {
        type: String,
        unique: true,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    }
})

const Token=mongoose.model('Token',token)
module.exports=Token