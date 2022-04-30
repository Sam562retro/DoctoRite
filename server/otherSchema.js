const mongoose = require('mongoose');

var help = mongoose.model('needHelp', new mongoose.Schema({
    typeAcc: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    PhoneNo: {
        type: Number,
        required: true
    },
    userId: {
        type:String,
        required: true
    },
    need: {
        type: String,
        required:true
    },
    explanation: {
        type: String,
        required: true
    }
}));

module.exports={
    help: help
};