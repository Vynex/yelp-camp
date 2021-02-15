const expresss = require('express');
const router = expresss.Router({ mergeParams: true });


const { reviewSchema } = require('../schemas');
const Campground = require('../models/campground');
const Review = require('../models/review');

const catchAsync = require('../utils/CatchAsync');
const HandledError = require('../utils/HandledError');



const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate (req.body);
    if (error) {
        const message = error.details.map (el => el.message).join(',');
        throw new HandledError (400, message);
    } else {
        next();
    }
};



router.post('/', validateReview, catchAsync (async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById (id);

    const { body, rating } = req.body.review;
    const review = new Review ({ body, rating });
    
    camp.reviews.push (review);    

    await review.save();
    await camp.save();

    req.flash('success', 'Created New Review');
    res.redirect(`/campgrounds/${ camp._id }`);
}));

router.delete('/:rid', catchAsync (async (req, res) => {
    const { id, rid } = req.params;

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    await Review.findByIdAndDelete(rid);
    
    req.flash('success', 'Deleted Review');
    res.redirect(`/campgrounds/${id}`);
}));




module.exports = router;