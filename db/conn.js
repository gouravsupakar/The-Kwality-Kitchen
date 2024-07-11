const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/KwalityKitchen",{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(()=>{
    console.log("Connection Established")
}).catch((e)=>console.log("Connection Not Established...."))
//The connection of the express app , Nodejs and MongoDb database . The connection is made using the 
//require method in the main index file of the App.
//<!-------------Created By Ritank Saxena------------->
