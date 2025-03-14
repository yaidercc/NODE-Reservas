require("dotenv").config({ path: __dirname + "/../../.env" });
const app  = require( "../../src/app");
const request = require("supertest");
const UserMother = require("../../src/tests/users/domain/usersMother");

describe('users E2E Test', () => {

    test("Should create a new user", async () => {
        const dto = UserMother.dto()
        const response = await request(app).post("/api/users").send(dto)
        expect(response.status).toBe(201)
    })

    test("Should find an user", async () => {
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

    test("Should update an user", async () => {
        const dto = UserMother.dto()
        await request(app).post("/api/users").send(dto)

        const infoToUpdate = {
            name: "John Doe",
        }

        const response = await request(app).put(`/api/users/${dto.id}`).send(infoToUpdate)

        expect(response.status).toBe(200)
    })

    test.only("Should get all users", async () => {
        const dto = UserMother.dto()
        const response = await request(app).get("/api/users")
        expect(response.status).toBe(200)
        expect(response.body.data.items.length).toBeGreaterThan(0)
    })
})