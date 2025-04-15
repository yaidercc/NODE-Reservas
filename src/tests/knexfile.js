const {getKnexInstance } = require("../shared/infrastructure/KnexConnection")
const {testing} = require("../config/database/Knexfile");

module.exports = {
    knexConfig: getKnexInstance(testing),
}