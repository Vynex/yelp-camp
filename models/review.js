const monogose = require('mongoose');

const reviewSchema = new monogose.Schema ({
    rating: {
        type: Number,        
    },
    body: {
        type: String,
    }
});


const Review = monogose.model ('Review', reviewSchema);


module.exports = Review;


