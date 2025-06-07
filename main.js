let firstNumber = "";
let secondNumber = "";
let operator = "";
let percentage = "";
let isFirstNumber = true;
let justCalculated = false;
let displayValue = "0";

function updateScreen() {
  screen.textContent = displayValue;
}

function reset() {
  displayValue = "0";
  firstNumber = "";
  secondNumber = "";
  operator = "";
  isFirstNumber = true;
  justCalculated = false;
  updateScreen();
  operatorButtons.forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove("active");
  });
  numberButtons.forEach((btn) => (btn.disabled = false));
}

function removeLastElement() {
  if (isFirstNumber) {
    firstNumber = firstNumber.slice(0, -1);
    screen.textContent = firstNumber || "0";
  } else {
    secondNumber = secondNumber.slice(0, -1);
    screen.textContent = secondNumber || "0";
  }
}

function cleanAfterCalculate() {
  secondNumber = "";
  operator = "";
  isFirstNumber = true;
}

function formatResult(value) {
  if (Number.isInteger(value)) {
    return value.toString();
  } else {
    return value.toString().length > 14 ? value.toExponential(2) : value.toFixed(3);
  }
}

function calculatePercentage(first, second, operator) {
  switch (operator) {
    case "+":
      return first + (first * second) / 100;
    case "-":
      return first - (first * second) / 100;
    case "*":
      return first * (second / 100);
    case "/":
      return first / (second / 100);
    default:
      throw new Error("Invalid operator");
  }
}

function getPercentage() {
  try {
    const firstElement = parseFloat(firstNumber);
    const secondElement = parseFloat(secondNumber);

    if (isNaN(firstElement) || isNaN(secondElement)) {
      throw new Error("Invalid numbers");
    }

    const result = calculatePercentage(firstElement, secondElement, operator);
    screen.textContent = formatResult(result);
    firstNumber = "";
    secondNumber = "";
    operator = "";
    isFirstNumber = true;
  } catch (error) {
    screen.textContent = "Invalid operation";
    setErrorClass(true);
    cleanAfterCalculate();
  }
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
    displayValue = "Really ?";
    updateScreen();
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

  displayValue = formatResult(result);
  updateScreen();

  firstNumber = displayValue;
  secondNumber = "";
  operator = "";
  isFirstNumber = true;
  justCalculated = true;

  operatorButtons.forEach((btn) => (btn.disabled = false));
  numberButtons.forEach((btn) => (btn.disabled = false));

  return result;
}

const screen = document.querySelector(".screen");
const operatorButtons = document.querySelectorAll(".operator");
const numberButtons = document.querySelectorAll(".number");
const resetAllButton = document.getElementById("button-clearAll");
const resultButton = document.getElementById("button-result");
const ResetButton = document.getElementById("button-clear");
const percentageButton = document.getElementById("button-percentage");

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!isFirstNumber && secondNumber !== "") {
      calculate();
    }

    const symbol = button.textContent;

    if (!operator && symbol === "-" && (firstNumber === "" || firstNumber === "0" || justCalculated)) {
      firstNumber = "-";
      displayValue = firstNumber;
      updateScreen();
      justCalculated = false;
      return;
    }

    if (operator && symbol === "-" && (secondNumber === "" || secondNumber === "0")) {
      secondNumber = "-";
      displayValue = secondNumber;
      updateScreen();
      return;
    }

    if (justCalculated) {
      justCalculated = false;
      firstNumber = displayValue;
      secondNumber = "";
      operator = "";
    }

    operator = symbol;
    isFirstNumber = false;
    numberButtons.forEach((btn) => (btn.disabled = false));
    operatorButtons.forEach((btn) => {
      btn.disabled = btn.textContent !== "-";
      btn.classList.remove("active");
    });
    button.classList.add("active");
    updateScreen();
  });
});

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (screen.classList.contains("screen-error")) {
      setErrorClass(false);
      reset();
    }

    if (justCalculated) {
      firstNumber = "";
      secondNumber = "";
      operator = "";
      isFirstNumber = true;
      displayValue = "0";
      updateScreen();
      justCalculated = false;
    }

    if (isFirstNumber) {
      if (firstNumber === "-") {
        firstNumber = "-" + button.textContent;
      } else if (firstNumber === "0") {
        firstNumber = button.textContent;
      } else {
        firstNumber += button.textContent;
      }
      displayValue = firstNumber;
    } else {
      if (secondNumber === "-") {
        secondNumber = "-" + button.textContent;
      } else if (secondNumber === "0") {
        secondNumber = button.textContent;
      } else {
        secondNumber += button.textContent;
      }
      displayValue = secondNumber;
    }
    updateScreen();

    operatorButtons.forEach((btn) => (btn.disabled = false));

    if (screen.textContent.length === 13) {
      numberButtons.forEach((btn) => (btn.disabled = true));
    }
  });
});

