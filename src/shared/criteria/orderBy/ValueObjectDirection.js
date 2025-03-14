const ValueObjectEnum = require("../../valueObjects/valueObjectEnum");

const VALID_DIRECTIONS = {
    DESC: 'desc',
    ASC: 'asc'
}

class ValueObjectDirection extends ValueObjectEnum {
    constructor(direction) {
        super("direction", direction.toLowerCase(), Object.values(VALID_DIRECTIONS));
    }
    static fromValues(value) {
        for(const direction of Object.values(VALID_DIRECTIONS)) {
            if(value.toLowerCase() === direction) {
                return new ValueObjectDirection(value);
            }
        }
        throw new Error(`the direction: ${value}, is not a valid direction`);
    }
}

module.exports = {
    ValueObjectDirection,
    VALID_DIRECTIONS
};