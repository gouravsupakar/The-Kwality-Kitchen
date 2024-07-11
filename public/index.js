//<!-------------Kwality Kitchen Backend Source code by Ritank Saxena(github/ritank1998------------->
const express = require("express")   //importing express app
const cors = require("cors")   //importing cors for cross browser requests
const hbs = require("hbs")     //importing handlebars
const path = require("path")
const mongoose = require("mongoose")
const { json } = require("express") // importing json format from express to read the authentication data
const jwt = require("jsonwebtoken") // importing Jason web token
const multer = require("multer")
const port = process.env.PORT || 3000 // declaring the port which will be used for the session
const app = express()

const sub = require("@novu/node")
const cookieParser = require("cookie-parser") //works as a middleware
const NOVU_API = '5a81b3ea5f716a12e4224205bbf4dcd1'
const circulaJson = require("circular-json")
const axios = require("axios")
const stripe = require("stripe")
const CircularJSON = require("circular-json")
const STRIPE_KEY = "sk_test_51OFL9qSEugCzyQa356HYQlT2ET8AmGww8bxPJCJ1Hgp0PL2wktB35JDHaRHbx5WLhIOvCfKMjToNNE7MBw3QmqAE00yklYxLwM"

const fs = require('fs');     // importing fs
const ejs = require ('ejs');  // importing ejs

require("../db/conn") //importing the connection method with MongoDb databse
// require("../successfulOrders/db/connections")
const registeredUsers = require("../models/loginSchema") //importing the database schema
const { log } = require("console")
const { userInfo } = require("os")
//const paymentConfirm = require("../successfulOrders/models/schema")



app.use(cors())
app.use(cookieParser())


//defining the path to the computer as we are using the handbars here , we are giving the express the path of  the files
const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")

//defining the method for the express to read the json format tokens
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.use(express.static(static_path))

app.set('view engine', 'ejs');      // Configure EJS as an additional view engine

app.set("views", template_path)    // Configure Handlebars as  view engine
app.set("view engine", "hbs")

//initial get request for the express app as the lander page
app.get("/", (req, res) => {
    res.render("landingindex")
})

//when registration is called
app.get("/registration", (req, res) => {
    res.render("index")
})

//when login is called
app.get("/loginindex", (req, res) => {
    res.render("loginindex")
})
//Counting the total number of the Users in the data base to set the subscribers in novu
app.get("/users", async (req, res) => {
    try {
        const myUsers = await registeredUsers.find()
        res.status(200).send(myUsers)
    } catch (error) {
        res.status(500).json(circulaJson.stringify({ message: error.message }))
    }
})
//this is the registration of the new user using the signup page

let emailFind = "" ;



//throw out the location and the address in the next step insted of this to avoid the registration confliict in the application
// directly capture the location and the address on the address book or on the next step whie ordering 
app.post("/registration", async (req, res) => {
   const {fullName, email , number , password , confirm_password , address , location} = req.body
    emailFind = req.body.email;

    try {

        //fetching the password and confirm password from the registration page and saving as the variables
       // const pass = req.body.password
       // const conf_pass = req.body.confirm_password
        if (password === confirm_password) {
            //creating a new variable to save the details of the new user on the db the details fetched here
            //are save on main ui & db
            //const locate = req.body.location
            const newRegisteredUser = new registeredUsers({
                fullName,
                email,
                number,
                password,
                confirm_password,
            })
            //genertating the novu subscriber and sending the email of activation if the account
            const novu = new sub.Novu(NOVU_API)
            {
                try {
                    await novu.subscribers.identify(`${req.body.email}`, {
                        email: req.body.email,
                        phone: req.body.number,
                        firstName: req.body.fullName,
                    });
                    novu.trigger('account-activation', {
                        to: {
                            subscriberId: `${req.body.email}`,
                            email: req.body.email
                        },
                        payload: {
                            confirmationLink: '<REPLACE_WITH_DATA>'
                        }
                    });

                     
                }
                catch (error) {
                    res.status(500).json(circulaJson.stringify({ message: error.message }))
                }
            }

            //token generation using the new method defined on the database schema
            const Token = await newRegisteredUser.generateAuthenticationToken();
            const costomer = await newRegisteredUser.save()

            //cookie is a inbuilt feature of the Nodejs . can be used directly.
            res.cookie("jwt", Token, {
                expires: new Date(Date.now() + 70000),
                httpOnly: true
            })
            console.log(Token)


            //the costomer variable is created to store the data on the database 
    
        //    res.status(200).json(circulaJson.stringify({newRegisteredUser , Token}))
            res.status(200).render("loginindex", { token: Token });

        }

        else {
            res.send("Re-Enter the Password....")
        }
    } catch (error) {

        res.status(500).json(circulaJson.stringify({ message: error.message }))
        console.log(error)
    }
})

