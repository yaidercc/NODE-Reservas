const ReservationMother = require("./domain/reservationMother");
const Reservation = require("../../core/reservations/domain/Reservations");

describe('Reservations Unit tests', () => {
    it('Should Create a reservation', async () => {
        const dto = ReservationMother.dto()
        const newReservation = Reservation.create(dto)

        expect(newReservation.id.value).toEqual(dto.id)
        expect(newReservation.user_id.value).toEqual(dto.user_id)
        expect(newReservation.room_id.value).toEqual(dto.room_id)
        expect(newReservation.date_from.value).toEqual(dto.date_from)
        expect(newReservation.date_to.value).toEqual(dto.date_to)

    })

    it('Should Cancel a reservation', async () => {
        const dto = ReservationMother.dto()
        const newReservation = Reservation.create(dto)

        newReservation.cancel();

        expect(newReservation.cancelled_at.value).toBeDefined()

    })

});