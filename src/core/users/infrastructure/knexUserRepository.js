const knexRepository = require("../../../shared/infrastructure/knexRepository");
const User =  require("../domain/User");

class KnexUserRepository extends knexRepository {
    constructor(config) {
        super(config, 'users');
    }

    async save(dto){
        console.log({
            id: dto.id.value,
            name: dto.name.value,
            last_name: dto.last_name.value,
            email: dto.email.value,
            password: dto.password.value,
            created_at: dto.created_at.value,
        })
        await this.connection(this.tableName).insert({
            id: dto.id.value,
            name: dto.name.value,
            last_name: dto.last_name.value,
            email: dto.email.value,
            password: dto.password.value,
            created_at: dto.created_at.value,
        })
    }

    async find(id){
        if(!id?.value){
            throw new Error("ID must be provided")
        }
        const result = await this.connection(this.tableName).where({id: id.value}).first();

        return result ?  new User(result) : null
    }
}

module.exports = KnexUserRepository;