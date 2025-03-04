import {ValueObjectId} from "../../../shared/valueObjects/valueObjectId";
import {valueObjectString} from "../../../shared/valueObjects/valueObjectString";
import {valueObjectEmail} from "./valueObjects/valueObjectEmail";
import {valueObjectPassword} from "./valueObjects/valueObjectPassword";
import {AggregateRoot} from "../../../shared/valueObjects";

class User extends AggregateRoot {
    /** @type {valueObjectString} */
    #name;
    /** @type {valueObjectString} */
    #lastName;
    /** @type {valueObjectEmail} */
    #email;
    /** @type {valueObjectPassword} */
    #password;

    constructor(id, name, lastName ,email, password) {
        super(id)
        this.#name = new valueObjectString("name", name);
        this.#lastName = new valueObjectString("last_name", name);
        this.#email = new valueObjectEmail("email", email);
        this.#password = new valueObjectPassword("password", password);

    }

    set name (newName) {
        if(newName !== this.#name.value) {
            this.#name = new valueObjectString("name", newName);
            this.#changedAttributes.name = newName;
        }
    }
    set lastName (newLastName) {
        if(newLastName !== this.#lastName.value) {
            this.#lastName = new valueObjectString("last_name", newLastName);
            this.#changedAttributes.lastName = newLastName;
        }
    }

    set email (newEmail) {
        if(newEmail !== this.#email.value) {
            this.#email = new valueObjectEmail("email", newEmail);
            this.#changedAttributes.email = newEmail;
        }
    }

    set password (newPassword) {
        if(newPassword === this.#password.value) {
            this.#password = new valueObjectPassword("password", newPassword);
            this.#changedAttributes.password = newPassword;
        }
    }

    get id() {
        return this.#id;
    }
    get name() {
        return this.#name;
    }
    get lastName() {
        return this.#lastName;
    }
    get email() {
        return this.#email;
    }




}