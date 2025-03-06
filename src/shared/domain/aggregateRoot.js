const {ValueObjectId, ValueObjectTimeStamp} = require("../valueObjects");

class AggregateRoot {
    /** @type {ValueObjectId} */
    #id;
    /** @type {ValueObjectId} */
    #created_by = null;
    /** @type {ValueObjectTimestamp} */
    #updated_by = null;
    /** @type {ValueObjectTimestamp} */
    #created_at = null;
    /** @type {ValueObjectTimeStamp} */
    #updated_at = null;
    /** @type {ValueObjectId} */
    #deleted_by = null;
    /** @type {ValueObjectTimestamp} */
    #deleted_at = null;
    /** @type {object} */
    #changedAttributes;

    constructor(id) {
        this.#id = new ValueObjectId('id',id);
        this.#changedAttributes = {};
    }

    get id() {
        return this.#id;
    }

    get changedAttributes() {
        return this.#changedAttributes;
    }

    flushChanges() {
        this.#changedAttributes = {};
    }

    update(dto) {
        Object.entries(dto).forEach(([key, value]) => {
            const currentValue =  typeof this[key]?.value === 'object'
                ? JSON.stringify(this[key]?.value)
                : this[key]?.value;

            const newValue = typeof value === 'object' ? JSON.stringify(value) : value;

            if (currentValue !== newValue) this[key] = value;

        })
    }

    delete(dto) {
        if (!dto.hasOwnProperty('deleted_at') || !dto.hasOwnProperty('deleted_by')) {
            throw new Error("Element has already been deleted.");
        }
        this.deleted_at = dto.deleted_at;
        this.deleted_by = dto.deleted_by;
    }
}

module.exports = AggregateRoot;