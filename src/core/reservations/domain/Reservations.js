const AggregateRoot = require("../../../shared/domain/aggregateRoot");
const {ValueObjectId} = require("../../../shared/valueObjects");
const ValueObjectTimeStamp = require("../../../shared/valueObjects/valueObjectTimeStamp");

class Reservations extends AggregateRoot {

    /** @type {ValueObjectId} */
    #user_id;
    /** @type {ValueObjectId} */
    #room_id;
    /** @type {ValueObjectTimeStamp} */
    #date_from;
    /** @type {ValueObjectTimeStamp} */
    #date_to;
    /** @type {ValueObjectTimeStamp} */
    #cancelled_at;

    constructor({id, user_id, room_id, date_from, date_to, created_at, updated_at, deleted_at, cancelled_at}) {
        super(id);
        this.#user_id = new ValueObjectId('user_id', user_id);
        this.#room_id = new ValueObjectId('room_id', room_id);
        this.#date_from = new ValueObjectTimeStamp('date_from', date_from);
        this.#date_to = new ValueObjectTimeStamp("date_to", date_to);
        this.#cancelled_at = new ValueObjectTimeStamp("cancelled_at", cancelled_at,true);
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.deleted_at = deleted_at;
    }

    static create(dto) {
        return new Reservations(dto)
    }

    get user_id() {
        return this.#user_id;
    }

    get room_id() {
        return this.#room_id;
    }

    get date_from() {
        return this.#date_from;
    }

    get date_to() {
        return this.#date_to;
    }

    get cancelled_at() {
        return this.#cancelled_at;
    }

    set user_id(newUserId) {
        if (newUserId !== this.#user_id.value) {
            this.#user_id = new ValueObjectId('user_id', newUserId);
            this.changedAttributes.user_id = newUserId;
        }
    }
    set room_id(newRoomId) {
        if (newRoomId !== this.#room_id.value) {
            this.#room_id = new ValueObjectId('room_id', mId);
            this.changedAttributes.room_id = mId;
        }
    }
    set date_from(newDateFrom) {
        if (newDateFrom !== this.#date_from.value) {
            this.#date_from = new ValueObjectTimeStamp('date_from', newDateFrom);
            this.changedAttributes.date_from = newDateFrom;
        }
    }
    set date_to(newDateTo) {
        if (newDateTo !== this.#date_to.value) {
            this.#date_to = new ValueObjectTimeStamp("date_to", newDateTo);
            this.changedAttributes.date_to = newDateTo;
        }
    }

    set cancelled_at(newCancelledDate) {
        if (newCancelledDate !== this.#cancelled_at.value) {
            this.#cancelled_at = new ValueObjectTimeStamp("cancelled_at", newCancelledDate);
            this.changedAttributes.cancelled_at = newCancelledDate;
        }
    }

    cancel() {
        if (this.#cancelled_at.value) {
            throw new Error("reservation was cancelled");
        }
        this.cancelled_at = new Date().toISOString();

    }

}

module.exports = Reservations