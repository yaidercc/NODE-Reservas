const express = require('express');
const cors = require('cors');

class ServerManager {
    #app;
    #path;
    constructor() {
        this.port = process.env.PORT || 4000;
        this.#app = express();

        this.#path={
            users: "/api/users"
        }

        this.middlewares();

        this.#routes()
    }

    middlewares() {
        this.#app.use(express.json());
        this.#app.use(cors())
    }

    #routes(){
        this.#app.use(this.#path.users, require("../api/users/routes"));
    }

    listen(){
        this.#app.listen(this.port, ()=>{
            console.log("Server started");
        });
    }
}

module.exports = ServerManager;