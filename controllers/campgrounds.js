const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
const { cloudinary } = require('../configs/cloudinary');

module.exports.index = async (req, res) => {
    const camps = await Campground.find({}).populate('popupText');

    res.render('campgrounds/index', { camps });
};

module.exports.createForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.create = async (req, res) => {
    const { title, location, image, price, description } = req.body.camp;
    const geoData = await geocoder.forwardGeocode({
        query: location,
        limit: 1
    }).send();

    const camp = new Campground ({ title, location, image, price, description });
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.author = req.user._id;

    await camp.save();

    req.flash('success', 'Successfully Made New Campground');
    res.redirect(`/campgrounds/${ camp._id }`);
};

module.exports.show = async (req, res) => {
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
};

module.exports.updateForm = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);

    if (!camp) {
        req.flash('error', "Campground Doesn't Exist");
        return res.redirect('/campgrounds');
    }
    
    res.render('campgrounds/edit', { id, camp });
};

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const { title, location, image, price, description } = req.body.camp;
    const camp = await Campground.findByIdAndUpdate(id, { title, location, image, price, description });

    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...images);
    await camp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    

    req.flash('success', 'Successfully Updated Campground');
    res.redirect(`/campgrounds/${id}`);
};

module.exports.destroy = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    req.flash('success', 'Successfully Deleted Campground');
    res.redirect('/campgrounds');
};