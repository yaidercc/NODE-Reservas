const KnexUserReposiroty = require("../../core/users/infrastructure/knexUserRepository");
const {knexConfig} = require("../knexfile");
const {UserFinder} = require("../../core/users");
const UsersMother = require("./domain/usersMother");

describe("prueba",()=>{
   const repository = new KnexUserReposiroty(knexConfig);
    beforeEach(async () => {
        await repository.connection.migrate.latest();
    });

    afterEach(async () => {
        await repository.connection.migrate.rollback(undefined, true);
    });

    it('Should create an user', async () => {
        const createdUser = await UsersMother.create(repository)
        const findUser = await new UserFinder(repository).execute(createdUser.id.value);
        console.log(findUser);
    });
})