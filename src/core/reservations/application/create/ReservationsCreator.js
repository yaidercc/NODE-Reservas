const Criteria = require("../../../../shared/criteria/Criteria");
const ReservationsCollectionResponse = require("../ReservationsCollectionResponse");
const Reservations = require("../../domain/Reservations");

class ReservationsCreator {
    #repository;

    constructor(repository) {
        this.#repository = repository;
    }

    async execute(dto) {
        if (!dto) throw new Error(`dto cannot be null`);

        const msIn24h = 24 * 60 * 60 * 1000;
        const reservationDuration = new Date(dto.date_to).getTime() - new Date(dto.date_from).getTime();

        if (reservationDuration <= 0 || reservationDuration % msIn24h !== 0) {
            return {
                success: false,
                code: 400,
                errors: "reservation duration must be greater or equal to 24h"
            }
        }

        const dtoCriteria = {
            filter: [
                {
                    field: "date_from",
                    operator: "lt",
                    value: dto.date_to,
                    type: "AND"
                },
                {
                    field: "date_to",
                    operator: "gt",
                    value: dto.date_from,
                    type: "AND"
                },
                {
                    field: "room_id",
                    operator: "eq",
                    value: dto.room_id,
                    type: "AND"
                }
            ],
            limit: 0,
            offset: 0,
            order: {
                field: "created_at",
                direction: "desc"
            }
        };


        const criteria = new Criteria(dtoCriteria.filter, dtoCriteria.order, dtoCriteria.limit, dtoCriteria.offset);

        const response = await this.#repository.search(criteria);
        const reservations = new ReservationsCollectionResponse(response);

        if (reservations.length > 0) {
            return {
                success: false,
                code: 400,
                errors: "The room is already booked during this date range."
            }
        }
        const reservation = new Reservations(dto);
        await this.#repository.save(reservation);

        return {
            success: true
        }

    }
}

module.exports = ReservationsCreator;