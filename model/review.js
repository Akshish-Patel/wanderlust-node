const mongoose = require("mongoose")
const Schema = mongoose.Schema

const reviewScnema = new Schema({
   
    comment: {
        type: String
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },

    author : {
        type: Schema.Types.ObjectId,
        reg : "User",
        require: true
    }
});

module.exports = mongoose.model("review", reviewScnema);