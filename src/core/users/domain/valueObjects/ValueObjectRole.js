const ValueObjectEnum = require("../../../../shared/valueObjects/ValueObjectEnum");

const VALID_ROLES = {
    ADMIN: "admin",
    CLIENT: "client",
}
class ValueObjectRole extends ValueObjectEnum{
    constructor(value) {
        super("role",value,VALID_ROLES,true);
    }
}

module.exports = ValueObjectRole;