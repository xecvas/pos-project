// Update Time and Date Continuously
export function DateTime() {
function updateTime() {
  const now = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = days[now.getDay()];
  const formattedTime = `${dayName}, ${String(now.getDate()).padStart(2, "0")}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${now.getFullYear()}, ${String(now.getHours() % 12 || 12).padStart(
    2,
    "0"
  )}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(
    2,
    "0"
  )} ${now.getHours() >= 12 ? "PM" : "AM"}`;
  document.querySelectorAll(".current-time").forEach((el) => (el.textContent = formattedTime));
}
updateTime();
setInterval(updateTime, 1000);
}

//Image Preview
export function initializeImagePreview() {
  // Ensure the preview functionality applies only to the "list-menu" page
  if (!window.location.pathname.includes("list-menu")) return;

  const fileInput = document.getElementById("fileInput");
  const imgPreview = document.getElementById("menu_images");

  // Add event listener for file input changes
  fileInput?.addEventListener("change", (event) => {
    const file = event.target?.files?.[0]; // Safely access the selected file
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (imgPreview) {
        imgPreview.src = reader.result;
        imgPreview.style.display = "block"; // Show the image after loading
      }
    };
    reader.readAsDataURL(file); // Read the file as a Data URL
  });
}

// Calculator Functionality
export function createCalculator() {
const calculatorHTML = `
  <div class="calculator-popup" id="shared-calculator" style="display: none;">
    <div class="calculator-display mb-2 p-2 border rounded" id="calculator-display">0</div>
    <div class="calculator-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
      <button onclick="appendValue('/', event)">÷</button>
      <button onclick="appendValue('*', event)">×</button>
      <button onclick="appendValue('-', event)">−</button>
      <button onclick="appendValue('+', event)">+</button>
      <button onclick="appendValue('7', event)">7</button>
      <button onclick="appendValue('8', event)">8</button>
      <button onclick="appendValue('9', event)">9</button>
      <button onclick="clearCalculator(event)">C</button>
      <button onclick="appendValue('4', event)">4</button>
      <button onclick="appendValue('5', event)">5</button>
      <button onclick="appendValue('6', event)">6</button>
      <button class="btn-equal" onclick="calculateResult(event)">=</button>
      <button onclick="appendValue('1', event)">1</button>
      <button onclick="appendValue('2', event)">2</button>
      <button onclick="appendValue('3', event)">3</button>
      <button onclick="appendValue('0', event)" style="grid-column: span 2;">0</button>
      <button onclick="appendValue('.', event)">.</button>
    </div>
  </div>
`;
document.body.insertAdjacentHTML("beforeend", calculatorHTML);
}

export function initCalculator() {
// Ensure the element exists before adding the event listener
const calcToggle = document.getElementById("calc-toggle");
const calcPopup = document.getElementById("shared-calculator");

if (calcToggle && calcPopup) {
  // Function to position the calculator near the toggle icon
  function positionCalculator() {
    const toggleRect = calcToggle.getBoundingClientRect();
    calcPopup.style.top = `${toggleRect.top + window.scrollY}px`;
    calcPopup.style.left = `${toggleRect.right + 20}px`; // Add 20px gap
  }

  // Show or hide calculator on toggle click
  calcToggle.addEventListener("click", function () {
    if (calcPopup.style.display === "none" || !calcPopup.style.display) {
      calcPopup.style.display = "block";
      positionCalculator(); // Position the calculator when shown
      currentValue = "0"; // Reset calculator display
      document.getElementById("calculator-display").textContent = currentValue;
    } else {
      calcPopup.style.display = "none"; // Hide calculator
    }
  });

  // Update position on window resize to keep it near the toggle icon
  window.addEventListener("resize", function () {
    if (calcPopup.style.display === "block") {
      positionCalculator();
    }
  });
}

// Calculator operation functions
let currentValue = "0";

function appendValue(value, event) {
  event.preventDefault();
  if (currentValue === "0") {
    currentValue = value;
  } else {
    currentValue += value;
  }
  document.getElementById("calculator-display").textContent = currentValue;
}

function clearCalculator(event) {
  event.preventDefault();
  currentValue = "0";
  document.getElementById("calculator-display").textContent = currentValue;
}

function calculateResult(event) {
  event.preventDefault();
  try {
    currentValue = eval(currentValue).toString(); // Calculate result
  } catch (e) {
    currentValue = "Error"; // Handle invalid expressions
  }
  document.getElementById("calculator-display").textContent = currentValue;

  // Update related inputs with the result, if available
  const hargaInput = document.getElementById("harga");
  if (hargaInput) {
    hargaInput.value = currentValue;
  }

  const openingCashInput = document.getElementById("openingCash");
  if (openingCashInput) {
    openingCashInput.value = currentValue;
  }

  calcPopup.style.display = "none"; // Hide calculator after calculation
}

// Expose calculator functions globally for inline event handlers
window.appendValue = appendValue;
window.clearCalculator = clearCalculator;
window.calculateResult = calculateResult;

// Close calculator when clicking outside of it
window.addEventListener("click", function (event) {
  if (
    calcPopup.style.display === "block" &&
    !calcPopup.contains(event.target) &&
    !calcToggle.contains(event.target)
  ) {
    calcPopup.style.display = "none"; // Close calculator
  }
});
}