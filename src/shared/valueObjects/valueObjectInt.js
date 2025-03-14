const ValueObject = require("./valueObject");
const {validate} = require("uuid");
const Guards = require("./guards");

class ValueObjectInt extends ValueObject {
    constructor(field, value, nullable = false) {
        super(field,value);

        if(!value && !nullable) {
            throw new Error(`${this.field}: the value cannot be null.`);
        }

        Guards.integerType(this)
    }

}

module.exports = ValueObjectInt;