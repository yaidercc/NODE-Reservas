const ReservationsCreator = require("../../src/core/reservations/application/create/ReservationsCreator");
const HttpResponses = require("../../src/shared/httpResponses/httpResponses");
const GetBusyDaysByDate = require("../../src/core/reservations/application/getBusyDaysByDate/getBusyDaysByDate");
const ReservationCancel = require("../../src/core/reservations/application/cancel/ReservationCancel");
const {validate: validateUuid} = require("uuid");
const GetBusyDaysByRoom = require("../../src/core/reservations/application/getBusyDaysByRoom/getBusyDaysByRoom");

class ReservationController {
    #repository;
    #roomRepository;
    constructor(repository, roomRepository) {
        this.#repository = repository;
        this.#roomRepository = roomRepository;
    }

    create = async ( req, res ) => {
        try {
            const { body: reservationInfo } = req;
            await new ReservationsCreator(this.#repository).execute({...reservationInfo, created_at: new Date().toISOString()});
            return HttpResponses.created({res})

        }catch (error) {
            console.log(error)
            return HttpResponses.internalServerError({errors: error.message, res})
        }
    }

    search = async ( req, res ) => {
        try {
            const { body: dtoCriteria } = req;
            const user = await new ReservationsSearcher(this.#repository).execute(dtoCriteria);
            return HttpResponses.ok({res, ...user.toJson() })

        }catch (error) {
            console.log(error.message)
            return HttpResponses.internalServerError({errors: error.errors, res})
        }
    }

    cancel = async ( req, res ) => {
        try {
            const { id } = req.params;

            if(!validateUuid(id)){
                return HttpResponses.badRequest({errors: "El id es invalido", res})
            }

            const response = await new ReservationCancel(this.#repository).execute(id);
            console.log(response)
            return HttpResponses.ok({res})

        } catch (error) {
            console.log(error)
            return HttpResponses.internalServerError({errors: error.errors, res})
        }
    }



    getBusyDaysByRoom = async ( req, res ) => {
        try {
            const { roomId } = req.params;

            if(!validateUuid(roomId)){
                return HttpResponses.badRequest({errors: "El id es invalido", res})
            }

            const response = await new GetBusyDaysByRoom(this.#repository).execute(roomId);
            return HttpResponses.ok({res, ...response.toJson() })

        } catch (error) {
            console.log(error.message)
            return HttpResponses.internalServerError({errors: error.errors, res})
        }
    }

    getBusyDaysByDate = async ( req, res ) => {
        try {
            const { body: datesToSearch } = req;
            const response = await new GetBusyDaysByDate(this.#repository,this.#roomRepository).execute({...datesToSearch});
            return HttpResponses.ok({res, ...response.toJson() })

        }catch (error) {
            console.log(error)
            return HttpResponses.internalServerError({errors: error.message, res})
        }
    }
}

module.exports = ReservationController