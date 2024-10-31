require('dotenv').config();


const express = require("express")
const mongoose = require("mongoose")
const app = express()
const Listing = require("./model/listings")
const Review = require("./model/review.js")
const path = require("path")
const WrapAsync = require("./utils/WrapAsync")
const CustomError = require("./utils/CustomError")
const { listingSchema, reviewSchema } = require("./schema.js")
// router reqire
const listings = require("./routes/listing.js")
const review = require("./routes/review.js")
const user =require("./routes/user.js")
// express session 
const session = require("express-session")

// mongo session
const MongoStore = require('connect-mongo');

const flash = require("connect-flash")
// passport 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlist"
const dburl = process.env.ATLASDB_URL

// db connections
async function main() {
    await mongoose.connect(dburl)
}

main().catch(() => {
    console.log("DB Connected")
}).catch((err) => {
    console.log(err)
})


app.set("view engine", "views")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public/css")))
app.use(express.static(path.join(__dirname, "model")))
app.use(express.urlencoded({ extended: true }))

// mongo session is use to store the express session on cloud mongo db server instade of our local machine or memory
const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SERCET
      },
    touchAfter: 24 * 3600 // time period in seconds
})

store.on("error", () =>{
    console.log("ERROR IN MONGO SESSION STORE ",err)
})

// default to make a session
const sessionOption = { 
    store: store,
    secret: process.env.SERCET, 
    resave: false, 
    saveUninitialized: true ,
    cookie: {
        expires: Date.now() +  7 * 24 * 60 * 60 * 1000, // milisecond
        maxAge: 7 * 24 * 60 * 60 * 1000, // milisecond
        httpOnly: true
    }
}


app.use(session(sessionOption))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next()
})

// home rout 
app.get("/", async (req, res) => {

    // let listings = await Listing.find({});
    res.send("Hi, i am root!")
});


//routers
app.use("/listing", listings)   
app.use("/listing/:id/review", review)
app.use("/", user)

app.listen(8080, () => {
    console.log("Server run on port : 8080")
})



app.all("*", (req, res, next) => {
    next(new CustomError(404, "Page Not Found!!"))
})

app.use((err, req, res, next) => {
    
    console.log(err)
    let {statusCode, message} = err
    // console.log(err.name)
    // res.send(err.message)
    res.render("error.ejs", {err})
})