app.delete("/subs", async (req, res) => {
    try {
        const novu = new sub.Novu(NOVU_API)
        await novu.subscribers.delete('Ritank Saxena_saxena.ritank@gmail.com');
        res.send("Ho gya")
    }
    catch (error) {
        res.status(500).json(circulaJson.stringify({ message: error.message }))
    }
})





//this is the login of the existing user using the login page using the POST method
// app.post("/loginindex", async (req, res) => {

//     
//     //getting the email and password from the login page using the same process as in registration
//     try {
//         const email = req.body.email;
        
//         const pass = req.body.password;
//         console.log(pass)
//         const userEmail = await registeredUsers.findOne({ email: email })
//         console.log(userEmail)
//         //token generation using the new method defined on the database schema
//         const Token = await userEmail.generateAuthenticationToken();

//         //login Cookie to keep the track of the Login of the user
//         res.cookie("jwt", Token, {
//             expires: new Date(Date.now() + 3000),
//             httpOnly: true
//         })
//         //cookie is an inbuilt feature
//         if (userEmail.password === pass) {
//             console.log("the pass in the login is" , pass)
            
//             res.status(400).render("indexAppPage")
//         } else {
//             res.status(404).send("Invalid username or password")
//         }

//     } catch (e) {
//         console.log(e)
//         res.status(404).send("User not found...")
//     }

// });

app.post("/loginindex", async (req, res) => {
    emailFind = req.body.email;
    const email = req.body.email;
    const pass = req.body.password;

    try {
        const user = await registeredUsers.findOne({ email: email });
        console.log(user)
        if (!user) {
            return res.status(404).send("User not found");
        }

        if (user.password !== pass) {
            return res.status(401).send("Invalid password");
        }

        const kwalityK = await user.generateAuthenticationToken();

        res.cookie("jwt", kwalityK, {
            expires: new Date(Date.now() + 600000),// 10 min expiry
            httpOnly: true,
        });

        res.status(200).send({ kwalityK }); // Sending token to frontend
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


app.get("/indexAppPage", (req, res) => {  // code by Gourav supakar
    res.render('indexAppPage.hbs');
    
})

//displaying the Menu card using the get method
// app.get("/Menu", (req, res) => {
//     //requesting the cookie generating on login or sign to verify the user
//     res.render("Menuindex")
// })



// app.get('/cart', (req, res) => {
//     res.render('Cart.ejs');
// })





app.post("/options", (req, res) => {
    var ele = document.myform.plan.value;
    console.log(ele);
    alert("You have select the " + " " + ele + " " + "Plan");
    if (ele == "Monthly") {
        res.status(200).send("monthly", "_self");

    }
    else if (ele == "daily") {
        alert("welcome daily");
    }
    else {
        res.status(200).send("weekindex", "_self");

    }
})

// below code by Gourav supakar

//Menu Card Database is here
const db = mongoose.createConnection("mongodb://127.0.0.1:27017/MenuCard")

const ordersDb = mongoose.createConnection("mongodb://127.0.0.1:27017/SuccessfulOrders")

const tiffinDb = mongoose.createConnection("mongodb://127.0.0.1:27017/TiffinItems")

// successfulOrdes schema

const orderSchema = new mongoose.Schema({

    date:{
        type: String,
        required: true
    },

    customerName: {
        type: String,
        required: true
    },

    data: {
        type: Array,
        required: true
    },

    orderPrice: {
        type: Number,
        required: true
    },

    phone: {
        type: Number,
        require: true
    }
    
})

// orders model 

const SuccessfulOrders = ordersDb.model("orders", orderSchema);


// menuItem schema
const menuItemSchema = new mongoose.Schema ({
    
    Name: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    price: {
        type: Number,
        required: true
    }
});

const tiffinItemSchema= new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    price: {
        type: Number,
        required: true
    },
    content: {
        type: String,
    },
    itemType: {
        type: String
    }
})

// tiffin items validation here

const lunchItems = tiffinDb.model("lunchItems", tiffinItemSchema);

const dinnerItems = tiffinDb.model("dinnerItems", tiffinItemSchema);

//Menu Items Validation is here
//Veg Curry
const vegCurries = db.model("vegCurries", menuItemSchema)

//Non Veg Curry
const nonvegCurries = db.model("nonvegCurries", menuItemSchema)


//Starters
const Starters = db.model("Starters",  menuItemSchema)


//Salads
const Salad = db.model("Salad",  menuItemSchema)


//Rice Items
const RiceItems = db.model("RiceItems",  menuItemSchema)


//Tandoor
const TandoorItems = db.model("Tondoor",  menuItemSchema)

// breads 

const BreadItems = db.model("BreadItems", menuItemSchema);


//Multer Functions to upload the images 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
}).single('testImage')


