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