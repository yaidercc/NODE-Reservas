const Knex = require("knex")

let instance = null;

const getKnexInstance = (knexConfig) => {
    if (!instance) {
        instance = Knex(knexConfig);
    }
    return instance;
};

module.exports = {
    getKnexInstance
}