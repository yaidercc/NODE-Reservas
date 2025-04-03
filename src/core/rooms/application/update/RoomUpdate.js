const DomainRoomFinder = require("../../domain/RoomFinder");

class RoomsUpdate {
    #repository;
    #finder;
    constructor(repository) {
        this.#repository = repository;
        this.#finder = new DomainRoomFinder(repository);
    }

    async execute(id, dto){
        if (!dto) throw new Error(`dto cannot be null`);

        const room = await this.#finder.execute(id);
        if(!room){
            throw new Error("Room not exists")
        }
        room.update(dto);

        await this.#repository.update(room);

        room.flushChanges();


    }
}

module.exports = RoomsUpdate ;