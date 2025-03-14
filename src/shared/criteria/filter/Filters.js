const FiltersCriteria = require("./FiltersCriteria");

class Filters {
    #filters;
    constructor(filters) {
        this.#filters = filters;
    }

    get filters() {
        return this.#filters;
    }

    static fromValues (filters) {
        return new Filters(filters.map((filter) => FiltersCriteria.fromValues(filter)));
    }

}

module.exports = Filters;