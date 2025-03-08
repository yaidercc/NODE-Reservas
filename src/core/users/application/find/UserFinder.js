const DomainUserFinder = require("../../domain/UserFinder");
const UserResponse = require("../UserResponse");

class UserFinder {

    #finder;
    constructor (repository) {
        this.#finder = new DomainUserFinder(repository)
    }

    async execute(id){
        const user = await this.#finder.execute(id);
        return new UserResponse(user);
    }
}

module.exports = UserFinder;