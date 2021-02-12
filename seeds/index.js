const mongoose = require('mongoose');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('error', console.error.bind(console, 'Connection Erorr, '));
mongoose.connection.once('open', () => {
    console.log('Connection to the Database Established');
});


const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

const seed = async() => {
    await Campground.deleteMany({});
    
    for(let i = 0; i != 50; i++) {
        const random1000 =  Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const randomArr = arr => arr[Math.floor(Math.random() * arr.length)];

        const camp = new Campground ({
            title: `${randomArr(descriptors)} ${randomArr(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Error dolores voluptas maxime et in est, eligendi, omnis a esse enim amet soluta quos, cum consequuntur! Obcaecati dignissimos distinctio hic deleniti!',
            price
        })
        await camp.save();
    }
};


seed().then(() => {
    mongoose.connection.close();
    console.log('Connection Closed');
});