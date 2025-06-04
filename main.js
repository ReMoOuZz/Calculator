function reset() {
  firstNumber = "";
  secondNumber = "";
  operator = "";
  features = "";
  isFirstNumber = true;
}

function calculate() {
  const firstNumberCalculate = parseInt(firstNumber);
  const secondNumberToCalculate = parseInt(secondNumber);
  let result;

  if (operator === "+") {
    result = firstNumberCalculate + secondNumberToCalculate;
  } else if (operator === "-") {
    result = firstNumberCalculate - secondNumberToCalculate;
  } else if (operator === "*") {
    result = firstNumberCalculate * secondNumberToCalculate;
  } else if (operator === "/") {
    result = firstNumberCalculate / secondNumberToCalculate;
  }

  if (operator === "/" && (firstNumberCalculate === 0 || secondNumberToCalculate === 0)) {
    screen.textContent = "Really ??";
    reset();
    return;
  }

  screen.textContent = result;
  firstNumber = result.toString();
  secondNumber = "";
  operator = "";
  isFirstNumber = true;
  return result;
}

const screen = document.querySelector(".screen");
const operatorButtons = document.querySelectorAll(".operator");
const numberButtons = document.querySelectorAll(".number");
const featuresButton = document.querySelectorAll(".feature");
const ResetButton = document.getElementById("button-clearAll");
const resultButton = document.getElementById("button-result");

let firstNumber = "";
let secondNumber = "";
let operator = "";
let features = "";
let isFirstNumber = true;

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (isFirstNumber) {
      firstNumber += button.textContent;
      screen.textContent = firstNumber;
    } else {
      secondNumber += button.textContent;
      screen.textContent = secondNumber;
    }
  });
});

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    operator = button.textContent;
    screen.textContent = "0";
    isFirstNumber = false;
  });
});

featuresButton.forEach((button) => {
  button.addEventListener("click", () => {
    features = button.textContent;
    console.log(features);
  });
});

ResetButton.addEventListener("click", () => {
  screen.textContent = "0";
  reset();
});

resultButton.addEventListener("click", () => {
  calculate();
});
