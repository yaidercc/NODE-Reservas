const jwt = require("jsonwebtoken");
const {KnexUserRepository} = require("../../core/users");
const {development: knexConfig} = require("../../config/database/knexfile");
const {ValueObjectId} = require("../valueObjects");
const HttpResponses = require("../httpResponses/httpResponses");
const UserResponse = require("../../core/users/application/UserResponse");

const validateJWT = async (req, res, next) => {
    const token = req.header("x-token");
    if (!token) {
        return res.json({
            success: false,
            msg: "No hay token en la peticion",
        });
    }

    try {
        const {id} = jwt.verify(token, process.env.SECRETKEY);
        const repository = new KnexUserRepository(knexConfig);
        const user = await repository.find(new ValueObjectId("id",id));
        if (!user) {
            return HttpResponses.notFound({errors: "User don´t exists", res})
        }

        req.user = new UserResponse(user).toJson().data;
        next();
    } catch (error) {
        return HttpResponses.Unauthorized({errors: "User don´t exists", res})

    }
};

module.exports = validateJWT;