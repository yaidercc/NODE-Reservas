const Criteria = require("../../../../shared/criteria/Criteria");
const ReservationCollectionResponse = require("../ReservationsCollectionResponse");

class ReservationSearcher {
    #repository;
    constructor(repository) {
        this.#repository = repository;
    }

    async execute({filter, order, limit, offset}) {
        const criteria = new Criteria(filter, order, limit, offset);
        const rooms = await this.#repository.search(criteria);

        return new ReservationCollectionResponse(rooms);
    }
}

module.exports = ReservationSearcher;