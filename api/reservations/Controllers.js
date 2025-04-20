const ReservationsCreator = require("../../src/core/reservations/application/create/ReservationsCreator");
const HttpResponses = require("../../src/shared/httpResponses/HttpResponses");
const GetBusyRoomsByDate = require("../../src/core/reservations/application/getBusyRoomsByDate/GetBusyRoomsByDate");
const ReservationCancel = require("../../src/core/reservations/application/cancel/ReservationCancel");
const {validate: validateUuid} = require("uuid");
const GetBusyDaysByRoom = require("../../src/core/reservations/application/getBusyDaysByRoom/GetBusyDaysByRoom");
const ReservationSearcher = require("../../src/core/reservations/application/search/ReservationSearcher");

class ReservationController {
    #repository;
    #roomRepository;
    constructor(repository, roomRepository) {
        this.#repository = repository;
        this.#roomRepository = roomRepository;
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


            const reservation = await new ReservationSearcher(this.#repository).execute(dtoCriteria);
            return HttpResponses.ok({res, ...reservation.toJson() })

        } catch (error) {
            console.log(error.message)
            return HttpResponses.internalServerError({errors: error.errors, res})
        }
    }

    create = async ( req, res ) => {
        try {
            const { body: reservationInfo } = req;
            const response = await new ReservationsCreator(this.#repository).execute({...reservationInfo, created_at: new Date().toISOString()});
            if (!response.success) {
                const {errors, code} = response
                return HttpResponses.badResponseByCode(code, {errors, res})
            }
            return HttpResponses.created({res})

        }catch (error) {
            console.log(error)
            return HttpResponses.internalServerError({errors: error.message, res})
        }
    }

    search = async ( req, res ) => {
        try {
            const { body: dtoCriteria } = req;
            const reservation = await new ReservationSearcher(this.#repository).execute(dtoCriteria);
            return HttpResponses.ok({res, ...reservation.toJson() })

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



    getBusyDaysByRoom = async ( req, res ) => {
        try {
            const { roomId } = req.params;

            if(!validateUuid(roomId)){
                return HttpResponses.badRequest({errors: "El id es invalido", res})
            }

            const response = await new GetBusyDaysByRoom(this.#repository).execute(roomId);
            if (!response.success) {
                const {errors, code} = response
                return HttpResponses.badResponseByCode(code, {errors, res})
            }
            const { busyDays } = response
            return HttpResponses.ok({res, ...busyDays.toJson() })

        } catch (error) {
            console.log(error.message)
            return HttpResponses.internalServerError({errors: error.errors, res})
        }
    }

    getBusyRoomsByDate = async ( req, res ) => {
        try {
            const { body: datesToSearch } = req;
            const response = await new GetBusyRoomsByDate(this.#repository,this.#roomRepository).execute({...datesToSearch});
            if (!response.success) {
                const {errors, code} = response
                return HttpResponses.badResponseByCode(code, {errors, res})
            }
            const { rooms } = response
            return HttpResponses.ok({res, ...rooms.toJson() })

        }catch (error) {
            console.log(error)
            return HttpResponses.internalServerError({errors: error.message, res})
        }
    }
}

module.exports = ReservationController