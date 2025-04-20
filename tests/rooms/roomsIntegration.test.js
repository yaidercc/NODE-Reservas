const {KnexRoomRepository, RoomFinder, RoomResponse, RoomSearcher} = require("../../src/core/rooms");
const {knexConfig} = require("../knexfile");
const RoomsMother = require("./domain/roomsMother");
const RoomsUpdate = require("../../src/core/rooms/application/update/RoomUpdate");
const searchedRoom = require("../../src/shared/domain/AggregateRoot");

describe('Rooms Integrations testss', () => {
    const repository = new KnexRoomRepository(knexConfig);
    beforeEach(async () => {
        await repository.connection.migrate.latest();
    });

    afterEach(async () => {
        await repository.connection.migrate.rollback(undefined, true);
    });

    it('Should Create a room', async () => {
        const createdRoom = await RoomsMother.create(repository)
        const room = (await new RoomFinder(repository).execute(createdRoom.id.value)).room.toJson().data;
        expect(room.id).toBe(createdRoom.id.value);
    })


    it('Should Find a room by id', async () => {
        const createdRoom = await RoomsMother.create(repository)
        const {room} = await new RoomFinder(repository).execute(createdRoom.id.value);

        expect(room).not.toBeNull();
        expect(room).toBeInstanceOf(RoomResponse)
    })

    it('Should Find a room by a criteria', async () => {
        const roomDto = RoomsMother.dto();
        await RoomsMother.create(repository,{...roomDto, name: "200"});

        const criteria =  {
            filter: [{
                field: "name",
                type: "AND",
                operator: "eq",
                value: "200"
            }],
            limit: 10,
            offset: 0,
            order: {
                field: 'created_at',
                direction: 'desc',
            },
        }

        const SearchedRoom = (await new RoomSearcher(repository).execute(criteria)).toJson().data;
        expect(SearchedRoom[0].id).toBe(roomDto.id)
    })

    it('Should Update a room', async () => {
        const createdRoom = await RoomsMother.create(repository)
        const dtoRoomUpdated = {
            name: "102"
        }
        await (new RoomsUpdate(repository).execute(createdRoom.id.value, dtoRoomUpdated));

        const findRoom = (await new RoomFinder(repository).execute(createdRoom.id.value)).room.toJson().data;

        expect(findRoom.name).toBe(dtoRoomUpdated.name);
    })
});