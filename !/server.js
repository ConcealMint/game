const express = require("express");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const path = require("path");
const io = new Server(server);
app.use(express.static(path.resolve("")));
let connections = 0;

io.on("connection", (socket) => {
    console.log("A successful connection is made.");
    connections++;
    console.log("Total connections: " + connections + `.\nUser ID is: ${socket.id}.`
    );
})

app.get("/", (req, res) => {
    return res.render("index.html");
});
server.listen(6969, () => {
    console.log("Connected to port 6969.");
});