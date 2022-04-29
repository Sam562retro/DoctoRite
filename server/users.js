const mongoose = require('mongoose');

var doc = mongoose.model('doctorUsers', new mongoose.Schema({
    password : {
        type: String,
        required: true
    },
    typeAcc: {
        type: Number,
        required: true,
        default: 1
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
    covidStatus: {
        type: Boolean,
        required: true
    },
    address : {
        type: String,
        required: true
    },
    health : {
        type : String,
        required: false
    },
    freeTimeStart : {
        type: Date,
        required: false,
        default : (new Date()).getTime()
    },
    freeTimeEnd  : {
        type: Date,
        required: false,
        default : (new Date()).getTime()
    }
}));

var pat = mongoose.model('patientUsers', new mongoose.Schema({
    password : {
        type: String,
        required: true
    },
    typeAcc: {
        type: Number,
        required: true,
        default: 3
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
    covidStatus: {
        type: Boolean,
        required: true
    },
    address : {
        type: String,
        required: true
    },
    health : {
        type : String,
        required: true,
        default: "Hey everybody, I am doing great"
    }
}));

var fam = mongoose.model('familyUsers', new mongoose.Schema({
    password : {
        type: String,
        required: true
    },
    typeAcc: {
        type: Number,
        required: true,
        default: 2
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
    covidStatus: {
        type: Boolean,
        required: true
    },
    address : {
        type: String,
        required: true
    },
    health : {
        type : String,
        required: true,
        default: "Hey everybody, I am doing great"
    },
    relatedDoc : {
        type: String,
        required: true
    }
}));

   module.exports={
       doc: doc,
       pat : pat,
       fam : fam
   };