const { KnexUserRepository, UserCreator} = require( "../../src/core/users");
const { development: knexConfig } = require("../../src/config/database/knexfile");
const HttpResponses = require("../../src/shared/httpResponses/httpResponses");
class UserController {
    #repository;
    constructor() {
        this.#repository = new KnexUserRepository(knexConfig);
    }

    create = async ( req, res ) => {
        try {
            const { body: userInfo } = req;
            await new UserCreator(this.#repository).execute(userInfo);
            return HttpResponses.created({res})

        }catch (error) {
            console.log(error)
            return HttpResponses.internalServerError({errors: error, res})
        }
    }
}

module.exports = UserController;