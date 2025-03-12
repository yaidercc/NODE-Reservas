require("dotenv").config({ path: __dirname + "/../../.env" });
const KnexUserReposiroty = require("../../src/core/users/infrastructure/knexUserRepository");
const {knexConfig} = require("../../src/tests/knexfile");
const app  = require( "../../src/app");
const request = require("supertest");
const UserMother = require("../../src/tests/users/domain/usersMother");

describe('users E2E Test', () => {
    const repository = new KnexUserReposiroty(knexConfig);

    test("Should create a new user", async () => {
        const dto = UserMother.dto()
        const user = await request(app).post("/api/users").send(dto)

    })
})