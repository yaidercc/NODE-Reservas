const ValueObjectInt = require("../valueObjects/valueObjectInt");
const OrderByCriteria = require("./orderBy/OrderByCriteria");
const Filters = require("./filter/Filters");
const {FILTER_TYPE} = require("./filter/ValueObjectFilterType");
const {COMPARISION_OPERATORS} = require("./filter/ValueObjectFilterOperator");

class Criteria {

    #filters;
    #order;
    #limit;
    #offset;

    constructor(filters, order, limit, offset) {
        this.#filters = !filters ? filters : Filters.fromValues(filters);
        this.#order = !order ? null : new OrderByCriteria(limit);
        this.#offset = !offset ? null : new ValueObjectInt("offset", offset);
        this.#limit = !limit ? null : new ValueObjectInt("order", order);
    }

    get limit() {
        return this.#limit.value;
    }

    get order() {
        return this.#order.value;
    }

    get offset() {
        return this.#offset.value;
    }

    convertToKnex(knexQuery, table = null) {

        this.#filters.filters.forEach((filter) => this.#converFiltersToKnex(knexQuery, filter))

        if (this.limit) {
            knexQuery.limit(this.limit);
        }

        if (this.offset) {
            knexQuery.offset(this.offset);
        }

        if (table) knexQuery.order(`${table}.${this.order.field}`, this.order.direction);
        else knexQuery.order(this.order.field, this.order.direction);
    }

    #converFiltersToKnex(KnexQuery, filter) {
        this.validateLikeOrIlikeOperator(filter);
        this.validateInNotInOperator(filter);
        this.validateBetweenOperator(filter);

        const andCondition = {
            "null": ()=> KnexQuery.whereNull(filter.field.value),
            "notNull": ()=> KnexQuery.whereNotNull(filter.field.value),
            "between": ()=> KnexQuery.andWhereBetween(filter.field.value, filter.value.value),
        }
        const orCondition = {
            "null": ()=> KnexQuery.orWhereNull(filter.field.value),
            "notNull": ()=> KnexQuery.orWhereNotNull(filter.field.value),
            "between": ()=> KnexQuery.orWhereBetween(filter.field.value, filter.value.value),
        }

        if(filter.type.value === FILTER_TYPE.AND) andCondition[filter.operator]()
        if(filter.type.value === FILTER_TYPE.OR) orCondition[filter.operator]()
    }

    validateLikeOrIlikeOperator(filter){
        if(filter.operator.value === COMPARISION_OPERATORS.like || filter.operator.value === COMPARISION_OPERATORS.ilike){
            filter.setValue(`%${filter.value.value}%`)
        }
    }

    validateInNotInOperator(filter){
        if(filter.operator.value === COMPARISION_OPERATORS.notIn || filter.operator.value === COMPARISION_OPERATORS.in) {
            filter.setValue(filter.operator.value.split(", "))
        }
    }

    validateBetweenOperator(filter){
        if(filter.operator.value === COMPARISION_OPERATORS.between){
            const valuesSplited = filter.value.split(", ");
            if(valuesSplited.length !== 2){
                throw new Error("Between must have 2 values");
            }

            filter.setValue(valuesSplited);
        }
    }


}

module.exports = Criteria;