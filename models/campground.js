const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
    title: {
        type: String
    },
    image: {
        type: String
    },
    description: {
        type: String
    },
    rate: {
        type: Number
    },
    location: {
        type: String
    }
});


const Campground = mongoose.model('Campground', campgroundSchema);


module.exports = Campground;