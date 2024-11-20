// Render dynamic modal for the latest release
export function initModals() {
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

  // Event listener to display the latest release in modal
  $(".notification").on("click", () => {
    const latestRelease = ReleaseData?.[0];
    if (latestRelease) {
      $("#modalContent").html(`
          <h5>${latestRelease.version} - ${latestRelease.date}</h5>
          <ul>${latestRelease.features
            .map((feature) => `<li>${feature}</li>`)
            .join("")}</ul>
        `);

      $("#releaseModal")
        .modal({
          backdrop: false, // Disable modal backdrop
          keyboard: true, // Enable ESC key to close
        })
        .modal("show");
    }
  });

  // Close modal if clicking outside
  $(document).on("click", (event) => {
    const modalDialog = $("#releaseModal .modal-dialog");
    if (
      !modalDialog.is(event.target) &&
      modalDialog.has(event.target).length === 0
    ) {
      if ($("#releaseModal").is(":visible")) {
        $("#releaseModal").modal("hide");
      }
    }
  });
}

// Render login page accordion with the latest release
export function renderLoginPageAccordion() {
  const latestRelease = ReleaseData?.[0];
  if (latestRelease) {
    const featuresHTML = Object.entries(latestRelease.features)
      .map(
        ([category, items]) =>
          `<strong>${
            category.charAt(0).toUpperCase() + category.slice(1)
          }:</strong>
           <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`
      )
      .join("");

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
            ${featuresHTML}
          </div>
        </div>
      </div>
    `;
    $("#accordion-login-page").empty().append(accordionItem);
  }
}

// Render all release notes in an accordion
export function renderReleaseNotesAccordion() {
  const releaseNotesAccordion = $("#accordion-release-notes");
  releaseNotesAccordion.empty();

  ReleaseData.forEach((release, index) => {
    const isLastRelease = index === 0;

    const featuresHTML = Object.entries(release.features)
      .map(
        ([category, items]) =>
          `<strong>${
            category.charAt(0).toUpperCase() + category.slice(1)
          }:</strong>
           <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`
      )
      .join("");

    const accordionItem = `
      <div class="accordion-item" style="border-radius: 12px; margin-bottom: 10px;">
        <h2 class="accordion-header" id="heading-note-${index}">
          <button class="accordion-button ${
            isLastRelease ? "" : "collapsed"
          }" type="button"
            data-bs-toggle="collapse" data-bs-target="#collapse-note-${index}"
            aria-expanded="${isLastRelease}" aria-controls="collapse-note-${index}" style="border-radius: 12px;">
            ${release.version} - ${release.date}
          </button>
        </h2>
        <div id="collapse-note-${index}" class="accordion-collapse collapse ${
      isLastRelease ? "show" : ""
    }"
          aria-labelledby="heading-note-${index}" data-bs-parent="#accordion-release-notes" style="border-radius: 12px;">
          <div class="accordion-body">
            ${featuresHTML}
          </div>
        </div>
      </div>
    `;
    releaseNotesAccordion.append(accordionItem);
  });
}
