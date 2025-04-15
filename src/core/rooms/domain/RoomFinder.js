const ValueObjectId = require("../../../shared/valueObjects/ValueObjectId");

class RoomsFinder {
    #repository;
    constructor(repository) {
        this.#repository = repository;
    }
    async execute(id) {
        return this.#repository.find(new ValueObjectId('id', id));
    }
}

module.exports = RoomsFinder;