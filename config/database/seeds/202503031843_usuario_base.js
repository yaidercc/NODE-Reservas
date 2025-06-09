const {v4: uuid} = require('uuid')
const bcryptjs = require("bcryptjs");
async function seed(knex) {
    const password = `1d44b922`;
    const salt = bcryptjs.genSaltSync();
    const hashedPassword = bcryptjs.hashSync(password, salt);
    await knex("users").del();
    await knex('users').insert(
        {
            id: '8a09ba2c-0231-4cc3-b02d-5b90054d6f90',
            name: "yaider",
            last_name: "cordoba",
            role: "admin",
            email: "yaider@gmail.com",
            password: hashedPassword,
        }
    )
}

module.exports = {seed}