export function addGlobalEventListeners() {
    // Sidebar toggle
    $("#burger-btn").on("click", () => $("#sidebar").toggleClass("expanded"));
  
    // Toggle password visibility
    $("#togglePassword").on("click", () => {
      const passwordInput = $("#login_password");
      const isPassword = passwordInput.attr("type") === "password";
      passwordInput.attr("type", isPassword ? "text" : "password");
      $("#eyeIcon").toggleClass("fa-eye fa-eye-slash");
    });
  
    // Redirect to the all releases page
    $("#seeAllReleases").on("click", () => {
      window.location.href = "/release-note";
    });
  
    // Export data
    $("#export-menu").on("click", () => window.location.href = "/export_menu");
    $("#export-customers").on("click", () => window.location.href = "/export_customers");
  
    // Filter release notes
    $('input[type="search"]').on("keyup", function () {
      const searchTerm = $(this).val().toLowerCase();
      $("#accordion-release-notes .accordion-item").filter(function () {
        $(this).toggle($(this).text().toLowerCase().includes(searchTerm));
      });
    });
  
    // Set the latest release version in the navbar
    const projectTitle = document.querySelector(".navbar-brand .project-version");
    if (ReleaseData?.length > 0 && projectTitle) {
      projectTitle.textContent = `v${ReleaseData[0].version}`; // Assumes the latest version is the first item
    }
  
    // Date of Birth -> Age calculation
    const dobInput = document.getElementById("dob");
    const ageInput = document.getElementById("age");
  
    if (dobInput && ageInput) {
      function calculateAge(dob) {
        const today = new Date();
        const birthDate = new Date(dob.split("-").reverse().join("-")); // Convert DD-MM-YYYY to YYYY-MM-DD
        if (!isNaN(birthDate)) {
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          return age;
        }
        return ""; // Return empty if invalid date
      }
  
      function isValidDate(dob) {
        return /^\d{2}-\d{2}-\d{4}$/.test(dob);
      }
  
      dobInput.addEventListener("input", function () {
        const dob = dobInput.value;
        if (isValidDate(dob)) {
          const age = calculateAge(dob);
          ageInput.value = age;
        } else {
          ageInput.value = ""; // Clear age if date is invalid
        }
      });
    }
  }
  