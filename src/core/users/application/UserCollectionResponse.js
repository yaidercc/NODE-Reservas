const UserResponse =  require("./UserResponse");

class UserCollectionResponse {
    /** @type {User[]} */
    #userCollection;

    constructor(userCollection) {
        this.userCollection = userCollection;
    }

    toJson() {
        return {
            data: {
                items: this.#userCollection.map((user) => new UserResponse(user).toJson().data),
            }
        }
    }
}
module.exports = UserCollectionResponse;