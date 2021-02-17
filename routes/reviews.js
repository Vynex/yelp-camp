const expresss = require('express');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const router = expresss.Router({ mergeParams: true });


const Campground = require('../models/campground');
const Review = require('../models/review');

const catchAsync = require('../utils/CatchAsync');


router.post('/', isLoggedIn, validateReview, catchAsync (async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);

    const { body, rating } = req.body.review;
    const review = new Review ({ body, rating });
    review.author = req.user._id;
    console.log('Review, ', review);
    console.log('req', req.user);
    
    camp.reviews.push (review);    

    await review.save();
    await camp.save();

    req.flash('success', 'Created New Review');
    res.redirect(`/campgrounds/${ camp._id }`);
}));

router.delete('/:rid', isLoggedIn, isReviewAuthor, catchAsync (async (req, res) => {
    const { id, rid } = req.params;

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    await Review.findByIdAndDelete(rid);
    
    req.flash('success', 'Deleted Review');
    res.redirect(`/campgrounds/${id}`);
}));




module.exports = router;