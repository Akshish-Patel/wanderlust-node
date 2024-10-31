const Listing = require("../model/listings")
const Review = require("../model/review.js")
const User = require("../model/user.js")

// mapbox
const mbxGeocoading = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoading({ accessToken: maptoken });


// home page
module.exports.index = async (req, res) => {

    let listings = await Listing.find({});
    res.render("home.ejs", { listings })
}


// get new listing form
module.exports.newForm = (req, res) => {
    res.render("new.ejs")
}

// post new listing form
module.exports.postNewForm = async(req, res, next) => {

    let mapboxResponse = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
      }).send()

    //   console.log(mapboxResponse.body.features[0].geometry.coordinates)

    let data = req.body
    // console.log(data)
    const newListing = new Listing(data.listing)
    newListing.owner = req.user._id;
    newListing.url = req.file.path
    newListing.geometry=mapboxResponse.body.features[0].geometry
    console.log(newListing)
    await newListing.save()
    req.flash("success", "New Listing Created!")
    res.redirect("/listing")
}

// module.exports.postNewForm = async(req, res, next) => {
//     console.log(req.file.path)
//     res.send(req.file.path)
// }

// get show listing page
module.exports.showListing = async (req, res) => {

    let reviewsAuthor = []
    let id = req.params.id                                //this is nested populate 
    let showlisting = await Listing.findById(id).populate({path:"reviews", populate:{path: "author"}}).populate("owner")// populate is use to get the object of reviews from their _id
    
    if(showlisting)
    {
        for(let reviewes of showlisting.reviews)
        {
            let user = await User.findById(reviewes.author)
            console.log(user)
            reviewsAuthor.push(user)
        }
    }

    // console.log(reviewsAuthor)
    // console.log(showlisting)
    if(!showlisting){
        req.flash("error", "Listing you requested for dose not exist!!")
        res.redirect("/listing")
    }
    let maptoken = process.env.MAP_TOKEN;
    // console.log(maptoken)
    console.log(reviewsAuthor.length)
    console.log(showlisting.reviews.length)
    res.render("show.ejs", { showlisting, reviewsAuthor, maptoken })
}

// get edit/update listing form
module.exports.updateListing = async (req, res) => {

    let id = req.params.id
    let data = await Listing.findById(id)
    if(!data){
        req.flash("error", "Listing you requested for dose not exist!!")
        res.redirect("/listing")
    }
    res.render("update.ejs", { data })
}

// post edit/update lisitng form
module.exports.updatePostListing = async (req, res) => {
    let data = req.body
    let id = req.params.id
    
    let mapboxResponse = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
      }).send()

    //   newListing.geometry=mapboxResponse.body.features[0].geometry
      data.listing.geometry=mapboxResponse.body.features[0].geometry
    // console.log(data)
    // three dot(...) is used to deconstruct the object which is arrived from the url body part
    let listing = await Listing.findByIdAndUpdate(id, { ...data.listing })

    if(typeof req.file !== "undefined"){

        listing.url = req.file.path
        await listing.save()
    }

    req.flash("success", "Listing Updated!")
    // console.log({ ...data })
    
    res.redirect("/listing/" + id)
}

// get delete listing 
module.exports.deleteListing = async (req, res) => {
    let id = req.params.id
    await Listing.findByIdAndDelete(id)
    req.flash("success", "Listing Deleted!!")
    res.redirect("/listing")
}