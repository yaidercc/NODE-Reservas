
const ValueObjectEnum = require("../../valueObjects/ValueObjectEnum");
const FILTER_TYPE = {
    AND: "AND",
    OR: "OR",
}
class ValueObjectFilterType extends ValueObjectEnum {
    constructor(operator) {
        super("type",operator,FILTER_TYPE);
    }

    static fromValues(value) {
        for(const operatorValue of Object.values(FILTER_TYPE)) {
            if(operatorValue === value) {
                return new ValueObjectFilterType(value);
            }
        }

        throw new Error(`the filter type ${value} is not a valid type`);
    }
}

module.exports = {ValueObjectFilterType, FILTER_TYPE};