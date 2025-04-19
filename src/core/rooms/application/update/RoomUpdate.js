const DomainRoomFinder = require("../../domain/RoomFinder");
const {ValueObjectString} = require("../../../../shared/valueObjects");

class RoomsUpdate {
    #repository;
    #finder;

    constructor(repository) {
        this.#repository = repository;
        this.#finder = new DomainRoomFinder(repository);
    }

    async execute(id, dto) {
        if (!dto) throw new Error(`dto cannot be null`);

        const room = await this.#finder.execute(id);

        if (!room) {
            return {
                success: false,
                code: 404,
                errors: "Room does not exist"
            }
        }

        const existsRoomName = await this.#repository.find(new ValueObjectString("name", dto.name))
        if (existsRoomName && existsRoomName.id.value !== id) {
            return {
                success: false,
                code: 400,
                errors: "Room already exists"
            }
        }
        room.update(dto);

        await this.#repository.update(room);

        room.flushChanges();

        return {
            success: true
        }

    }
}

module.exports = RoomsUpdate;