const ValueObject = require("../../valueObjects/valueObject");

class ValueObjectFilterValue extends ValueObject {
    constructor(value) {
        super("valor filtro",value);
    }

}

module.exports = ValueObjectFilterValue