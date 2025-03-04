const ValueObject = require("./valueObject");
const Guards = require("./guards");

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