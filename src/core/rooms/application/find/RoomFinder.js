const RoomResponse = require("../RoomResponse");
const DomainRoomFinder = require("../../domain/RoomFinder");

class RoomsFinder {
    #finder;
    constructor(repository) {
        this.#finder = new DomainRoomFinder(repository)
    }
    async execute(id){
        const room = await this.#finder.execute(id)
        if(!room || room.deleted_at.value){
            throw new Error("Room don´t exists");
        }
        return new RoomResponse(room);
    }
}

module.exports = RoomsFinder;