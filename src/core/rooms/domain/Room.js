const AggregateRoot = require("../../../shared/domain/aggregateRoot");
const ValueObjectString = require("../../../shared/valueObjects/valueObjectString");

class Room extends AggregateRoot{
    /** @type {ValueObjectString} */
    #name;

    constructor({id, name,created_at, updated_at, deleted_at}) {
        super(id);
        this.#name = new ValueObjectString("name",name)
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.deleted_at = deleted_at;
    }

    static create(dto) {
        return new Room(dto)
    }

    get name() {
        return this.#name;
    }

    set name (newName) {
        if(newName !== this.#name.value) {
            this.#name = new ValueObjectString("name", newName);
            this.changedAttributes.name = newName;
        }
    }

}

module.exports = Room