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
            return {
                success: false,
                code: 404,
                errors: "user does not exist"

            }
        }
        return {
            success: true,
            user: new UserResponse(user)
        }
    }
}

module.exports = UserFinder;