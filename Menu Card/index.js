const express = require("express")
const cors = require("cors")
const port = process.env.PORT || 9000
const app = express()
require("./db/connections.js")
const menuItems = require("./models/schemas.js")
const multer = require("multer")

app.get("/" , (req,res)=>{
    res.status(200).send("this is working")
})


const storage = multer.diskStorage({
    destination : "uploads",
    filename: (req,file,cb)=>{
        cb(null , file.originalname)
    }
})

const upload = multer({
    storage : storage
}).single('testImage')

app.post("/upload" , (req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            console.log(err)
        }else{
            const newImage = new menuItems({
                Name : req.body.name , 
                image: {
                    data: req.file.filename,
                    contentType: 'image/jpg'
                }
            })
            
            newImage.save()
            .then(()=>res.status(200).send("Image Uploaded"))
            .catch((err)=>console.log(err))
        }
    })
})

app.listen(port , ()=>{
    console.log("Api is working fine")
})