const {v4: uuid} = require('uuid');
const Room = require("../../../core/rooms/domain/Room");
const chance = new (require('chance'))();
class RoomsMother {
    static dto() {
        return {
            id: uuid(),
            name: chance.integer({ min: 101,  max: 900}).toString(),
            created_at: new Date().toISOString()
        }
    }

    static async create(repository) {
        const roomDto = RoomsMother.dto()
        const room = Room.create(roomDto);
        await repository.save(room);
        return room;
    }
}

module.exports = RoomsMother