// lunch items upload Api

app.post("/lunchItems", (req,res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(500).json(circulaJson.stringify({ message: err.message }))
        } else {
            const newTiffinItem = new lunchItems({

                Name: req.body.name,
                image: {
                    data: fs.readFileSync('uploads/' + req.file.filename),
                    contentType: 'image/jpg'
                },
                price: req.body.Price,
                content: req.body.content,
                itemType: req.body.itemType
            })

            newTiffinItem.save()
                .then(() => res.status(200).send("Image Uploaded"))
                .catch((err) => res.status(500).json(circulaJson.stringify({ message: err.message })))
        }
    })
})

// dinner items upload Api

app.post("/dinnerItems", (req,res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(500).json(circulaJson.stringify({ message: err.message }))
        } else {
            const newTiffinItem = new dinnerItems({

                Name: req.body.name,
                image: {
                    data: fs.readFileSync('uploads/' + req.file.filename),
                    contentType: 'image/jpg'
                },
                price: req.body.Price,
                content: req.body.content,
                itemType: req.body.itemType
            })

            newTiffinItem.save()
                .then(() => res.status(200).send("Image Uploaded"))
                .catch((err) => res.status(500).json(circulaJson.stringify({ message: err.message })))
        }
    })
})


//Veg Curry Upload Api

app.post("/vegcurry", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(500).json(circulaJson.stringify({ message: err.message }))
        } else {
            const newImage = new vegCurries({
                
                Name: req.body.name,
                image: {
                    data: fs.readFileSync('uploads/' + req.file.filename),
                    contentType: 'image/jpg'
                },
                price: req.body.Price
            })

            newImage.save()
                .then(() => res.status(200).send("Image Uploaded"))
                .catch((err) => res.status(500).json(circulaJson.stringify({ message: err.message })))
        }
    })
})


//Nonveg Curry Upload Api
app.post("/nonvegcurry", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(500).json(circulaJson.stringify({ message: err.message }))
        } else {
            const newImage = new nonvegCurries({

                Name: req.body.name,
                image: {
                    data: fs.readFileSync('uploads/' + req.file.filename),
                    contentType: 'image/jpg'
                },
                price: req.body.Price
            })

            newImage.save()
                .then(() => res.status(200).send("Image Uploaded"))
                .catch((err) => res.status(500).json(circulaJson.stringify({ message: err.message })))
        }
    })
})


