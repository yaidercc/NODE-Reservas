const Guards = require("./guards");
const ValueObjectString = require("./valueObjectString");

export class valueObjectEmail extends ValueObjectString {
    constructor(field, value, nullable = false) {
        super(field, value);

        if(nullable) return;

        Guards.validateEmail(this);
    }
}