
async function seed(knex) {
    await knex("rooms").del();
    await knex('rooms').insert(
        {
            id: '6faae9be-523a-42a5-b015-6fa0b88340bf',
            name: "100",
        }
    )
}

module.exports = {seed}