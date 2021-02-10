const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connection to the Database Established');
}).catch((err) => {
    console.log('Failed to Establish Connection to the Database');
    console.error(err);
});


const Campground = require('./models/campground');

// const seedCampgrounds = [
//     {

//     },
// ]

