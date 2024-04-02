document.addEventListener("DOMContentLoaded", function () {
    let historyDiv = document.querySelector(".history");
    let screen = document.querySelector(".screen");
    let buttons = document.querySelectorAll(".btn");
    let history = "";

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            handleButtonClick(button.innerText);
        });
    });

    function handleButtonClick(value) {
        if (value === "C") {
            clearAll();
        } else if (value === "DEL") {
            deleteLastChar();
        } else if (value === "=") {
            evaluateExpression();
        } else {
            appendToScreen(value);
        }
    }

    function clearAll() {
        screen.value = "";
        history = "";
        updateHistory();
    }

    function deleteLastChar() {
        let currentText = screen.value;
        screen.value = currentText.slice(0, -1);
    }

    function appendToScreen(value) {
        screen.value += value;
    }

    function evaluateExpression() {
        try {
            let expression = screen.value;
            let result = eval(expression);

            result = parseFloat(result.toFixed(5));

            history = expression + " = " + result;
            screen.value = result;
            updateHistory();
        } catch (error) {
            screen.value = "Error";
        }
    }

    function updateHistory() {
        historyDiv.value = history;
    }
});