const KnexUserReposiroty = require("../../core/users/infrastructure/knexUserRepository");
const {knexConfig} = require("../knexfile");
const {UserFinder} = require("../../core/users");


describe("prueba",()=>{
   const repository = new KnexUserReposiroty(knexConfig);
    beforeEach(async () => {
        await repository.connection.migrate.latest();
    });

    afterEach(async () => {
        await repository.connection.migrate.rollback(undefined, true);
    });

    it('finds an existing Ans instance by id', async () => {
        const ansResult = await new UserFinder(repository).execute("8a09ba2c-0231-4cc3-b02d-5b90054d6f90");
        console.log(ansResult);
    });
})