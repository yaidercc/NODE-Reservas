const ReservationsResponse = require("./ReservationsResponse");


class ReservationsCollectionResponse {
    #reservations;
    constructor(reservations) {
        this.#reservations = reservations;
    }

    toJson() {
        return {
            data: this.#reservations.map((reservation) => new ReservationsResponse(reservation).toJson().data),
        }
    }
}

module.exports = ReservationsCollectionResponse