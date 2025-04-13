const DomainReservationFinder = require("../../domain/ReservationFinder");

class ReservationCancel {
    #repository;
    #finder;

    constructor(repository) {
        this.#repository = repository;
        this.#finder = new DomainReservationFinder(repository);
    }

    async execute(id) {

        const reservation = await this.#finder.execute(id);
        if (!reservation) {
            throw new Error("Reservation not exists")
        }

        if (new Date(reservation.date_to) < new Date()) {
            throw new Error("Reservation has expired")
        }

        if (reservation.cancelled_at.value) {
            throw new Error("Reservation was cancelled")
        }

        const hoursDiferenceMs = new Date(reservation.date_from.value).getTime() -  new Date().getTime();
        const twoHoursDifferenceMs = 2 * 60  * 60 * 1000;

        if(hoursDiferenceMs < twoHoursDifferenceMs || hoursDiferenceMs <= 0) {
            throw new Error("You can only cancel a reservation up to 2 hours before the reservation time.")
        }

        reservation.cancel();


        await this.#repository.update(reservation);

        reservation.flushChanges();


    }
}

module.exports = ReservationCancel;