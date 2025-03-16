const {User} = require("../../../core/users");
const {v4: uuid} = require('uuid')
const chance = new (require('chance'))();

class UserMother {
    static dto(){
        return  {
            id: uuid() ,
            name: chance.name({max:10}),
            last_name: chance.last({max:10}),
            email: chance.email({max:50}),
            password: `dasd`,
            created_at: new Date().toISOString(),
        }
    }

    static async create(repository) {
        const userDto = UserMother.dto();
        const user = User.create(userDto);
        await repository.save(user);
        return user;
    }
}

module.exports = UserMother;