const {development: knexConfig} = require("../../config/database/Knexfile");
const MiddlewaresManager = require("../../src/shared/middlewares/Middlewares");
const validateSchemas = require("../../src/shared/ValidateSchemas");
const SearchSchema = require("../../src/shared/schemas/SearchSchema");
const {findBusyDaysByDateSchema, createReservationSchema} = require("./Schemas");
const {KnexRoomRepository} = require("../../src/core/rooms");
const KnexReservationRepository = require("../../src/core/reservations/infrastructure/KnexReservationRepository");
const ReservationController = require("./Controllers");
const Router = require("express").Router();

class Routes {
    #repository;
    #roomRepository;

    constructor() {
        this.router = Router;
        this.#repository = new KnexReservationRepository(knexConfig);
        this.#roomRepository = new KnexRoomRepository(knexConfig)
        this.middlewares = new MiddlewaresManager(knexConfig);
        this.controllers = new ReservationController(this.#repository, this.#roomRepository);
        this.setRoutes()
    }

    setRoutes() {
        this.router.post("/",
            [
                this.middlewares.validateJWT.bind(this.middlewares),
                validateSchemas(createReservationSchema)
            ], this.controllers.create)
        this.router.post("/search",
            [
                this.middlewares.validateJWT.bind(this.middlewares),
                this.middlewares.isAdmin,
                validateSchemas(SearchSchema)
            ], this.controllers.search)
        this.router.get("/getBusyDaysByRoom/:roomId", this.controllers.getBusyDaysByRoom)
        this.router.post("/getBusyDaysByDate",
            validateSchemas(findBusyDaysByDateSchema)
            , this.controllers.getBusyDaysByDate)
        this.router.get("/cancel/:id",
            [
                this.middlewares.validateJWT.bind(this.middlewares),
                this.middlewares.isReservationOwner.bind(this.middlewares)
            ], this.controllers.cancel)
    }
}

module.exports = new Routes().router;
