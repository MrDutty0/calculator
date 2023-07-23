let enteredNumber = 0;
let enteredExpression = [];
let isDotAdded = false;

const NUMBER_LIMIT = Number.MAX_SAFE_INTEGER;

listen();

function listen() {
    document.addEventListener("keydown", (event) => {
        const keyAction = getEventKey(event)
        if (keyAction !== null){ //if valid key was pressed and acknowledged
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
        "ArrowUp": "+/-",
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
        "Slash": "/"
    };
    return keyCode in keyCodeToAction ? keyCodeToAction[keyCode] : null;
}

function processAction(action) {
    if (Number.isInteger(+action)) {
        addNumberToScreen(+action);
        return;
    }

    const calculatorActionMap = {
        "⌫": deleteLastDigit,
        ".": addDot,
        // "=",
        // "-",
        // "×",
        // "/",
        // "+",
        // "+/-"
    }
    if (action in calculatorActionMap) {
        calculatorActionMap[action]();
    }
}

function addNumberToScreen(number) {
    const newNum = makeNewNumber(number);
    if (isNumberExceedingLimit(newNum)) return;

    displayToMainScreen(transformIntoCorrectForm(newNum));

    enteredNumber = newNum;
}

function makeNewNumber(number) {
    if (enteredNumber === 0) return number;

    if (isDotAdded) {
        if (Number.isInteger(enteredNumber)) {
            return +(`${enteredNumber}.${number}`);
        }
    }

    return +(`${enteredNumber}${number}`);
}

function toExpo(x) {
    return Number.parseFloat(x).toExponential(2)
}

function isNumberExceedingLimit(x) {
    const stringNumber = x.toString();

    if (x >= NUMBER_LIMIT) {
        showError(`Number limit (${toExpo(NUMBER_LIMIT)}) exceeded`);
        return true;
    } else if (stringNumber.length > 15) {
        showError(`Character length limit (${NUMBER_LIMIT.toString().length}) exceeded`);
        return true;
    } else if (stringNumber.slice(stringNumber.indexOf(".")).length > 6) { //if there are more than 5 numbers after the decimal point
        showError(`Exceeded number limit (5) after the decimal point`);
        return true;
    }

    return false;
}

function displayToMainScreen(input) {
    const screen = document.getElementById("entered");
    screen.textContent = input;
}

function showError(errorMessage) {
    const screen = document.getElementById("entered");
    const previousText = transformIntoCorrectForm(enteredNumber);    
    
    screen.textContent = errorMessage;
    screen.classList.add("error-message");

    setTimeout(() => {
        screen.classList.remove("error-message");
        screen.textContent = previousText;
    }, 1.25 * 1000);
}

function deleteLastDigit() {
    // Get the whole number except the last element
    const stringNumber = enteredNumber.toString();

    const indexOfDot = stringNumber.indexOf(".");
    if (isDotAdded) {
        if (indexOfDot === -1) {
            displayToMainScreen(transformIntoCorrectForm(enteredNumber));
            isDotAdded = false;
            return;
        } 
    }

    enteredNumber = +stringNumber.slice(0, -1);
    if (isDotAdded && Number.isInteger(enteredNumber)) {
        displayToMainScreen(transformIntoCorrectForm(enteredNumber) + ".")
        return;
    }
    displayToMainScreen(transformIntoCorrectForm(enteredNumber));
}

function addDot() {
    if (isDotAdded) return;
    displayToMainScreen(transformIntoCorrectForm(enteredNumber) + ".");
    isDotAdded = true;
}

function transformIntoCorrectForm(number) {
    const stringNumber = number.toString();

    let numberPartAfterDot;
    let integerPart;

    if (isDotAdded && stringNumber.includes(".")) {
        const indexOfDot = stringNumber.indexOf(".");

        numberPartAfterDot = stringNumber.slice(indexOfDot);
        integerPart = stringNumber.slice(0, indexOfDot);
    } else {
        numberPartAfterDot = "";
        integerPart = number;
    }

    let numberToDisplay;

    if (stringNumber.length >= 11) {
        numberToDisplay = toExpo(integerPart) + numberPartAfterDot;
    } else {
        numberToDisplay = number;
    }

    return numberToDisplay;
}