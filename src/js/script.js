// Function to render release content to different parts of the page
function renderReleaseContent(modal = false) {
  const release = ReleaseData && ReleaseData[0]; // Check if ReleaseData exists and fetch the first item
  if (!release) return; // Exit if ReleaseData is unavailable

  const releaseContent = `
    <p><strong>Release date:</strong> ${release.date}</p>
    <ul class="custom-bullet-list">
      ${release.features.map((feature) => `<li>${feature}</li>`).join("")}
    </ul>
  `;

  if (modal) {
    document.getElementById("modalContent").innerHTML = releaseContent;
  } else {
    const releaseAccordionBody = document.getElementById("collapseOne");
    if (releaseAccordionBody) {
      releaseAccordionBody.innerHTML = releaseContent;
    }
  }
}

// Make showLatestRelease globally accessible
window.showLatestRelease = function() {
  renderReleaseContent(true); // Load content for modal
  const releaseModal = new bootstrap.Modal(document.getElementById('releaseModal'));
  releaseModal.show();
};

// DOM Ready Function
$(document).ready(function () {
  console.log(new Date());
  renderReleaseContent();

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
    document.getElementById("togglePassword").addEventListener("click", function () {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      eyeIcon.classList.toggle("fa-eye");
      eyeIcon.classList.toggle("fa-eye-slash");
    });
  }
});

// Navigate to release notes page
function showAllReleases() {
  window.location.href = "{{ url_for('release_note') }}"; // Use Flask's URL for the route
}
