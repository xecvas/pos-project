$(document).ready(function () {
  // Show current date on console
  console.log(new Date());

  // Get the checkbox element and password input elements
  const checkbox = document.getElementById("checkbox");
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eyeIcon");

  // Load and apply the saved toggle setting from localStorage
  function loadToggleSetting() {
    const isChecked = JSON.parse(localStorage.getItem("isChecked")) || false;
    checkbox.checked = isChecked;
    $("body, canvas, .form-text").toggleClass("dark", isChecked);
  }

  // Save the toggle setting to localStorage
  function saveToggleSetting() {
    localStorage.setItem("isChecked", JSON.stringify(checkbox.checked));
  }

  // Handle dark mode toggle
  if (checkbox) {
    loadToggleSetting();
    checkbox.addEventListener("change", function () {
      $("body, canvas, .form-text").toggleClass("dark");
      saveToggleSetting();
    });
  }

  // Toggle password visibility
  document.getElementById("togglePassword").addEventListener("click", function () {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    eyeIcon.classList.toggle("fa-eye");
    eyeIcon.classList.toggle("fa-eye-slash");
  });
});