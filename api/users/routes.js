const Router = require("express").Router();
const { createSchema, updateSchema, loginSchema } = require('./schemas')
const UserController  = require('./controllers')
const validateSchemas = require("../../src/shared/validateSchemas")
const SearchSchema = require("../../src/shared/schemas/searchSchema");
const {KnexUserRepository} = require("../../src/core/users");
const {development: knexConfig} = require("../../src/config/database/knexfile");
const MiddlewaresManager = require("../../src/shared/middlewares/Middlewares");

class Routes {
    #repository;
    constructor() {
        this.router = Router;
        this.#repository = new KnexUserRepository(knexConfig);
        this.middlewares = new MiddlewaresManager(this.#repository);
        this.controllers = new UserController(this.#repository);
        this.setRoutes()

    }

    setRoutes(){
        this.router.get("/", this.controllers.index)
        this.router.get("/:id", this.controllers.find)
        this.router.post("/",[validateSchemas(createSchema), this.middlewares.validateJWT.bind(this.middlewares), this.middlewares.isAdmin], this.controllers.create)
        this.router.post("/search",validateSchemas(SearchSchema), this.controllers.search)
        this.router.post("/login",validateSchemas(loginSchema), this.controllers.login)
        this.router.put("/:id",validateSchemas(updateSchema), this.controllers.update)
    }
}

module.exports = new Routes().router;