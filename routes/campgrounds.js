const expresss = require('express');
const router = expresss.Router();

const { isLoggedIn, isAuthor, validateCamp } = require('../middleware');

const catchAsync = require('../utils/CatchAsync');

const Campground = require('../models/campground');



router.get('/', catchAsync (async (req, res) => {
    const camps = await Campground.find({});

    res.render('campgrounds/index', { camps });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/new', isLoggedIn, validateCamp, catchAsync ( async (req, res) => {
    const { title, location, image, price, description } = req.body.camp;
    const camp = new Campground ({ title, location, image, price, description });
    camp.author = req.user._id;

    await camp.save();

    req.flash('success', 'Successfully Made New Campground');
    res.redirect(`/campgrounds/${ camp._id }`);
}));

router.get('/:id', catchAsync (async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
        path: 'reviews', 
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!camp) {
        req.flash('error', "Campground Doesn't Exist");
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/view', { id, camp });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync (async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);

    if (!camp) {
        req.flash('error', "Campground Doesn't Exist");
        return res.redirect('/campgrounds');
    }
    
    res.render('campgrounds/edit', { id, camp });
}));

router.put('/:id', isLoggedIn, isAuthor, catchAsync (async (req, res) => {
    const { id } = req.params;
    const { title, location, image, price, description } = req.body.camp;
    await Campground.findByIdAndUpdate(id, { title, location, image, price, description });
    

    req.flash('success', 'Successfully Updated Campground');
    res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync (async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    req.flash('success', 'Successfully Deleted Campground');
    res.redirect('/campgrounds');
}));




module.exports = router;