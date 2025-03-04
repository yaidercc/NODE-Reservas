const {v4: uuid} = require('uuid')
async function seed(knex) {
    await knex('users').insert(
        {
            id: '8a09ba2c-0231-4cc3-b02d-5b90054d6f90',
            name: "yaider",
            last_name: "cordoba",
            email: "yaider@gmail.com",
            password: `${uuid().split("-")[0]}`,
        }
    );
}

module.exports = {seed}