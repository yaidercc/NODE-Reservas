const Router = require("express").Router();
const { createSchema, updateSchema } = require('./Schemas')
const RoomsController  = require('./Controllers')
const validateSchemas = require("../../src/shared/ValidateSchemas")
const SearchSchema = require("../../src/shared/schemas/SearchSchema");
const {KnexRoomRepository} = require("../../src/core/rooms");
const {development: knexConfig} = require("../../config/database/Knexfile");
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
        this.router.delete("/:id/delete",[this.middlewares.validateJWT.bind(this.middlewares), this.middlewares.isAdmin], this.controllers.delete)
    }
}

module.exports = new Routes().router;