//Starters Upload Api
app.post("/starter", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(500).json(circulaJson.stringify({ message: err.message }))
        } else {
            const newImage = new Starters({
                Name: req.body.name,
                image: {
                    data: fs.readFileSync('uploads/' + req.file.filename),
                    contentType: 'image/jpg'
                },
                price: req.body.Price
            })

            newImage.save()
                .then(() => res.status(200).send("Image Uploaded"))
                .catch((err) => res.status(500).json(circulaJson.stringify({ message: err.message })))
        }
    })
})


//Salads Upload Api
app.post("/salad", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(500).json(circulaJson.stringify({ message: err.message }))
        } else {
            const newImage = new Salad({
                Name: req.body.name,
                image: {
                    data: fs.readFileSync('uploads/' + req.file.filename),
                    contentType: 'image/jpg'
                },
                price: req.body.Price
            })

            newImage.save()
                .then(() => res.status(200).send("Image Uploaded"))
                .catch((err) => res.status(500).json(circulaJson.stringify({ message: err.message })))
        }
    })
})


//Rice Items Upload Api
app.post("/rice", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(500).json(circulaJson.stringify({ message: err.message }))
        } else {
            const newImage = new RiceItems({
                Name: req.body.name,
                image: {
                    data: fs.readFileSync('uploads/' + req.file.filename),
                    contentType: 'image/jpg'
                },
                price: req.body.Price
            })

            newImage.save()
                .then(() => res.status(200).send("Image Uploaded"))
                .catch((err) => res.status(500).json(circulaJson.stringify({ message: err.message })))
        }
    })
})

//Tandoor
app.post("/tandoor", (req, res) => {
    upload(req, res, (error) => {
        if (error) {
            res.status(500).json(circulaJson.stringify({ message: error.message }))
        }
        else {
            const newImage = new TandoorItems({
                Name: req.body.name,
                image: {
                    data: fs.readFileSync('uploads/' + req.file.filename),
                    contentType: 'image/jpg'
                },
                price: req.body.Price
            })
            newImage.save()
                .then(() => res.status(200).send("Images Updated"))
                .catch((err) => res.status(500).json(circulaJson.stringify({ message: err.message })))
        }
    })
})

// breadItems upload api

app.post("/bread", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(500).json(circulaJson.stringify({ message: err.message }))
        } else {
            const newImage = new BreadItems({
                
                Name: req.body.name,
                image: {
                    data: fs.readFileSync('uploads/' + req.file.filename),
                    contentType: 'image/jpg'
                },
                price: req.body.Price
            })

            newImage.save()
                .then(() => res.status(200).send("Image Uploaded"))
                .catch((err) => res.status(500).json(circulaJson.stringify({ message: err.message })))
        }
    })
})


//Getting DB Data

let vegCurryData = [];
let nonVegCurryData = [];
let starterData = [];
let saladData = [];
let riceData = [];
let tandoorData = [];
let breadData = [];
let lunchItemsData = [];
let dinnerItemsData = [];



//vegCurries
app.get("/vegcurry", async (req, res) => {
    const data = await vegCurries.find();
    
    try {
        res.status(200).send(data)
    } catch (error) {
        res.status(500).json(circulaJson.stringify({ message: error.message }))
    }
})

//nonVeg Currie
app.get("/nonvegcurry", async (req, res) => {
    const data = await nonvegCurries.find()

    try {

        res.status(200).send(data)
    }
    catch (error) {
        res.status(500).json(circulaJson.stringify({ message: error.message }))
    }
})

//Rice items
app.get("/rice", async (req, res) => {
    const data = await RiceItems.find()

    try {
        res.status(200).send(data)
    }
    catch (error) {
        res.status(500).json(circulaJson.stringify({ message: error.message }))
    }
})

//tandoor
app.get("/tandoor", async (req, res) => {
    const data = await TandoorItems.find()


    try {
        res.status(200).send(data)
    }
    catch (error) {
        res.status(500).json(circulaJson.stringify({ message: error.message }))
    }

})

//Salads
app.get("/salad", async (req, res) => {
    const data = await Salad.find()

    try {
        res.status(200).send(data)
    }
    catch (error) {
        res.status(500).json(circulaJson.stringify({ message: error.message }))
    }
})


