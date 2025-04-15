const Router = require("express").Router();
const { createSchema, updateSchema, loginSchema } = require('./Schemas')
const UserController  = require('./Controllers')
const validateSchemas = require("../../src/shared/ValidateSchemas")
const SearchSchema = require("../../src/shared/schemas/SearchSchema");
const {KnexUserRepository} = require("../../src/core/users");
const {development: knexConfig} = require("../../src/config/database/Knexfile");
const MiddlewaresManager = require("../../src/shared/middlewares/Middlewares");

class Routes {
    #repository;
    constructor() {
        this.router = Router;
        this.#repository = new KnexUserRepository(knexConfig);
        this.middlewares = new MiddlewaresManager(knexConfig);
        this.controllers = new UserController(this.#repository);
        this.setRoutes()

    }

    setRoutes(){
        this.router.get("/",[this.middlewares.validateJWT.bind(this.middlewares), this.middlewares.isAdmin], this.controllers.index)
        this.router.get("/:id", this.controllers.find)
        this.router.post("/",validateSchemas(createSchema), this.controllers.create)
        this.router.post("/search",[validateSchemas(SearchSchema), this.middlewares.validateJWT.bind(this.middlewares), this.middlewares.isAdmin], this.controllers.search)
        this.router.post("/login",validateSchemas(loginSchema), this.controllers.login)
        this.router.put("/:id",[this.middlewares.validateJWT.bind(this.middlewares), this.middlewares.canEdit],validateSchemas(updateSchema), this.controllers.update)
        this.router.delete("/:id/delete",[this.middlewares.validateJWT.bind(this.middlewares), this.middlewares.canEdit], this.controllers.delete)
    }
}

module.exports = new Routes().router;