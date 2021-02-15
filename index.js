const express = require('express');
const app = express();
const port = 3000;

const path = require('path');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

mongoose.connection.on('error', console.error.bind(console, 'Connection Erorr, '));
mongoose.connection.once('open', () => {
    console.log('Connection to the Database Established');
});

const methodOverride = require('method-override');
const Joi = require('joi');

const { campSchema, reviewSchema } = require('./schemas');

const catchAsync = require('./utils/CatchAsync');
const HandledError = require('./utils/HandledError');

const Review = require('./models/review');
const Campground = require('./models/campground');


app.set('view engine', 'ejs');
app.set('static', path.join(__dirname, 'public'));
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


const validateCamp = (req, res, next) => {
    const { error } = campSchema.validate (req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new HandledError (400, message);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate (req.body);
    if (error) {
        const message = error.details.map (el => el.message).join(',');
        throw new HandledError (400, message);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
});


app.get('/campgrounds', catchAsync (async (req, res) => {
    const camps = await Campground.find({});

    res.render('campgrounds/index', { camps });
}));

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds/new', validateCamp, catchAsync ( async (req, res) => {
    const { title, location, image, price, description } = req.body.camp;
    const camp = Campground.create({ title, location, image, price, description });

    await camp.save();

    res.redirect(`/campgrounds/${ camp._id }`);
}));

app.get('/campgrounds/:id', catchAsync (async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('reviews');

    res.render('campgrounds/view', { id, camp });
}));

app.get('/campgrounds/:id/edit', catchAsync (async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);

    res.render('campgrounds/edit', { id, camp });
}));

app.put('/campgrounds/:id', catchAsync (async (req, res) => {
    const { id } = req.params;
    const { title, location, image, price, description } = req.body.camp;
    await Campground.findByIdAndUpdate(id, { title, location, image, price, description });

    res.redirect(`/campgrounds/${id}`);
}));

app.delete('/campgrounds/:id', catchAsync (async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    res.redirect('/campgrounds');
}));


app.post('/campgrounds/:id/reviews', validateReview, catchAsync (async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById (id);

    const { body, rating } = req.body.review;
    const review = new Review ( { body, rating } );
    
    camp.reviews.push (review);    

    await review.save();
    await camp.save();

    res.redirect(`/campgrounds/${ camp._id }`);
}));

app.delete('/campgrounds/:id/reviews/:rid', catchAsync (async (req, res) => {
    const { id, rid } = req.params;

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    await Review.findByIdAndDelete(rid);
    
    res.redirect(`/campgrounds/${id}`);
}));

app.all('*', (req, res, next) => {
    next (new HandledError (404, 'Resource Not Found'));
});


app.use ((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!';
    res.status(status).render('error', { err });
})



app.listen(port, () => {
    console.log(`Server Listening at Port ${port}`);
});