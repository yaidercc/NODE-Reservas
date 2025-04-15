const ValueObject = require("./ValueObject");
const Guards = require("./Guards");

class ValueObjectString extends ValueObject {
    constructor(field, value, nullable = false) {
        super(field, value);

        if(!value && !nullable) {
            throw  new Error(`${field}: The value cannot be null`);
        }
        Guards.stringType(this);
        return;
    }
}
module.exports = ValueObjectString;