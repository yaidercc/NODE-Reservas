const {knexConfig} = require("../knexfile");
const KnexReservationRepository = require("../../src/core/reservations/infrastructure/KnexReservationRepository");
const ReservationsMother = require("./domain/reservationMother");
const ReservationsCreator = require("../../src/core/reservations/application/create/ReservationsCreator");
const ReservationFinder = require("../../src/core/reservations/application/finder/ReservationFinder");
const ReservationSearcher = require("../../src/core/reservations/application/search/ReservationSearcher");
const GetBusyDaysByRoom = require("../../src/core/reservations/application/getBusyDaysByRoom/GetBusyDaysByRoom");
const {KnexRoomRepository} = require("../../src/core/rooms");
const RoomsMother = require("../rooms/domain/roomsMother");
const GetBusyDaysByDate = require("../../src/core/reservations/application/getBusyDaysByDate/GetBusyDaysByDate");
const ReservationCancel = require("../../src/core/reservations/application/cancel/ReservationCancel");
const DomainReservationsFinder = require("../../src/core/reservations/domain/ReservationFinder");

describe('Reservations Integrations tests', () => {
    const repository = new KnexReservationRepository(knexConfig);
    const roomRepository = new KnexRoomRepository(knexConfig);
    beforeEach(async () => {
        await repository.connection.migrate.latest();
    });

    afterEach(async () => {
        await repository.connection.migrate.rollback(undefined, true);
    });

    it('Should Create a reservation', async () => {
        const reservationDto = ReservationsMother.dto();
        await new ReservationsCreator(repository).execute(reservationDto);
        const reservationResponse = await repository.connection("reservations").select("*").where("id", reservationDto.id);
        expect(reservationResponse.length).toBe(1)
    })

    it('Should Find a reservation', async () => {
        const reservationCreated = await ReservationsMother.create(repository);
        const responseReservation = await new ReservationFinder(repository).execute(reservationCreated.id.value);

        expect(responseReservation.toJson().data.id).toBe(reservationCreated.id.value);
    })

    it('Should Find a room by a criteria', async () => {
        const reservationCreated = await ReservationsMother.create(repository);

        const criteria = {
            filter: [{
                field: "room_id",
                type: "AND",
                operator: "eq",
                value: reservationCreated.room_id.value,
            }],
            limit: 10,
            offset: 0,
            order: {
                field: 'created_at',
                direction: 'desc',
            },
        }

        const SearchedReservation = (await new ReservationSearcher(repository).execute(criteria)).toJson().data;

        expect(SearchedReservation[0].room_id).toBe(reservationCreated.room_id.value);
    })

    it('Should Find busy days by room', async () => {
        const reservationCreated = await ReservationsMother.create(repository);
        const busyDays = await new GetBusyDaysByRoom(repository).execute(reservationCreated.room_id.value)
        expect(busyDays.toJson().data.length).toBe(1);
    })

    it('Should Find busy days by date', async () => {
        const roomsCreated = await RoomsMother.createMany(roomRepository, 4);
        const reservationDto = ReservationsMother.dto()
        const reservationCreated = await ReservationsMother.create(repository, {
            ...reservationDto,
            room_id: roomsCreated[0].id.value
        });

        const busyDays = await new GetBusyDaysByDate(repository, roomRepository).execute({
            date_to: reservationCreated.date_to.value,
            date_from: reservationCreated.date_from.value
        })

        expect(busyDays.toJson().data.length).toBe(3);
    })

    it('Should Cancel a reservation', async () => {
        const reservationCreated = await ReservationsMother.create(repository);

        await new ReservationCancel(repository).execute(reservationCreated.id.value);


        const findReservation = await new DomainReservationsFinder(repository).execute(reservationCreated.id.value)
        expect(findReservation.cancelled_at.value).toBeDefined();
    })



});