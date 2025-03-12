const DomainUserFinder = require("../../domain/UserFinder") ;
const User = require("../../domain/User");

class UserCreator {
    #repository;
    #finder;

    constructor(repository) {
        this.#repository = repository;
        this.#finder = new DomainUserFinder(repository);
    }

    async execute(dto) {
        if (!dto) throw new Error(`dto cannot be null`);

        const existsUser = await this.#finder.execute(dto.id)
        if (existsUser) {
            throw new Error(`User already exists`);
        }
        const user = new User(dto);
        await this.#repository.save(user);
    }
}

module.exports = UserCreator;