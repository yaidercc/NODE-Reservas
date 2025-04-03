const DomainUserFinder = require("../../domain/UserFinder");

class UserDeleter {
    #repository;
    #finder;
    constructor(repository) {
        this.#repository = repository;
        this.#finder = new DomainUserFinder(repository);
    }


    async execute(id, dto) {
        if(!id) throw new Error(`id cannot be null`);

        const user = await this.#finder.execute(id);
        if(!user) throw new Error(`user doesn't exist`);

        user.delete(dto);

        await this.#repository.delete(user);

        user.flushChanges();
    }
}

module.exports = UserDeleter;