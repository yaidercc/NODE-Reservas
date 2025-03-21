const {KnexRoomRepository, RoomFinder} = require("../../core/rooms");
const {knexConfig} = require( "../knexfile");
const RoomsMother = require("./domain/roomsMother");

describe('Rooms Integrations testss', () => {
    const repository  = new KnexRoomRepository(knexConfig);
    beforeEach(async () => {
        await repository.connection.migrate.latest();
    });

    afterEach(async () => {
        await repository.connection.migrate.rollback(undefined, true);
    });

    it('Should Create a room', async () => {
        const createdRoom = await RoomsMother.create(repository)
        const room = (await new RoomFinder(repository).execute(createdRoom.id.value)).toJson().data;
        expect(room.id).toBe(createdRoom.id.value);
    })

    it('Should Create a room', async () => {
        const createdRoom = await RoomsMother.create(repository)
        const room = (await new RoomFinder(repository).execute(createdRoom.id.value)).toJson().data;
        expect(room.id).toBe(createdRoom.id.value);
    })
});