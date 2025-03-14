const { KnexUserRepository, UserCreator, UserFinder} = require( "../../src/core/users");
const { development: knexConfig } = require("../../src/config/database/knexfile");
const HttpResponses = require("../../src/shared/httpResponses/httpResponses");
const {validate: validateUuid} = require("uuid");
const UserUpdater = require("../../src/core/users/application/update/UserUpdater");
const UserSearcher = require("../../src/core/users/application/search/UserSearcher");

class UserController {
    #repository;
    constructor() {
        this.#repository = new KnexUserRepository(knexConfig);
    }

    create = async ( req, res ) => {
        try {
            const { body: userInfo } = req;
            await new UserCreator(this.#repository).execute({...userInfo, created_at: new Date().toISOString()});
            return HttpResponses.created({res})

        }catch (error) {
            console.log(error.message)
            return HttpResponses.internalServerError({errors: error.message, res})
        }
    }

    update = async ( req, res ) => {
        try {
            const { body: userInfo } = req;
            const { id } = req.params;

            if(!validateUuid(id)){
                return HttpResponses.badRequest({errors: "El id es invalido", res})
            }

            await new UserUpdater(this.#repository).execute(id, {...userInfo, updated_at: new Date().toISOString()});
            return HttpResponses.ok({res})

        } catch (error) {
            console.log(error.message)
            return HttpResponses.internalServerError({errors: error.message, res})
        }
    }

    find = async ( req, res ) => {
        try {
            const { id } = req.params;

            if(!validateUuid(id)){
                return HttpResponses.badRequest({errors: "El id es invalido", res})
            }

            const user = await new UserFinder(this.#repository).execute(id);
            return HttpResponses.ok({res, ...user.toJson() })

        } catch (error) {
            console.log(error.message)
            return HttpResponses.internalServerError({errors: error.message, res})
        }
    }

    index = async ( req, res ) => {
        try {

            const dtoCriteria = {
                filter: undefined,
                limit: 10,
                offset: 0,
                order: {
                    field: 'created_at',
                    direction: 'desc',
                },
            };


            const user = await new UserSearcher(this.#repository).execute(dtoCriteria);
            return HttpResponses.ok({res, ...user.toJson() })

        } catch (error) {
            console.log(error.message)
            return HttpResponses.internalServerError({errors: error.message, res})
        }
    }
}

module.exports = UserController;