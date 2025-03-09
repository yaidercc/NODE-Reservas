
const {ValueObjectString} =  require( "../../../shared/valueObjects");
const valueObjectEmail =  require( "./valueObjects/valueObjectEmail");
const valueObjectPassword =  require( "./valueObjects/valueObjectPassword");
const AggregateRoot  = require("../../../shared/domain/aggregateRoot");

class User extends AggregateRoot {
    /** @type {ValueObjectString} */
    #name;
    /** @type {ValueObjectString} */
    #last_name;
    /** @type {valueObjectEmail} */
    #email;
    /** @type {valueObjectPassword} */
    #password;

    constructor({id, name, last_name, email, password,created_at, updated_at, deleted_at}) {
        super(id)
        this.#name = new ValueObjectString("name", name);
        this.#last_name = new ValueObjectString("last_name", last_name);
        this.#email = new valueObjectEmail("email", email);
        this.#password = new valueObjectPassword("password", password);
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.deleted_at = deleted_at;

    }

    static create(dto) {
        console.log(dto);
        return new User(dto)
    }

    set name (newName) {
        if(newName !== this.#name.value) {
            this.#name = new ValueObjectString("name", newName);
            this.changedAttributes.name = newName;
        }
    }
    set last_name (newLastName) {
        if(newLastName !== this.#last_name.value) {
            this.#last_name = new ValueObjectString("last_name", newLastName);
            this.changedAttributes.lastName = newLastName;
        }
    }

    set email (newEmail) {
        if(newEmail !== this.#email.value) {
            this.#email = new valueObjectEmail("email", newEmail);
            this.changedAttributes.email = newEmail;
        }
    }

    set password (newPassword) {
        if(newPassword === this.#password.value) {
            this.#password = new valueObjectPassword("password", newPassword);
            this.changedAttributes.password = newPassword;
        }
    }

    get name() {
        return this.#name;
    }
    get last_name() {
        return this.#last_name;
    }
    get email() {
        return this.#email;
    }
    get password() {
        return this.#password;
    }


}

module.exports = User;