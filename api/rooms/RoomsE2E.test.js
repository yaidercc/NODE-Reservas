require("dotenv").config({path: __dirname + "/../../.env"});
const server = require("../../src/app");
const request = require("supertest");
const UserMother = require("../../src/tests/users/domain/usersMother");
const RoomsMother = require("../../src/tests/rooms/domain/roomsMother");
const {KnexRoomRepository} = require("../../src/core/rooms");
const {development: knexConfig} = require("../../src/config/database/Knexfile");
const {v4: uuid} = require('uuid')

describe('rooms E2E Test', () => {
    const repository = new KnexRoomRepository(knexConfig);
    let token;
    let app;
    beforeAll(async () => {
        app = server.app
        await repository.connection.migrate.rollback({
            directory: "src/config/database/migrations"
        }, true);
        await repository.connection.migrate.latest({
            directory: "src/config/database/migrations"
        });
        await repository.connection.seed.run({
            directory: "src/config/database/seeds"
        });

        const loginResponse = await request(app)
            .post("/api/users/login")
            .send(UserMother.adminUserLogin);
        token = loginResponse.body.data.token;

    });

    beforeEach(async () => {
        await repository.connection.migrate.rollback({
            directory: "src/config/database/migrations"
        }, true);
        await repository.connection.migrate.latest({
            directory: "src/config/database/migrations"
        });
        await repository.connection.seed.run({
            directory: "src/config/database/seeds"
        });
    });

    afterAll(async () => {
        await repository.connection.destroy();
        await server.close()
    })

    it("Should create a room", async () => {
        const dto = RoomsMother.dto()
        const response = await request(app).post("/api/rooms").set("x-token", token).send(dto);

        expect(response.status).toBe(201)
    })

    it("Should not update a non-existence room", async () => {
        const infoToUpdate ={
            name: "999"
        }
        const response = await request(app).put(`/api/rooms/${uuid()}`).set("x-token", token).send(infoToUpdate);

        expect(response.status).toBe(500)
    })

    it("Should not update a room with a existent name", async () => {
        const room1 = await RoomsMother.create(repository)
        const room2 = await RoomsMother.create(repository)
        const infoToUpdate ={
            name:room2.name.value
        }
        const response = await request(app).put(`/api/rooms/${room1.id.value}`).set("x-token", token).send(infoToUpdate);

        expect(response.status).toBe(500)
    })

    it("Should update a room", async () => {
        const room = await RoomsMother.create(repository)
        const infoToUpdate ={
            name: "999"
        }
        const responseUpdate = await request(app).put(`/api/rooms/${room.id.value}`).set("x-token", token).send(infoToUpdate);
        const responseFinder = await request(app)
            .get(`/api/rooms/${room.id.value}`)
        expect(responseUpdate.status).toBe(200)
        expect(responseFinder.body.data.name).toBe("999")
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

    it("Should fetch room by a criteria", async () => {
        const roomCreated = await RoomsMother.create(repository);

        const dtoCriteria = {
            filter: [
                {
                    field: "name",
                    operator: "eq",
                    value: roomCreated.name.value,
                    type: "AND"
                },

                {
                    field: "deleted_at",
                    operator: "null",
                    value: '',
                    type: "AND"
                },

            ],
            limit: 10,
            offset: 0,
            order: {
                field: 'created_at',
                direction: 'desc',
            },
        };
        const response = await request(app).post("/api/rooms/search").send(dtoCriteria).set("x-token", token)

        const {name} = response.body.data[0]
        expect(name).toBe(roomCreated.name.value)

    })

    it("Should not fetch deleted rooms", async () => {
        const roomCreated = await RoomsMother.createMany(repository, 5);

        await request(app).delete(`/api/rooms/${roomCreated[0].id.value}/delete`).set("x-token", token)

        const response = await request(app).get("/api/rooms")

        expect(response.body.data.length).toBe(5)

    })


    it("Should delete a room", async () => {
        const room = await RoomsMother.create(repository)

        await request(app)
            .delete(`/api/rooms/${room.id.value}/delete`).set("x-token", token)


        const response = await request(app).get(`/api/rooms/${room.id.value}`);

        expect(response.status).toBe(500);

    })

    it("Should not delete a no-existence room", async () => {
        const response = await request(app).delete(`/api/rooms/${uuid()}/delete`).set("x-token", token)
        expect(response.status).toBe(500)
    })


})