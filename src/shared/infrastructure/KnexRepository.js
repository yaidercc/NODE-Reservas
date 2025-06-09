const Knex = require('knex');
class knexRepository {
    #connection;
    #tableName;
    constructor (config, table='') {
        this.#tableName = table;
        if (typeof config !== 'function') {
            this.#connection = Knex(config);
        } else {
            this.#connection = config;
        }
    }

    get connection () {
        return this.#connection;
    }

    get tableName () {
        return this.#tableName;
    }

    async update (aggregate) {
        try {
            await this.connection(this.#tableName)
                .update(aggregate.changedAttributes)
                .where({id: aggregate.id.value})
                .whereNull("deleted_at")
        }catch (error) {
            console.log(error)
            throw new Error("Ha ocurrido un error inesperado")
        }
    }

    async delete(aggregate){
        await this.update(aggregate)
    }
}

module.exports = knexRepository;