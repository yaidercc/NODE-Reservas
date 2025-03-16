const jwt = require("jsonwebtoken");
const {ValueObjectId} = require("../valueObjects");
const HttpResponses = require("../httpResponses/httpResponses");
const UserResponse = require("../../core/users/application/UserResponse");

class MiddlewaresManager {
    #repository;
    constructor(repository) {
        this.#repository = repository;
    }

    async validateJWT(req,res, next){
        const token = req.header("x-token");
        if (!token) {
            return HttpResponses.badRequest({res, errors: "There is not a token in the request." })
        }

        try {
            const {id} = jwt.verify(token, process.env.SECRETKEY);

            const user = await this.#repository.find(new ValueObjectId("id",id));

            if (!user) {
                return HttpResponses.notFound({errors: "User don´t exists", res})
            }

            req.user = new UserResponse(user).toJson().data;
            next();
        } catch (error) {
            console.log(error.message)
            return HttpResponses.unauthorized({errors: "User don´t exists", res})

        }

    }
    isAdmin(req,res, next){
        const {user} = req
        if(!user){
            throw new Error("user doesn't exist in the request");
        }
        const { role } = user
        if(role !== "admin"){
            return HttpResponses.forbidden({errors: "You do not have permission to perform this action.", res})
        }
        next()
    }
}

module.exports = MiddlewaresManager;