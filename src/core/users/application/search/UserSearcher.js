const Criteria = require("../../../../shared/criteria/Criteria");
const UserCollectionResponse = require("../UserCollectionResponse");

class UserSearcher {
    #repository;

    constructor(repository) {
        this.#repository = repository;
    }

    async execute({filter, order, limit, offset}) {
        const criteria = new Criteria(filter, order, limit, offset);
        const rows = await this.#repository.search(criteria);

        return new UserCollectionResponse(rows)
    }
}

module.exports = UserSearcher;