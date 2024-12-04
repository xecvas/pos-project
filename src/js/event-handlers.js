export function addGlobalEventListeners() {
  // Toggle sidebar visibility
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

  // Export menu data to Excel
  $("#export-menu").on("click", () => {
      window.location.href = "/export_menu";
  });

  // Export customer data to Excel
  $("#export-customers").on("click", () => {
      window.location.href = "/export_customers";
  });

  // Filter release notes by search input
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
}