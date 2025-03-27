const mongoose = require('mongoose');

const defaultMsgSchema = new mongoose.Schema({
    defaultMessage:{
        type:String,
        required:true
    }
},{timestamps:true})

const DefaultMsg = mongoose.model("DefaultMsg",defaultMsgSchema)

module.exports = {DefaultMsg};