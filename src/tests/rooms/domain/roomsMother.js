const {v4: uuid} = require('uuid')
const chance = new (require('chance'))();
class RoomsMother {
    static dto() {
        return {
            id: uuid(),
            name: chance.integer({ min: 101 },{max: 900}).toString(),
            created_at: new Date().toISOString()
        }
    }
}

module.exports = RoomsMother