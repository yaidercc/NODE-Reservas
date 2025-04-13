const HttpResponses = require("../../src/shared/httpResponses/httpResponses");
const {RoomSearcher, RoomsCreator, RoomFinder, RoomDeleter} = require("../../src/core/rooms");
const RoomUpdater = require("pg/lib/connection");
const {validate: validateUuid} = require("uuid");

class RoomsControllers {
    #repository;
    constructor(repository) {
        this.#repository = repository;
    }
    create = async ( req, res ) => {
        try {
            const { body: roomInfo } = req;
            await new RoomsCreator(this.#repository).execute({...roomInfo, created_at: new Date().toISOString()});
            return HttpResponses.created({res})

        }catch (error) {
            console.log(error.message)
            return HttpResponses.internalServerError({errors: error.message, res})
        }
    }

    search = async ( req, res ) => {
        try {
            const { body: dtoCriteria } = req;
            const user = await new RoomSearcher(this.#repository).execute(dtoCriteria);
            return HttpResponses.ok({res, ...user.toJson() })

        }catch (error) {
            console.log(error.message)
            return HttpResponses.internalServerError({errors: error.errors, res})
        }
    }


    update = async ( req, res ) => {
        try {
            const { body: roomInfo } = req;
            const { id } = req.params;

            if(!validateUuid(id)){
                return HttpResponses.badRequest({errors: "El id es invalido", res})
            }

            await new RoomUpdater(this.#repository).execute(id, {...roomInfo, updated_at: new Date().toISOString()});
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

            const user = await new RoomFinder(this.#repository).execute(id);
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

            await new RoomDeleter(this.#repository).execute(id, dto);
            return HttpResponses.ok({res})

        } catch (error) {
            console.log(error)
            return HttpResponses.internalServerError({errors: error.errors, res})
        }
    }

    index = async ( req, res ) => {
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


            const room = await new RoomSearcher(this.#repository).execute(dtoCriteria);
            return HttpResponses.ok({res, ...room.toJson() })

        } catch (error) {
            console.log(error.message)
            return HttpResponses.internalServerError({errors: error.errors, res})
        }
    }
}

module.exports = RoomsControllers