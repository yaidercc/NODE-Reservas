

const {ValueObjectString} = require("../../../../shared/valueObjects");
const {RoomFinder} = require("../../index");

class RoomsCreator {
    #repository;
    #finder;
    constructor(repository) {
        this.#repository = repository;
        this.#finder = new RoomFinder(repository);
    }

   async execute(dto) {
        if (!dto) throw new Error(`dto cannot be null`);

        const existsRoomName = await this.#repository.find(ValueObjectString("name",dto.name))
        const existsRoom = await this.#finder.execute(dto.id)

        if (existsRoom || existsRoomName ) {
            throw new Error(`Room already exists`);
        }

        const user = new User(dto);
        await this.#repository.save(user);
    }
}

module.exports = RoomsCreator;