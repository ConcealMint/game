document.addEventListener("DOMContentLoaded", function () {
    const socket = io();

    socket.on("connect", () => {
        console.log("Connected.");
    });

    const reselect = document.getElementById("reselect");
    const playerPFP = document.getElementById("playerPFP");
    reselect.addEventListener("click", () => {
        let pfps = Math.floor(Math.random() * 5);
        switch (pfps) {
            case 0: {
                playerPFP.setAttribute("src", "../images/gameLogo.png");
                break;
            }
            case 1: {
                playerPFP.setAttribute("src", "../images/logo.png");
                break;
            }
            case 2: {
                playerPFP.setAttribute("src", "../images/tulla.png");
                break;
            }
            case 3: {
                playerPFP.setAttribute("src", "../images/player01.png");
                break;
            }
            case 4: {
                playerPFP.setAttribute("src", "../images/reselect.png");
                break;
            }
        }
    });

    const pages = document.querySelectorAll(".page");
    const readyButton = document.getElementById("readyButton");
    const mainScreen = pages[0];
    const lobbyScreen = pages[1];
    const gameScreen = pages[2];
    const selectedName = document.getElementById("selectedName");

    mainScreen.classList.add("active");

    readyButton.addEventListener("click", () => {
        mainScreen.classList.remove("active");
        lobbyScreen.classList.add("active");

        let name = selectedName.value.trim() || "Cool User";
        socket.emit("send-player-info-to-server", { name, playerPFP });

        const playerElements = {
            player01: document.getElementById("player01ActualName"),
            player02: document.getElementById("player02ActualName"),
            player03: document.getElementById("player03ActualName"),
            player04: document.getElementById("player04ActualName")
        };

        socket.on("update-players", (backendPlayers) => {
            // Clear previous player data
            // Render the player names and PFPs on the lobby page
            for (let playerId in backendPlayers) {
                const backendPlayer = backendPlayers[playerId];
                const playerName = backendPlayer.playerName;
                const playerID = backendPlayer.playerId;
                const playerPFP = backendPlayer.pfpSrc;

                // Get the corresponding player element
                let playerElement = playerElements[`player0${playerID}`];

                // Check if player element exists
                if (playerElement) {
                    // Update player name
                    playerElement.textContent = playerName;
                    // Update player ID
                    playerElement.dataset.playerId = playerID;
                    // Update player PFP
                    playerElement.previousElementSibling.src = playerPFP;
                }
            }

            let occupiedIndex = 1;
            for (let i = 1; i <= 4; i++) {
                const playerElement = playerElements[`player0${i}`];
                if (playerElement.textContent !== "") {
                    if (i !== occupiedIndex) {
                        playerElements[`player0${occupiedIndex}`].textContent = playerElement.textContent;
                        playerElements[`player0${occupiedIndex}`].dataset.playerId = playerElement.dataset.playerId;
                        playerElement.textContent = "";
                        playerElement.dataset.playerId = "";
                    }
                    occupiedIndex++;
                }
            }
        });
        socket.on("updateTotalPlayers", (players) => {
            let numberOfPlayersOutOfTotal = document.getElementById("numberOfPlayersOutOfTotal");
            switch (players) {
                case 1: {
                    numberOfPlayersOutOfTotal.textContent = players + " / 4";
                    break;
                }
                case 2: {
                    numberOfPlayersOutOfTotal.textContent = players + " / 4";
                    break;
                }
                case 3: {
                    numberOfPlayersOutOfTotal.textContent = players + " / 4";
                    break;
                }
                case 4: {
                    numberOfPlayersOutOfTotal.textContent = players + " / 4";
                    break;
                }
            }
        });

        socket.on("player-disconnect", (disconnectedPlayerId) => {
            const playerElement = playerElements[`player0${disconnectedPlayerId}`];
            if (playerElement) {
                playerElement.textContent = "";
                playerElement.dataset.playerId = "";
            }
        });
    });
});
