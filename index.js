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
const Campground = require('./models/campground');


app.set('view engine', 'ejs');
app.set('static', path.join(__dirname, 'public'));
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home');
});


app.get('/campgrounds', async (req, res) => {
    const camps = await Campground.find({});

    res.render('campgrounds/index', { camps });
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds/new', async (req, res) => {
    const { title, location, image, price, description } = req.body.camp;
    console.log('req.body');
    console.log(req.body);
    console.log(title);
    const camp = Campground.create({ title, location, image, price, description });
    console.log('camp');
    console.log(camp);
    await camp.save();

    res.redirect(`/campgrounds/${ camp._id }`);
});

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);

    res.render('campgrounds/view', { id, camp });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);

    res.render('campgrounds/edit', { id, camp });
});

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const { title, location, image, price, description } = req.body.camp;
    await Campground.findByIdAndUpdate(id, { title, location, image, price, description });

    res.redirect(`/campgrounds/${id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    res.redirect('/campgrounds');
});





app.listen(port, () => {
    console.log(`Server Listening at Port ${port}`);
});