resetAllButton.addEventListener("click", () => {
  displayValue = "0";
  updateScreen();
  setErrorClass(false);
  reset();
});

ResetButton.addEventListener("click", () => {
  removeLastElement();
});

percentageButton.addEventListener("click", () => {
  percentage = percentageButton.textContent;
});

resultButton.addEventListener("click", () => {
  if (percentage === "%") {
    if (firstNumber && operator && secondNumber) {
      getPercentage();
    } else {
      screen.textContent = "Invalid operation";
      setErrorClass(true);
      cleanAfterCalculate();
    }
  } else {
    if (!isFirstNumber && secondNumber !== "") {
      calculate();
      justCalculated = true;
    } else if (!isFirstNumber && operator !== "") {
      screen.textContent = "Enter a valid number";
      setErrorClass(true);
      cleanAfterCalculate();
    }
  }
});

document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (screen.textContent === "0") {
    screen.textContent = "";
  }

  if (screen.classList.contains("screen-error")) {
    setErrorClass(false);
    reset();
  }

  if (justCalculated) {
    secondNumber = "";
    operator = "";
    isFirstNumber = true;
    displayValue = firstNumber;
    updateScreen();
    justCalculated = false;
  }

  if (/^[0-9]$/.test(e.key)) {
    if (justCalculated) {
      firstNumber = displayValue;
      secondNumber = "";
      operator = "";
      isFirstNumber = true;
      justCalculated = false;
    }

    if (isFirstNumber) {
      if (firstNumber === "-") {
        firstNumber = "-" + e.key;
      } else if (firstNumber === "0") {
        firstNumber = e.key;
      } else {
        firstNumber += e.key;
      }
      displayValue = firstNumber;
    } else {
      if (secondNumber === "-") {
        secondNumber = "-" + e.key;
      } else if (secondNumber === "0") {
        secondNumber = e.key;
      } else {
        secondNumber += e.key;
      }
      displayValue = secondNumber;
    }

    if (isFirstNumber && firstNumber.length >= 13) {
      numberButtons.forEach((btn) => (btn.disabled = true));
      return;
    }
    if (!isFirstNumber && secondNumber.length >= 13) {
      numberButtons.forEach((btn) => (btn.disabled = true));
      return;
    }

    updateScreen();
  }

  if (/^[+\-*/]$/.test(e.key)) {
    const symbol = e.key;

    if (justCalculated) {
      justCalculated = false;
      firstNumber = displayValue;
      secondNumber = "";
      operator = "";
      isFirstNumber = false;
    }

    if (!isFirstNumber && secondNumber !== "") {
      calculate();
    }

    if (!operator && symbol === "-" && (firstNumber === "" || firstNumber === "0")) {
      firstNumber = "-";
      displayValue = firstNumber;
      updateScreen();
      return;
    }

    if (operator && symbol === "-" && (secondNumber === "" || secondNumber === "0")) {
      secondNumber = "-";
      displayValue = secondNumber;
      updateScreen();
      return;
    }

    operator = symbol;
    isFirstNumber = false;
    numberButtons.forEach((btn) => (btn.disabled = false));
    operatorButtons.forEach((btn) => {
      btn.disabled = btn.textContent !== "-";
      btn.classList.remove("active");
    });
    const activeButton = Array.from(operatorButtons).find((btn) => btn.textContent === symbol);
    if (activeButton) {
      activeButton.classList.add("active");
    }

    updateScreen();
  }

  if (e.key === "ù") {
    percentage = "%";
  }

  if (e.key === "=" || e.key === "Enter") {
    if (percentage === "%") {
      if (firstNumber && operator && secondNumber) {
        getPercentage();
      } else {
        screen.textContent = "Invalid operation";
        setErrorClass(true);
        cleanAfterCalculate();
      }
    } else {
      if (!isFirstNumber && secondNumber !== "") {
        calculate();
        justCalculated = true;
      } else if (!isFirstNumber && operator !== "") {
        screen.textContent = "Enter a valid number";
        setErrorClass(true);
        cleanAfterCalculate();
      }
    }
  }

  if (e.key === "Delete") {
    removeLastElement();
  }

  if (e.key === "Backspace") {
    reset();
    updateScreen();
  }
});
