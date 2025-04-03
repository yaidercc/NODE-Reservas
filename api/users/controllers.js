const { UserCreator, UserFinder, UserDeleter} = require( "../../src/core/users");
const HttpResponses = require("../../src/shared/httpResponses/httpResponses");
const {validate: validateUuid} = require("uuid");
const UserUpdater = require("../../src/core/users/application/update/UserUpdater");
const UserSearcher = require("../../src/core/users/application/search/UserSearcher");
const UserLogin = require("../../src/core/users/application/login/UserLogin");

class UserController {
    #repository;
    constructor(repository) {
        this.#repository = repository
    }

    create = async ( req, res ) => {
        try {
            const { body: userInfo } = req;
            await new UserCreator(this.#repository).execute({...userInfo, created_at: new Date().toISOString()});
            return HttpResponses.created({res})

        }catch (error) {
            console.log(error)
            return HttpResponses.internalServerError({errors: error.message, res})
        }
    }

    search = async ( req, res ) => {
        try {
            const { body: dtoCriteria } = req;
            const user = await new UserSearcher(this.#repository).execute(dtoCriteria);
            return HttpResponses.ok({res, ...user.toJson() })

        }catch (error) {
            console.log(error.message)
            return HttpResponses.internalServerError({errors: error.errors, res})
        }
    }

    login = async ( req, res ) => {
        try {
            const { body: loginInfo } = req;
            const user = await new UserLogin(this.#repository).execute(loginInfo);
            return HttpResponses.ok({res, ...user })

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
            console.log(error)
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
            console.log(error)
            return HttpResponses.internalServerError({errors: error.errors, res})
        }
    }

    delete = async ( req, res ) => {
        try {
            const { id } = req.params;

            if(!validateUuid(id)){
                return HttpResponses.badRequest({errors: "El id es invalido", res})
            }

            const dto = {
                deleted_at: new Date().toISOString()
            };

            await new UserDeleter(this.#repository).execute(id, dto);
            return HttpResponses.ok({res})

        } catch (error) {
            console.log(error)
            return HttpResponses.internalServerError({errors: error.errors, res})
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
            return HttpResponses.internalServerError({errors: error.errors, res})
        }
    }
}

module.exports = UserController;