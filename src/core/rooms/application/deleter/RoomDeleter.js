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
        if(!room) throw new Error(`room doesn't exist`);

        room.delete(dto);

        await this.#repository.delete(room);

        room.flushChanges();
    }
}

module.exports = RoomsDeleter;