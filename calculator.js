
/**
 * Initialize DOM variables
 */
const calculatorPane = document.querySelector(".calculator-pane > span");
const calculatorClear = document.querySelector(".calculator-button[data-value='clear'");
const calculatorButtons = document.querySelectorAll(".calculator-button");
const operators = {add: "+", subtract: "-", multiply: "*", divide: "/"};
calculatorButtons.forEach((button) => button.addEventListener("click", addButtonAction));


/**
 * Initialize calculator variables and define class
 * 
 * Each calculation is as follows:
 * 
 * [ X <OP1> Y <OP2> Z]
 * 
 * Where X, Y, and Z are maths operands, and OP1 and OP2 are maths operators
 * 
 * State:
 * 
 * INITIAL - Start calculation with default inputs
 * SET_X - Set the first operand
 * SET_OP1 - Set the first operator
 * SET_Y - Set the second operand
 * SET_OP2 - Set the second operator
 * SET_Z - Set the final operand
 * EQUAL - End calculation by evaluating inputs
 * 
 * Action:
 * 
 * NUM - Input is a number or decimal e.g. [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "."]
 * OPS - Input is a simple operator (OPS) e.g. [+, -]
 * OPC - Input is a complex operator (OPC) e.g. [*, /]
 * EQL - Input is equals sign (=) i.e. evaluate math expression
 * CLR - Input is clear, meaning to partially or fully reset math expression
 * NEG - Input is negation, same as multiplying by -1
 * PER - Input is percent, same as dividing by 100
 */
const State = { INITIAL: 0, SET_X: 1, SET_OP1: 2, SET_Y: 3, SET_OP2: 4, SET_Z: 5, EQUAL: 6};
const Action = { NUM: 0, OPS: 1, OPC: 2, EQL: 3, CLR: 4, NEG: 5, PER: 6};
const Display = { X: 0, Y: 1, Z: 2, ZERO: 3};

class Calculator {
	constructor(displayPane, clearButton) {
		this.displayPane = displayPane;
		this.clearButton = clearButton;
		this.#defaultInputs(); // Method allows for reset later
	}

