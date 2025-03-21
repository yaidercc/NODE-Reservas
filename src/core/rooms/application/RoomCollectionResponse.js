const RoomResponse = require("./RoomResponse");

class RoomCollectionResponse {
    #rooms;
    constructor(rooms) {
        this.#rooms = rooms;
    }

    toJson() {
        return {
            data: this.#rooms.map((room) => new RoomResponse(room).toJson().data),
        }
    }
}

module.exports = RoomCollectionResponse