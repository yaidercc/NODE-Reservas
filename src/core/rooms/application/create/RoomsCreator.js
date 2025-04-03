const {ValueObjectString} = require("../../../../shared/valueObjects");
const RoomFinder = require("../../application/find/RoomFinder");
const ValueObjectId = require("../../../../shared/valueObjects/valueObjectId");
const Room = require("../../domain/Room");


class RoomsCreator {
    #repository;
    #finder;

    constructor(repository) {
        this.#repository = repository;
        this.#finder = new RoomFinder(repository);
    }

    async execute(dto) {
        if (!dto) throw new Error(`dto cannot be null`);

        const existsRoomName = await this.#repository.find(new ValueObjectString("name", dto.name))
        const existsRoom = await this.#repository.find(new ValueObjectId("id", dto.id))


        if (existsRoom || existsRoomName) {
            throw new Error(`Room already exists`);
        }

        const room = new Room(dto);
        await this.#repository.save(room);
    }
}

module.exports = RoomsCreator;