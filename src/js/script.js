$(document).ready(function () {
  // Show current date on console
  console.log(new Date());

  // Get the checkbox element
  const checkbox = document.getElementById("checkbox");

  // Function to load and apply the saved toggle setting from localStorage
  function loadToggleSetting() {
    const isChecked = JSON.parse(localStorage.getItem("isChecked"));
    if (isChecked) {
      checkbox.checked = true;
      $("body, canvas, .form-text").addClass("dark");
    }
  }

  // Function to save the toggle setting to localStorage
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

  // JavaScript for toggle password visibility
  const togglePassword = document.querySelector("#togglePassword");
  const passwordInput = document.querySelector("#password");
  const eyeIcon = document.querySelector("#eyeIcon");

  togglePassword.addEventListener("click", () => {
    // Determine the new type and toggle the icon class
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    eyeIcon.classList.toggle("fa-eye", isPassword);
    eyeIcon.classList.toggle("fa-eye-slash", !isPassword);
  });
});
