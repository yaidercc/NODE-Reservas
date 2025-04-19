const bcryptjs = require("bcryptjs");
const generateJWT = require("../../../../shared/jwt/GenerateJWT");
const UserResponse = require("../UserResponse");
const valueObjectEmail = require("../../domain/valueObjects/ValueObjectEmail");

class UserLogin {
    #repository;

    constructor(repository) {
        this.#repository = repository;
    }

    async execute({email, password}) {
        if (!email || !password) throw new Error(`email and password must be provided.`);

        const user = await this.#repository.find(new valueObjectEmail(email));

        if (!user || user.deleted_at.value) {
            return {
                success: false,
                code: 404,
                errors: "User does not exists"
            }

        }

        const isThePasswordCorrect = bcryptjs.compareSync(password, user.password.value);

        if (!isThePasswordCorrect) {
            return {
                success: false,
                code: 400,
                errors: "Email or password are incorrect."
            }
        }

        const token = await generateJWT(user.id.value);

        return {
            success: true,
            data: {
                user: new UserResponse(user).toJson().data,
                token
            }
        }


    }
}

module.exports = UserLogin
