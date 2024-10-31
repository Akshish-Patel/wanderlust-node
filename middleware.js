const Listing = require("./model/listings")

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        console.log(req.locals)
        req.flash("error", "You must be logged in to create listing!")
        return res.redirect("/login");
    }

    next();
}

module.exports.isEditIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to Edit listing!")
        return res.redirect("/login");
    }

    next();
}

module.exports.isDelete = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to Delete listing!")
        return res.redirect("/login");
    }

    next();
}

module.exports.isDeleteReview = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to Delete Review!")
        return res.redirect("/login");
    }

    next();
}
module.exports.saveRedirect = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listnig")
        return res.redirect(`/listing/${id}`)
    }
    next();
}


module.exports.isReviewOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listnig")
        return res.redirect(`/listing/${id}`)
    }
    next();
}