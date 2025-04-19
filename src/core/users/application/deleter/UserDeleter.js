const DomainUserFinder = require("../../domain/UserFinder");

class UserDeleter {
    #repository;
    #finder;

    constructor(repository) {
        this.#repository = repository;
        this.#finder = new DomainUserFinder(repository);
    }


    async execute(id, dto) {
        if (!id) {
            return {
                success: false,
                code: 400,
                errors: "id cannot be null"
            }
        }

        const user = await this.#finder.execute(id);
        if (!user) {
            return {
                success: false,
                code: 404,
                errors: "user does not exist"
            }
        }

        user.delete(dto);

        await this.#repository.delete(user);

        user.flushChanges();
        return {
            success: true
        }
    }
}

module.exports = UserDeleter;