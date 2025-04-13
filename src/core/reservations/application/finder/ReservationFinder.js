const DomainReservationFinder = require("../../domain/ReservationFinder");
const ReservationsResponse = require("../ReservationsResponse");

class ReservationFinder {
    #finder;

    constructor(repository) {
        this.#finder = new DomainReservationFinder(repository);
    }

   async execute(id) {
        const reservation = await this.#finder.execute(id);

        if(!reservation || reservation.deleted_at.value || reservation.cancelled_at.value){
            throw new Error("Reservation don´t exists");
        }
        return new ReservationsResponse(reservation);
    }
}

module.exports = ReservationFinder;