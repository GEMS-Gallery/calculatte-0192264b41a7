import { backend } from 'declarations/backend';

let display = document.getElementById('display');
let buttons = document.querySelectorAll('button');
let currentValue = '';
let operator = '';
let firstOperand = null;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (button.classList.contains('num')) {
            currentValue += value;
            display.value = currentValue;
        } else if (button.classList.contains('op')) {
            if (firstOperand === null) {
                firstOperand = parseFloat(currentValue);
                operator = value;
                currentValue = '';
            } else {
                calculate();
                operator = value;
            }
        } else if (button.id === 'equals') {
            calculate();
        } else if (button.id === 'clear') {
            clear();
        }
    });
});

async function calculate() {
    if (firstOperand !== null && currentValue !== '') {
        const secondOperand = parseFloat(currentValue);
        let result;

        try {
            switch (operator) {
                case '+':
                    result = await backend.add(firstOperand, secondOperand);
                    break;
                case '-':
                    result = await backend.subtract(firstOperand, secondOperand);
                    break;
                case '*':
                    result = await backend.multiply(firstOperand, secondOperand);
                    break;
                case '/':
                    const divisionResult = await backend.divide(firstOperand, secondOperand);
                    if (divisionResult === null) {
                        throw new Error('Division by zero');
                    }
                    result = divisionResult;
                    break;
            }

            display.value = result;
            firstOperand = result;
            currentValue = '';
        } catch (error) {
            display.value = 'Error';
            clear();
        }
    }
}

function clear() {
    currentValue = '';
    operator = '';
    firstOperand = null;
    display.value = '';
}
