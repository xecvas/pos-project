// Toggle sidebar visibility
export function addGlobalEventListeners() {
  $("#burger-btn").on("click", () => $("#sidebar").toggleClass("expanded"));

  // Toggle password visibility
  $("#togglePassword").on("click", () => {
    const passwordInput = $("#login_password");
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

  //release-note search bar for version
  $('input[type="search"]').on("keyup", function () {
    var searchTerm = $(this).val().toLowerCase();
    // Filter elemen berdasarkan input pencarian
    $("#accordion-release-notes .accordion-item").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(searchTerm) > -1);
    });
  });
  
  // Select the latest version from ReleaseData and set in navbar
  const projectTitle = document.querySelector(".navbar-brand .project-version");

  if (ReleaseData && ReleaseData.length > 0 && projectTitle) {
    const latestVersion = ReleaseData[0].version; // Assuming the latest version is the first item
    projectTitle.textContent = `v${latestVersion}`;
  }
}
