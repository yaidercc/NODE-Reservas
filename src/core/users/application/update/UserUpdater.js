const DomainUserFinder = require("../../domain/UserFinder");

class UserUpdater {
    #repository;
    #finder;

    constructor(repository) {
        this.#repository = repository;
        this.#finder = new DomainUserFinder(repository);
    }
   async execute(id, dto) {
        if(!dto) throw new Error("dto cannot be null")

        const user = await this.#finder.execute(id);
        if(!user) throw new Error("user not exists")

        user.update(dto);

        await this.#repository.update(user);


    }
}

module.exports = UserUpdater;