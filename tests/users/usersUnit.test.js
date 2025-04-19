const UserMother = require("./domain/usersMother");
const User = require("../../src/core/users/domain/User");

describe("User unit tests", () => {
    test("Should create a user", async () => {
        const dto = UserMother.dto();
        const user = User.create(dto)
        expect(user.id.value).toBe(dto.id);
        expect(user.name.value).toBe(dto.name);
        expect(user.last_name.value).toBe(dto.last_name);
        expect(user.id.value).toBe(dto.id);
    })

    test("Should cancel an user", () => {
        const dto = UserMother.dto();
        const user = User.create(dto)

        user.update(
            {
                name: "yaider updated"
            }
        )
        expect(user.name.value).toBe("yaider updated");
    })

    test("Should delete an user", () => {
        const dto = UserMother.dto();
        const user = User.create(dto)

        user.delete({
            ...dto,
            deleted_at: new Date().toISOString()
        })

        expect(user.deleted_at.value).toBeDefined();
    })
})