
const {ValueObjectString,Guards} = require("../../../../shared/valueObjects");

class valueObjectEmail extends ValueObjectString {
    constructor(value, nullable = false) {
        super("email", value);

        if(nullable) return;

        Guards.validateEmail(this);
    }
}
module.exports = valueObjectEmail;