	#defaultInputs() {
		this.state = State.INITIAL;
		this.x = "0";
		this.operator1 = "+";
		this.y = "0";
		this.operator2 = "+";
		this.z = "0";
		this.display = Display.X;
	}

	output() {
		switch(this.display) {
		case Display.X: 
			this.displayPane.textContent = this.formatForOutput(this.x);
			break;
		case Display.Y: 
			this.displayPane.textContent = this.formatForOutput(this.y);
			break;
		case Display.Z: 
			this.displayPane.textContent = this.formatForOutput(this.z);
			break;
		case Display.ZERO: 
			this.displayPane.textContent = "0"; 
			break;
		}
	}

	print() {
		console.log(
			Object.keys(State)[this.state], " [", this.x, this.operator1,
			this.y, this.operator2,this.z, "], DISPLAY ", this.displayPane.textContent
		);
	}

	evaluate(a, b, operator) {
		switch(operator) {
		case "+": return (parseFloat(a) + parseFloat(b)).toString(); break;
		case "-": return (parseFloat(a) - parseFloat(b)).toString(); break;
		case "*": return (parseFloat(a) * parseFloat(b)).toString(); break;
		case "/": return (parseFloat(a) / parseFloat(b)).toString(); break;
		}
	}

	handleInput(action, value) {
		let delay = 60;
		switch(action) {
		case Action.NUM:
			this.handleNumberInput(value);
			delay = 0;
			break;
		case Action.OPS: this.handleOperatorSimpleInput(value); break;
		case Action.OPC: this.handleOperatorComplexInput(value); break;
		case Action.EQL: this.handleEqualsInput(); break;
		case Action.CLR: this.handleClearInput(); break;
		case Action.NEG: this.handleNegationInput(); break;
		case Action.PER: this.handlePercentInput(); break;
		}
		
		this.displayPane.textContent = "";
		setTimeout(() => {
			this.output();
			this.print();
		}, delay);
	}

	// If user clicked on a number or decimal button
	handleNumberInput(value) {
		if (this.display === Display.ZERO) {
			this.x = "0";
			this.y = "0";
			this.display = Display.X;
		}
		switch(this.state) {
		case State.INITIAL:
			this.state = State.SET_X;
			this.x = this.updateOperand(this.x, value);
			break;
		case State.SET_X:
			this.x = this.updateOperand(this.x, value);
			break;
		case State.SET_OP1:
			this.state = State.SET_Y;
			this.y = "0";
			this.y = this.updateOperand(this.y, value);
			this.display = Display.Y;
			break;
		case State.SET_Y:
			this.y = this.updateOperand(this.y, value);
			break;
		case State.SET_OP2:
			this.state = State.SET_Z;
			this.z = "0";
			this.z = this.updateOperand(this.z, value);
			this.display = Display.Z;
			break;
		case State.SET_Z:
			this.z = this.updateOperand(this.z, value);
			break;
		case State.EQUAL:
			this.state = State.SET_X;
			this.x = "0"
			this.x = this.updateOperand(this.x, value);
			break;
		}
		this.clearButton.textContent = "C";
	}

	// If user clicked on + or -
	handleOperatorSimpleInput(value) {
		switch(this.state) {
		case State.SET_Y:
		case State.SET_OP2:
		case State.SET_Z:
			this.y = this.evaluate(this.y, this.z, this.operator2);
			this.x = this.evaluate(this.x, this.y, this.operator1);
			this.state = State.SET_OP1;
			this.operator1 = value;
			this.display = Display.X;
			break;
		case State.INITIAL:
		case State.SET_X:
		case State.SET_OP1:
			this.y = this.x;
			this.state = State.SET_OP1;
			this.operator1 = value;
			break;
		case State.EQUAL:
			this.state = State.SET_OP1;
			this.operator1 = value;
			break;
		}
	}

	// If user clicked on * or /
	handleOperatorComplexInput(value) {
		switch(this.state) {
		case State.SET_Y:
			if ("*/".includes(this.operator1)) {
				this.x = this.evaluate(this.x, this.y, this.operator1);
				this.y = this.evaluate(this.x, this.y, this.operator1);
				this.state = State.SET_OP1;
				this.operator1 = value;
			} else {
				this.state = State.SET_OP2;
				this.operator2 = value;
			}
			break;
		case State.SET_OP2:
			this.operator2 = value;
			break;
		case State.SET_Z:
			this.y = this.evaluate(this.y, this.z, this.operator2);
			this.z = this.evaluate(this.y, this.z, this.operator2);
			this.state = State.SET_OP2;
			this.operator2 = value;
			this.display = Display.Y;
			break;
		case State.INITIAL:
		case State.SET_X:
		case State.SET_OP1:
		case State.EQUAL:
			this.state = State.SET_OP1;
			this.operator1 = value;
			break;
		}
	}

	// If user clicked on =
	handleEqualsInput() {
		switch(this.state) {
		case State.SET_OP2:
		case State.SET_Z:
			this.y = this.evaluate(this.y, this.z, this.operator2);
			this.x = this.evaluate(this.x, this.y, this.operator1); // Using new y
			break;
		case State.SET_X:
			this.y = "0";
			this.x = this.evaluate(this.x, this.y, this.operator1);
		default:
			this.x = this.evaluate(this.x, this.y, this.operator1);
			break;
		}
		this.state = State.EQUAL;
		this.display = Display.X;
	}

	// If user clicked C or AC
	handleClearInput() {
		switch(this.state) {
		case State.INITIAL:
			this.#defaultInputs();
			break;
		case State.SET_X:
			this.x = this.resetCalculation(this.x);
			break;
		case State.SET_OP1:
			this.state = State.SET_X;
			this.operator1 = "+";
			this.y = "0";
			break;
		case State.SET_Y:
			this.y = this.resetCalculation(this.y);
			break;
		case State.SET_OP2: 
			this.state = State.SET_Y;
			this.operator2 = "+";
			break;
		case State.SET_Z: 
			this.z = this.resetCalculation(this.z);
			break;
		case State.EQUAL:
			if (this.x !== "0") {
				this.state = State.SET_X;
				this.display = Display.ZERO;
			} else {
				this.#defaultInputs();
			}
			break;
		}
		this.clearButton.textContent = "AC";
	}

	// If user clicks on ±
	handleNegationInput() {
		switch(this.state) {
		case State.INITIAL: break;
		case State.SET_X: this.x = this.makeNegative(this.x); break;
		case State.SET_OP1: 
			this.state = State.SET_Y;
			this.y = this.makeNegative(this.y);
			this.display = Display.Y;
			break;
		case State.SET_Y: this.y = this.makeNegative(this.y); break;
		case State.SET_OP2 : 
			this.state = State.SET_Y;
			this.y = this.makeNegative(this.y); 
			this.display = State.SET_Y;
			break;
		case State.SET_Z: this.z = this.makeNegative(this.z);break;
		case State.EQUAL: 
			this.x = this.makeNegative(this.x);
			break;
		}
	}

	// If user clicks %
	handlePercentInput() {
		switch(this.state) {
		case State.INITIAL: break;
		case State.SET_X: this.x = this.makePercent(this.x); break;
		case State.SET_OP1:
			this.state = State.SET_Y;
			this.y = this.makePercent(this.y);
			this.display = Display.Y;
			break;
		case State.SET_Y: this.y = this.makePercent(this.y); break;
		case State.SET_OP2:
			this.state = State.SET_Z;
			this.z = this.makePercent(this.z);
			this.display = Display.Z; 
			break;
		case State.SET_Z: this.z = this.makePercent(this.z);break;
		case State.EQUAL: this.x = this.makePercent(this.x); break;
		}
	}

	// Append value to number, there can only be 1 decimal value in a number
	updateOperand(operand, value) {
		if (value === ".") {
			!operand.includes(".") && (operand += ".")
		} else {
			operand = operand === "0" ? value : operand + value;
		}
		return operand;
	}

	resetCalculation(operand) {
		if (operand === "0") {
			this.#defaultInputs();
		}
		return "0"
	}

	formatForOutput(value) {
		let [whole, fraction] = value.split(".");
		whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return (fraction ? whole + "." + fraction : whole);
	}

	makeNegative(value) {
		return (value[0] === "-" ? value.slice(1) : "-" + value);
	}

	makePercent(value) {
		return (parseFloat(value) / 100).toString();
	}
}


