const mongoose = require('mongoose');
const Review = require('./review');
const { campSchema } = require('../schemas');

const campgroundSchema = new mongoose.Schema({
    title: {
        type: String
    },
    location: {
        type: String
    },
    image: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});


campSchema.post('findOneAndDelete', async function (doc) {
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