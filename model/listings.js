const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Review = require("./review.js")

const listingSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    description: String,
    url: {
            type: String,
            require: true,
            default: "https://images.unsplash.com/photo-1489516408517-0c0a15662682?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (value) => value === "" ? "https://images.unsplash.com/photo-1489516408517-0c0a15662682?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : value
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "review"
        }
    ],
    owner : {
        type: Schema.Types.ObjectId,
        ref : "User",
        require: true
    },

    geometry:{
        type:{
            type: String,
            enum: ['Point'],
            require: true
        },
        
        coordinates: {
            type: [Number],
            require: true
        }
    }
})

// post mongoose middleware which is use to delete all reviews of listing when listing was delete
listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){

        // below command is use to delete all review from review collection which is connected with listing 
        // $in is use to delete more than one data at a time
        await Review.deleteMany({ _id : { $in : listing.reviews}})
    }
})

const Listing = mongoose.model("listing", listingSchema)

module.exports = Listing