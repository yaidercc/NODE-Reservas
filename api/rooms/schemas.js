const Joi = require('joi');

const schemaBase = {
    name: Joi.string().max(30).required()
}

const createSchema = Joi.object({
    id: Joi.string().uuid().required(),
    ...schemaBase,
    created_at: Joi.date()
});

const updateSchema = Joi.object({
    ...schemaBase,
});

module.exports = {createSchema, updateSchema};