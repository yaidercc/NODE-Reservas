const {ValueObjectString,Guards} = require("../../../../shared/valueObjects");

class valueObjectPassword extends ValueObjectString {
    constructor(value, nullable = false) {
        super("password", value);

        if(nullable) return;

        Guards.validatePassword(this);
    }
}
module.exports = valueObjectPassword;