$(document).ready(function () {
  console.log(new Date());
  $("#myDataTable").DataTable();
  renderLatestReleaseInfo();
  renderLoginPageAccordion();
  renderReleaseNotesAccordion();

  // Dark mode toggle setting
  const checkbox = document.getElementById("checkbox");
  if (checkbox) {
    const loadToggleSetting = () => {
      const isChecked = JSON.parse(localStorage.getItem("isChecked")) || false;
      checkbox.checked = isChecked;
      $("body, canvas, .form-text").toggleClass("dark", isChecked);
    };

    const saveToggleSetting = () => {
      localStorage.setItem("isChecked", JSON.stringify(checkbox.checked));
    };

    loadToggleSetting();
    checkbox.addEventListener("change", function () {
      $("body, canvas, .form-text").toggleClass("dark");
      saveToggleSetting();
    });
  }

  // Toggle password visibility
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eyeIcon");
  if (passwordInput && eyeIcon) {
    document
      .getElementById("togglePassword")
      .addEventListener("click", function () {
        const type =
          passwordInput.getAttribute("type") === "password"
            ? "text"
            : "password";
        passwordInput.setAttribute("type", type);
        eyeIcon.classList.toggle("fa-eye");
        eyeIcon.classList.toggle("fa-eye-slash");
      });
  }

  // Event listener for notification icon
  $(".notification").on("click", function () {
    const latestRelease = ReleaseData[0]; // Ambil release terbaru

    if (latestRelease) {
      // Buat konten untuk modal tanpa accordion
      const modalContent = `
        <h5>${latestRelease.version} - ${latestRelease.date}</h5>
        <ul>
          ${latestRelease.features
            .map((feature) => `<li>${feature}</li>`)
            .join("")}
        </ul>
      `;

      // Masukkan konten ke dalam modal
      $("#modalContent").html(modalContent);

      // Mengubah jarak antara fitur dan tombol dengan JavaScript
      const modalFooter = $(".modal-footer");
      modalFooter.css("margin-top", "-30px"); // Mengatur margin atas footer

      // Tampilkan modal
      $("#releaseModal").modal("show");
    }
  });

  // Event listener untuk "See All Releases"
  // Pastikan "See All Releases" berfungsi sebagai hyperlink
  $("#seeAllReleases").on("click", function (e) {
    // Link akan berjalan normal, jadi kita tidak perlu mencegah default behavior
    // Mengarahkan pengguna ke /release-note
    window.location.href = "/release-note";
  });
});

function renderLatestReleaseInfo() {
  const latestRelease = ReleaseData[0]; // Mengambil rilis terbaru (posisi pertama)
  if (latestRelease) {
    const latestReleaseContainer = $("#latest-release-info");
    const latestReleaseContent = `
      ${latestRelease.date}
      <p>Last Update: v.<strong>${latestRelease.version}</strong></p>
    `;
    latestReleaseContainer.html(latestReleaseContent); // Menampilkan data di container
  }
}
// Render accordion untuk halaman login (hanya rilis terakhir dengan icon check)
function renderLoginPageAccordion() {
  const latestRelease = ReleaseData[0]; // Rilis terakhir (paling atas di array)
  const loginAccordion = $("#accordion-login-page");
  loginAccordion.empty(); // Bersihkan kontainer sebelum ditambahkan

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
            <ul>
              ${latestRelease.features
                .map((feature) => `<li>${feature}</li>`)
                .join("")}
            </ul>
          </div>
        </div>
      </div>
    `;
    loginAccordion.append(accordionItem);
  }
}

// Render accordion untuk halaman release notes (semua versi)
function renderReleaseNotesAccordion() {
  const releaseNotesAccordion = $("#accordion-release-notes");
  releaseNotesAccordion.empty(); // Bersihkan kontainer sebelum ditambahkan

  ReleaseData.forEach((release, index) => {
    const releaseId = `collapse-note-${index}`;
    const headerId = `heading-note-${index}`;

    const accordionItem = `
      <div class="accordion-item">
        <h2 class="accordion-header" id="${headerId}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                  data-bs-target="#${releaseId}" aria-expanded="false" aria-controls="${releaseId}">
            ${release.version} - ${release.date}
          </button>
        </h2>
        <div id="${releaseId}" class="accordion-collapse collapse" aria-labelledby="${headerId}"
             data-bs-parent="#accordion-release-notes">
          <div class="accordion-body">
            <ul>
              ${release.features
                .map((feature) => `<li>${feature}</li>`)
                .join("")}
            </ul>
          </div>
        </div>
      </div>
    `;
    releaseNotesAccordion.append(accordionItem);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const burgerBtn = document.getElementById("burger-btn");
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.querySelector(".main-content");

  burgerBtn.addEventListener("click", function () {
    // Toggle expanded class pada sidebar
    sidebar.classList.toggle("expanded");
  });

  // Select the latest version from ReleaseData and set in navbar
  const projectTitle = document.querySelector(".navbar-brand .project-version");

  if (ReleaseData && ReleaseData.length > 0 && projectTitle) {
    const latestVersion = ReleaseData[0].version; // Assuming the latest version is the first item
    projectTitle.textContent = `v${latestVersion}`;
  }
});
