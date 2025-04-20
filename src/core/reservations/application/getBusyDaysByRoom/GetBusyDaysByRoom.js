const Criteria = require("../../../../shared/criteria/Criteria");
const ReservationsCollectionResponseByRoom = require("../ReservationsCollectionResponseByRoom");

class GetBusyDaysByRoom {
    #repository;
    constructor(repository) {
        this.#repository = repository;
    }

    async execute(roomId) {
        if (!roomId) throw new Error(`roomId cannot be null`);
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const dtoCriteria = {
            filter: [
                {
                    field: "date_to",
                    operator: "gte",
                    value: todayStart.toISOString(),
                    type: "AND"
                },
                {
                    field: "cancelled_at",
                    operator: "null",
                    value: '',
                    type: "AND"
                },
                {
                    field: "deleted_at",
                    operator: "null",
                    value: '',
                    type: "AND"
                },
                {
                    field: "room_id",
                    operator: "eq",
                    value: roomId,
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
        const criteria = new Criteria(dtoCriteria.filter, dtoCriteria.order, dtoCriteria.limit, dtoCriteria.offset);

        const busyDays = await this.#repository.search(criteria);

        return {
            success: true,
            busyDays: new ReservationsCollectionResponseByRoom(busyDays)
        }
    }
}

module.exports = GetBusyDaysByRoom;