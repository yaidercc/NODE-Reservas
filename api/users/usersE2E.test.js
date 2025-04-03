require("dotenv").config({ path: __dirname + "/../../.env" });
const app  = require( "../../src/app");
const request = require("supertest");
const UserMother = require("../../src/tests/users/domain/usersMother");
const {development: knexConfig} = require("../../src/config/database/knexfile");
const {KnexUserRepository} = require("../../src/core/users");

describe('users E2E Test', () => {
    const repository = new KnexUserRepository(knexConfig);
    const userPassword = 'RandomPass123#'
    let token;

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/users/login")
            .send(UserMother.adminUserLogin);
        token = loginResponse.body.data.token;

    });

    it("Should create a new user", async () => {
        const dto = UserMother.dto(userPassword)

        const response = await request(app).post("/api/users").send({...dto,password: userPassword})

        expect(response.status).toBe(201)
    })

    it("Should find an user", async () => {
        const userCreated = await UserMother.create(repository);

        const { status, body } = await request(app).get(`/api/users/${userCreated.id.value}`)
        const { data: user } = body

        expect(status).toBe(200)

        expect(user.id).toBe(userCreated.id.value)
        expect(user.name).toBe(userCreated.name.value)
        expect(user.last_name).toBe(userCreated.last_name.value)
        expect(user.email).toBe(userCreated.email.value)
    })

    it("Should update an user", async () => {
        const userCreated = await UserMother.create(repository);

        const infoToUpdate = {
            name: "John Doe",
        }
        const response = await request(app).put(`/api/users/${userCreated.id.value}`).send(infoToUpdate)

        expect(response.status).toBe(200)
    })

    it("Should fetch all users", async () => {
        await UserMother.createMany(repository,3)

        const response = await request(app).get("/api/users")

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
                }
            ],
            limit: 10,
            offset: 0,
            order: {
                field: 'created_at',
                direction: 'desc',
            },
        };
        const response = await request(app).post("/api/users/search").send(dtoCriteria)

        const { name } = response.body.data[0]
        expect(name).toBe(userCreated.name.value)

    })

    it("Should login an user", async () => {

        const userCreated = await UserMother.create(repository, userPassword);

        const loginUser = await request(app).post("/api/users/login").send({email: userCreated.email.value, password: userPassword})

        expect(loginUser.status).toBe(200)
    })

    it("Should delete an user", async () => {
        const userCreated = await UserMother.create(repository);
        await request(app).delete(`/api/users/${userCreated.id.value}/delete`).set("x-token",token)

        const response = await request(app).get(`/api/users/${userCreated.id.value}`)

        expect(response.status).toBe(500)
    })


})