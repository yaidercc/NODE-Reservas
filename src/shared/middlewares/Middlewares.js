const jwt = require("jsonwebtoken");
const {ValueObjectId} = require("../valueObjects");
const HttpResponses = require("../httpResponses/HttpResponses");
const UserResponse = require("../../core/users/application/UserResponse");
const {KnexUserRepository} = require("../../core/users");
const KnexRoomRepository = require("../../core/rooms/infrastructure/KnexRoomRepository");
const KnexReservationRepository = require("../../core/reservations/infrastructure/KnexReservationRepository");

class MiddlewaresManager {
    #userRepository;
    #roomRepository;
    #reservationRepository;

    constructor(knexConfig) {
        this.#userRepository = new KnexUserRepository(knexConfig);
        this.#roomRepository = new KnexRoomRepository(knexConfig);
        this.#reservationRepository = new KnexReservationRepository(knexConfig);
    }

    async validateJWT(req, res, next) {
        const token = req.header("x-token");
        if (!token) {
            return HttpResponses.badRequest({res, errors: "There is not a token in the request."})
        }

        try {
            const {id} = jwt.verify(token, process.env.SECRETKEY);

            const user = await this.#userRepository.find(new ValueObjectId("id", id));

            if (!user) {

                return HttpResponses.notFound({errors: "User don´t exists", res})
            }

            req.user = new UserResponse(user).toJson().data;
            next();
        } catch (error) {
            console.log("eyy",error.message)
            return HttpResponses.unauthorized({errors: error.message, res})

        }

    }

    isAdmin(req, res, next) {
        const {user} = req
        if (!user) {
            throw new Error("user doesn't exist in the request");
        }
        const {role} = user
        if (role !== "admin") {
            return HttpResponses.forbidden({errors: "You do not have permission to perform this action.", res})
        }
        next()
    }

    async isReservationOwner(req, res, next) {
        const {user} = req
        const {id} = req.params
        if (!user) {
            throw new Error("user doesn't exist in the request");
        }

        const reservation = await this.#reservationRepository.find(new ValueObjectId("id", id))

        if(reservation.user_id.value !== user.id){
            return HttpResponses.badRequest({res, errors: "You are not the owner of this reservation"})
        }
        next()
    }

    canEdit(req, res, next) {
        const {user, params} = req
        if (!user) {
            throw new Error("user doesn't exist in the request");
        }

        if (params.id !== user.id && user.role !== "admin") {
            return HttpResponses.forbidden({errors: "You do not have permission to perform this action.", res})
        }

        next()

    }
}

module.exports = MiddlewaresManager;