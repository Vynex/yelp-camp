const expresss = require('express');
const router = expresss.Router();


const { campSchema } = require('../schemas');
const { isLoggedIn } = require('../middleware');


const catchAsync = require('../utils/CatchAsync');
const HandledError = require('../utils/HandledError');

const Campground = require('../models/campground');


const validateCamp = (req, res, next) => {
    const { error } = campSchema.validate (req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new HandledError (400, message);
    } else {
        next();
    }
};


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

    await camp.save();

    req.flash('success', 'Successfully Made New Campground');
    res.redirect(`/campgrounds/${ camp._id }`);
}));

router.get('/:id', catchAsync (async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('reviews');

    if (!camp) {
        req.flash('error', "Campground Doesn't Exist");
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/view', { id, camp });
}));

router.get('/:id/edit', isLoggedIn, catchAsync (async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);

    if (!camp) {
        req.flash('error', "Campground Doesn't Exist");
        return res.redirect('/campgrounds');
    }
    
    res.render('campgrounds/edit', { id, camp });
}));

router.put('/:id', isLoggedIn, catchAsync (async (req, res) => {
    const { id } = req.params;
    console.log(req.body.camp);
    const { title, location, image, price, description } = req.body.camp;
    await Campground.findByIdAndUpdate(id, { title, location, image, price, description });
    

    req.flash('success', 'Successfully Updated Campground');
    res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync (async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    req.flash('success', 'Successfully Deleted Campground');
    res.redirect('/campgrounds');
}));




module.exports = router;