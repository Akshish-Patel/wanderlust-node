const express = require("express")
const mongoose = require("mongoose")
const app = express()
const Listing = require("../model/listings")
const Review = require("../model/review.js")
const User = require("../model/user.js")
const path = require("path")
const WrapAsync = require("../utils/WrapAsync")
const CustomError = require("../utils/CustomError")
const { listingSchema, reviewSchema } = require("../schema.js")
const router = express.Router()
const flash = require("connect-flash");
const { isLoggedIn, isEditIn, isDelete, isOwner } = require("../middleware.js")
const review = require("../model/review.js")

const listingController = require("../controller/listing.js")

// multer is use to convert url-encodet to accept files from url
const multer  = require('multer')
const {storage} = require("../cloudCinfug.js")
const upload = multer({ storage })


const validateListing = (req, res, next) =>{
    let data = req.body
    let {error} = listingSchema.validate(data)
    if(error){
        throw new CustomError(400, error)
    }
    next()
}


// home rout 
router.get("/", WrapAsync(listingController.index));


// new routs
router.get("/new", isLoggedIn, listingController.newForm)

router.post("/new", isLoggedIn, upload.single('listing[url]'), validateListing, WrapAsync(listingController.postNewForm))
// router.post("/new", upload.single('listing[url]'), WrapAsync(listingController.postNewForm))

// show rout
router.get("/:id", WrapAsync(listingController.showListing))
    


// update
router.get("/:id/update", isEditIn, isOwner, WrapAsync(listingController.updateListing))

router.post("/:id/update", isEditIn, isOwner, upload.single('listing[url]'), validateListing, WrapAsync(listingController.updatePostListing))

// delete
router.get("/:id/delete", isDelete, isOwner, WrapAsync(listingController.deleteListing))



module.exports = router;