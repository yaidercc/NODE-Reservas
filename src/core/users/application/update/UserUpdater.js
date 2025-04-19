const DomainUserFinder = require("../../domain/UserFinder");
const valueObjectEmail = require("../../domain/valueObjects/ValueObjectEmail");

class UserUpdater {
    #repository;
    #finder;

    constructor(repository) {
        this.#repository = repository;
        this.#finder = new DomainUserFinder(repository);
    }

    async execute(id, dto) {
        if (!dto) throw new Error("dto cannot be null")

        const user = await this.#finder.execute(id);
        if (!user) {
            return {
                success: false,
                code: 404,
                errors: "User does not exist"
            }
        }

        if (dto?.email) {
            const existsEmail = await this.#repository.find(new valueObjectEmail(dto.email));
            if (existsEmail && existsEmail.id.value !== id && !existsEmail.deleted_at.value) {
                return {
                    success: false,
                    code: 400,
                    errors: "Email already exists"
                }
            }
        }

        user.update(dto);

        await this.#repository.update(user);
        return {
            success: true
        }
    }
}

module.exports = UserUpdater;