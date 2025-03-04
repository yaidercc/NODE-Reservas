const knexRepository = require("../../../shared/infrastructure/knexRepository");

class KnexUserRepository extends knexRepository {
    constructor(config) {
        super(config, 'users');
    }

    async insert(dto){
        await this.connection(this.tableName).insert(dto)
    }

    async find(id){
        const result = await this.connection(this.tableName).where({id: id.value}).first();

        return result
    }
}

module.exports = KnexUserRepository;