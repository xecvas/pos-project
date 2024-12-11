export function utils() {
  // Updates the time display for all elements with the class "current-time"
  function updateTime() {
    const now = new Date();

    // Format day name
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = days[now.getDay()];

    // Format date as dd-mm-yyyy
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    // Format time as hh:mm:ss AM/PM
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    // Full formatted date-time string
    const formattedTime = `${dayName}, ${day}-${month}-${year}, ${String(
      hours
    ).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;

    // Update all elements with the formatted time
    document.querySelectorAll(".current-time").forEach((el) => {
      el.textContent = formattedTime;
    });
  }

  // Set initial time and update every second
  updateTime();
  setInterval(updateTime, 1000);
}

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
  if (calcToggle) {
    // Tampilkan/hide popup kalkulator
    calcToggle.addEventListener("click", function (event) {
      const calcPopup = document.getElementById("shared-calculator");

      if (calcPopup.style.display === "none" || !calcPopup.style.display) {
        // Hitung posisi elemen kalkulator
        const toggleRect = calcToggle.getBoundingClientRect();
        calcPopup.style.display = "block";
        calcPopup.style.top = `${toggleRect.top + window.scrollY}px`;
        calcPopup.style.left = `${toggleRect.right + 20}px`; // Tambahkan jarak 20px
      } else {
        calcPopup.style.display = "none";
      }

      // Reset kalkulator ketika popup muncul
      if (calcPopup.style.display === "block") {
        currentValue = "0";
        document.getElementById("calculator-display").textContent =
          currentValue;
      }
    });
  }

  // Kalkulator Functions
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
      currentValue = eval(currentValue).toString();
    } catch (e) {
      currentValue = "Error";
    }
    document.getElementById("calculator-display").textContent = currentValue;
    
    // Check if the element exists before setting its value
    const hargaInput = document.getElementById("harga");
    if (hargaInput) {
      hargaInput.value = currentValue;
    }

    const openingCashInput = document.getElementById("openingCash");
    if (openingCashInput) {
      openingCashInput.value = currentValue;
    }

    document.getElementById("shared-calculator").style.display = "none"; // Hide calculator after calculation
  }

  // Assign functions to window so they can be used in inline event handlers
  window.appendValue = appendValue;
  window.clearCalculator = clearCalculator;
  window.calculateResult = calculateResult;

  // Close calculator when clicking outside of it
  window.addEventListener("click", function (event) {
    const calcPopup = document.getElementById("shared-calculator");
    const calcContainer = document.querySelector(".calculator-popup");
    const calcToggle = document.getElementById("calc-toggle");

    if (calcPopup && calcContainer && calcToggle) {
      if (
        calcPopup.style.display === "block" &&
        !calcContainer.contains(event.target) &&
        !calcToggle.contains(event.target)
      ) {
        calcPopup.style.display = "none";
      }
    }
  });
}

export function initializeImagePreview() {
  if (!window.location.pathname.includes("list-menu")) {
    return;
  }
  // Ambil elemen file input dan tambahkan event listener
  const fileInput = document.getElementById("fileInput");
  fileInput.addEventListener("change", previewImage);
}

function previewImage(event) {
  // Periksa apakah file input valid
  if (!event.target || !event.target.files) {
    console.error("Event or file input not properly defined.");
    return;
  }

  const file = event.target.files[0]; // Ambil file pertama dari input
  const reader = new FileReader();

  reader.onload = function (e) {
    const img = document.getElementById("menu_images");
    img.src = e.target.result;
    img.style.display = "block"; // Tampilkan gambar setelah dimuat
  };

  if (file) {
    reader.readAsDataURL(file); // Membaca file sebagai URL
  }
}
