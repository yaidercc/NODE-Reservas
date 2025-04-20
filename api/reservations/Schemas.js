const Joi = require('joi');

const datesSchema = {
    date_from: Joi.date().required(),
    date_to: Joi.date()
        .required()
        .custom((value, helpers) => {
            const { date_from } = helpers.state.ancestors[0];
            const msIn24h = 24 * 60 * 60 * 1000;

            if (!date_from) return value;

            const duration = new Date(value).getTime() - new Date(date_from).getTime();

            if (duration <= 0 || duration % msIn24h !== 0) {
                return helpers.error('date.invalidInterval'); // 🔥 Custom error
            }

            return value;
        }, '24h interval validation')
        .messages({
            'date.invalidInterval': 'The end date must be greater than the start date and in multiples of 24 hours.'
        }),
};


const createReservationSchema = Joi.object({
    id: Joi.string().uuid().required(),
    room_id: Joi.string().uuid().required(),
    user_id: Joi.string().uuid().required(),
    ...datesSchema,
    created_at: Joi.date()
});

const findBusyRoomsByDateSchema =Joi.object({
    ...datesSchema
})
module.exports = {
    createReservationSchema,
    findBusyRoomsByDateSchema
}