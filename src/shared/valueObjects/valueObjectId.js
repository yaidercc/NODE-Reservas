const ValueObject = require("./valueObject");
const {validate} = require("uuid");

class ValueObjectId extends ValueObject {
    constructor(field, value, nullable = false) {
        super(field,value);

        if(!value && !nullable) {
            throw new Error(`${this.field}: the value cannot be null.`);
        }

        this.#ensureValueObjectUuid(value)
    }

    #ensureValueObjectUuid(value){
        if(!validate(value)){
            throw new Error(`${this.field}: Invalid value ${value} for object uuid`);
        }
    }

}

module.exports = ValueObjectId;