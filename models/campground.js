const mongoose = require('mongoose');

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
    }
});


const Campground = mongoose.model('Campground', campgroundSchema);


module.exports = Campground;