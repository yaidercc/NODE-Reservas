const ValueObjectEnum = require("../../valueObjects/valueObjectEnum");
const COMPARISION_OPERATORS = {
    eq: "=",
    neq: "!=",
    gt: ">",
    gte: ">=",
    lt: '<',
    lte: '<=',
    between: 'between',
    in: 'in',
    notIn: 'not in',
    like: 'like',
    ilike: 'ilike',
    null: 'null',
    notNull: 'notNull',
}
class ValueObjectFilterOperator extends ValueObjectEnum {
    constructor(operator) {
        super("operator",operator,Object.values(COMPARISION_OPERATORS));
    }

    static fromValues(value) {
        for(const operatorValue of Object.keys(COMPARISION_OPERATORS)) {
            if(operatorValue === value) {
                return new ValueObjectFilterOperator(COMPARISION_OPERATORS[operatorValue]);
            }
        }

        throw new Error(`the filter operator: ${value}, is not a valid operator`);
    }
}

module.exports = {
    ValueObjectFilterOperator,
    COMPARISION_OPERATORS
};