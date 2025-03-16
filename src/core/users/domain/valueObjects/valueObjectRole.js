const ValueObjectEnum = require("../../../../shared/valueObjects/valueObjectEnum");
const UserMother = require("../../../../tests/users/domain/usersMother");
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