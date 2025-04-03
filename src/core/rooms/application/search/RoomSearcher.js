const Criteria = require("../../../../shared/criteria/Criteria");
const RoomCollectionResponse = require("../RoomCollectionResponse");

class RoomSearcher {
    #repository;
    constructor(repository) {
        this.#repository = repository;
    }

    async execute({filter, order, limit, offset}) {
        const criteria = new Criteria(filter, order, limit, offset);
        const rooms = await this.#repository.search(criteria);

        return new RoomCollectionResponse(rooms);
    }
}

module.exports = RoomSearcher;