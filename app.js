require("dotenv").config();

const server = require("./server");
const Server = new server();

Server.listen()

module.exports = Server;