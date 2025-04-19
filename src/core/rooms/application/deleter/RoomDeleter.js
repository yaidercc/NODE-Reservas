const DomainRoomFinder = require("../../domain/RoomFinder");

class RoomsDeleter {
    #repository;
    #finder;
    constructor(repository) {
        this.#repository = repository;
        this.#finder = new DomainRoomFinder(repository);
    }


    async execute(id, dto) {
        if(!id) throw new Error(`id cannot be null`);

        const room = await this.#finder.execute(id);
        if(!room) {
            return {
                success: false,
                code: 404,
                errors: "Room does not exist"
            }
        }

        room.delete(dto);

        await this.#repository.delete(room);

        room.flushChanges();
        return {
            success: true,
        }
    }
}

module.exports = RoomsDeleter;