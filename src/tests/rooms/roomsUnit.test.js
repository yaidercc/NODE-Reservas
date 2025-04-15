const RoomsMother = require("./domain/roomsMother");
const Room = require("../../core/rooms/domain/Room");

describe('Rooms Unit tests', () => {
    it('Should Create a room', async () => {
        const dto = RoomsMother.dto()
        const newRoom = Room.create(dto)

        expect(newRoom.id.value).toEqual(dto.id)
        expect(newRoom.name.value).toEqual(dto.name)
    })

    it('Should Update a room', async () => {
        const dto = RoomsMother.dto()
        const newRoom = Room.create(dto)

        const dtoCriteria = {
            name: "101"
        }

        newRoom.update(dtoCriteria)

        expect(newRoom.name.value).toEqual(dtoCriteria.name)
    })

    it('Should Delete a room', async () => {
        const dto = RoomsMother.dto()
        const newRoom = Room.create(dto)

        const dtoCriteria = {
            deleted_at: new Date().toISOString()
        }

        newRoom.delete(dtoCriteria)
        expect(newRoom.deleted_at.value).toBeDefined()
    })
});