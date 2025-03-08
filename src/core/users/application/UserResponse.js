class UserResponse {
    /** @type {User} */
    #user;
    constructor(user) {
        this.#user = user;
    }

    toJson() {
        return {
            data: {
                id: this.#user.id.value,
                name: this.#user.name.value,
                last_name: this.#user.last_name.value,
                email: this.#user.email.value
            }
        }
    }
}

module.exports = UserResponse;