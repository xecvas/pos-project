// Create modal HTML
function createModalHTML(id, title, bodyContent, footerContent) {
  return `
    <div class="modal fade" id="${id}" tabindex="-1" aria-labelledby="formModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header" style="border-bottom: none;">
            <h5 class="modal-title" id="formModalLabel">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">${bodyContent}</div>
          <div class="modal-footer" style="border-top: none;">${footerContent}</div>
        </div>
      </div>
    </div>
  `;
}

// Initialize modals
export function initModals() {
  const modalHTML = createModalHTML(
    "releaseModal",
    "Latest Release",
    '<div id="modalContent"></div>',
    `<a href="/release-note" id="seeAllReleases" class="btn btn-link" style="text-decoration: none;"><b>See All Releases</b></a>`
  );

  $("#dynamicModalContainer").html(modalHTML);

  $(".notification").on("click", () => {
    const latestRelease = ReleaseData?.[0];
    if (latestRelease) {
      const featuresHTML = generateFeaturesHTML(latestRelease.features);
      $("#modalContent").html(`
        <h5>${latestRelease.version} - ${latestRelease.date}</h5>
        ${featuresHTML}
      `);
      $("#releaseModal").modal({ backdrop: false, keyboard: true }).modal("show");
    }
  });

  $(document).on("click", (event) => {
    const modalDialog = $("#releaseModal .modal-dialog");
    if (!modalDialog.is(event.target) && modalDialog.has(event.target).length === 0) {
      if ($("#releaseModal").is(":visible")) {
        $("#releaseModal").modal("hide");
      }
    }
  });
}

// Generate features HTML
function generateFeaturesHTML(features) {
  return Object.entries(features)
    .map(
      ([category, items]) =>
        `<strong>${category.charAt(0).toUpperCase() + category.slice(1)}:</strong>
         <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`
    )
    .join("");
}