//Starters
app.get("/starter", async (req, res) => {
    const data = await Starters.find()


    try {
        res.status(200).send(data)
    }
    catch (error) {
        res.status(500).json(circulaJson.stringify({ message: error.message }))
    }

})



// breads

app.get("/bread", async (req, res) => {
    const data = await BreadItems.find()

    
    try {
        res.status(200).send(data);
    } catch (error) {
        res.status(500).json(circulaJson.stringify({ message: error.message }))
    }
})

// function to convert image data to base 64

function convertImageData(data) {

    return data.map((item) => {

        const base64String = Buffer.from(item.image.data.data).toString('base64');

        return {...item, image:base64String}
  });


}

app.get("/lunchItems", async (req, res) => {
    const data = await lunchItems.find();
    
    try {
        res.status(200).send(data)
    } catch (error) {
        res.status(500).json(circulaJson.stringify({ message: error.message }))
    }
})

app.get("/dinnerItems", async (req, res) => {
    const data = await dinnerItems.find();

    try {
        res.status(200).send(data)
    } catch (error) {
        res.status(500).json(circulaJson.stringify({ message: error.message }))
    }
})



app.get('/tiffinLunchItems', async(req, res) => {

    await axios.get('http://localhost:3000/lunchItems')
    .then((res) => lunchItemsData = convertImageData(res.data))
    .catch((error) => console.log("error geting the lunch items data"));

    try {
        res.status(200).send(lunchItemsData)
    } catch (error) {
        console.log("error in sending lunch items data", error)
    }
});



app.get('/tiffinDinnerItems', async(req, res) => {

    await axios.get('http://localhost:3000/dinnerItems')
    .then((res) => dinnerItemsData = convertImageData(res.data))
    .catch((error) => console.log("error geting the dinner items data", error));

    try {
        res.status(200).send(dinnerItemsData)
    } catch (error) {
        console.log("error in sending the the dinner items data", error);
    }
})

//tiffin services
// app.get("/tiffin", async(req, res) => {

//     await axios.get('http://localhost:3000/tiffinItem').then ((res) =>  tiffinData = convertImageData(res.data));
//     res.render("tiffinindex");

//     tiffinData.map((item) => console.log(item.Name))

    
// })



app.get("/menu", async (req, res) => {

     await axios.get('http://localhost:3000/starter').then ((res) =>  starterData = convertImageData(res.data));
    
     await axios.get('http://localhost:3000/salad').then ((res) => saladData = convertImageData(res.data) );

     await axios.get('http://localhost:3000/tandoor').then ((res) => tandoorData = convertImageData(res.data) );

     await axios.get('http://localhost:3000/vegcurry').then ((res) => vegCurryData = convertImageData(res.data) );

     await axios.get('http://localhost:3000/nonvegcurry').then ((res) => nonVegCurryData = convertImageData(res.data) );

     await axios.get('http://localhost:3000/rice').then ((res) => riceData = convertImageData(res.data) );

     await axios.get('http://localhost:3000/bread').then ((res) => breadData = convertImageData(res.data) );


    res.render('Menu.ejs', {starterItems: starterData,
         saladItems: saladData,
         tandoorItems: tandoorData,
         vegCurryItems: vegCurryData,
         nonVegCurryItems: nonVegCurryData,
         riceItems: riceData,
         breadItems: breadData
        })
})

let cartData = [] ;
let tiffinData = []
app.post('/cart', (req, res) => {

    cartData = req.body.data;

    tiffinData = req.body.tiffinData;
    
    console.log('Received cart data:', cartData);
    // Process the cart data as needed

    console.log('Received tiffinData data:', tiffinData);

    res.send({cartData: cartData, tiffinData: tiffinData});
    // Render the cart page with the retrieved data

});



app.get('/cart', (req,res) => {
    res.render("cart", { cartData: JSON.stringify(cartData || []), tiffinData: JSON.stringify(tiffinData || []) })
});



const today = new Date();
const options = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
};

const indianDate = String(today.toLocaleDateString('en-IN', options));



let data = [] ;


//Payment Gateway

