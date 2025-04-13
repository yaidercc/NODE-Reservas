require("dotenv").config({path: __dirname + "/../../.env"});
const app = require("../../src/app");
const request = require("supertest");
const UserMother = require("../../src/tests/users/domain/usersMother");
const {development: knexConfig} = require("../../src/config/database/knexfile");
const KnexReservationRepository = require("../../src/core/reservations/infrastructure/KnexReservationRepository");
const {KnexUserRepository} = require("../../src/core/users");
const {KnexRoomRepository} = require("../../src/core/rooms");
const RoomsMother = require("../../src/tests/rooms/domain/roomsMother");
const ReservationsMother = require("../../src/tests/reservations/domain/reservationMother");

const login = async (email, password) => {
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

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/users/login")
            .send(UserMother.adminUserLogin);
        adminToken = loginResponse.body.data.token;

    });

    it("Should create a reservation", async () => {
        const user = await UserMother.create(userRepository, "User123*");
        const room = await RoomsMother.create(roomRepository);
        const userToken = await login(user.email.value, "User123*")

        const reservationDto = ReservationsMother.dto({user_id: user.id.value, room_id: room.id.value})
        const response = await request(app).post("/api/reservations").send(reservationDto).set("x-token", userToken).send(reservationDto);

        expect(response.status).toBe(201)
    })

    it("Should cancel a reservation", async () => {
        const user = await UserMother.create(userRepository, "User123*");
        const room = await RoomsMother.create(roomRepository,);
        const userToken = await login(user.email.value, "User123*")

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

    it('Should Find busy days by date', async () => {
        const roomsCreated = await RoomsMother.createMany(roomRepository, 4);
        const user = await UserMother.create(userRepository);
        const reservationDto = ReservationsMother.dto({user_id: user.id.value, room_id: roomsCreated[0].id.value})
        const reservationCreated = await ReservationsMother.create(repository, reservationDto);
        const response = await request(app).post(`/api/reservations/getBusyDaysByDate`).send({
            date_to: reservationCreated.date_to.value,
            date_from: reservationCreated.date_from.value
        })

        expect(response.body.data.length).toBe(3);
    })
})