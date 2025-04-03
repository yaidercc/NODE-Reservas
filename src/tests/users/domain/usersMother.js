const {v4: uuid} = require('uuid')
const User = require("../../../core/users/domain/User.js");
const bcryptjs = require("bcryptjs");
const chance = new (require('chance'))();

class UserMother {
    static dto(password = ''){
        const salt = bcryptjs.genSaltSync();
        const hashedPassword = bcryptjs.hashSync(password || 'Password123*', salt);

        return {
            id: uuid(),
            name: chance.name({max:10}),
            last_name: chance.last({max:10}),
            email: chance.email({max:50}),
            password: hashedPassword,
            created_at: new Date().toISOString(),
        }
    }

    static async create(repository, password, dto) {
        const useDto = dto || UserMother.dto(password);
        const user = User.create(useDto);
        await repository.save(user);
        return user;
    }

    static async createMany(repository, quantity) {
        const users = [];
        for (let i = 0; i < quantity; i++){
            await UserMother.create(repository);
        }
        return users;
    }

    static adminUserLogin = {
        email: "yaider@gmail.com",
        password: "1d44b922"
    }
}

module.exports = UserMother;