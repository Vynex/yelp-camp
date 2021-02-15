const Joi = require('joi');

module.exports.campSchema = Joi.object ({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object ({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});