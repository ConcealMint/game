const express = require("express");
const path = require("path");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
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
let playerIdCounter = 1;

io.on("connect", (socket) => {
    connections++;
    console.log("A user connected.", socket.id, "\nNumber of connections:", connections + "\n");

    socket.on("send-player-info-to-server", (data) => {
        if (typeof data === 'object' && (data.hasOwnProperty('name') || data.hasOwnProperty('pfpSrc'))) {
            console.log(data);
            const name = data.name;
            const pfpSrc = data.pfpSrc;
    
            let playerId = -1; // Default player ID
            if (Object.keys(players).length < 4) { // If less than 4 players, assign a new ID
                playerId = playerIdCounter++;
            } else { // If 4 players already exist, find the next available ID
                playerId = findAvailablePlayerId();
            }
    
            const playerName = name;
            players[socket.id] = { playerName, playerId, pfpSrc };
            showAllPlayers();
            io.emit("update-players", players);
            io.emit("updateTotalPlayers", connections);
        }
    });    

    socket.on("disconnect", (reason) => {
        console.log("Disconnected because: " + reason);
        connections--;
        console.log("A user disconnected.", socket.id, "\nNumber of connections:", connections + "\n");
        const disconnectedPlayer = players[socket.id];
        if (disconnectedPlayer) {
            console.log(`Player ${disconnectedPlayer.playerName} with Player ID ${disconnectedPlayer.playerId} disconnected.`);

            // Decrement playerIdCounter if players leave
            playerIdCounter--;

            // Delete the disconnected player
            delete players[socket.id];
            showAllPlayers();
            io.emit("update-players", players);
            io.emit("updateTotalPlayers", connections);
        }
    });

    const findAvailablePlayerId = () => {
        let playerIds = Object.values(players).map(player => player.playerId);
        playerIds.sort((a, b) => a - b); // Sort player IDs in ascending order
        for (let i = 1; i <= 4; i++) {
            if (!playerIds.includes(i)) {
                return i;
            }
        }
        return -1; // No available ID found
    };

    const showAllPlayers = () => {
        console.log("Online players:");
        if (Object.keys(players).length === 0) {
            console.log("No players found.");
        }
        for (const socketId in players) {
            if (players.hasOwnProperty(socketId)) {
                console.log(`Name: ${players[socketId].playerName}, Player ID: ${players[socketId].playerId}, PFP Src: ${players[socketId].pfpSrc}, Socket ID: ${socketId}`);
            }
        }
    }
});

httpServer.listen(6969, () => {
    console.log("Connected to port 6969.");
});
