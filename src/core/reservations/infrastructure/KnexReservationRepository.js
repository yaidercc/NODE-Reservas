const knexRepository = require("../../../shared/infrastructure/knexRepository");
const Reservations = require("../domain/Reservations");

class KnexReservationRepository extends knexRepository {
    constructor(config) {
        super(config, 'reservations');

    }

    async save(dto) {
        try {
            await this.connection(this.tableName).insert(
                {
                    id: dto.id.value,
                    user_id: dto.user_id.value,
                    room_id: dto.room_id.value,
                    date_from: dto.date_from.value,
                    date_to: dto.date_to.value,
                }
            );
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
        return result ? new Reservations(result) : null
    }

    async search(criteria) {
        try {
            const query = this.connection(this.tableName).select("*")
            criteria.convertToKnex(query)
            const rows = await query;
            return !rows ? null : rows.map((reservation) => new Reservations(reservation));
        } catch (err) {
            console.log(err)
        }

    }


}

module.exports = KnexReservationRepository;