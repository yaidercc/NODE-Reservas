const ValueObjectInt = require("../valueObjects/ValueObjectInt");
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
        this.#order = !order ? null : new OrderByCriteria(order);
        this.#offset = !offset ? null : new ValueObjectInt("offset", offset);
        this.#limit = !limit ? null : new ValueObjectInt("limit", limit);
    }

    get limit() {
        return this.#limit?.value || 0;
    }

    get order() {
        return {
            field: this.#order.field.value,
            direction: this.#order.direction.value,
        }
    }

    get offset() {
        return this.#offset?.value || 0;
    }

    convertToKnex(knexQuery, table = null) {

        this.#filters?.filters?.forEach((filter) => this.#converFiltersToKnex(knexQuery, filter))


        if (this.limit) {
            knexQuery.limit(this.limit);
        }


        if (this.offset) {
            knexQuery.offset(this.offset);
        }

        if (table) knexQuery.orderBy(`${table}.${this.order.field}`, this.order.direction);
        else knexQuery.orderBy(this.order.field, this.order.direction);
    }

    #converFiltersToKnex(KnexQuery, filter) {
        this.validateLikeOrIlikeOperator(filter);
        this.validateInNotInOperator(filter);
        this.validateBetweenOperator(filter);

        const andCondition = {
            "null": () => KnexQuery.whereNull(filter.field.value),
            "notNull": () => KnexQuery.whereNotNull(filter.field.value),
            "between": () => KnexQuery.andWhereBetween(filter.field.value, filter.value.value),
            "default": () => KnexQuery.where(filter.field.value,filter.operator.value, filter.value.value) // Fallback
        };

        const orCondition = {
            "null": () => KnexQuery.orWhereNull(filter.field.value),
            "notNull": () => KnexQuery.orWhereNotNull(filter.field.value),
            "between": () => KnexQuery.orWhereBetween(filter.field.value, filter.value.value),
            "default": () => KnexQuery.orWhere(filter.field.value,filter.operator.value, filter.value.value) // Fallback
        };

        if(filter.type.value === FILTER_TYPE.AND) {
            if(andCondition[filter.operator.value]) andCondition[filter.operator.value]()
            else andCondition["default"]()


        }
        if(filter.type.value === FILTER_TYPE.OR) {
            if(orCondition[filter.operator.value]) orCondition[filter.operator.value]()
            else orCondition["default"]()
        }
    }

    validateLikeOrIlikeOperator(filter){
        if(filter.operator.value === COMPARISION_OPERATORS.like || filter.operator.value === COMPARISION_OPERATORS.ilike){
            filter.setValue(`%${filter.value.value}%`)
        }
    }

    validateInNotInOperator(filter){
        if(filter.operator.value === COMPARISION_OPERATORS.notIn || filter.operator.value === COMPARISION_OPERATORS.in) {
            filter.setValue(filter.value.value.split(", "))
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