const Listing = require("../model/listings")
const Review = require("../model/review.js")
const User = require("../model/user.js")

module.exports.postNewReview = async (req, res) => {

    let listing = await Listing.findById(req.params.id);
    let review = await new Review(req.body.review);
    review.author = req.user._id;

    listing.reviews.push(review);
    // console.log("body ====",req.body)
    // console.log(listing)
    review.save();
    listing.save();
    req.flash("success", "New Review Created!")
    res.redirect(`/listing/${req.params.id}`);
}

module.exports.deleteReview = async(req, res) =>{
    let listingId = req.params.id;
    let reviewId =  req.params.rId;
    let review = await Review.findById(reviewId)

// invalid review
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this Review")
        return res.redirect(`/listing/${req.params.id}`)
    }

    // $pull: {reviews: reviewId} is use to delete only one listing from the array of review which arrives into listing schema
    await Listing.findByIdAndUpdate(listingId, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "Review Deleted!")
    res.redirect(`/listing/${req.params.id}`);
}