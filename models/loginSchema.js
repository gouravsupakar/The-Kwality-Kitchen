//<!-------------Created By Ritank Saxena------------->
const mongoose = require("mongoose")
const express = require("express")
//require("../public/index")
const jwt = require("jsonwebtoken")
const users = new mongoose.Schema({

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
},
location :[{
  location: {
    type : String,
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




//token generation and authentication for the users while signing up using the middleware.
users.methods.generateAuthenticationToken = async function() {
    try{
        const token = jwt.sign({_id:this._id.toString()}, "thisisresumeprojectwebsite")
        this.tokens = this.tokens.concat({token:token})
        return token
        await this.save()
    }catch(error){
        res.status(404).send("User Authentication Error")
        console.log(error)
    }
}



const userList = new mongoose.model('userList' , users)
module.exports = userList
