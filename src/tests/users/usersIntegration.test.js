const KnexUserReposiroty = require("../../core/users/infrastructure/knexUserRepository");
const {knexConfig} = require("../knexfile");
const {UserFinder} = require("../../core/users");
const UsersMother = require("./domain/usersMother");
const UserResponse = require("../../core/users/application/UserResponse");

describe("prueba",()=>{
   const repository = new KnexUserReposiroty(knexConfig);
    beforeEach(async () => {
        await repository.connection.migrate.latest();
    });

    afterEach(async () => {
        await repository.connection.migrate.rollback(undefined, true);
    });

    it('Should create an user', async () => {
        console.log(UsersMother.dto());
        const createdUser = await UsersMother.create(repository)
        const user = (await new UserFinder(repository).execute(createdUser.id.value)).toJson().data;
        expect(user.id).toBe(createdUser.id.value);
    });

    it('Should find an user by id', async () => {
        const createdUser = await UsersMother.create(repository);
        const user = await new UserFinder(repository).execute(createdUser.id.value)

        expect(user).not.toBeNull();
        expect(user).toBeInstanceOf(UserResponse)
    })

    it('Should return all users', async () => {

    })
})