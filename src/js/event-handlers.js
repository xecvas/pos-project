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

  $('input[type="search"]').on("keyup", function () {
    var searchTerm = $(this).val().toLowerCase();
    // Filter elemen berdasarkan input pencarian
    $("#accordion-release-notes .accordion-item").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(searchTerm) > -1);
    });
  });

  $(document).on("click", ".dropdown-item", function (e) {
    e.preventDefault();
  
    const selectedText = $(this).text(); // Get the selected dropdown text
    const filterValue = $(this).data("filter"); // Get the filter value
  
    // Update the dropdown button text
    $("#dropdownKategori").text(selectedText);
  
    // Apply filtering to the DataTable
    window.myTable.column(3).search(filterValue).draw(); // Use the global DataTable instance
  });
  
  
  
}
