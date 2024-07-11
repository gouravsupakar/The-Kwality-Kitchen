const mongoose = require("mongoose")


const menuCard = mongoose.Schema({
    Name: {
             type : String,
             required: true
    },
    image : {
        data:Buffer,
        contentType : String
    },
    price :{
        type : Number,
        required: true
    }
})

//Veg curry Database
const VegCurry = mongoose.model('VegCurry' , menuCard)
module.exports = VegCurry

//Non-Veg Curry Databse
// const NonvegCurry = mongoose.model('NonVegCurry' , menuCard)
// module.exports = NonvegCurry

// //Tandoor Databse
// const Tandoor = mongoose.model('Tandoor' , menuCard)
// module.exports = Tandoor

// //Salad's Database
// const Salad = mongoose.model('Salad' , menuCard)
// module.exports = Salad

// //Starters Database 
// const Starters = mongoose.model('Starters' , menuCard)
// module.exports = Starters

// //Rice Items
// const RiceItems = mongoose.model('RiceItems' , menuCard)
// module.exports = RiceItems