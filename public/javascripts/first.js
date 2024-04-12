document.addEventListener("DOMContentLoaded", function () {
    const socket = io();

    socket.on("connect", () => {
        console.log("Connected.");
    });
    // Select the favicon link element
const favicon = document.getElementById("favicon");

// Function to toggle between two favicon images with a specified interval
function animateFavicon() {
    // Define an array of URLs for your favicon frames
    const frames = [
        "../images/1.png",
        "../images/2.png",
        "../images/3.png",
        "../images/4.png",
        "../images/5.png",
    ];

    let currentIndex = 0;

    // Update the favicon with the next frame
    function updateFavicon() {
        favicon.href = frames[currentIndex];
        currentIndex = (currentIndex + 1) % frames.length;
    }

    // Update favicon at regular intervals to create animation
    setInterval(updateFavicon, 500); // Change 500 to adjust the animation speed
}

// Call the function to start the animation
animateFavicon();

    const reselect = document.getElementById("reselect");
    const playerPFP = document.getElementById("playerPFP");
    reselect.addEventListener("click", () => {
        let pfps = Math.floor(Math.random() * 5);
        switch (pfps) {
            case 0: {
                playerPFP.setAttribute("src", "../images/player03.png");
                break;
            }
            case 1: {
                playerPFP.setAttribute("src", "../images/player04.png");
                break;
            }
            case 2: {
                playerPFP.setAttribute("src", "../images/player02.png");
                break;
            }
            case 3: {
                playerPFP.setAttribute("src", "../images/player01.png");
                break;
            }
            case 4: {
                playerPFP.setAttribute("src", "../images/player05.png");
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
    /* remove now */
    // mainScreen.classList.remove("active");
    // gameScreen.classList.add("active");
    /* remove now */

    readyButton.addEventListener("click", () => {
        mainScreen.classList.remove("active");
        lobbyScreen.classList.add("active");

        let name = selectedName.value.trim() || "Cool User";
        let pfpSrc = playerPFP.src;
        socket.emit("send-player-info-to-server", { name, pfpSrc });

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

                    // Update player PFP if it's not undefined
                    if (playerPFP) {
                        let playerPFPElement = document.getElementById(`player0${playerID}ActualPFP`);
                        if (playerPFPElement) {
                            playerPFPElement.src = playerPFP;
                        }
                    }
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
            socket.emit("update-players");
        });

        socket.on("player-disconnect", (disconnectedPlayerId) => {
            const playerElement = playerElements[`player0${disconnectedPlayerId}`];
            if (playerElement) {
                playerElement.textContent = "";
                playerElement.dataset.playerId = "";

                // Reset the profile picture
                const playerPFPElement = document.getElementById(`player0${disconnectedPlayerId}ActualPFP`);
                if (playerPFPElement) {
                    playerPFPElement.src = ""; // Set the source to an empty string
                }

                // Shift the positions of the remaining players
                for (let i = disconnectedPlayerId + 1; i <= 4; i++) {
                    const nextPlayerElement = playerElements[`player0${i}`];
                    const currentPlayerElement = playerElements[`player0${i - 1}`];
                    if (nextPlayerElement && currentPlayerElement) {
                        // Move the next player's information to the current player's position
                        currentPlayerElement.textContent = nextPlayerElement.textContent;
                        currentPlayerElement.dataset.playerId = nextPlayerElement.dataset.playerId;

                        // Clear the next player's information
                        nextPlayerElement.textContent = "";
                        nextPlayerElement.dataset.playerId = "";
                    }
                }
            }
        });

    });
    let buttonToStartGame = document.getElementById("buttonToStartGame");
buttonToStartGame.addEventListener("click", () => {
    console.log('Button clicked');
    lobbyScreen.classList.remove("active");
    gameScreen.classList.add("active");
});

let promptProceed = document.getElementById("promptProceed");
promptProceed.addEventListener("click", () => {
    let gameTextPrompt = document.getElementById("gameTextPrompt").value;
    console.log("Value of gameTextPrompt:", gameTextPrompt);
    socket.emit("client-s-prompt", gameTextPrompt);
});
});
