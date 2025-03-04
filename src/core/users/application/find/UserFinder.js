const DomainUserFinder = require("../../domain/UserFinder");

class UserFinder {

    #finder;
    constructor (repository) {
        this.#finder = new DomainUserFinder(repository)
    }

    async execute(id){
        const result = this.#finder.execute(id);
        return result;
    }
}

module.exports = UserFinder;