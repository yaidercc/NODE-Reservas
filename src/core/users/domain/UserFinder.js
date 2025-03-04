const ValueObjectId = require("../../../shared/valueObjects/valueObjectId")
class UserFinder {
    #repository;

    constructor(repository) {
        this.#repository = repository;
    }

    /**
     * @param {string} id
     * @return {Promise<Ans>}
     */
    async execute(id) {
        return this.#repository.find(new ValueObjectId('id', id));
    }
}


module.exports = UserFinder
