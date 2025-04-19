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
            return {
                success: false,
                code: 404,
                errors: "Room don´t exists"
            }
        }
        return {
            success: true,
            room: new RoomResponse(room)
        }
    }
}

module.exports = RoomsFinder;