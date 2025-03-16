const knexRepository = require("../../../shared/infrastructure/knexRepository");
const User = require("../domain/User");

class KnexUserRepository extends knexRepository {
    constructor(config) {
        super(config, 'users');
    }

    async save(dto) {
        try {
            await this.connection(this.tableName).insert({
                id: dto.id.value,
                name: dto.name.value,
                last_name: dto.last_name.value,
                email: dto.email.value,
                password: dto.password.value,
                created_at: dto.created_at.value,
            })
        } catch (err) {
            console.log(err)
        }
    }

    async find(criteria) {
        if (!criteria?.value) {
            throw new Error("Value must be provided for finder function")
        }
        const queryFieldAndValue = {
            [criteria.field]: criteria.value,
        }

        const result = await this.connection(this.tableName).where(queryFieldAndValue).first();

        return result ? new User(result) : null
    }


    async search(criteria) {
        try {
            const query = this.connection(this.tableName).select("*")
            criteria.convertToKnex(query)
            const rows = await query;
            return !rows ? null : rows.map((user) => new User(user));
        } catch (err) {
            console.log(err)
        }

    }
}

module.exports = KnexUserRepository;