const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
    name: {
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