/**
 * Create calculator and define events
 */
const c = new Calculator(calculatorPane, calculatorClear);
c.print();
function addButtonAction() {

	switch(this.dataset.value) {
	case "0":
	case "1":
	case "2":
	case "3":
	case "4":
	case "5":
	case "6":
	case "7":
	case "8":
	case "9":
	case ".":
		c.handleInput(Action.NUM, this.dataset.value);
		break;
	case "add":
	case "subtract":
		resetButtonStyling()
		this.classList.add('calculator-button-box');
		c.handleInput(Action.OPS, operators[this.dataset.value]);
		break;
	case "multiply":
		resetButtonStyling()
		this.classList.add('calculator-button-box');
		c.handleInput(Action.OPC, operators[this.dataset.value]);
		break;
	case "divide":
		resetButtonStyling()
		this.classList.add('calculator-button-box-top');
		c.handleInput(Action.OPC, operators[this.dataset.value]);
		break;
	case "negate":
		c.handleInput(Action.NEG);
		break;
	case "percent":
		c.handleInput(Action.PER);
		break;
	case "equals":
		resetButtonStyling()
		c.handleInput(Action.EQL);
		break;
	case "clear":
		resetButtonStyling()
		c.handleInput(Action.CLR);
		break;
	}
}

function resetButtonStyling() {
	calculatorButtons.forEach((button) => { 
		button.classList.remove('calculator-button-box');
		button.classList.remove('calculator-button-box-top');
	});
}