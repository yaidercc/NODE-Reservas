const {ValueObjectId, ValueObjectTimeStamp} = require("../valueObjects");

class AggregateRoot {
    /** @type {ValueObjectId} */
    #id;
    /** @type {ValueObjectId} */
    #created_at = null;
    /** @type {ValueObjectTimeStamp} */
    #updated_at = null;
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
        if (!dto.hasOwnProperty('deleted_at')) {
            throw new Error("deleted_at cannot be null.");
        }
        this.deleted_at = dto.deleted_at;

    }

    get created_at() {
        return this.#created_at;
    }
    get updated_at() {
        return this.#updated_at;
    }
    get deleted_at() {
        return this.#deleted_at;
    }
    set created_at(value) {
        if (this.#created_at === null || this.#created_at === undefined) {
            this.#created_at = new ValueObjectTimeStamp('created at', value);
        }
    }
    set updated_at(value) {
        this.#updated_at = new ValueObjectTimeStamp('updated at', value, true);
        if (value !== null && value !== undefined) {
            this.#changedAttributes.updated_at = this.#updated_at.value;
        }
    }

    set deleted_at(value) {
        this.#deleted_at = new ValueObjectTimeStamp('deleted at', value, true);
        if (value !== null && value !== undefined) {
            this.#changedAttributes.deleted_at = this.#deleted_at.value;
        }
    }
}

module.exports = AggregateRoot;