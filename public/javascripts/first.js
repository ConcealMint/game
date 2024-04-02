const socket = io();

socket.on("connect", () => {
    console.log("Connected.");
});

document.addEventListener("DOMContentLoaded", function () {

    // window.addEventListener("beforeunload", function (event) {
    //     event.preventDefault();
    //     event.returnValue = '';
    // });
    const pages = document.querySelectorAll(".page");
    let readyButton = document.getElementById("readyButton");
    let startButton = document.getElementById("buttonToStartGame");
    let mainScreen = pages[0];
    let lobbyScreen = pages[1];
    let gameScreen = pages[2];
    // lobby.classList.add("active");
    let selectedName = document.getElementById("selectedName");
    mainScreen.classList.add("active");

    readyButton.addEventListener("click", () => { //to go to lobby screen
        let name = selectedName.value;
        let buttonToJoinGame = document.getElementById("buttonToJoinGame");
        let numberOfPlayersOutOfTotal = document.getElementById("numberOfPlayersOutOfTotal");
        console.log(name);
        mainScreen.classList.remove("active");
        lobbyScreen.classList.add("active");
        let room = "1234";
        socket.emit("player-info", name);

        buttonToJoinGame.addEventListener("click", () => {
            let lobbyTeamCode = document.getElementById("lobbyTeamCode").value;
            socket.emit("join-room", lobbyTeamCode);
            socket.on("joined-room", (roomcode) => {
                let lobbyTeamCodePrompt = document.getElementById("lobbyTeamCodePrompt");
                lobbyTeamCodePrompt.textContent = `Joined room: ${roomcode}.`;
            });
            socket.on("show-player-info", (name, connections) => {
                numberOfPlayersOutOfTotal.textContent = `0/4`;
                let player01ActualName = document.getElementById("player01ActualName");
                let player02ActualName = document.getElementById("player02ActualName");
                let player03ActualName = document.getElementById("player03ActualName");
                let player04ActualName = document.getElementById("player04ActualName");
                switch (connections) {
                    case 1: {
                        numberOfPlayersOutOfTotal.textContent = `1/4`;
                        player01ActualName.textContent = name;
                        break;
                    }
                    case 2: {
                        numberOfPlayersOutOfTotal.textContent = `2/4`;
                        player02ActualName.textContent = name;
                        break;
                    }
                    case 3: {
                        numberOfPlayersOutOfTotal.textContent = `3/4`;
                        player03ActualName.textContent = name;
                        break;
                    }
                    case 4: {
                        numberOfPlayersOutOfTotal.textContent = `4/4`;
                        player04ActualName.textContent = name;
                        break;
                    }
                }
            });
        });


        // startButton.addEventListener("click", () => { //to go to game screen
        //     mainScreen.classList.remove("active");
        //     lobbyScreen.classList.remove("active");
        //     gameScreen.classList.add("active");
        //     socket.emit("join-room");
        // });
    });
});