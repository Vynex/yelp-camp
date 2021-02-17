const monogose = require('mongoose');

const reviewSchema = new monogose.Schema ({
    rating: {
        type: Number,        
    },
    body: {
        type: String,
    },
    author: {
        type: monogose.Schema.Types.ObjectId,
        ref: 'User'
    }
});


const Review = monogose.model ('Review', reviewSchema);


module.exports = Review;


