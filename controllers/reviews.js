const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.create = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);

    const { body, rating } = req.body.review;
    const review = new Review ({ body, rating });
    review.author = req.user._id;
    
    camp.reviews.push (review);    

    await review.save();
    await camp.save();

    req.flash('success', 'Created New Review');
    res.redirect(`/campgrounds/${ camp._id }`);
}

module.exports.destroy = async (req, res) => {
    const { id, rid } = req.params;

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    await Review.findByIdAndDelete(rid);
    
    req.flash('success', 'Deleted Review');
    res.redirect(`/campgrounds/${id}`);
}