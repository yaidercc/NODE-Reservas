const Router = require("express").Router();
const { createSchema, updateSchema } = require('./schemas')
const UserController  = require('./controllers')
const validateSchemas = require("../../src/shared/validateSchemas")

class Routes {
    constructor() {
        this.router = Router;
        this.controllers = new UserController();
        this.setRoutes()

    }

    setRoutes(){
        this.router.get("/:id", this.controllers.find)
        this.router.post("/",validateSchemas(createSchema), this.controllers.create)
        this.router.put("/:id",validateSchemas(updateSchema), this.controllers.update)
    }
}

module.exports = new Routes().router;