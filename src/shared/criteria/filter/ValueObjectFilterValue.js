const ValueObject = require("../../valueObjects/ValueObject");

class ValueObjectFilterValue extends ValueObject {
    constructor(value) {
        super("valor filtro",value);
    }

}

module.exports = ValueObjectFilterValue