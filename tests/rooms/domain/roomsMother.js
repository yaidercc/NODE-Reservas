const {v4: uuid} = require('uuid');
const Room = require("../../../src/core/rooms/domain/Room");
const chance = new (require('chance'))();
class RoomsMother {
    static dto() {
        return {
            id: uuid(),
            name: chance.integer({ min: 101,  max: 900}).toString(),
            created_at: new Date().toISOString()
        }
    }

    static async create(repository, dto = null) {
        const roomDto = dto || RoomsMother.dto()
        const room = Room.create(roomDto);
        await repository.save(room);
        return room;
    }

    static async createMany(repository,quantity) {
        const rooms = [];
        for (let i = 0; i < quantity; i++) {
           const room = await RoomsMother.create(repository);
           rooms.push(room);
        }

        return rooms;
    }

}

module.exports = RoomsMother