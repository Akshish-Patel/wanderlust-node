const express = require("express")
const mongoose = require("mongoose")
const app = express()
const Listing = require("../model/listings")
const Review = require("../model/review.js")
const path = require("path")
const WrapAsync = require("../utils/WrapAsync")
const CustomError = require("../utils/CustomError")
const { listingSchema, reviewSchema } = require("../schema.js")
const {isDeleteReview} = require("../middleware.js");
// mergeParams: true is use to get the id parameter which is arrived from app.js
const router = express.Router( {mergeParams: true } )

const reviewController = require("../controller/review.js")

// review middleware
const validateReview = (req, res, next) =>{
    let data = req.body
    console.log("------------\n",data)
    let {error} = reviewSchema.validate(data)
    if(error){
        throw new CustomError(400, error)
    }
    next()
    // res.send("check")
}


// Review
// post routs
router.post("/", validateReview, WrapAsync(reviewController.postNewReview))

// delete review
router.get("/:rId", isDeleteReview, WrapAsync(reviewController.deleteReview))


module.exports = router;