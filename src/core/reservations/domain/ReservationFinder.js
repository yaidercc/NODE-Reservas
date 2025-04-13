const ValueObjectId = require("../../../shared/valueObjects/valueObjectId");

class ReservationFinder {
    #repository;

    constructor(repository) {
        this.#repository = repository;
    }

    async execute(id) {
        return this.#repository.find(new ValueObjectId('id', id));
    }
}

module.exports = ReservationFinder;