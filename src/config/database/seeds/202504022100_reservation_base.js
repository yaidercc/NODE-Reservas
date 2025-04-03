
async function seed(knex) {
    const now = new Date();
    const future = new Date(now);
    future.setHours(future.getHours() + 24);

    await knex('reservations').insert(
        {
            id: 'c4fa928b-ba85-4e23-88ab-10cdb9b48d56',
            user_id: '8a09ba2c-0231-4cc3-b02d-5b90054d6f90',
            room_id: '6faae9be-523a-42a5-b015-6fa0b88340bf',
            date_from: now,
            date_to: future
        }
    );
}

module.exports = {seed}