app.post("/pay" ,async (req,res)=>{

    data = req.body.cart;
    
    const cost = req.body.totalCartPrice ;
    const cartData = req.body.cart;
    const email = emailFind;
    let userData = await registeredUsers.findOne({email: email});
    let Name = userData.fullName;
    let number = userData.number;

    

    try {
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: 'test_2MRQRMYMoXXlWlO3WUfmBo7FrVUqHW4syRI',
          client_secret: 'test_RJ5w60rIFhpxc6LAmujaFC6S3FHF1atJ9EAqz5Tj7ue034QGXFoSfCTUB9T57xFcI6ZTw2bfUS3wcoBeoUj3FgXeSrK0c8n5yFpCNmgXsv6gTuPV0aOTsLnpeq7'
        })
      };
      
  
      const response = await fetch('https://test.instamojo.com/oauth2/token/', options);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
  
      
      const responseData = await response.json();
      console.log(responseData);
      const token = responseData.access_token;
      
  
  
      const optionsForPaymentsLink = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token} `,
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          allow_repeated_payments: false,
          send_email: true,
          amount: cost,
          purpose: "Food Delivery",
          buyer_name: Name,
          email: email,
          phone: number,
          redirect_url: 'http://localhost:3000/dashboard'
        })
      }
      
      const requireResponse = await fetch('https://test.instamojo.com/v2/payment_requests/', optionsForPaymentsLink)
      const reqData = await requireResponse.json();
      const url = reqData.longurl
      const paymentId = reqData.id

      console.log(requireResponse);

      console.log(optionsForPaymentsLink);

      console.log(reqData);
      console.log(url);

      console.log(Name);
      console.log(email);
      console.log(number);
      console.log(cost);

      res.status(200).json({ response: reqData }); // Sending response as JSON

      const statusCode = res.statusCode;

      if (statusCode === 200) {
        const newOrder = new  SuccessfulOrders({
            date: indianDate,
            customerName: Name,
            data: cartData,
            orderPrice: cost,
            phone: number
        });

        newOrder.save()
        .then(() => res.status(200))
        .catch((err) => res.status(500).json(circulaJson.stringify({ message: err.message })))

      } 


      // Log the status code if status is 200
      console.log('Status Code:', requireResponse.status);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message }); // Sending error response
    }
});



//getting the dashboard using the get method
app.get("/dashboard", async (req, res) => {

    try {

        const email = emailFind;
        let userInfo = await registeredUsers.findOne({email: email});
        let userName = userInfo.fullName;
        const orderData = await SuccessfulOrders.find({customerName: userName }).sort({ _id: -1 });
        let orderItems = orderData.map((item) => {
            return item.data;
        });
    
        let totalCost = 0 ;
        orderData.map((item) => 
            totalCost += parseInt(item.orderPrice)
        );
    
    
        const totalOrderCount = orderData.length;
    
        console.log(orderData );
    
        console.log(totalCost);
    
        console.log('Total items in the collection:', totalOrderCount);
    
        console.log(orderItems);
    
        res.render("dashboardindex", {name: userName,
            totalOrder: totalOrderCount,
            orderData: JSON.stringify(orderData),
            orderItems: JSON.stringify(orderItems),
            totalCost: totalCost})


    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).send("Internal Server Error");
    }


})




app.get('/clientconformation', (req, res) => {
    res.send("client info")
    // res.render('clientconformation'); // Render the clientconformation view or send some data
});


//dashboard address
app.get("/address" , (req,res)=>{
    res.render("address.hbs")
})


//save address in db
app.put("/updateaddress", async (req, res) => {
    const { email, name, address, phone } = req.body;
    try {
        const registeredUsers = await userDetails.findOneAndUpdate({ email: email }, {
            $set: {
                address: `${name} ${address} , ${phone}`
            }
        });
        res.status(200).json(registeredUsers);
    } catch (err) {
        res.status(500).json(err);
    }
});
//running the app on server

app.listen(port, () => {
    console.log("Hi this the API is live now")
})


//generic google maps link
// https://www.google.com/maps?q=12.8871174,77.5973469