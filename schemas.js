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