// Render login page accordion with the latest release
export function renderLoginPageAccordion() {
  const latestRelease = ReleaseData?.[0];
  if (latestRelease) {
    const featuresHTML = generateFeaturesHTML(latestRelease.features);
    const accordionItem = `
      <div class="accordion-item" style="border-radius: 12px;">
        <h2 class="accordion-header" id="heading-login">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#collapse-login" aria-expanded="false" aria-controls="collapse-login" style="border-radius: 12px;">
            <span class="icon-circle"><i class="fa fa-check icon-check"></i></span>
            ${latestRelease.version} - ${latestRelease.date}
          </button>
        </h2>
        <div id="collapse-login" class="accordion-collapse collapse" aria-labelledby="heading-login"
          data-bs-parent="#accordion-login-page">
          <div class="accordion-body">${featuresHTML}</div>
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
    const featuresHTML = generateFeaturesHTML(release.features);
    const accordionItem = `
      <div class="accordion-item" style="border-radius: 12px; margin-bottom: 15px;">
        <h2 class="accordion-header" id="heading-note-${index}">
          <button class="accordion-button ${isLastRelease ? "" : "collapsed"}" type="button"
            data-bs-toggle="collapse" data-bs-target="#collapse-note-${index}"
            aria-expanded="${isLastRelease}" aria-controls="collapse-note-${index}" style="border-radius: 12px;">
            <strong>${release.version} - ${release.date}</strong>
          </button>
        </h2>
        <div id="collapse-note-${index}" class="accordion-collapse collapse ${isLastRelease ? "show" : ""}"
          aria-labelledby="heading-note-${index}" data-bs-parent="#accordion-release-notes" style="border-radius: 12px;">
          <div class="accordion-body">${featuresHTML}</div>
        </div>
      </div>
    `;
    releaseNotesAccordion.append(accordionItem);
  });

  const projectTitle = document.querySelector(".navbar-brand .project-version");
  if (ReleaseData && ReleaseData.length > 0 && projectTitle) {
    const latestVersion = ReleaseData[0].version;
    projectTitle.textContent = `v${latestVersion}`;
  }

  initForgotPasswordModal();
}

// Initialize Forgot Password Modal
function initForgotPasswordModal() {
  const forgotPasswordModalElement = document.getElementById("forgotPasswordModal");
  if (forgotPasswordModalElement) {
    forgotPasswordModalElement.addEventListener("submit", function (event) {
      event.preventDefault();
      const forgotPasswordModalInstance = bootstrap.Modal.getInstance(forgotPasswordModalElement);
      forgotPasswordModalInstance.hide();
      const checkEmailModal = new bootstrap.Modal(document.getElementById("checkEmailModal"));
      checkEmailModal.show();
    });
  }
}

// Initialize delete modals
export function initDeleteModals() {
  const modalHTML = createModalHTML(
    "datatable-delete-modal",
    "<i class='fa fa-warning'></i> Delete Data",
    "Are you sure to delete this record?",
    `
      <button type="button" id="row-delete-no" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
      <button type="submit" id="row-delete-yes" class="btn btn-danger delete">Delete</button>
    `
  );

  const successModalHTML = (`
  <div class="modal fade" id="success-delete-modal" tabindex="-1" aria-labelledby="formModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body text-center">
          <p class="fs-4">Delete Success</p>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
        </div>
      </div>
    </div>
  </div>
`
);

  $("body").append(modalHTML + successModalHTML);

  let rowToDelete = null;
  let currentTable = null;

  $(document).on("click", ".delete-btn", function () {
    const id = $(this).data("id");
    const tableName = $(this).closest("table").attr("id");
    currentTable = tableName === "mymenu" ? window.menuTable : window.customersTable;
    rowToDelete = currentTable.row($(this).closest("tr"));
    $("#row-delete-yes").data("id", id);
    $("#datatable-delete-modal").modal("show");
  });

  $("#row-delete-yes").on("click", function () {
    const id = $(this).data("id");
    if (currentTable && rowToDelete) {
      const endpoint = currentTable === window.menuTable ? `/delete_menu/${id}` : `/delete_customer/${id}`;
      $.ajax({
        type: "POST",
        url: endpoint,
        success: function () {
          rowToDelete.remove().draw();
          $("#datatable-delete-modal").modal("hide");
          $("#success-delete-modal").modal("show");
        },
        error: function (xhr, status, error) {
          console.error("Error deleting record:", error);
        },
      });
    }
  });

  $("#success-delete-modal").on("click", function () {
    $("#success-delete-modal").modal("hide");
  });

  $(document).on("click", ".view-btn", function () {
    const id = $(this).data("id");
    showCustomerModal(id, "view");
  });

  $(document).on("click", ".edit-btn", function () {
    const id = $(this).data("id");
    showCustomerModal(id, "edit");
  });

  $(document).on("click", "#add-customers", function () {
    resetCustomerForm();
    $("#CustomersModals").modal("show");
  });

  function showCustomerModal(id, mode) {
    resetCustomerForm();
    $.ajax({
      url: `/get_customer/${id}`,
      method: "GET",
      success: function (data) {
        populateCustomerForm(data, mode);
        $("#CustomersModals").modal("show");
      },
      error: function (xhr) {
        alert(`Error: ${xhr.responseJSON.error}`);
      },
    });
  }

  function resetCustomerForm() {
    $("#CustomersModalsForm")[0].reset();
    $("input, textarea, select").removeAttr("readonly").removeAttr("disabled");
    $("#customer_id").val("");
    $("#age, #membership, #loyalty_points").attr("readonly", true);
    $("#CustomersModalsLabel").html('<i class="fa fa-plus"></i> Add New Customer');
  }

  function populateCustomerForm(data, mode) {
    $("#customer_id").val(data.id);
    $("#nama_customers").val(data.name);
    $("#dob").val(data.birthday ? moment(data.birthday, "DD-MM-YYYY").format("DD-MM-YYYY") : "");
    $("#age").val(data.age);
    $("#gender").val(data.gender);
    $("#email").val(data.email);
    $("#phone_number").val(data.phone);
    $("#address").val(data.address);
    $("#city").val(data.city);
    $("#country").val(data.country);
    $("#loyalty_points").val(data.royalty_point);
    $("#membership").val(data.roles_type);

    if (mode === "view") {
      $("#CustomersModalsLabel").html('<i class="fa fa-eye"></i> View Customer');
      $("#CustomersModalsForm input, #CustomersModalsForm textarea, #CustomersModalsForm select").attr("readonly", true).attr("disabled", true);
    } else if (mode === "edit") {
      $("#CustomersModalsLabel").html('<i class="fa fa-edit"></i> Edit Customer');
    }
  }

  $("#CustomersModalsForm").on("submit", function (event) {
    event.preventDefault();
    const id = $("#customer_id").val();
    const url = id ? `/update_customer/${id}` : "/add_customer";

    $.ajax({
      url: url,
      method: "POST",
      data: $(this).serialize(),
      success: function (response) {
        alert(response.message);
        $("#CustomersModals").modal("hide");
        location.reload();
      },
      error: function (xhr) {
        const errorMessage = xhr.responseJSON.error || "An unknown error occurred.";
        showErrorModal(errorMessage);
      },
    });
  });

  $(document).on("change", "#dob", function () {
    const dob = $(this).val();
    const isValid = /^\d{2}-\d{2}-\d{4}$/.test(dob);
    if (!$("#CustomersModals").hasClass("show")) return;

    if (!isValid && dob) {
      alert("Tanggal harus dalam format DD-MM-YYYY");
      $(this).val("");
    }
  });

  $("#CustomersModalsForm").on("submit", function (event) {
    const gender = $("#gender").val();
    if (!["Male", "Female", "Other"].includes(gender)) {
      event.preventDefault();
      showErrorModal("Please select a valid gender.");
    }
  });

  function showErrorModal(message) {
    $("#errorMessage").text(message);
    $("#errorModal").modal("show");
  }
}
