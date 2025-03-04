const ValueObject = require("./valueObject");

class ValueObjectTimeStamp extends ValueObject {
    constructor(field, value, nullable = false) {
        super(field, value);
        if(!value && !nullable) {
            throw new Error(`${this.field}: The value cannot be null`);
        }
        value = new Date(value);
        this.#ensureIsTimestamp(value);
    }

    #ensureIsTimestamp(value) {
        if (value.toString() === 'Invalid Date') {
            throw new Error(`${this.field}: Invalid value ${value} for object timestamp`);
        }
    }
}

module.exports = ValueObjectTimeStamp;