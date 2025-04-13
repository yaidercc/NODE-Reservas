class ReservationsCollectionResponseByRoom {
    #reservations;
    constructor(reservations) {
        this.#reservations = reservations;
    }

    toJson() {
        return {
            data: this.#reservations.map(({date_from,date_to}) => ({
                date_from: date_from.value,
                date_to: date_to.value,
            })),
        }
    }
}

module.exports = ReservationsCollectionResponseByRoom