const Router = require("express").Router();
const { createSchema } = require('./schemas')
const UserController  = require('./controllers')
const validateSchemas = require("../../src/shared/validateSchemas")

class Routes {
    constructor() {
        this.router = Router;
        this.controllers = new UserController();
        this.setRoutes()

    }

    setRoutes(){
        this.router.post("/",validateSchemas(createSchema), this.controllers.create)
    }
}

module.exports = new Routes().router;