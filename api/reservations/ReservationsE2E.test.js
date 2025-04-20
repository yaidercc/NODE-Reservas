require("dotenv").config({path: __dirname + "/../../.env"});
const server = require("../../app");
const request = require("supertest");
const UserMother = require("../../tests/users/domain/usersMother");
const {development: knexConfig} = require("../../config/database/Knexfile");
const KnexReservationRepository = require("../../src/core/reservations/infrastructure/KnexReservationRepository");
const {KnexUserRepository} = require("../../src/core/users");
const {KnexRoomRepository} = require("../../src/core/rooms");
const RoomsMother = require("../../tests/rooms/domain/roomsMother");
const ReservationsMother = require("../../tests/reservations/domain/reservationMother");

const login = async (email, password, app) => {
    const loginResponse = await request(app)
        .post("/api/users/login")
        .send({email, password});
    return loginResponse.body.data.token || ""
}


describe('rooms E2E Test', () => {
    const repository = new KnexReservationRepository(knexConfig);
    const userRepository = new KnexUserRepository(knexConfig)
    const roomRepository = new KnexRoomRepository(knexConfig)

    let adminToken;
    let app;
    beforeAll(async () => {
        app = server.app
        await repository.connection.migrate.rollback({
            directory: "config/database/migrations"
        }, true);
        await repository.connection.migrate.latest({
            directory: "config/database/migrations"
        });
        await repository.connection.seed.run({
            directory: "config/database/seeds"
        });

        const loginResponse = await request(app)
            .post("/api/users/login")
            .send(UserMother.adminUserLogin);
        adminToken = loginResponse.body.data.token;

    });

    beforeEach(async () => {
        await repository.connection.migrate.rollback({
            directory: "config/database/migrations"
        }, true);
        await repository.connection.migrate.latest({
            directory: "config/database/migrations"
        });
        await repository.connection.seed.run({
            directory: "config/database/seeds"
        });
    });


    afterAll(async () => {
        await repository.connection.destroy();
        await server.close()
    })

    it("Should create a reservation", async () => {
        const user = await UserMother.create(userRepository, "User123*");
        const room = await RoomsMother.create(roomRepository);
        const userToken = await login(user.email.value, "User123*", app)

        const reservationDto = ReservationsMother.dto({user_id: user.id.value, room_id: room.id.value})
        const response = await request(app).post("/api/reservations").send(reservationDto).set("x-token", userToken).send(reservationDto);

        expect(response.status).toBe(201)
    })

    it("Should fetch all reservations", async () => {
        const user = await UserMother.create(userRepository, "User123*");
        const room = await RoomsMother.create(roomRepository);
        const userToken = await login(user.email.value, "User123*", app)

        const reservationDto = ReservationsMother.dto({user_id: user.id.value, room_id: room.id.value})
        await request(app).post("/api/reservations").send(reservationDto).set("x-token", userToken).send(reservationDto);


        const response = await request(app)
            .get(`/api/reservations`).set("x-token", adminToken)
        const { data } = response.body
        expect(response.status).toBe(200)
        expect(data.length).toBeGreaterThan(0)
    })


    it("Should cancel a reservation", async () => {
        const user = await UserMother.create(userRepository, "User123*");
        const room = await RoomsMother.create(roomRepository,);
        const userToken = await login(user.email.value, "User123*", app)

        const reservationDto = ReservationsMother.dto({user_id: user.id.value, room_id: room.id.value})
        await ReservationsMother.create(repository, reservationDto)

        const response = await request(app).get(`/api/reservations/cancel/${reservationDto.id}`).send(reservationDto).set("x-token", userToken).send(reservationDto);

        expect(response.status).toBe(200)
    })

    it('Should Find busy days by room', async () => {
        const user = await UserMother.create(userRepository);
        const room = await RoomsMother.create(roomRepository);
        const reservationDto = ReservationsMother.dto({user_id: user.id.value, room_id: room.id.value})

        const reservationCreated = await ReservationsMother.create(repository, reservationDto);
        const response = await request(app).get(`/api/reservations/getBusyDaysByRoom/${reservationCreated.room_id.value}`);

        expect(response.body.data.length).toBe(1);
    })

    it('Should Find busy rooms by date', async () => {
        const roomsCreated = await RoomsMother.createMany(roomRepository, 4);
        const user = await UserMother.create(userRepository);
        const reservationDto = ReservationsMother.dto({user_id: user.id.value, room_id: roomsCreated[0].id.value})
        const reservationCreated = await ReservationsMother.create(repository, reservationDto);
        const response = await request(app).post(`/api/reservations/getBusyRoomsByDate`).send({
            date_to: reservationCreated.date_to.value,
            date_from: reservationCreated.date_from.value
        })

        expect(response.body.data.length).toBe(3);
    })
})