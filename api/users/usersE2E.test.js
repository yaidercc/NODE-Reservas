require("dotenv").config({ path: __dirname + "/../../.env" });
const app  = require( "../../src/app");
const request = require("supertest");
const UserMother = require("../../src/tests/users/domain/usersMother");

describe('users E2E Test', () => {

    it("Should create a new user", async () => {
        const dto = UserMother.dto()
        const response = await request(app).post("/api/users").send(dto)
        expect(response.status).toBe(201)
    })

    it("Should find an user", async () => {
        const dto = UserMother.dto()
        await request(app).post("/api/users").send(dto)

        const { status, body } = await request(app).get(`/api/users/${dto.id}`)
        const { data: user } = body

        expect(status).toBe(200)
        expect(user.id).toBe(dto.id)
        expect(user.name).toBe(dto.name)
        expect(user.last_name).toBe(dto.last_name)
        expect(user.email).toBe(dto.email)
    })

    it("Should update an user", async () => {
        const dto = UserMother.dto()
        await request(app).post("/api/users").send(dto)

        const infoToUpdate = {
            name: "John Doe",
        }
        const response = await request(app).put(`/api/users/${dto.id}`).send(infoToUpdate)

        expect(response.status).toBe(200)
    })

    it("Should fetch all users", async () => {
        const response = await request(app).get("/api/users")

        expect(response.status).toBe(200)
        expect(response.body.data.items.length).toBeGreaterThan(0)
    })

    it("Should fetch users by a criteria", async () => {
        const dto = UserMother.dto()
        await request(app).post("/api/users").send(dto)
        const dtoCriteria = {
            filter: [
                {
                    field: "name",
                    operator: "eq",
                    value: dto.name,
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

        const { name } = response.body.data.items[0]
        expect(name).toBe(dto.name)

    })

    it("Should login an user", async () => {
        const dto = UserMother.dto()
        await request(app).post("/api/users").send(dto)

        const loginUser = await request(app).post("/api/users/login").send({email: dto.email, password: dto.password})
        expect(loginUser.status).toBe(200)
    })
})