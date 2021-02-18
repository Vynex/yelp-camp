const mongoose = require('mongoose');
const Review = require('./review');


const imageSchema = new mongoose.Schema({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

const campgroundSchema = new mongoose.Schema({
    title: {
        type: String
    },
    location: {
        type: String
    },
    images: [imageSchema],
    price: {
        type: Number
    },
    description: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});


campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});


const Campground = mongoose.model ('Campground', campgroundSchema);


module.exports = Campground;