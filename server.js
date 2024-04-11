const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, { pingInterval: 2000, pingTimeout: 5000 });

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/gameDB", {

});
const db = mongoose.connection;

// Define Player schema
const playerSchema = new mongoose.Schema({
    name: String,
    pfpSrc: String,
    playerId: Number,
});

const Player = mongoose.model("Player", playerSchema);

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render('index');
});

let connections = 0;
let players = {};
let playerIdCounter = 1;
// Function to update the player IDs of the remaining players
const updateRemainingPlayerIds = () => {
    const remainingPlayers = Object.values(players);
    remainingPlayers.sort((a, b) => a.playerId - b.playerId);

    for (let i = 0; i < remainingPlayers.length; i++) {
        remainingPlayers[i].playerId = i + 1;
    }
};


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

            // Create a new player document
            const newPlayer = new Player({
                name: playerName,
                pfpSrc: pfpSrc,
                playerId: playerId
            });

            // Save player data to MongoDB
            newPlayer.save()
                .then(() => {
                    console.log("Player data saved to MongoDB");
                })
                .catch((err) => {
                    console.error("Error saving player data:", err);
                });

            players[socket.id] = { playerName, playerId, pfpSrc };
            showAllPlayers();
            io.emit("update-players", players);
            io.emit("updateTotalPlayers", connections);
        }
    });

    let prompts = {};

    socket.on("client-s-prompt", (prompt) => {
        // Get the socket ID of the client emitting the prompt
        const clientId = socket.id;

        // Check if prompts exist for this client
        if (!prompts[clientId]) {
            // If prompts don't exist, initialize an empty array
            prompts[clientId] = [];
        }

        // Append the new prompt to the array of prompts for this client
        prompts[clientId].push(prompt);

        // Emit an event to update total players (if needed)
        io.emit("updateTotalPlayers", connections);

        // Log the updated prompts object
        console.log(prompts);
    });




    socket.on("disconnect", async (reason) => {
        console.log("Disconnected because: " + reason);
        connections--;
        console.log("A user disconnected.", socket.id, "\nNumber of connections:", connections + "\n");
        const disconnectedPlayer = players[socket.id];
        if (disconnectedPlayer) {
            console.log(`Player ${disconnectedPlayer.playerName} with Player ID ${disconnectedPlayer.playerId} disconnected.`);

            // Emit player-disconnect event
            io.emit("player-disconnect", disconnectedPlayer.playerId);

            // Delete the disconnected player
            delete players[socket.id];

            try {
                // Remove the disconnected player's data from MongoDB
                const deletedPlayer = await Player.findOneAndDelete({ playerId: disconnectedPlayer.playerId });
                if (deletedPlayer) {
                    console.log("Player data deleted from MongoDB:", deletedPlayer);
                } else {
                    console.log("Player data not found in MongoDB for deletion.");
                }
            } catch (err) {
                console.error("Error deleting player data:", err);
            }

            // Decrement playerIdCounter if players leave
            playerIdCounter--;

            // Update the remaining player IDs to ensure sequential order
            updateRemainingPlayerIds();

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
