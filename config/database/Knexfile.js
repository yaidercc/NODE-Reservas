require("dotenv").config({ path: "../../../.env" });

const connection = {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

const schema = process.env.DB_SCHEMA;

const setSchema = (conn, done) => {
    conn.query('SET timezone="UTC";', done);
    conn.query(`CREATE SCHEMA IF NOT EXISTS ${schema};`, done);
    conn.query(`SET search_path TO ${schema};`, done);
};

const development = {
    client: 'pg',
    pool: {
        afterCreate: setSchema,
    },
    migrations: {
        tableName: `knex_migrations`,
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
        directory: './config/database/migrations',
    },
    seeds: {
        directory: './seeds',
    },
};
module.exports = {
    development,
    testing
}