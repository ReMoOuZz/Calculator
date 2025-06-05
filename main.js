let firstNumber = "";
let secondNumber = "";
let operator = "";
let isFirstNumber = true;
let justCalculated = false;

function reset() {
  screen.textContent = "0";
  firstNumber = "";
  secondNumber = "";
  operator = "";
  isFirstNumber = true;
  operatorButtons.forEach((btn) => (btn.disabled = false));
  numberButtons.forEach((btn) => (btn.disabled = false));
}

function cleanAfterCalculate() {
  secondNumber = "";
  operator = "";
  isFirstNumber = true;
}

function setErrorClass(isError) {
  let element = document.querySelector(".screen");

  if (isError) {
    element.classList.add("screen-error");
  } else {
    element.classList.remove("screen-error");
  }
}

function calculate() {
  const first = parseFloat(firstNumber);
  const second = parseFloat(secondNumber);
  let result;

  if (operator === "/" && second === 0) {
    screen.textContent = "Really ?";
    reset();
    return;
  }
  switch (operator) {
    case "+":
      result = first + second;
      break;
    case "-":
      result = first - second;
      break;
    case "*":
      result = first * second;
      break;
    case "/":
      result = first / second;
      break;
    default:
      return;
  }

  const resultStr = result.toString();
  screen.textContent = resultStr.length === 13 ? result.toExponential(2) : resultStr;
  screen.textContent = Number.isInteger(result) ? result : result.toFixed(3);

  firstNumber = result.toString();
  secondNumber = "";
  operator = "";
  isFirstNumber = true;

  operatorButtons.forEach((btn) => (btn.disabled = false));
  numberButtons.forEach((btn) => (btn.disabled = false));

  return result;
}

const screen = document.querySelector(".screen");
const operatorButtons = document.querySelectorAll(".operator");
const numberButtons = document.querySelectorAll(".number");
const ResetButton = document.getElementById("button-clearAll");
const resultButton = document.getElementById("button-result");

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (screen.classList.contains("screen-error")) {
      setErrorClass(false);
      screen.textContent = "";
      reset();
    }

    if (justCalculated) {
      firstNumber = "";
      secondNumber = "";
      operator = "";
      isFirstNumber = true;
      screen.textContent = "0";
      justCalculated = false;
    }

    if (isFirstNumber) {
      firstNumber += button.textContent;
      screen.textContent = firstNumber;
    } else {
      secondNumber += button.textContent;
      screen.textContent = secondNumber;
    }

    operatorButtons.forEach((btn) => (btn.disabled = false));

    if (screen.textContent.length === 13) {
      numberButtons.forEach((btn) => (btn.disabled = true));
    }
  });
});

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!isFirstNumber && secondNumber !== "") {
      calculate();
    }

    if (justCalculated) {
      justCalculated = false;
      isFirstNumber = false;
      operator = button.textContent;
      numberButtons.forEach((btn) => (btn.disabled = false));
      operatorButtons.forEach((btn) => (btn.disabled = true));
      return;
    }

    operator = button.textContent;
    isFirstNumber = false;

    numberButtons.forEach((btn) => (btn.disabled = false));
    operatorButtons.forEach((btn) => (btn.disabled = true));
  });
});

ResetButton.addEventListener("click", () => {
  screen.textContent = "0";
  setErrorClass(false);
  reset();
});

resultButton.addEventListener("click", () => {
  if (!isFirstNumber && secondNumber !== "") {
    calculate();
    justCalculated = true;
  } else if (!isFirstNumber && operator !== "") {
    screen.textContent = "Enter a valid number";
    setErrorClass(true);
    cleanAfterCalculate();
  }
});
