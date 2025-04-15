const {Guards} = require("./index");

class ValueObjectEnum {
    #value;

    constructor(field, value, validValues, nullable = false) {
        if(!nullable && !value) {
            throw new Error(`${field}: The value cannot be null`);
        }
        if(nullable && !value) {
            return;
        }
        Guards.enumValue(value, validValues);
        this.#value = value;
        this.field = field;
        Object.freeze(this);
    }

    get value() {
        return this.#value;
    }
}
module.exports = ValueObjectEnum;