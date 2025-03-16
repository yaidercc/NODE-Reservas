require("dotenv").config({ path: "../../../.env" });

const connection = {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

const development = {
    client: 'pg',
    migrations: {
        tableName: 'knex_migrations',
        directory: './migrations',
    },
    seeds: {
        directory: './seeds',
    },
    connection: { ...connection },
};


const testing = {
    client: 'sqlite3',
    connection: {
        filename: ':memory:',
    },
    useNullAsDefault: true,
    migrations: {
        tableName: 'knex_migrations',
        directory: './src/config/database/migrations',
    },
    seeds: {
        directory: './seeds',
    },
};
module.exports = {
    development,
    testing
}