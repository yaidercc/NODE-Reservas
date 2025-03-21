const {KnexRoomRepository, RoomFinder, RoomResponse} = require("../../core/rooms");
const {knexConfig} = require( "../knexfile");
const RoomsMother = require("./domain/roomsMother");
const RoomsUpdate = require("../../core/rooms/application/update/RoomUpdate");

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


    it('Should Find a room by id', async () => {
        const createdRoom = await RoomsMother.create(repository)
        const room = await new RoomFinder(repository).execute(createdRoom.id.value);
        console.log(room)
        expect(room).not.toBeNull();
        expect(room).toBeInstanceOf(RoomResponse)
    })

    it('Should Update a room', async () => {
        const createdRoom = await RoomsMother.create(repository)
        const dtoRoomUpdated = {
            name: "102"
        }
        await (new RoomsUpdate(repository).execute(createdRoom.id.value, dtoRoomUpdated));

        const findRoom = (await new RoomFinder(repository).execute(createdRoom.id.value)).toJson().data;

        expect(findRoom.name).toBe(dtoRoomUpdated.name);
    })
});