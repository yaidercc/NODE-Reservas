const knexRepository = require("../../../shared/infrastructure/knexRepository");

class KnexUserRepository extends knexRepository {
    constructor(config) {
        super(config, 'users');
    }

    async save(dto){
        await this.connection(this.tableName).insert({
            name: dto.name.value,
            last_name: dto.last_name.value,
            email: dto.email.value,
            password: dto.password.value,
        })
    }

    async find(id){
        const result = await this.connection(this.tableName).where({id: id.value}).first();

        return result
    }
}

module.exports = KnexUserRepository;