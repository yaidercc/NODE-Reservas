const Router = require("express").Router();
const { createSchema, updateSchema } = require('./schemas')
const RoomsController  = require('./controllers')
const validateSchemas = require("../../src/shared/validateSchemas")
const SearchSchema = require("../../src/shared/schemas/searchSchema");
const {KnexRoomRepository} = require("../../src/core/rooms");
const {development: knexConfig} = require("../../src/config/database/knexfile");
const MiddlewaresManager = require("../../src/shared/middlewares/Middlewares");

class Routes {
    #repository;
    constructor() {
        this.router = Router;
        this.#repository = new KnexRoomRepository(knexConfig);
        this.middlewares = new MiddlewaresManager(knexConfig);
        this.controllers = new RoomsController(this.#repository);
        this.setRoutes()

    }

    setRoutes(){
        this.router.get("/", this.controllers.index)
        this.router.get("/:id", this.controllers.find)
        this.router.post("/",[validateSchemas(createSchema), this.middlewares.validateJWT.bind(this.middlewares), this.middlewares.isAdmin], this.controllers.create)
        this.router.post("/search",validateSchemas(SearchSchema), this.controllers.search)
        this.router.put("/:id",[validateSchemas(updateSchema), this.middlewares.validateJWT.bind(this.middlewares), this.middlewares.isAdmin], this.controllers.update)
        this.router.get("/:id/delete",[this.middlewares.validateJWT.bind(this.middlewares), this.middlewares.isAdmin], this.controllers.delete)
    }
}

module.exports = new Routes().router;