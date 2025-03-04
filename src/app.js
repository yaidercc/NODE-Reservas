require("dotenv").config({ path: __dirname + "/../.env" });
const server = require("./server");
const Server = new server();

Server.listen()