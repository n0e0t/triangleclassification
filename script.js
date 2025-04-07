document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", handleSubmit);
});

function handleSubmit(event) {
    event.preventDefault();

    const side1 = document.getElementById("side1");
    const side2 = document.getElementById("side2");
    const side3 = document.getElementById("side3");

    const side1Value = side1.value.trim();
    const side2Value = side2.value.trim();
    const side3Value = side3.value.trim();

    const side1Error = document.getElementById("side1Error");
    const side2Error = document.getElementById("side2Error");
    const side3Error = document.getElementById("side3Error");

    let output1 = validateInput(side1Value);
    let output2 = validateInput(side2Value);
    let output3 = validateInput(side3Value);

    if (output1 !== "Input valid." || output2 !== "Input valid." || output3 !== "Input valid.") {
        side1Error.textContent = (output1 !== "Input valid.") ? output1 : "";
        side2Error.textContent = (output2 !== "Input valid.") ? output2 : "";
        side3Error.textContent = (output3 !== "Input valid.") ? output3 : "";

        side1.style.borderColor = (output1 !== "Input valid.") ? "red" : "";
        side2.style.borderColor = (output2 !== "Input valid.") ? "red" : "";
        side3.style.borderColor = (output3 !== "Input valid.") ? "red" : "";

        displayResult("");
        return;
    }

    side1Error.textContent = "";
    side2Error.textContent = "";
    side3Error.textContent = "";

    side1.style.borderColor = "";
    side2.style.borderColor = "";
    side3.style.borderColor = "";

    let { x, y, z } = sortSides(Number(side1Value), Number(side2Value), Number(side3Value));
    const triangleType = classifyTriangle(x, y, z);
    displayResult(triangleType);
    showTriangleImage(triangleType);
    suggestTransformations(x, y, z);
}

function displayResult(result) {
    const resultDiv = document.getElementById("result");
    if (result === "Invalid input." || result === "Not a Triangle") {
        resultDiv.style.color = "red";
    } else {
        resultDiv.style.color = "black";
    }
    resultDiv.value = result;
}

function validateInput(value) {
    if (typeof value !== "string" || value.trim() === "") {
        return "Field can’t be empty";
    }

    if (value.trim() === "0") {
        return "Side of triangle can’t be 0";
    }

    const regex = /^[0-9]+(\.[0-9]{1,2})?$/;
    if (!regex.test(value)) {
        return "Value can’t be special characters or arithmetic operators";
    }

    return "Input valid.";
}

function sortSides(a, b, c) {
    let sides = [a, b, c];
    sides.sort((a, b) => a - b);
    let [x, y, z] = sides;
    return { x, y, z };
}

function classifyTriangle(x, y, z) {
    const EPS = 1e-9;

    if (x + y < z + EPS) {
        return "Not a Triangle";
    }

    if (almostEqual(x, y, EPS) && almostEqual(y, z, EPS)) {
        return "Equilateral Triangle";
    }

    if (almostEqual(x, y, EPS) || almostEqual(y, z, EPS) || almostEqual(x, z, EPS)) {
        return "Isosceles Triangle";
    }

    if (almostEqual(x*x + y*y, z*z, EPS)) {
        return "Right Triangle";
    }
    return "Scalene Triangle";
}

function almostEqual(a, b, eps) {
    return Math.abs(a - b) < eps;
}

function showTriangleImage(type) {
    const container = document.getElementById('result-image-container');
    container.innerHTML = ''; 
    const img = document.createElement('img');
  
    
    img.src = `images/${type}.png`;
    img.alt = `${type}`;
    container.appendChild(img);
}
  
function suggestTransformations(a, b, c) {
const suggestions = [];
const currentType = classifyTriangle(a, b, c);


if (currentType !== 'Equilateral Triangle') {
    const max = Math.max(a, b, c);
    suggestions.push(`แก้ไขเพื่อให้เป็น Equilateral Triangle`);
    suggestions.push(`เพิ่มหรือลดด้านให้เท่ากันทั้งหมด (${max}) เพื่อให้เป็นสามเหลี่ยมด้านเท่า`);
}

if (currentType !== 'Isosceles Triangle') {
    suggestions.push(`แก้ไขเพื่อให้เป็น Isosceles Triangle`);
    suggestions.push(`ปรับด้านใดด้านหนึ่งให้เท่ากับอีกด้าน เช่น a = b เพื่อให้เป็นสามเหลี่ยมหน้าจั่ว`);
}

if (currentType !== 'Right Triangle') {
    suggestions.push(`แก้ไขเพื่อให้เป็น Right Triangle`);
    if (a === b) suggestions.push(`เปลี่ยนความยาวด้าน c ให้ไม่เท่ากับ a/b เพื่อเป็นสามเหลี่ยมด้านไม่เท่า`);
    if (a === c) suggestions.push(`เปลี่ยนความยาวด้าน b`);
    if (b === c) suggestions.push(`เปลี่ยนความยาวด้าน a`);
}

const container = document.getElementById('recommendations-container');
container.innerHTML = `<div>คำแนะนำเพิ่มเติม:</div><ul>${suggestions.map(s => `<li>${s}</li>`).join('')}</ul>`;
}
  

  