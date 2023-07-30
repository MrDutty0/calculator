let enteredNumber = 0;
let enteredExpression = [];
let isDotAdded = false;
let errorInCalculationOccurred = false;

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
        "NumpadDivide": "÷",
        "NumpadEnter": "=",
        "Enter": "=",
        "NumpadMultiply": "×",
        "NumpadSubtract": "-",
        "NumpadAdd": "+",
        "Period": ".",
        "Slash": "÷"
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
        "=": calculate,
        "-": () => addSignToCalculate("-"),
        "×": () => addSignToCalculate("*"),
        "÷": () => addSignToCalculate("/"),
        "+": () => addSignToCalculate("+"),
        "+/-": changeSign,
        "CE": () => clearInput(clearEverything = false),
        "C": () => clearInput(clearEverything = true),
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

    let [firstPart, secondPart] = stringNumber.split(".");
    firstPart = transformIntoCorrectForm(firstPart);
    secondPart = secondPart ? "." + secondPart : "";

    let numberLength = firstPart.length + secondPart.length;

    let isError = false;

    if (x >= NUMBER_LIMIT) {
        showError(`Number limit (${toExpo(NUMBER_LIMIT)}) exceeded`);
        isError = true;
    } else if (numberLength > 12) {
        showError("Exceeded number length limit (11)");
        isError = true;
    } 
    else if (secondPart.length > 6) { //if there are more than 5 numbers after the decimal point
        showError(`Exceeded number limit (5) after the decimal point`);
        isError = true;
    }

    return isError;
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

    if (stringNumber.length === 2 && stringNumber[0] === "-") {
        enteredNumber = 0;
        displayToMainScreen(0);
        return;
    }

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

    let [firstPart, secondPart] = stringNumber.split(".");
    secondPart = secondPart ? "." + secondPart : "";

    if(firstPart.length + secondPart.length >= 11) {
        firstPart = toExpo(firstPart);
    }

    return firstPart + secondPart;
}

function changeSign() {
    if(enteredNumber === 0) return;

    enteredNumber *= -1;
    displayToMainScreen(transformIntoCorrectForm(enteredNumber));
}

function addSignToCalculate(sign) {
    if (enteredNumber == 0) {
        enteredExpression.pop();
        enteredExpression.push(sign);
    } else {
        enteredExpression.push(enteredNumber, sign);
        enteredNumber = 0;
        displayToMainScreen(0);
    }

    reloadCalculationScreen();
}

function reloadCalculationScreen() {
    let calculationText = "";

    enteredExpression.forEach(item => {
        if (!isNaN(+item)) {
            const number = item;
            if (number < 0) {
                calculationText += `(${transformIntoCorrectForm(number)}) `;
            } else {
                calculationText += transformIntoCorrectForm(number) + " ";
            }
        } else {
            calculationText += item + " ";
        }
    });

    const historyElement = document.querySelector("#history");
    historyElement.textContent = calculationText;

    scrollMaxRigth();
}

function scrollMaxRigth() {
    const scrollableElement = document.querySelector("#history");

    const scrollDistanceToLeft = scrollableElement.scrollWidth - scrollableElement.clientWidth;
    scrollableElement.scrollLeft = scrollDistanceToLeft;
}

function clearInput(clearEverything = false) {
    const inputScreen = document.getElementById("entered");
    inputScreen.textContent = "0";
    enteredNumber = 0;

    if(clearEverything) {
        const history = document.querySelector("#history");
        history.textContent = "";
        enteredExpression = [];
    }
}

function calculate() { 
    prepareLastNumberForCalculation();

    // Order of operations
    evaluate("/");
    evaluate("*");

    evaluate("-");
    evaluate("+");
    if(errorInCalculationOccurred) {
        enteredExpression.pop();
        return;
    };

    const result = enteredExpression[0];
    clearInput(clearEverything = true);

    enteredNumber = numberToFixed(result, 5);

    displayToMainScreen(transformIntoCorrectForm(enteredNumber));
}

function prepareLastNumberForCalculation() {
    if (enteredNumber == 0) {
        enteredExpression.pop();
    } else {
        enteredExpression.push(enteredNumber);
    }
}

function evaluate(operator) {
    let indexOfOperator = enteredExpression.indexOf(operator);

    while (isElementFound(indexOfOperator)) {
        const firstOperand = enteredExpression[indexOfOperator - 1];
        const secondOperand = enteredExpression[indexOfOperator + 1];
        const operator = enteredExpression[indexOfOperator];

        const result = getResult(firstOperand, secondOperand, operator);

        const fixedNumber = numberToFixed(result, 5);
        if (isNumberExceedingLimit(fixedNumber)) {
            errorInCalculationOccurred = true;
            return
        } else errorInCalculationOccurred = false;

        //remove the operands and the operator. In their place put the result
        enteredExpression.splice(indexOfOperator - 1, 3, result);

        indexOfOperator = enteredExpression.indexOf(operator);
    }
}

function isElementFound(index) {
    return index >= 0;
}

function getResult(a, b, operator) {
    switch (operator) {
        case "/":
            return a / b;

        case "*":
            return a * b;

        case "-":
            return a - b;

        case "+":
            return a + b;
    }
}

function numberToFixed(number, afterPoint) {
    return +Number.parseFloat(number).toFixed(afterPoint);
}
