const express = require("express");
const path = require("path");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io")/*(3000, {
    cors: {
        origin: ["https://localhost:6969"]
    }
})*/;
const httpServer = createServer(app);
const io = new Server(httpServer);



app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, "public")));


app.set("view engine", "ejs");




app.get('/', (req, res) => {
    res.render('index');
});

let connections = 0;
let players = {};
io.on("connection", (socket) => {
    connections++;
    console.log("A user connected.", socket.id, "\nNumber of connections:", connections);
    players[socket.id] = {
        x: 122,
        y: 233
    }
    io.emit("updatePlayers", players);
    socket.on("player-info", (name) => {
        io.emit("show-player-info", name, connections);
    });
    socket.on("join-room", (roomcode) => {
        console.log(roomcode);
        socket.join(roomcode);
        io.emit("joined-room", roomcode);
    })

    socket.on("disconnect", () => {
        connections--;
        console.log("A user disconnected.", socket.id, connections);
        socket.on("player-info", (name) => {
            io.emit("show-player-info", name, connections);
        });
    });
});

httpServer.listen(6969, () => {
    console.log("Connected to port 6969.");
});


