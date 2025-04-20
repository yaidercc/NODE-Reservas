const Joi = require('joi');

const schemaBase = {
    name: Joi.string().max(30).required(),
    last_name: Joi.string().max(30).required(),
    email: Joi.string().max(100).required(),
    password: Joi.string().max(30).required()
}

const createSchema = Joi.object({
    id: Joi.string().uuid().required(),
    ...schemaBase,
    created_at: Joi.date()
});

const updateSchema = Joi.object({
    name: Joi.string().max(30),
    last_name: Joi.string().max(30),
    email: Joi.string().max(100),
    password: Joi.string().max(30),
    role: Joi.string().valid('admin', 'client')
});

const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});
module.exports = {createSchema, updateSchema, loginSchema};