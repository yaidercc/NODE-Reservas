const ValueObjectString = require("../../valueObjects/valueObjectString");
const {ValueObjectFilterOperator} = require("./ValueObjectFilterOperator");
const {ValueObjectFilterType} = require("./ValueObjectFilterType");
const ValueObjectFilterValue = require("./ValueObjectFilterValue");

class FiltersCriteria {

    constructor(field, operator, value, type) {
        this.field = field;
        this.operator = operator;
        this.value = value;
        this.type = type;
    }

    static fromValues(values) {
        if (!values.field || !values.operator || !values.value  || !values.type) {
            throw new Error('Filter must have field, operator, value, type');
        }

        return new FiltersCriteria(
            new ValueObjectString('field',values.field),
            ValueObjectFilterOperator.fromValues(values.operator),
            new ValueObjectFilterValue(values.value),
            ValueObjectFilterType.fromValues(values.type)
        )
    }

    setValue(value) {
        this.value = new ValueObjectFilterValue(value);
    }
}

module.exports = FiltersCriteria;