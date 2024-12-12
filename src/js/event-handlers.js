// Event Handlers for Global Interactions
export function addGlobalEventListeners() {
  $("#burger-btn").on("click", () => $("#sidebar").toggleClass("expanded"));
  $("#togglePassword").on("click", togglePasswordVisibility);
  $("#seeAllReleases").on("click", () => (window.location.href = "/release-note"));
  $("#export-menu").on("click", () => (window.location.href = "/export_menu"));
  $("#export-customers").on("click", () => (window.location.href = "/export_customers"));

  $('input[type="search"]').on("keyup", filterReleaseNotes);

  const dobInput = document.getElementById("dob");
  const ageInput = document.getElementById("age");
  if (dobInput && ageInput) handleAgeCalculation(dobInput, ageInput);
}

function togglePasswordVisibility() {
  const passwordInput = $("#login_password");
  const isPassword = passwordInput.attr("type") === "password";
  passwordInput.attr("type", isPassword ? "text" : "password");
  $("#eyeIcon").toggleClass("fa-eye fa-eye-slash");
}

function filterReleaseNotes() {
  const searchTerm = $(this).val().toLowerCase();
  $("#accordion-release-notes .accordion-item").filter(function () {
    $(this).toggle($(this).text().toLowerCase().includes(searchTerm));
  });
}

function handleAgeCalculation(dobInput, ageInput) {
  dobInput.addEventListener("input", function () {
    const dob = dobInput.value;
    if (/^\d{2}-\d{2}-\d{4}$/.test(dob)) {
      const birthDate = new Date(dob.split("-").reverse().join("-"));
      if (!isNaN(birthDate)) {
        let age = new Date().getFullYear() - birthDate.getFullYear();
        const m = new Date().getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate())) age--;
        ageInput.value = age;
      }
    } else ageInput.value = "";
  });
}

export function setupCashierPage(userRole, setupCompleted) {
  if (userRole === "cashier" && setupCompleted === "false") setupCashierModal();
}

function setupCashierModal() {
  const modalElement = document.getElementById("cashierModal");
  const cashierModal = new bootstrap.Modal(modalElement, { backdrop: "static", keyboard: false });
  cashierModal.show();

  document.getElementById("submitCashierForm").addEventListener("click", () => {
    const outlet = document.getElementById("outlet").value;
    const cashierName = document.getElementById("cashierName").value;
    const openingCash = document.getElementById("openingCash").value;

    if (!outlet || !cashierName || !openingCash) return alert("Please fill in all fields!");

    fetch("/cashier/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outlet, cashierName, openingCash }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) alert(data.error);
        else cashierModal.hide();
      })
      .catch(console.error);
  });
}