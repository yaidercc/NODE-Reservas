const Criteria = require("../../../../shared/criteria/Criteria");
const RoomCollectionResponse = require("../../../rooms/application/RoomCollectionResponse");

class GetBusyRoomsByDate {
    #repository;
    #roomRepository;

    constructor(repository, roomRepository) {
        this.#repository = repository;
        this.#roomRepository = roomRepository
    }

    async execute(dto) {
        if (!dto) throw new Error(`dto cannot be null`);

        const busyRoomsCriteria = {
            filter: [
                {
                    field: "date_from",
                    operator: "lt",
                    value: dto.date_to,
                    type: "AND"
                },
                {
                    field: "date_to",
                    operator: "gt",
                    value: dto.date_from,
                    type: "AND"
                },
                {
                    field: "cancelled_at",
                    operator: "null",
                    value: '',
                    type: "AND"
                },
            ],
            limit: 0,
            offset: 0,
            order: {
                field: 'created_at',
                direction: 'desc',
            },
        };

        let criteria = new Criteria(busyRoomsCriteria.filter, busyRoomsCriteria.order, busyRoomsCriteria.limit, busyRoomsCriteria.offset);

        const busyRooms = await this.#repository.search(criteria);


        const notBusyRoomsCriteria = {
            filter: [
                {
                    field: "id",
                    operator: "notIn",
                    value: busyRooms.map(room => room.room_id.value).join(", "),
                    type: "AND"
                }
            ],
            limit: 0,
            offset: 0,
            order: {
                field: 'created_at',
                direction: 'desc',
            },
        };

        criteria = new Criteria(notBusyRoomsCriteria.filter, notBusyRoomsCriteria.order, notBusyRoomsCriteria.limit, notBusyRoomsCriteria.offset);

        const notBusyRooms = await this.#roomRepository.search(criteria);

        return {
            success: true,
            rooms: new RoomCollectionResponse(notBusyRooms)
        }
    }
}

module.exports = GetBusyRoomsByDate;