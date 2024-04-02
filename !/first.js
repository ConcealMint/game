
document.addEventListener("DOMContentLoaded", function () {


    const pages = document.querySelectorAll(".page");
    let readyButton = document.getElementById("readyButton");
    let startButton = document.getElementById("buttonToStartGame");
    let mainScreen = pages[0];
    let lobbyScreen = pages[1];
    let gameScreen = pages[2];
    // lobby.classList.add("active");
    mainScreen.classList.add("active");

    readyButton.addEventListener("click", () => { //to go to lobby screen
        let player01 = document.getElementById("player01ActualName");
        let player02 = document.getElementById("player02ActualName");
        let player03 = document.getElementById("player03ActualName");
        let player04 = document.getElementById("player04ActualName");
        let name = document.getElementById("selectedName");
        let selectedName = name.value.trim();
        let enteredCode = document.getElementById("lobbyTeamCode");
        let actualEnteredCode = enteredCode.value;
        let lobbyTeamCode = "69420x";


        if(actualEnteredCode === lobbyTeamCode){
            player02.textContent = selectedName;
        }


        mainScreen.classList.remove("active");
        lobbyScreen.classList.add("active");

        if (selectedName.length >= 3 || selectedName.length == 0) {
            player01.style.fontSize = "1rem";
            player02.style.fontSize = "1rem";
            player03.style.fontSize = "1rem";
            player04.style.fontSize = "1rem";
        }
        if (selectedName === "") {
            player01.textContent = "A Cool Username";
        }
        else {
            player01.textContent = selectedName;
        }


        startButton.addEventListener("click", () => { //to go to game screen
            mainScreen.classList.remove("active");
            lobbyScreen.classList.remove("active");
            gameScreen.classList.add("active");
        })
        // window.addEventListener("beforeunload", function (event) {
        //     event.preventDefault();
        //     event.returnValue = '';
        //     return 'Your custom warning message goes here.';
        // });
    });
});