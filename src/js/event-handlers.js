// Toggle sidebar visibility
export function addGlobalEventListeners() {
    $("#burger-btn").on("click", () => $("#sidebar").toggleClass("expanded"));
  
    // Toggle password visibility
    $("#togglePassword").on("click", () => {
      const passwordInput = $("#password");
      const isPassword = passwordInput.attr("type") === "password";
      passwordInput.attr("type", isPassword ? "text" : "password");
      $("#eyeIcon").toggleClass("fa-eye fa-eye-slash");
    });
  
    // Redirect to all releases page
    $("#seeAllReleases").on("click", () => {
      window.location.href = "/release-note";
    });
  
    // Export to Excel
    $("#export-excel").on("click", () => {
      window.location.href = "/export_excel";
    });
  }
  