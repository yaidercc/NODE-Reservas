const DomainUserFinder = require("../../domain/UserFinder") ;
const User = require("../../domain/User");
const bcryptjs = require("bcryptjs");
class UserCreator {
    #repository;
    #finder;

    constructor(repository) {
        this.#repository = repository;
        this.#finder = new DomainUserFinder(repository);
    }

    async execute(dto) {
        if (!dto) throw new Error(`User don´t existsdto cannot be null`);

        const existsUser = await this.#finder.execute(dto.id)
        if (existsUser) {
            throw new Error(`User already exists`);
        }
        const salt = bcryptjs.genSaltSync();
        const encriptedPassword  = bcryptjs.hashSync(dto.password, salt);

        const user = new User({...dto, password: encriptedPassword});
        await this.#repository.save(user);
    }
}

module.exports = UserCreator;