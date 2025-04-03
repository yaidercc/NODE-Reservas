const express = require('express');
const cors = require('cors');
const morgan = require("morgan");

class ServerManager {
    #app;
    #path;
    constructor() {
        this.port = process.env.PORT || 4000;
        this.#app = express();

        this.#path={
            users: "/api/users",
            rooms: "/api/rooms"
        }

        this.middlewares();

        this.#routes()
    }

    middlewares() {
        this.#app.use(express.json());
        this.#app.use(cors())
        this.#app.use(morgan("dev"));
    }

    #routes(){
        this.#app.use(this.#path.users, require("../api/users/routes"));
        this.#app.use(this.#path.rooms, require("../api/rooms/routes"));
    }

    listen(){
        this.#app.listen(this.port, ()=>{
            console.log("Server started");
        });
    }

    get app(){
        return this.#app;
    }
}

module.exports = ServerManager;