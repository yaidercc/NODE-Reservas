class ReservationsResponse {
    #reservation;
    constructor(reservation) {
        this.#reservation = reservation;
    }

    toJson(){
        if (!this.#reservation) return {}

        return {
            data: {
                id: this.#reservation.id.value,
                user_id: this.#reservation.user_id.value,
                room_id: this.#reservation.room_id.value,
                date_from: this.#reservation.date_from.value,
                date_to: this.#reservation.date_to.value,

            }
        }
    }
}
module.exports = ReservationsResponse;