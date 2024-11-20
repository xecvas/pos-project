$(document).ready(function () {
  console.log(new Date());

  // Variable declarations
  const searchInput = $("input[placeholder='Search Version']");
  const releaseNotesAccordion = $("#accordion-release-notes");

  // Notification click event to display the latest release in a modal
  $(".notification").on("click", () => {
    const latestRelease = ReleaseData?.[0];
    if (latestRelease) {
      $("#modalContent").html(`
        <h5>${latestRelease.version} - ${latestRelease.date}</h5>
        <ul>${latestRelease.features.map(feature => `<li>${feature}</li>`).join("")}</ul>
      `);

      // Initialize and display the modal
      $("#releaseModal").modal({
        backdrop: false, // Disable modal backdrop
        keyboard: true, // Enable ESC key for closing
      }).modal("show");
    }
  });

  // Close modal when clicking outside
  $(document).on("click", (event) => {
    const modal = $("#releaseModal .modal-dialog");
    const isClickInside = modal.is(event.target) || modal.has(event.target).length > 0;
    if (!isClickInside && $("#releaseModal").is(":visible")) {
      $("#releaseModal").modal("hide");
    }
  });

  // Dynamic modal HTML content
  const modalHTML = `
    <div id="releaseModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="false">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="releaseModalLabel">Latest Release</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="modalContent"></div>
          <div class="modal-footer" style="border-top: none;">
            <a href="/release-note" id="seeAllReleases" class="btn btn-link" style="text-decoration: none;">
              <b>See All Releases</b>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
  $("#dynamicModalContainer").html(modalHTML);

  // Render the latest release in the login page accordion
  function renderLoginPageAccordion() {
    const latestRelease = ReleaseData?.[0];
    if (latestRelease) {
      const accordionItem = `
        <div class="accordion-item">
          <h2 class="accordion-header" id="heading-login">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
              data-bs-target="#collapse-login" aria-expanded="false" aria-controls="collapse-login">
              <span class="icon-circle"><i class="fa fa-check icon-check"></i></span>
              ${latestRelease.version} - ${latestRelease.date}
            </button>
          </h2>
          <div id="collapse-login" class="accordion-collapse collapse" aria-labelledby="heading-login"
            data-bs-parent="#accordion-login-page">
            <div class="accordion-body">
              <ul>${latestRelease.features.map(feature => `<li>${feature}</li>`).join("")}</ul>
            </div>
          </div>
        </div>
      `;
      $("#accordion-login-page").empty().append(accordionItem);
    }
  }

  // Render all release notes in an accordion
  function renderReleaseNotesAccordion() {
    releaseNotesAccordion.empty();
    ReleaseData.forEach((release, index) => {
      const isLastRelease = index === 0;
      const accordionItem = `
        <div class="accordion-item" style="border-radius: 12px; margin-bottom: 10px;">
          <h2 class="accordion-header" id="heading-note-${index}">
            <button class="accordion-button ${isLastRelease ? "" : "collapsed"}" type="button"
              data-bs-toggle="collapse" data-bs-target="#collapse-note-${index}"
              aria-expanded="${isLastRelease}" aria-controls="collapse-note-${index}" style="border-radius: 12px;">
              ${release.version} - ${release.date}
            </button>
          </h2>
          <div id="collapse-note-${index}" class="accordion-collapse collapse ${isLastRelease ? "show" : ""}"
            aria-labelledby="heading-note-${index}" data-bs-parent="#accordion-release-notes" style="border-radius: 12px;">
            <div class="accordion-body">
              <ul>${release.features.map(feature => `<li>${feature}</li>`).join("")}</ul>
            </div>
          </div>
        </div>
      `;
      releaseNotesAccordion.append(accordionItem);
    });
  }

  // Filter release notes based on the search query
  function filterReleaseNotes(query) {
    const lowerCaseQuery = query.toLowerCase();
    $("#accordion-release-notes .accordion-item").each(function () {
      const versionText = $(this).find("button.accordion-button").text().toLowerCase();
      $(this).toggle(versionText.includes(lowerCaseQuery));
    });
  }

  // Search input with debounce
  let debounceTimeout;
  searchInput.on("input", function () {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      filterReleaseNotes($(this).val());
    }, 300);
  });

  // Render accordion content on page load
  renderLoginPageAccordion();
  renderReleaseNotesAccordion();

  // Format currency in Rupiah
  const formatRupiah = (value) =>
    "Rp. " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Initialize DataTable
  $("#mymenu").DataTable({
    columnDefs: [{ visible: false, targets: 0 }], // Hide ID column
    processing: true,
    serverSide: true,
    ajax: {
      url: "/data", // Endpoint to fetch data
      type: "GET",
      data: (d) => {
        d.page = Math.ceil(d.start / d.length) + 1; // Calculate page number
        d.per_page = d.length; // Items per page
      },
    },
    columns: [
      { data: "id", title: "ID" },
      { data: "nama_menu", title: "Name" },
      { data: "kode", title: "Code" },
      { data: "kategori", title: "Category" },
      { data: "sub_kategori", title: "Subcategory" },
      { data: "harga", title: "Price", render: formatRupiah },
      { data: "status", title: "Status" },
      {
        data: null,
        title: "Action",
        orderable: false,
        className: "text-center",
        render: (row) => `
          <button class="btn btn-primary btn-sm edit-btn" data-id="${row.id}">Edit</button>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${row.id}">Delete</button>
        `,
      },
    ],
    pagingType: "simple_numbers", // Simplified pagination controls
    dom:
      "<'row'<'col-sm-6'l><'col-sm-6'f>>" + // Length changing and search input
      "<'row'<'col-sm-12't>>" + // Table
      "<'row'<'col-sm-4'i><'col-sm-4 d-flex justify-content-center'p><'col-sm-4'>>", // Info and pagination
    language: {
      search: "Search:", // Custom label for the search box
      paginate: { previous: "&lt;", next: "&gt;" }, // Simplified pagination symbols
    },
    initComplete: function () {
      // Ensure search box and headers are properly styled
      this.api().columns().header().to$().addClass("text-center");
    },
  });  

  // Dark mode toggle
  const darkModeCheckbox = $("#checkbox");
  if (darkModeCheckbox.length) {
    const toggleDarkMode = (isChecked) =>
      $("body, canvas, .form-text").toggleClass("dark", isChecked);
    const isChecked = JSON.parse(localStorage.getItem("isChecked")) || false;

    darkModeCheckbox.prop("checked", isChecked).change(() => {
      localStorage.setItem("isChecked", darkModeCheckbox.prop("checked"));
      toggleDarkMode(darkModeCheckbox.prop("checked"));
    });

    toggleDarkMode(isChecked);
  }

  // Password visibility toggle
  $("#togglePassword").on("click", () => {
    const passwordInput = $("#password");
    const isPassword = passwordInput.attr("type") === "password";
    passwordInput.attr("type", isPassword ? "text" : "password");
    $("#eyeIcon").toggleClass("fa-eye fa-eye-slash");
  });

  // Redirect to the all releases page
  $("#seeAllReleases").on("click", () => (window.location.href = "/release-note"));

  // Export data to Excel
  $("#export-excel").click(() => (window.location.href = "/export_excel"));

  // Sidebar toggle functionality
  $("#burger-btn").on("click", () => $("#sidebar").toggleClass("expanded"));

  // Set project title with the latest version
  const projectTitle = $(".navbar-brand .project-version");
  if (ReleaseData?.[0] && projectTitle.length) {
    projectTitle.text(`v${ReleaseData[0].version}`);
  }
});
