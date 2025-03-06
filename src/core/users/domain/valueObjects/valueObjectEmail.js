
const {ValueObjectString,Guards} = require("../../../../shared/valueObjects");

class valueObjectEmail extends ValueObjectString {
    constructor(field, value, nullable = false) {
        super(field, value);

        if(nullable) return;

        Guards.validateEmail(this);
    }
}
module.exports = valueObjectEmail;