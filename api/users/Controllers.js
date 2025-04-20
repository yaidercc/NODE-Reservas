const {UserCreator, UserFinder, UserDeleter} = require("../../src/core/users");
const HttpResponses = require("../../src/shared/httpResponses/HttpResponses");
const {validate: validateUuid} = require("uuid");
const UserUpdater = require("../../src/core/users/application/update/UserUpdater");
const UserSearcher = require("../../src/core/users/application/search/UserSearcher");
const UserLogin = require("../../src/core/users/application/login/UserLogin");

class UserController {
    #repository;

    constructor(repository) {
        this.#repository = repository
    }

    create = async (req, res) => {
        try {
            const {body: userInfo} = req;
            const response = await new UserCreator(this.#repository).execute({
                ...userInfo,
                created_at: new Date().toISOString()
            });
            if (!response.success) {
                const {errors} = response
                return HttpResponses.badResponseByCode(response.code, {errors, res})
            }
            return HttpResponses.created({res})

        } catch (error) {
            console.log(error)
            return HttpResponses.internalServerError({errors: error.message, res})
        }
    }

    search = async (req, res) => {
        try {
            const {body: dtoCriteria} = req;
            const user = await new UserSearcher(this.#repository).execute(dtoCriteria);
            return HttpResponses.ok({res, ...user.toJson()})

        } catch (error) {
            console.log(error.message)
            return HttpResponses.internalServerError({errors: error.errors, res})
        }
    }

    login = async (req, res) => {
        try {
            const {body: loginInfo} = req;
            const response = await new UserLogin(this.#repository).execute(loginInfo);
            if (!response.success) {
                const {errors, code} = response
                return HttpResponses.badResponseByCode(code, {errors, res})
            }
            const {data} = response
            return HttpResponses.ok({res, data})

        } catch (error) {
            console.log(error.message)
            return HttpResponses.internalServerError({errors: error.message, res})
        }
    }

    update = async (req, res) => {
        try {
            const {body: userInfo, user} = req;
            const {id} = req.params;

            if (!validateUuid(id)) {
                return HttpResponses.badRequest({errors: "El id es invalido", res})
            }

            if (userInfo?.role === "admin" && user.role !== userInfo.role) {
                return HttpResponses.forbidden({errors: "You cannot change your role without admin permissions", res})
            }

            const response = await new UserUpdater(this.#repository).execute(id, {
                ...userInfo,
                updated_at: new Date().toISOString()
            });
            if (!response.success) {
                const {errors, code} = response
                return HttpResponses.badResponseByCode(code, {errors, res})
            }
            return HttpResponses.ok({res})

        } catch (error) {
            console.log(error)
            return HttpResponses.internalServerError({errors: error.message, res})
        }
    }

    find = async (req, res) => {
        try {
            const {id} = req.params;

            if (!validateUuid(id)) {
                return HttpResponses.badRequest({errors: "El id es invalido", res})
            }

            const response = await new UserFinder(this.#repository).execute(id);

            if (!response.success) {
                const {errors, code} = response
                return HttpResponses.badResponseByCode(code, {errors, res})
            }
            const {user} = response

            return HttpResponses.ok({res, ...user.toJson()})

        } catch (error) {
            console.log(error)
            return HttpResponses.internalServerError({errors: error.errors, res})
        }
    }

    delete = async (req, res) => {
        try {
            const {id} = req.params;

            if (!validateUuid(id)) {
                return HttpResponses.badRequest({errors: "El id es invalido", res})
            }

            const dto = {
                deleted_at: new Date().toISOString()
            };

            const response = await new UserDeleter(this.#repository).execute(id, dto);

            if (!response.success) {
                const {errors, code} = response
                return HttpResponses.badResponseByCode(code, {errors, res})
            }
            return HttpResponses.ok({res})

        } catch (error) {
            console.log(error)
            return HttpResponses.internalServerError({errors: error.errors, res})
        }
    }

    index = async (req, res) => {
        try {

            const dtoCriteria = {
                filter: [
                    {
                        field: "deleted_at",
                        operator: "null",
                        value: '',
                        type: "AND"
                    },
                ],
                limit: 10,
                offset: 0,
                order: {
                    field: 'created_at',
                    direction: 'desc',
                },
            };


            const user = await new UserSearcher(this.#repository).execute(dtoCriteria);
            return HttpResponses.ok({res, ...user.toJson()})

        } catch (error) {
            console.log(error.message)
            return HttpResponses.internalServerError({errors: error.errors, res})
        }
    }
}

module.exports = UserController;