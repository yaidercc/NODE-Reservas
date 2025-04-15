const express = require('express');
const cors = require('cors');
const morgan = require("morgan");

class ServerManager {
    #app;
    #path;
    #server;
    constructor() {
        this.port = process.env.PORT || 4000;
        this.#app = express();

        this.#path={
            users: "/api/users",
            rooms: "/api/rooms",
            reservations: "/api/reservations",
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
        this.#app.use(this.#path.reservations, require("../api/reservations/routes"));
    }

    listen(){
        this.#server = this.#app.listen(this.port, ()=>{
            console.log("Server started");
        });
    }

    get app(){
        return this.#app;
    }

    close() {
        return new Promise((resolve, reject) => {
            if (this.#server) {
                this.#server.close((err) => {
                    if (err) {
                        return reject(err);
                    }
                    console.log("Server closed");
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

}

module.exports = ServerManager;