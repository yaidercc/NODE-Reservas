const Joi = require('joi');

const createSchema = Joi.object({
    id: Joi.string().uuid().required(),
    name: Joi.string().max(30).required(),
    last_name: Joi.string().max(30).required(),
    email: Joi.string().max(100).required(),
    password: Joi.string().max(30).required()
});

module.exports = {createSchema};