const KnexUserRepository = require("../../core/users/infrastructure/knexUserRepository");
const {knexConfig} = require("../knexfile");
const {UserFinder} = require("../../core/users");
const UsersMother = require("./domain/usersMother");
const UserResponse = require("../../core/users/application/UserResponse");
const UserUpdater = require("../../core/users/application/update/UserUpdater");
const UserSearcher = require("../../core/users/application/search/UserSearcher");
const UserCreator = require("../../core/users/application/create/UserCreator");

describe("User integration tests",()=>{
   const repository = new KnexUserRepository(knexConfig);

    beforeEach(async () => {
        await repository.connection.migrate.latest();
    });

    afterEach(async () => {
        await repository.connection.migrate.rollback(undefined, true);
    });

    it('Should Create a reservation', async () => {
        const userDto = UsersMother.dto();
        await new UserCreator(repository).execute(userDto);
        const userReesponse = await repository.connection("users").select("*").where("id", userDto.id);
        expect(userReesponse.length).toBe(1)
    })


    it('Should find an user by id', async () => {
        const createdUser = await UsersMother.create(repository);
        const user = await new UserFinder(repository).execute(createdUser.id.value)

        expect(user).not.toBeNull();
        expect(user).toBeInstanceOf(UserResponse)
    })

    it('Should Find a user by a criteria', async () => {
        const userDto = UsersMother.dto();
        await UsersMother.create(repository,null,{...userDto, name: "carlos"});

        const criteria =  {
            filter: [{
                field: "name",
                type: "AND",
                operator: "eq",
                value: "carlos"
            }],
            limit: 10,
            offset: 0,
            order: {
                field: 'created_at',
                direction: 'desc',
            },
        }

        const SearchedUser = (await new UserSearcher(repository).execute(criteria)).toJson().data;

        expect(SearchedUser[0].id).toBe(userDto.id)
    })

    it('Should cancel an user', async () => {
        const createdUser = await UsersMother.create(repository);
        await new UserUpdater(repository).execute(createdUser.id.value, {name: "soy yo"})
        const user = await repository.find(createdUser.id)
        expect(user.name.value).toBe("soy yo");
    })
})