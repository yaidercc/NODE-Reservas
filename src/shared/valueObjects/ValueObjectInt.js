const ValueObject = require("./ValueObject");
const {validate} = require("uuid");
const Guards = require("./Guards");

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