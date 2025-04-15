require("dotenv").config({path: __dirname + "/../../.env"});
const app = require("../../src/app");
const request = require("supertest");
const UserMother = require("../../src/tests/users/domain/usersMother");
const {development: knexConfig} = require("../../src/config/database/knexfile");
const {KnexUserRepository} = require("../../src/core/users");
const {v4: uuid} = require('uuid')

describe('users E2E Test', () => {
    const repository = new KnexUserRepository(knexConfig);
    const userPassword = 'RandomPass123#'
    let token;

    beforeAll(async () => {
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
    })

    it("Should create a new user", async () => {
        const dto = UserMother.dto(userPassword)

        const response = await request(app).post("/api/users").send({...dto, password: userPassword})

        expect(response.status).toBe(201)
    })

    it("Should not create a user with an existent email", async () => {
        const dto1 = UserMother.dto(userPassword)
        const dto2 = UserMother.dto(userPassword)


        await request(app).post("/api/users").send({...dto1, password: userPassword})
        const response = await request(app).post("/api/users").send({
            ...dto2,
            email: dto1.email,
            password: userPassword
        })


        expect(response.status).toBe(500)
    })

    it("Should update an user ", async () => {
        const userCreated = await UserMother.create(repository);

        const infoToUpdate = {
            email: "jhonDoe@gmail.com",
        }
        const responseUpdate = await request(app).put(`/api/users/${userCreated.id.value}`).send(infoToUpdate).set("x-token", token)
        const responseFindUser = await request(app).get(`/api/users/${userCreated.id.value}`).set("x-token", token)

        expect(responseUpdate.status).toBe(200)
        expect(responseFindUser.body.data.email).toBe(infoToUpdate.email)
    })

    it("Should not update an user with an existent email", async () => {
        const userCreated1 = await UserMother.create(repository);
        const userCreated2 = await UserMother.create(repository);

        const infoToUpdate = {
            email: userCreated1.email.value,
        }
        const response = await request(app).put(`/api/users/${userCreated2.id.value}`).send(infoToUpdate).set("x-token", token)

        expect(response.status).toBe(500)
    })

    it("Should not update a no-existence user", async () => {
        const infoToUpdate = {
            email: "jhonDoe@gmail.com",
        }
        const response = await request(app).put(`/api/users/${uuid()}`).send(infoToUpdate).set("x-token", token)

        expect(response.status).toBe(500)
    })

    it("Should find an user", async () => {
        const userCreated = await UserMother.create(repository);

        const {status, body} = await request(app).get(`/api/users/${userCreated.id.value}`)
        const {data: user} = body

        expect(status).toBe(200)

        expect(user.id).toBe(userCreated.id.value)
        expect(user.name).toBe(userCreated.name.value)
        expect(user.last_name).toBe(userCreated.last_name.value)
        expect(user.email).toBe(userCreated.email.value)
    })

    it("Should cancel an user", async () => {
        const userCreated = await UserMother.create(repository);

        const infoToUpdate = {
            name: "John Doe",
        }
        const response = await request(app).put(`/api/users/${userCreated.id.value}`).send(infoToUpdate).set("x-token", token)

        expect(response.status).toBe(200)
    })

    it("Should fetch all users", async () => {
        await UserMother.createMany(repository, 3)

        const response = await request(app).get("/api/users").set("x-token", token)

        expect(response.status).toBe(200)
        expect(response.body.data.length).toBeGreaterThan(0)
    })

    it("Should fetch users by a criteria", async () => {
        const userCreated = await UserMother.create(repository);

        const dtoCriteria = {
            filter: [
                {
                    field: "name",
                    operator: "eq",
                    value: userCreated.name.value,
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
        const response = await request(app).post("/api/users/search").send(dtoCriteria).set("x-token", token)

        const {name} = response.body.data[0]
        expect(name).toBe(userCreated.name.value)

    })

    it("Should not fetch users deleted users", async () => {
        const usersCreated = await UserMother.createMany(repository, 5);

        await request(app).delete(`/api/users/${usersCreated[0].id.value}/delete`).set("x-token", token)

        const dtoCriteria = {
            filter: [
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
        const response = await request(app).post("/api/users/search").send(dtoCriteria).set("x-token", token)

        expect(response.body.data.length).toBe(5)

    })

    it("Should login an user", async () => {

        const userCreated = await UserMother.create(repository, userPassword);

        const loginUser = await request(app).post("/api/users/login").send({
            email: userCreated.email.value,
            password: userPassword
        })

        expect(loginUser.status).toBe(200)
    })

    it("Should delete an user", async () => {
        const userCreated = await UserMother.create(repository);
        await request(app).delete(`/api/users/${userCreated.id.value}/delete`).set("x-token", token)

        const response = await request(app).get(`/api/users/${userCreated.id.value}`)

        expect(response.status).toBe(500)
    })

    it("Should delete a no-existence user", async () => {
        const response = await request(app).delete(`/api/users/${uuid()}/delete`).set("x-token", token)
        expect(response.status).toBe(500)
    })



})