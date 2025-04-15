const {FILTER_TYPE} = require("../criteria/filter/ValueObjectFilterType");
const {COMPARISION_OPERATORS} = require("../criteria/filter/ValueObjectFilterOperator");
const Joi = require("joi")

const filter = Joi.object({
    field: Joi.string().required(),
    operator: Joi.string()
        .valid(...Object.keys(COMPARISION_OPERATORS))
        .required(),
    value: Joi.alternatives().try(Joi.string(), Joi.number()).required().allow(''),
    type: Joi.string()
        .valid(...Object.values(FILTER_TYPE))
        .required()
})

const SearchSchema = Joi.object({
    filter: Joi.array().items(filter).allow(null),
    limit: Joi.number().required().allow(null),
    offset: Joi.number().required().allow(null),
    order: Joi.object().allow(null),
})

module.exports = SearchSchema