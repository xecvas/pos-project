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
      $("#releaseModal")
        .modal({ backdrop: false, keyboard: true })
        .modal("show");
    }
  });

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

// Generate features HTML
function generateFeaturesHTML(features) {
  return Object.entries(features)
    .map(
      ([category, items]) =>
        `<strong>${
          category.charAt(0).toUpperCase() + category.slice(1)
        }:</strong>
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
          <button class="accordion-button ${
            isLastRelease ? "" : "collapsed"
          }" type="button"
            data-bs-toggle="collapse" data-bs-target="#collapse-note-${index}"
            aria-expanded="${isLastRelease}" aria-controls="collapse-note-${index}" style="border-radius: 12px;">
            <strong>${release.version} - ${release.date}</strong>
          </button>
        </h2>
        <div id="collapse-note-${index}" class="accordion-collapse collapse ${
      isLastRelease ? "show" : ""
    }"
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
  const forgotPasswordModalElement = document.getElementById(
    "forgotPasswordModal"
  );
  if (forgotPasswordModalElement) {
    forgotPasswordModalElement.addEventListener("submit", function (event) {
      event.preventDefault();
      const forgotPasswordModalInstance = bootstrap.Modal.getInstance(
        forgotPasswordModalElement
      );
      forgotPasswordModalInstance.hide();
      const checkEmailModal = new bootstrap.Modal(
        document.getElementById("checkEmailModal")
      );
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

  const successModalHTML = `
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
`;

  $("body").append(modalHTML + successModalHTML);

  let rowToDelete = null;
  let currentTable = null;

  $(document).on("click", ".delete-btn", function () {
    const id = $(this).data("id");
    const tableName = $(this).closest("table").attr("id");
    currentTable =
      tableName === "mymenu" ? window.menuTable : window.customersTable;
    rowToDelete = currentTable.row($(this).closest("tr"));
    $("#row-delete-yes").data("id", id);
    $("#datatable-delete-modal").modal("show");
  });

  $("#row-delete-yes").on("click", function () {
    const id = $(this).data("id");
    if (currentTable && rowToDelete) {
      const endpoint =
        currentTable === window.menuTable
          ? `/delete_menu/${id}`
          : `/delete_customer/${id}`;
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
  function resetForm(type) {
    const formId = type === "menu" ? "#MenuModalsForm" : "#CustomersModalsForm";
    $(formId)[0].reset();
    $(`${formId} input, ${formId} textarea, ${formId} select`)
      .removeAttr("readonly")
      .removeAttr("disabled");
    if (type === "menu") {
      $("#menu_id").val("");
      $("#MenuModalsLabel").html('<i class="fa fa-plus"></i> Add New Menu');
    } else {
      $("#customer_id").val("");
      $("#age, #membership, #loyalty_points").attr("readonly", true);
      $("#loyalty_points").val(0);
      $("#membership").val("Basic");
      $("#CustomersModalsLabel").html(
        '<i class="fa fa-plus"></i> Add New Customer'
      );
    }
  }

  function populateForm(data, type, mode) {
    if (type === "menu") {
      $("#menu_id").val(data.id);
      $("#nama_menu").val(data.nama_menu);
      $("#kode").val(data.kode);
      $("#kategori").val(data.kategori);
      $("#sub_kategori").val(data.sub_kategori);
      $("#harga").val(data.harga);
      $("#status").val(data.status);

      if (mode === "view") {
        const statusValue = data.status === "aktif" ? "Aktif" : "Tidak Aktif";
        $("#status").replaceWith(
          `<input type="text" class="form-control" id="status" value="${statusValue}" readonly />`
        );
        $("#calc-toggle").hide();
        $("#harga").addClass("rounded-end");
        $("#MenuModalsLabel").html('<i class="fa fa-eye"></i> View Menu');
        disableFormInputs("#MenuModalsForm");
      } else {
        $("#status").replaceWith(`
          <select class="form-select" id="status" name="status" required>
              <option disabled>Pilih Status</option>
              <option value="Aktif" ${
                data.status === "Aktif" ? "selected" : ""
              }>Aktif</option>
              <option value="Tidak Aktif" ${
                data.status === "Tidak Aktif" ? "selected" : ""
              }>Tidak Aktif</option>
          </select> 
      `);
        $("#calc-toggle").show();
        $("#harga").removeClass("rounded-end");
        $("#MenuModalsLabel").html('<i class="fa fa-edit"></i> Edit Menu');
      }
    } else {
      $("#customer_id").val(data.id);
      $("#nama_customers").val(data.name);
      $("#dob").val(
        data.birthday
          ? moment(data.birthday, "DD-MM-YYYY").format("DD-MM-YYYY")
          : ""
      );
      $("#age").val(data.age);
      $("#gender").val(data.gender);
      $("#email").val(data.email);
      $("#phone").val(data.phone);
      $("#address").val(data.address);
      $("#city").val(data.city);
      $("#country").val(data.country);
      $("#loyalty_points").val(data.royalty_point);
      $("#membership").val(data.roles_type);

      if (mode === "view") {
        const genderValue =
          data.gender === "Male"
            ? "Male"
            : data.gender === "Female"
            ? "Female"
            : data.gender === "Other"
            ? "Other"
            : "Unknown";
        $("#gender").replaceWith(
          `<input type="text" class="form-control" id="gender" value="${genderValue}" readonly />`
        );
        $("#CustomersModalsLabel").html(
          '<i class="fa fa-eye"></i> View Customer'
        );
        disableFormInputs("#CustomersModalsForm");
      } else {
        $("#gender").replaceWith(`
          <select class="form-select" id="gender" name="gender" required>
            <option disabled>Pilih Gender</option>
            <option value="Male" ${
              data.gender === "Male" ? "selected" : ""
            }>Male</option>
            <option value="Female" ${
              data.gender === "Female" ? "selected" : ""
            }>Female</option>
            <option value="Other" ${
              data.gender === "Other" ? "selected" : ""
            }>Other</option>
          </select>
        `);
        $("#CustomersModalsLabel").html(
          '<i class="fa fa-edit"></i> Edit Customer'
        );
      }
    }
  }

  function disableFormInputs(formId) {
    $(`${formId} input, ${formId} textarea, ${formId} select`)
      .attr("readonly", true)
      .attr("disabled", true);
  }

  function handleFormSubmit(event, type) {
    event.preventDefault();
    const idField = type === "menu" ? "#menu_id" : "#customer_id";
    const formId = type === "menu" ? "#MenuModalsForm" : "#CustomersModalsForm";
    const id = $(idField).val();
    const url = id ? `/update_${type}/${id}` : `/add_${type}`;

    $.ajax({
      url: url,
      method: "POST",
      data: $(formId).serialize(),
      success: function (response) {
        alert(response.message);
        $(`${type === "menu" ? "#MenuModals" : "#CustomersModals"}`).modal(
          "hide"
        );
        location.reload();
      },
      error: function (xhr) {
        const errorMessage =
          xhr.responseJSON.error || "An unknown error occurred.";
        showErrorModal(errorMessage);
      },
    });
  }

  function showErrorModal(message) {
    $("#errorMessage").text(message);
    $("#errorModal").modal("show");
  }

  $(document).on("click", ".view-menu-btn, .view-btn", function () {
    const id = $(this).data("id");
    const type = $(this).hasClass("view-menu-btn") ? "menu" : "customer";
    resetForm(type);
    $.ajax({
      url: `/get_${type}/${id}`,
      method: "GET",
      success: function (data) {
        populateForm(data, type, "view");
        $(`#${type === "menu" ? "MenuModals" : "CustomersModals"}`).modal(
          "show"
        );
      },
      error: function (xhr) {
        alert(`Error: ${xhr.responseJSON.error}`);
      },
    });
  });

  $(document).on("click", ".edit-menu-btn, .edit-btn", function () {
    const id = $(this).data("id");
    const type = $(this).hasClass("edit-menu-btn") ? "menu" : "customer";
    resetForm(type);
    $.ajax({
      url: `/get_${type}/${id}`,
      method: "GET",
      success: function (data) {
        populateForm(data, type, "edit");
        $(`#${type === "menu" ? "MenuModals" : "CustomersModals"}`).modal(
          "show"
        );
      },
      error: function (xhr) {
        alert(`Error: ${xhr.responseJSON.error}`);
      },
    });
  });

  $(document).on("click", "#add-menu, #add-customers", function () {
    const type = $(this).attr("id") === "add-menu" ? "menu" : "customer";
    resetForm(type);
    $(`#${type === "menu" ? "MenuModals" : "CustomersModals"}`).modal("show");
  });

  $("#MenuModalsForm, #CustomersModalsForm").on("submit", function (event) {
    const type = $(this).attr("id") === "MenuModalsForm" ? "menu" : "customer";
    handleFormSubmit(event, type);
  });
}
