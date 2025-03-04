const {getKnexInstance } = require("../shared/infrastructure/knexConnection")
const {testing} = require("../config/database/knexfile");

module.exports = {
    knexConfig: getKnexInstance(testing),
}