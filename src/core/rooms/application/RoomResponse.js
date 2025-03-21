class RoomResponse {
    #room;
    constructor(room) {
        this.#room = room;
    }

    toJson(){
        if (!this.#room) return {}
        return {
            data: {
                id: this.#room.id.value,
                name: this.#room.name.value
            }
        }
    }
}
module.exports = RoomResponse;