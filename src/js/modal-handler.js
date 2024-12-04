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
      const featuresHTML = Object.entries(latestRelease.features)
        .map(
          ([category, items]) =>
            `<strong>${
              category.charAt(0).toUpperCase() + category.slice(1)
            }:</strong>
             <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`
        )
        .join("");

      $("#modalContent").html(`
        <h5>${latestRelease.version} - ${latestRelease.date}</h5>
        ${featuresHTML}
      `);

      $("#releaseModal")
        .modal({
          backdrop: false,
          keyboard: true,
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
          <div class="accordion-body">
            ${featuresHTML}
          </div>
        </div>
      </div>
    `;

    releaseNotesAccordion.append(accordionItem);
  });

  // Select the latest version from ReleaseData and set in navbar
  const projectTitle = document.querySelector(".navbar-brand .project-version");

  if (ReleaseData && ReleaseData.length > 0 && projectTitle) {
    const latestVersion = ReleaseData[0].version;
    projectTitle.textContent = `v${latestVersion}`;
  }

  //Forgot Password Modal and Check Email Modal
  const forgotPasswordModalElement = document.getElementById(
    "forgotPasswordModal"
  );
  if (forgotPasswordModalElement) {
    forgotPasswordModalElement.addEventListener("submit", function (event) {
      event.preventDefault();

      // Hide the Forgot Password Modal
      var forgotPasswordModalInstance = bootstrap.Modal.getInstance(
        forgotPasswordModalElement
      );
      forgotPasswordModalInstance.hide();

      // Show the Check Email Modal
      var checkEmailModal = new bootstrap.Modal(
        document.getElementById("checkEmailModal")
      );
      checkEmailModal.show();
    });
  }
}

export function initDeleteModals() {
  // Add the modals dynamically to the DOM
  const modalHTML = `
    <div class="modal fade" id="datatable-delete-modal" tabindex="-1" aria-labelledby="formModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header" style="border-bottom: none;">
            <h5 class="modal-title" id="formModalLabel"><i class="fa fa-warning"></i>  Delete Data</h5>
          </div>
          <div class="modal-body">Are you sure to delete this record?</div>
          <div class="modal-footer" style="border-top: none;">
            <button type="button" id="row-delete-no" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" id="row-delete-yes" class="btn btn-danger delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
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

  // Append modals to the body
  $("body").append(modalHTML);

  let rowToDelete = null; // Scope for the row to delete
  let currentTable = null; // Scope for the current table

  // Show the delete modal when the delete button is clicked
  $(document).on("click", ".delete-btn", function () {
    const id = $(this).data("id"); // Get the ID from the clicked button
    const tableName = $(this).closest("table").attr("id"); // Determine which table the button belongs to

    if (tableName === "mymenu") {
      currentTable = window.menuTable;
    } else if (tableName === "mycustomer") {
      currentTable = window.customersTable;
    }

    rowToDelete = currentTable.row($(this).closest("tr")); // Get the corresponding row
    $("#row-delete-yes").data("id", id); // Set the ID for the confirmation button
    $("#datatable-delete-modal").modal("show"); // Show the delete modal
  });

  // Handle delete confirmation
  $("#row-delete-yes").on("click", function () {
    const id = $(this).data("id"); // Get the ID from the confirmation button

    if (currentTable && rowToDelete) {
      // Determine the correct endpoint
      const endpoint =
        currentTable === window.menuTable
          ? `/delete_menu/${id}`
          : `/delete_customer/${id}`;

      // Make an AJAX request to delete the record
      $.ajax({
        type: "POST",
        url: endpoint,
        success: function () {
          // Remove the row from DataTable and redraw
          rowToDelete.remove().draw();

          // Hide the delete modal and show success modal
          $("#datatable-delete-modal").modal("hide");
          $("#success-delete-modal").modal("show");
        },
        error: function (xhr, status, error) {
          console.error("Error deleting record:", error);
        },
      });
    }
  });

  // Hide delete success modal on "OK" button click
  $("#success-delete-modal").on("click", function () {
    $("#success-delete-modal").modal("hide"); // Hide the success modal
  });

  $(document).on("click", ".view-btn", function () {
    const id = $(this).data("id"); // Ambil ID dari atribut data-id
    showCustomerModal(id, "view");
  });

  $(document).on("click", ".edit-btn", function () {
    const id = $(this).data("id"); // Ambil ID dari atribut data-id
    showCustomerModal(id, "edit");
  });

  $(document).on("click", "#add-customers", function () {
    // Reset form
    $("#CustomersModalsForm")[0].reset();
    $("input, textarea, select").removeAttr("readonly").removeAttr("disabled");

    // Set default values for Add mode
    $("#CustomersModalsLabel").html('<i class="fa fa-plus"></i> Add New Customer'); // Untuk Add
    $("#customer_id").val(""); // Kosongkan ID pelanggan
    $("#age").attr("readonly", true); // Tetap readonly karena dihitung otomatis
    $("#membership").attr("readonly", true); // Tetap readonly
    $("#loyalty_points").attr("readonly", true); // Tetap readonly

    // Tampilkan modal
    $("#CustomersModals").modal("show");
  });

  function showCustomerModal(id, mode) {
    // Reset form
    $("#CustomersModalsForm")[0].reset();
    $("input, textarea, select").removeAttr("readonly").removeAttr("disabled");

    // Fetch customer data
    $.ajax({
      url: `/get_customer/${id}`,
      method: "GET",
      success: function (data) {
        // Populate form with customer data
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
        $("#phone_number").val(data.phone);
        $("#address").val(data.address);
        $("#city").val(data.city);
        $("#country").val(data.country);
        $("#loyalty_points").val(data.royalty_point);
        $("#membership").val(data.roles_type);

        // Mode: View
        if (mode === "view") {
          // Buat semua field readonly atau disabled
          $("#CustomersModalsLabel").html('<i class="fa fa-eye"></i> View Customer'); // Untuk View
          $(
            "#CustomersModalsForm input, #CustomersModalsForm textarea, #CustomersModalsForm select"
          )
            .attr("readonly", true)
            .attr("disabled", true);
        }

        // Mode: Edit
        if (mode === "edit") {
          // Hanya field tertentu yang readonly
          $("#CustomersModalsLabel").html('<i class="fa fa-edit"></i> Edit Customer'); // Untuk Edit
          $("#age").attr("readonly", true);
          $("#membership").attr("readonly", true);
          $("#loyalty_points").attr("readonly", true);
        }

        // Tampilkan modal
        $("#CustomersModals").modal("show");
      },
      error: function (xhr) {
        alert(`Error: ${xhr.responseJSON.error}`);
      },
    });
  }

  $("#CustomersModalsForm").on("submit", function (event) {
    event.preventDefault();

    const id = $("#customer_id").val(); // Ambil ID pelanggan
    const url = id ? `/update_customer/${id}` : "/add_customer"; // Gunakan endpoint sesuai mode

    $.ajax({
      url: url,
      method: "POST",
      data: $(this).serialize(),
      success: function (response) {
        alert(response.message); // Tampilkan pesan sukses
        $("#CustomersModals").modal("hide"); // Tutup modal
        location.reload(); // Reload tabel pelanggan
      },
      error: function (xhr) {
        const errorMessage =
          xhr.responseJSON.error || "An unknown error occurred.";
        showErrorModal(errorMessage); // Tampilkan pesan error
      },
    });
  });

  $(document).on("change", "#dob", function () {
    const dob = $(this).val(); // Format input date
    const isValid = /^\d{2}-\d{2}-\d{4}$/.test(dob); // Regex untuk DD-MM-YYYY

    // Pastikan modal masih aktif
    if (!$("#CustomersModals").hasClass("show")) {
      return; // Jika modal tidak aktif, keluar dari validasi
    }

    if (!isValid && dob) {
      // Validasi hanya jika ada nilai
      alert("Tanggal harus dalam format DD-MM-YYYY");
      $(this).val(""); // Kosongkan input jika format salah
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
    $("#errorMessage").text('tralala'); // Set pesan error
    $("#errorModal").modal("show"); // Tampilkan modal
  }
}
