// Modal HTML generator
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

// Generate features HTML for accordions
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

// Initialize modals functionality
export function initReleaseModals() {
  // Generate modal HTML structure
  const modalHTML = createModalHTML(
    "releaseModal",
    "Latest Release",
    '<div id="modalContent"></div>',
    `<a href="/release-note" id="seeAllReleases" class="btn btn-link" style="text-decoration: none;"><b>See All Releases</b></a>`
  );

  // Inject modal HTML into the container
  $("#dynamicModalContainer").html(modalHTML);

  // Handle notification click to display the latest release details
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

  // Close modal when clicking outside of it
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

// Initialize Forgot Password Modal
export function initForgotPasswordModal() {
  // Get the forgot password modal element
  const forgotPasswordModalElement = document.getElementById(
    "forgotPasswordModal"
  );

  // Add event listener for form submission
  if (forgotPasswordModalElement) {
    forgotPasswordModalElement.addEventListener("submit", function (event) {
      event.preventDefault();

      // Hide the forgot password modal
      const forgotPasswordModalInstance = bootstrap.Modal.getInstance(
        forgotPasswordModalElement
      );
      forgotPasswordModalInstance.hide();

      // Show the check email modal
      const checkEmailModal = new bootstrap.Modal(
        document.getElementById("checkEmailModal")
      );
      checkEmailModal.show();
    });
  }
}

// Render login page accordion
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

// Render release notes accordion
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
}

// Initialize delete button
export function initDeleteButton() {
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
}

export function initEditAddButtons() {
  const successModalHTML = `
    <div class="modal fade" id="success-modal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body text-center">
            <p class="fs-4">Menu Successful</p>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const errorModalHTML = `
    <div class="modal fade" id="error-modal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body">
            <h5>Error</h5>
            <p id="error-message"></p>
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;

  $("body").append(successModalHTML + errorModalHTML);
  
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

  function handleFormSubmit(event, type, operation) {
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
        // Tentukan pesan berdasarkan operasi (add atau edit)
        let successMessage = "";
        if (operation === "add") {
          successMessage = `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`;
        } else if (operation === "edit") {
          successMessage = `${type.charAt(0).toUpperCase() + type.slice(1)} edited successfully`;
        }
  
        // Set pesan ke dalam modal success
        $("#success-modal .modal-body p").text(successMessage);
  
        // Menampilkan modal success
        $("#success-modal").modal("show");
  
        // Menutup modal form setelah berhasil
        $(`${type === "menu" ? "#MenuModals" : "#CustomersModals"}`).modal("hide");
      },
      error: function (xhr) {
        // Menampilkan modal error dengan pesan
        const errorMessage =
          xhr.responseJSON && xhr.responseJSON.error
            ? xhr.responseJSON.error
            : "An unknown error occurred.";
        showErrorModal(errorMessage);
      },
    });
  }
  
  // Menambahkan event listener untuk modal success
  $("#success-modal").on("hide.bs.modal", function () {
    // Reload halaman setelah modal sukses ditutup
    location.reload();
  });
  
  
  function showErrorModal(message) {
    $("#error-message").text(message); // Set isi modal error
    $("#error-modal").modal("show");   // Tampilkan modal error
  }  

  $(document).on("click", ".view-menu-btn, .view-customers-btn", function () {
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

  $(document).on("click", ".edit-menu-btn, .edit-customers-btn", function () {
    const id = $(this).data("id");
    const type = $(this).hasClass("edit-menu-btn") ? "menu" : "customer";
    resetForm(type);
    $.ajax({
      url: `/get_${type}/${id}`,
      method: "GET",
      success: function (data) {
        populateForm(data, type, "edit");
        $(`#${type === "menu" ? "MenuModals" : "CustomersModals"}`).modal("show");
        // Pastikan saat submit, parameter operation = "edit"
        $(`#${type === "menu" ? "MenuModalsForm" : "CustomersModalsForm"}`).on("submit", function (event) {
          handleFormSubmit(event, type, "edit");  // operasi "edit"
        });
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
    handleFormSubmit(event, type, "add");  // operasi "add"
  });
}