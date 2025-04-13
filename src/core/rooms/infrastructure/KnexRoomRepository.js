const knexRepository = require("../../../shared/infrastructure/knexRepository");
const Room = require("../domain/Room");


class KnexRoomRepository extends knexRepository{
    constructor(config) {
        super(config,'rooms');
    }

    async save(dto){
        try{
            await this.connection(this.tableName).insert({
                id: dto.id.value,
                name: dto.name.value,
                created_at: dto.created_at.value
            });
        }catch(e){
            console.log(e);
            throw new Error(`Error: ${e}`);
        }

    }
    async find(criteria){
        try{
            if (!criteria?.value) {
                throw new Error("Value must be provided for finder function")
            }
            const queryFieldAndValue = {
                [criteria.field]: criteria.value,
            }

            const result = await this.connection(this.tableName).where(queryFieldAndValue).first();
            return result ? new Room(result) : null
        }catch(e){
            console.log(e);
            throw new Error(`Error: ${e}`);
        }
    }

    async search(criteria){
        try{
            const query = this.connection(this.tableName).select("*")
            criteria.convertToKnex(query)
            const rows = await query;
            return rows ? rows.map((room) => new Room(room)) : null;

        }catch(e){
            console.log(e);
            throw new Error(`Error: ${e}`);
        }
    }
}

module.exports = KnexRoomRepository