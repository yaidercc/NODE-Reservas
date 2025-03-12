const DomainUserFinder = require("../../domain/UserFinder");
const UserResponse = require("../UserResponse");

class UserFinder {

    #finder;
    constructor (repository) {
        this.#finder = new DomainUserFinder(repository)
    }

    async execute(id){
        const user = await this.#finder.execute(id);
        if(!user || user.deleted_at.value){
            throw new Error("User don´t exists");
        }
        return new UserResponse(user);
    }
}

module.exports = UserFinder;