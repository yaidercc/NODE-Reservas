const {getKnexInstance } = require("../src/shared/infrastructure/KnexConnection")
const {testing} = require("../config/database/Knexfile");

module.exports = {
    knexConfig: getKnexInstance(testing),
}