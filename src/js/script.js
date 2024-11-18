$(document).ready(function () {
  console.log(new Date());

  function formatRupiah(value) {
    return "Rp. " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Initialize DataTables
  var table = $("#mymenu").DataTable({
    columnDefs: [
      { visible: false, targets: 0 }, // Hide the `id` column (index 0)
    ],
    processing: true,
    serverSide: true,
    ajax: {
      url: "/data",
      type: "GET",
      data: function (d) {
        d.page = Math.ceil(d.start / d.length) + 1;
        d.per_page = d.length;
      },
    },
    columns: [
      { data: "id", title: "id" }, // Hidden column
      { data: "nama_menu", title: "Nama Menu" },
      { data: "kode", title: "Kode" },
      { data: "kategori", title: "Kategori" },
      { data: "sub_kategori", title: "Sub Kategori" },
      {
        data: "harga",
        title: "Harga",
        render: function (data, type, row) {
          return formatRupiah(data); // Format it on the client-side
        },
      },
      { data: "status", title: "Status" },
      {
        data: null,
        title: "Action",
        orderable: false,
        render: function (data, type, row) {
          return `
                    <button class="btn btn-primary btn-sm edit-btn" data-id="${row.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${row.id}">Delete</button>
                `;
        },
      },
    ],
    pagingType: "simple_numbers",
    dom: `
        <'row'<'col-sm-6'l><'col-sm-6'f>>
        <'row'<'col-sm-12't>>
        <'row'<'col-sm-4'i><'col-sm-4 d-flex justify-content-center'p><'col-sm-4'>>
    `,
    language: {
      paginate: {
        previous: "&lt;",
        next: "&gt;",
      },
    },
    initComplete: function () {
      // Add the "text-center" class to all header cells
      this.api().columns().header().to$().addClass("text-center");
    },
  });

  // Accordion Rendering
  renderLoginPageAccordion();
  renderReleaseNotesAccordion();

  // Dark Mode Toggle
  const checkbox = document.getElementById("checkbox");
  if (checkbox) {
    const toggleDarkMode = (isChecked) => {
      $("body, canvas, .form-text").toggleClass("dark", isChecked);
    };

    const loadToggleSetting = () => {
      const isChecked = JSON.parse(localStorage.getItem("isChecked")) || false;
      checkbox.checked = isChecked;
      toggleDarkMode(isChecked);
    };

    const saveToggleSetting = () => {
      localStorage.setItem("isChecked", JSON.stringify(checkbox.checked));
    };

    loadToggleSetting();
    checkbox.addEventListener("change", () => {
      toggleDarkMode(checkbox.checked);
      saveToggleSetting();
    });
  }

  // Toggle Password Visibility
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eyeIcon");
  const togglePassword = document.getElementById("togglePassword");
  if (passwordInput && eyeIcon && togglePassword) {
    togglePassword.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";
      eyeIcon.classList.toggle("fa-eye", !isPassword);
      eyeIcon.classList.toggle("fa-eye-slash", isPassword);
    });
  }

  // Notification Icon Click Event
  $(".notification").on("click", () => {
    const latestRelease = ReleaseData?.[0];
    if (latestRelease) {
      const modalContent = `
              <h5>${latestRelease.version} - ${latestRelease.date}</h5>
              <ul>${latestRelease.features
                .map((feature) => `<li>${feature}</li>`)
                .join("")}</ul>
          `;
      $("#modalContent").html(modalContent);
      $(".modal-footer").css("margin-top", "-30px");
      $("#releaseModal").modal("show");
    }
  });

  // "See All Releases" Link
  $("#seeAllReleases").on("click", () => {
    window.location.href = "/release-note";
  });
});

function renderLatestReleaseInfo() {
  const latestRelease = ReleaseData?.[0];
  if (latestRelease) {
    const content = `
          ${latestRelease.date}
          <p>Last Update: v.<strong>${latestRelease.version}</strong></p>
      `;
    $("#latest-release-info").html(content);
  }
}

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

document.addEventListener("DOMContentLoaded", () => {
  const burgerBtn = document.getElementById('burger-btn');
  const sidebar = document.getElementById('sidebar');

  if (burgerBtn && sidebar) { // Pastikan elemen ada sebelum menambahkan event listener
    burgerBtn.addEventListener('click', function () {
      sidebar.classList.toggle('expanded');
    });
  }

  const projectTitle = document.querySelector(".navbar-brand .project-version");
  if (typeof ReleaseData !== "undefined" && ReleaseData?.length && projectTitle) {
    projectTitle.textContent = `v${ReleaseData[0].version}`;
  }
});

