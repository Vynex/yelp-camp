const mongoose = require('mongoose');
const Campground = require('../models/campground');

const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('error', console.error.bind(console, 'Connection Erorr, '));
mongoose.connection.once('open', () => {
    console.log('Connection to the Database Established');
});


const cities = require('./cities');
const { places, descriptors, images } = require('./seedHelpers');

const seed = async() => {
    await Campground.deleteMany({});
    
    for(let i = 0; i != 50; i++) {
        const randomCity =  Math.floor(Math.random() * 528);
        const price = Math.floor(Math.random() * 2500) + 750;
        const randomArr = arr => arr[Math.floor(Math.random() * arr.length)];
        const randomImg1 = randomArr(images);
        const randomImg2 = randomArr(images);

        const camp = new Campground ({
            title: `${randomArr(descriptors)} ${randomArr(places)}`,
            author: '6030f840c34cdd4dc887e3b6',
            location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Error dolores voluptas maxime et in est, eligendi, omnis a esse enim amet soluta quos, cum consequuntur! Obcaecati dignissimos distinctio hic deleniti!',
            price,
            images: [
                {
                    url: randomImg1.url,
                    filename: randomImg1.filename
                },
                {
                    url: randomImg2.url,
                    filename: randomImg2.filename
                }
            ],
            geometry: {
                type: "Point",
                coordinates: [
                    cities[randomCity].longitude,
                    cities[randomCity].latitude,
                ]
            }
        })
        await camp.save();
    }
};


seed().then(() => {
    mongoose.connection.close();
    console.log('Connection Closed');
});