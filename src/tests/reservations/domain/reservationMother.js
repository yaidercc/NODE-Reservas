const {v4: uuid} = require('uuid');
const Reservations = require("../../../core/reservations/domain/Reservations");

class ReservationsMother {

    static dto({user_id = '', room_id = ''} = {}) {
        const now = new Date();

        const dateFrom = new Date(now.getTime() + 4 * 60 * 60 * 1000);
        const dateTo = new Date(dateFrom.getTime() + 24 * 60 * 60 * 1000);
        return {
            id: uuid(),
            user_id: user_id || uuid(),
            room_id: room_id || uuid(),
            date_from: dateFrom.toISOString(),
            date_to: dateTo.toISOString(),
            created_at: new Date().toISOString()
        };
    }

    static async create(repository, dto = null) {
        const reservationsDTO = dto || ReservationsMother.dto()
        const reservations = Reservations.create(reservationsDTO);
        await repository.save(reservations);
        return reservations;
    }

    static async createMany(repository, quantity) {
        const rooms = [];
        for (let i = 0; i < quantity; i++) {
            const room = await RoomsMother.create(repository);
            rooms.push(room);
        }

        return rooms;
    }

    static

}

module.exports = ReservationsMother