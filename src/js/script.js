$(document).ready(function () {
  console.log(new Date());

  // Variables
  const searchInput = $("input[placeholder='Search Version']");
  const releaseNotesAccordion = $("#accordion-release-notes");

  function renderLoginPageAccordion() {
    const latestRelease = ReleaseData?.[0];
    if (latestRelease) {
      const accordionItem = `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading-login">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapse-login" aria-expanded="false" aria-controls="collapse-login">
                        <span class="icon-circle">
                            <i class="fa fa-check icon-check"></i>
                        </span>
                        ${latestRelease.version} - ${latestRelease.date}
                    </button>
                </h2>
                <div id="collapse-login" class="accordion-collapse collapse" aria-labelledby="heading-login"
                     data-bs-parent="#accordion-login-page">
                    <div class="accordion-body">
                        <ul>${latestRelease.features
                          .map((feature) => `<li>${feature}</li>`)
                          .join("")}</ul>
                    </div>
                </div>
            </div>
        `;
      $("#accordion-login-page").empty().append(accordionItem);
    }
  }

  function renderReleaseNotesAccordion() {
    const releaseNotesAccordion = $("#accordion-release-notes");
    releaseNotesAccordion.empty();

    ReleaseData.forEach((release, index) => {
      const isLastRelease = index === 0;
      const accordionItem = `
            <div class="accordion-item" style="border-radius: 12px; margin-bottom: 10px;">
                <h2 class="accordion-header" id="heading-note-${index}">
                    <button class="accordion-button ${
                      isLastRelease ? "" : "collapsed"
                    }" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#collapse-note-${index}" 
                            aria-expanded="${isLastRelease}" aria-controls="collapse-note-${index}" 
                            style="border-radius: 12px;">
                        ${release.version} - ${release.date}
                    </button>
                </h2>
                <div id="collapse-note-${index}" 
                     class="accordion-collapse collapse ${
                       isLastRelease ? "show" : ""
                     }" 
                     aria-labelledby="heading-note-${index}" 
                     data-bs-parent="#accordion-release-notes" style="border-radius: 12px;">
                    <div class="accordion-body">
                        <ul>${release.features
                          .map((feature) => `<li>${feature}</li>`)
                          .join("")}</ul>
                    </div>
                </div>
            </div>
        `;
      releaseNotesAccordion.append(accordionItem);
    });
  }

  // Fungsi untuk memfilter release notes
  function filterReleaseNotes(query) {
    const lowerCaseQuery = query.toLowerCase();
    $("#accordion-release-notes .accordion-item").each(function () {
      const versionText = $(this)
        .find("button.accordion-button")
        .text()
        .toLowerCase();
      if (versionText.includes(lowerCaseQuery)) {
        $(this).show(); // Tampilkan jika sesuai
      } else {
        $(this).hide(); // Sembunyikan jika tidak sesuai
      }
    });
  }

  // Event listener untuk input pencarian
  searchInput.on("input", function () {
    const query = $(this).val();
    filterReleaseNotes(query); // Panggil fungsi filter
  });

  // Optional: Event listener untuk tombol pencarian
  $("#searchForm button").on("click", function () {
    const query = searchInput.val();
    filterReleaseNotes(query);
  });

  // Debounced search input event
  let debounceTimeout;
  searchInput.on("input", function () {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      renderFilteredReleaseNotes($(this).val().toLowerCase());
    }, 300);
  });

  // Render release notes on page load
  renderLoginPageAccordion();
  renderReleaseNotesAccordion();

  // Format Rupiah helper
  const formatRupiah = (value) =>
    "Rp. " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Initialize DataTable
  $("#mymenu").DataTable({
    columnDefs: [{ visible: false, targets: 0 }], // Hide ID column
    processing: true,
    serverSide: true,
    ajax: {
      url: "/data",
      type: "GET",
      data: (d) => {
        d.page = Math.ceil(d.start / d.length) + 1;
        d.per_page = d.length;
      },
    },
    columns: [
      { data: "id", title: "ID" },
      { data: "nama_menu", title: "Nama Menu" },
      { data: "kode", title: "Kode" },
      { data: "kategori", title: "Kategori" },
      { data: "sub_kategori", title: "Sub Kategori" },
      { data: "harga", title: "Harga", render: formatRupiah },
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
    pagingType: "simple_numbers",
    dom:
      "<'row'<'col-sm-6'l><'col-sm-6'f>>" + // Length changing input and search input
      "<'row'<'col-sm-12't>>" + // Table
      "<'row'<'col-sm-4'i><'col-sm-4 d-flex justify-content-center'p><'col-sm-4'>>", // Info and pagination
    language: { paginate: { previous: "&lt;", next: "&gt;" } },
    initComplete: function () {
      this.api().columns().header().to$().addClass("text-center");
    },
  });

  // Toggle dark mode
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

  // Toggle password visibility
  $("#togglePassword").on("click", () => {
    const passwordInput = $("#password");
    const isPassword = passwordInput.attr("type") === "password";
    passwordInput.attr("type", isPassword ? "text" : "password");
    $("#eyeIcon").toggleClass("fa-eye fa-eye-slash");
  });

  // Show latest release in modal
  $(".notification").on("click", () => {
    const latestRelease = ReleaseData?.[0];
    if (latestRelease) {
      $("#modalContent").html(`
        <h5>${latestRelease.version} - ${latestRelease.date}</h5>
        <ul>${latestRelease.features
          .map((feature) => `<li>${feature}</li>`)
          .join("")}</ul>
      `);
      $("#releaseModal").modal("show");
    }
  });

  // Redirect to all releases page
  $("#seeAllReleases").on(
    "click",
    () => (window.location.href = "/release-note")
  );

  // Export to Excel
  $("#export-excel").click(() => (window.location.href = "/export_excel"));

  // Sidebar toggle
  $("#burger-btn").on("click", () => $("#sidebar").toggleClass("expanded"));

  // Set project title
  const projectTitle = $(".navbar-brand .project-version");
  if (ReleaseData?.[0] && projectTitle.length) {
    projectTitle.text(`v${ReleaseData[0].version}`);
  }
});
