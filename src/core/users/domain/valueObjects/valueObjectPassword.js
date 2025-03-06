const {ValueObjectString,Guards} = require("../../../../shared/valueObjects");

class valueObjectPassword extends ValueObjectString {
    constructor(field, value, nullable = false) {
        super(field, value);

        if(nullable) return;

        Guards.validatePassword(this);
    }
}
module.exports = valueObjectPassword;