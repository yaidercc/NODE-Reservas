const {ValueObjectString} = require("../../valueObjects");
const {ValueObjectDirection} = require("./ValueObjectDirection");

class OrderByCriteria {

    constructor(order) {
        this.field = new ValueObjectString("field", order.field)
        this.direction = new ValueObjectDirection("direction", order.direction)
    }
}

module.exports = OrderByCriteria;