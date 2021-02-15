const express = require('express');
const app = express();
const port = 3000;

const path = require('path');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

mongoose.connection.on('error', console.error.bind(console, 'Connection Erorr, '));
mongoose.connection.once('open', () => {
    console.log('Connection to the Database Established');
});


const Joi = require('joi');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

const HandledError = require('./utils/HandledError');



app.set('view engine', 'ejs');
app.set('static', path.join(__dirname, 'public'));
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());

const sessionConfig = {
    secret: "UsHgPVjQXz3fWgCb",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 604800000,
        maxAge: 604800000
    }
}
app.use(session(sessionConfig));

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');



app.get('/', (req, res) => {
    res.render('home');
});


app.use('/campgrounds', campgrounds);

app.use('/campgrounds/:id/reviews', reviews);


app.all('*', (req, res, next) => {
    next (new HandledError (404, 'Resource Not Found'));
});


app.use ((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!';
    res.status(status).render('error', { err });
});



app.listen(port, () => {
    console.log(`Server Listening at Port ${port}`);
});