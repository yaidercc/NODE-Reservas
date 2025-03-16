const bcryptjs = require("bcryptjs");
const generateJWT = require("../../../../shared/jwt/generateJWT");
const UserResponse = require("../UserResponse");
const valueObjectEmail = require("../../domain/valueObjects/valueObjectEmail");

class UserLogin {
    #repository;
    constructor(repository) {
        this.#repository = repository;
    }

    async execute({email, password}) {
        if(!email || !password) throw new Error(`email and password must be provided.`);

        const user = await this.#repository.find(new valueObjectEmail(email));

        if(!user || user.deleted_at.value){
            throw new Error("User don´t exists");
        }

        const isThePasswordCorrect = bcryptjs.compareSync(password, user.password.value);

        if(!isThePasswordCorrect){
            throw new Error(`email or password are incorrect.`);
        }

        const token =await generateJWT(user.id.value);

        return {
           data: {
               user: new UserResponse(user).toJson().data,
               token
           }
        }




    }
}
module.exports=UserLogin
