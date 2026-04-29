// Insert value into input
function insertValue(val) {
  const input = document.getElementById("expression");
  input.value += val;
  input.focus();
}

function clearInput() {
  document.getElementById("expression").value = "";
  showVariables();
}

function backspace() {
  const input = document.getElementById("expression");
  input.value = input.value.slice(0, -1);
  showVariables();
}

// Get variables
function getVariables(expr) {
  return [...new Set(expr.match(/[A-Z]/g) || [])];
}

// Show detected variables
function showVariables() {
  const expr = document.getElementById("expression").value;
  const vars = getVariables(expr);

  let html = "";
  vars.forEach(v => {
    html += `<span>${v}</span>`;
  });

  document.getElementById("variables").innerHTML = html;
}

// Evaluate expression safely
function evaluateExpression(expr, values) {
  try {
    // Validate input
    if (!/^[A-Z0-9()!^v\s]+$/.test(expr)) {
      return "Error";
    }

    let converted = expr.replace(/\s+/g, "");

    // Replace variables
    for (let v in values) {
      converted = converted.replaceAll(v, values[v]);
    }

    // Replace operators
    converted = converted
      .replaceAll("^", "&&")
      .replaceAll("v", "||")
      .replaceAll("!", "!");

    let result = Function(`return (${converted})`)();

    return result ? 1 : 0;

  } catch {
    return "Error";
  }
}

// Generate truth table
function generateTable() {
  const expr = document.getElementById("expression").value;
  const vars = getVariables(expr);

  if (vars.length === 0) {
    alert("Enter a valid expression!");
    return;
  }
  if (!isValidExpression(expr)) {
  alert("Invalid logical expression!");
  return;
}
  const rows = Math.pow(2, vars.length);

  document.getElementById("resultBox").classList.remove("hidden");
  document.getElementById("title").innerText =
    `Truth Table for ${expr}`;

  let table = "<table><tr>";

  // FIXED: Proper headers
  vars.forEach(v => {
    table += `<th>${v}</th>`;
  });

  table += "<th>Result</th></tr>";

  // Generate rows
  for (let i = 0; i < rows; i++) {
    let values = {};
    let row = "<tr>";

    vars.forEach((v, index) => {
      let val = (i >> (vars.length - index - 1)) & 1;
      values[v] = val;

      row += `<td class="${val ? 'true' : 'false'}">
                ${val ? 'T' : 'F'}
              </td>`;
    });

    let result = evaluateExpression(expr, values);

    row += `<td class="${result ? 'true' : 'false'}">
              ${result ? 'T' : 'F'}
            </td></tr>`;

    table += row;
  }

  table += "</table>";

  document.getElementById("output").innerHTML = table;
}
function isValidExpression(expr) {
  // No two variables together
  if (/[A-Z]{2}/.test(expr)) return false;

  // No operator at start/end
  if (/^[\^v]|[\^v]$/.test(expr)) return false;

  // No invalid sequences like B!C without operator
  if (/[A-Z]![A-Z]/.test(expr)) return false;

  return true;
}