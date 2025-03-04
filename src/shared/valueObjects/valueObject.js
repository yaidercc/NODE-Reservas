class ValueObject {
    #value;

    constructor(field, value) {
        this.#value = value;
        this.field = field;
        Object.freeze(this);
    }

    get value() {
        return this.#value;
    }
}
module.exports = ValueObject;