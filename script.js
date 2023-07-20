let enteredNumber = 0;
let enteredExpression = []

const NUMBER_LIMIT = 1e48;

listen();

function listen() {
    document.addEventListener("keydown", (event) => {
        const keyAction = getEventKey(event)
        if (keyAction){ //if valid key was pressed and acknowledged
            processAction(keyAction);
        }
    });

    Array.from(document.getElementsByClassName("keyboard-button")).forEach(button => {
        button.addEventListener("click", event => {
            const action = button.querySelector(".button-text").textContent;
            processAction(action)
        });
    });
}

function getEventKey(event) {
    const keyCode = event.code;

    const keyCodeToAction = {
        "Backspace": "⌫",
        "Comma": ".",
        "Delete": "CE",
        "Digit0": 0,
        "Digit1": 1,
        "Digit2": 2,
        "Digit3": 3,
        "Digit4": 4,
        "Digit5": 5,
        "Digit6": 6,
        "Digit7": 7,
        "Digit8": 8,
        "Digit9": 9,
        "Equal": "=",
        "Escape": "C",
        "Minus": "-",
        "Numpad0": 0,
        "Numpad1": 1,
        "Numpad2": 2,
        "Numpad3": 3,
        "Numpad4": 4,
        "Numpad5": 5,
        "Numpad6": 6,
        "Numpad7": 7,
        "Numpad8": 8,
        "Numpad9": 9,
        "NumpadDecimal": ".",
        "NumpadDivide": "/",
        "NumpadEnter": "=",
        "Enter": "=",
        "NumpadMultiply": "×",
        "NumpadSubtract": "-",
        "NumpadAdd": "+",
        "Period": ".",
        "Slash": "/",
        "ArrowUp": "+/-"
    };
    return keyCode in keyCodeToAction ? keyCodeToAction[keyCode] : false;
}

function processAction(action) {
    if(Number.isInteger(+action)) {
        addNumberToScreen(+action);
    }

    // const calculatorActionMap = {
    //     "⌫",
    //     ".",
    //     ",",
    //     "=",
    //     "-",
    //     "/",
    //     "+",
    //     "+/-"
    // }
}

function addNumberToScreen(number) {
    const newNum = makeNewNumber(number);
    if(isNumberExceedingLimit(newNum)) return;
    
    // if the number is too big for normal notation
    newNum >= 1e11 ? displayToMainScreen(toExpo(newNum, 2)) : displayToMainScreen(newNum);

    enteredNumber = newNum;
}

function makeNewNumber(number) {
    if(enteredNumber === 0) return number;

    const newNum = (enteredNumber) * 10 + number;
    return newNum;
}

function toExpo(x, f) {
    return Number.parseFloat(x).toExponential(f)
}

function isNumberExceedingLimit(x) {
    const stringNumber = x.toString();

    if(x >= NUMBER_LIMIT) {
        throwError(`Number limit (${NUMBER_LIMIT}) exceeded`);
        return true;
    } else if (stringNumber.length >= 48) {
        throwError(`Character length limit (${NUMBER_LIMIT.toString().length}) exceeded`);
        return true;
    } else if (stringNumber.slice(stringNumber.split().indexOf(".")).length > 5) { //if there are more than 5 numbers after the decimal point
        throwError(`Exceeded number limit (5) after the decimal point`);
        return;
    }

    return false;
}

function displayToMainScreen(input) {
    const screen = document.getElementById("entered");
    screen.textContent = input;
}

function throwError(errorMessage) {
    const screen = document.getElementById("entered");
    const previousText = screen.textContent;
    
    screen.classList.add("error-message");
    screen.textContent = errorMessage;

    setTimeout(() => {
        screen.classList.remove("error-message");
        screen.textContent = previousText;
    }, 1.25 * 1000);
}