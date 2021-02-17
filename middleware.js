const { campSchema, reviewSchema } = require('./schemas');
const Campground = require('./models/campground');
const Review = require('./models/review');
const HandledError = require('./utils/HandledError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);

    if (!camp.author.equals(req.user._id)) {
        req.flash('error', "You don't have the permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, rid } = req.params;
    const review = await Review.findById(rid);

    if(!review.author.equals(req.user._id)) {
        req.flash('error', "You don't have the permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();    
};

module.exports.validateCamp = (req, res, next) => {
    const { error } = campSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new HandledError (400, message);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new HandledError (400, message);
    } else {
        next();
    }
};