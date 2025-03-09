const {User} = require("../../../core/users");
const {v4: uuid} = require('uuid')
class UserMother {
    static dto(){
        return  {
            id: uuid() ,
            name: "yaider",
            last_name: "cordoba",
            email: "yaider@gmail.com",
            password: `${uuid().split("-")[0]}`,
            created_at: new Date().toISOString(),
        }
    }

    static async create(repository) {
        const userDto = UserMother.dto();
        console.log(userDto);
        const user = User.create(userDto);
        await repository.save(user);
        return user;
    }
}

module.exports = UserMother;