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
            return {
                success: false,
                code: 404,
                errors: "Reservation not exists"
            }
        }

        if (new Date(reservation.date_to) < new Date()) {
            return {
                success: false,
                code: 400,
                errors: "Reservation has expired"
            }
        }

        if (reservation.cancelled_at.value) {
            return {
                success: false,
                code: 400,
                errors: "Reservation was already cancelled"
            }
        }

        const hoursDiferenceMs = new Date(reservation.date_from.value).getTime() - new Date().getTime();
        const twoHoursDifferenceMs = 2 * 60 * 60 * 1000;

        if (hoursDiferenceMs < twoHoursDifferenceMs || hoursDiferenceMs <= 0) {
            return {
                success: false,
                code: 400,
                errors: "You can only cancel a reservation up to 2 hours before the reservation time."
            }
        }

        reservation.cancel();


        await this.#repository.update(reservation);

        reservation.flushChanges();
        return {
            success: true
        }

    }
}

module.exports = ReservationCancel;