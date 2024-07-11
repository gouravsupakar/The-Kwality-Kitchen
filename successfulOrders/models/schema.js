const mongoose = require("mongoose")
const express = require("express")
//require("../public/index")
const jwt = require("jsonwebtoken")
const ConfirmOrders = new mongoose.Schema({

//Creating the database schema for the mongoDb database and defining the basic elements of the document of the collection
fullName:{
    type: String,
    required: true,
},
email:{
    type: String,
    required : true,
    unique : true
},
number:{
    type: Number,
    required : true,
    unique :  true
},
password : {
    type : String,
    required : true
},
confirm_password :{
    type: String,
    require: true
},
address: {
    type: String,
    required: true
},
location :[{
  location: {
    type : String,
    require : true
  }
}],
//Token is saved after generation into the database
tokens: [{
    token: {
        type : String,
        required : true
    }
}]
})


const finalOrder = mongoose.model("finalOrder" , ConfirmOrders)
module.exports = finalOrder