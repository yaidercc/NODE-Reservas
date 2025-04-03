require("dotenv").config({path: __dirname + "/../../.env"});
const app = require("../../src/app");
const request = require("supertest");
const UserMother = require("../../src/tests/users/domain/usersMother");
const RoomsMother = require("../../src/tests/rooms/domain/roomsMother");
const {KnexRoomRepository} = require("../../src/core/rooms");
const {development: knexConfig} = require("../../src/config/database/knexfile");


describe('rooms E2E Test', () => {
    const repository = new KnexRoomRepository(knexConfig);
    let token;

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/users/login")
            .send(UserMother.adminUserLogin);
        token = loginResponse.body.data.token;

    });

    it("Should create a room", async () => {
        const dto = RoomsMother.dto()
        const response = await request(app).post("/api/rooms").set("x-token", token).send(dto);

        expect(response.status).toBe(201)
    })

    it("Should fetch all rooms", async () => {
        await RoomsMother.createMany(repository,3)
        const response = await request(app)
            .get(`/api/rooms`)
        const { data } = response.body
        expect(response.status).toBe(200)
        expect(data.length).toBeGreaterThan(0)
    })


    it("Should fetch a room", async () => {
        const room = await RoomsMother.create(repository)

        const response = await request(app)
            .get(`/api/rooms/${room.id.value}`)
        const {id, name} = response.body.data

        expect(response.status).toBe(200)
        expect(room.id.value).toBe(id);
        expect(room.name.value).toBe(name);
    })


    it("Should delete a room", async () => {
        const room = await RoomsMother.create(repository)

        await request(app)
            .get(`/api/rooms/${room.id.value}/delete`).set("x-token", token)


        const response = await request(app).get(`/api/rooms/${room.id.value}`);

        expect(response.status).toBe(500);


    })


})