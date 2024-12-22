// Initialize DataTable configurations
export function initDataTable() {
  // Configure the User DataTable
  window.userTable = $("#myuser").DataTable({
    columnDefs: [
      { visible: false, targets: 0 }, // Hide ID column
      { className: "dt-left", targets: 1 }, // Left-align name column
      { className: "dt-center", targets: [2, 3, 4, 5, 6] }, // Center-align other columns
    ],
    processing: true,
    serverSide: true,
    ajax: {
      url: "/user",
      type: "GET",
      data: (d) => {
        d.page = Math.ceil(d.start / d.length) + 1; // Calculate current page
        d.per_page = d.length; // Items per page
      },
    },
    columns: [
      { data: "id", title: "ID" },
      { data: "username", title: "Username" },
      { data: "email", title: "Email" },
      { data: "name", title: "Name", width: "200px" },
      { data: "outlet", title: "Outlet", width: "200px" },
      { data: "role", title: "Roles", width: "200px" },
      {
        data: null,
        title: "Action",
        orderable: false,
        width: "180px",
        render: (row) => `
        <button class="btn btn-warning btn-sm view-menu-btn" data-id="${row.id}" style="margin-right: 3px;">View</button>
        <button class="btn btn-primary btn-sm edit-menu-btn" data-id="${row.id}" style="margin-right: 3px;">Edit</button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${row.id}">Delete</button>
      `,
      },
    ],
    order: [[1, "asc"]],
    paging: false,
    dom:
      "<'row'<'col-sm-6 d-flex align-items-center'<'custom-title'>><'col-sm-6'f>>" + // Custom layout
      "<'row'<'col-sm-12't>>" +
      "<'row'<'col-sm-4'i><'col-sm-4 d-flex justify-content-center'p><'col-sm-4'>>",
    language: {
      search: "Search:",
      paginate: { previous: "&lt;", next: "&gt;" },
      info: "", // Hapus teks "Showing x to x of x entries"
    },
    initComplete() {
      // Tambahkan teks "User" dengan ikon Font Awesome ke dalam elemen dengan class custom-title
      $("div.custom-title").html(`
      <h5 class='m-0 d-flex align-items-center'>
        <i class="fas fa-user me-2"></i> User
      </h5>
    `);
    },
  });

  // Configure the Menu DataTable
  window.menuTable = $("#mymenu").DataTable({
    columnDefs: [
      { visible: false, targets: 0 }, // Hide ID column
      { className: "dt-left", targets: 1 }, // Left-align name column
      { className: "dt-center", targets: [2, 3, 4, 5, 6, 7] }, // Center-align other columns
    ],
    processing: true,
    serverSide: true,
    ajax: {
      url: "/menu",
      type: "GET",
      data: (d) => {
        d.page = Math.ceil(d.start / d.length) + 1; // Calculate current page
        d.per_page = d.length; // Items per page
      },
    },
    columns: [
      { data: "id", title: "ID" },
      { data: "nama_menu", title: "Name" },
      { data: "kode", title: "Code", width: "200px" },
      { data: "kategori", title: "Category", width: "200px" },
      { data: "sub_kategori", title: "Subcategory", width: "200px" },
      {
        data: "harga",
        title: "Price",
        render: (value) =>
          `Rp. ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
        width: "200px",
      },
      { data: "status", title: "Status", width: "200px" },
      {
        data: null,
        title: "Action",
        orderable: false,
        width: "180px",
        render: (row) => `
            <button class="btn btn-warning btn-sm view-menu-btn" data-id="${row.id}" style="margin-right: 3px;">View</button>
            <button class="btn btn-primary btn-sm edit-menu-btn" data-id="${row.id}" style="margin-right: 3px;">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${row.id}">Delete</button>
          `,
      },
    ],
    order: [[1, "asc"]],
    pagingType: "simple_numbers",
    dom:
      "<'row'<'col-sm-6 d-flex align-items-center'l<'custom-container ms-3'>><'col-sm-6'f>>" +
      "<'row'<'col-sm-12't>>" +
      "<'row'<'col-sm-4'i><'col-sm-4 d-flex justify-content-center'p><'col-sm-4'>>",

    language: {
      search: "Search:",
      paginate: { previous: "&lt;", next: "&gt;" },
    },
    initComplete() {
      $("div.custom-container").html(`
        <div class="d-flex align-items-center">
          <span class="me-2"><i class="fas fa-vertical-line me-2"></i>Show by Kategori:</span>
          <div class="dropdown me-3">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownKategori"
              data-bs-toggle="dropdown" aria-expanded="false" style="width: 120px;">
              All
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownKategori">
              <li><a class="dropdown-item" href="#" data-filter="">All</a></li>
              <li><a class="dropdown-item" href="#" data-filter="makanan">Makanan</a></li>
              <li><a class="dropdown-item" href="#" data-filter="minuman">Minuman</a></li>
              <li><a class="dropdown-item" href="#" data-filter="snack">Snack</a></li>
            </ul>
          </div>
          
          <span class="me-2"><i class="fas fa-vertical-line me-2"></i>Show by Sub Kategori:</span>
          <div class="dropdown me-3">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownSubKategori"
              data-bs-toggle="dropdown" aria-expanded="false" style="width: 120px;">
              All
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownSubKategori">
              <li><a class="dropdown-item" href="#" data-filter="">All</a></li>
              <li><a class="dropdown-item" href="#" data-filter="makanan">Makanan</a></li>
              <li><a class="dropdown-item" href="#" data-filter="minuman">Minuman</a></li>
              <li><a class="dropdown-item" href="#" data-filter="snack">Snack</a></li>
            </ul>
          </div>
        </div>
      `);
    },
  });

  // Configure the Customers DataTable
  window.customersTable = $("#mycustomer").DataTable({
    columnDefs: [
      { visible: false, targets: 0 },
      { className: "dt-left", targets: 1 },
      { className: "dt-center", targets: [2, 3, 4, 5, 6, 8, 9, 10, 11, 12] },
    ],
    processing: true,
    serverSide: true,
    ajax: {
      url: "/data-customers",
      type: "GET",
      data: (d) => {
        d.page = Math.ceil(d.start / d.length) + 1;
        d.per_page = d.length;
      },
    },
    columns: [
      { data: "id", title: "ID" },
      { data: "name", title: "Name" },
      { data: "birthday", title: "Date of Birth" },
      { data: "age", title: "Age" },
      { data: "gender", title: "Gender" },
      { data: "email", title: "Email" },
      { data: "phone", title: "Phone Number" },
      { data: "address", title: "Address" },
      { data: "city", title: "City" },
      { data: "country", title: "Country" },
      { data: "roles_type", title: "Membership" },
      { data: "royalty_point", title: "Loyalty Points" },
      {
        data: null,
        title: "Actions",
        orderable: false,
        width: "180px",
        render: (row) => `
            <button class="btn btn-warning btn-sm view-customers-btn" data-id="${row.id}" style="margin-right: 3px;">View</button>
            <button class="btn btn-primary btn-sm edit-customers-btn" data-id="${row.id}" style="margin-right: 3px;">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${row.id}">Delete</button>
          `,
      },
    ],
    order: [[1, "asc"]],
    pagingType: "simple_numbers",
    dom:
      "<'row'<'col-sm-6'l><'col-sm-6'f>>" +
      "<'row'<'col-sm-12't>>" +
      "<'row'<'col-sm-4'i><'col-sm-4 d-flex justify-content-center'p><'col-sm-4'>>",
    language: {
      search: "Search:",
      paginate: { previous: "&lt;", next: "&gt;" },
    },
    initComplete() {
      this.api().columns().header().to$().addClass("text-center");
    },
  });
}

//Refresh table function
$('#refresh-menu').on('click', function() {
  window.menuTable.ajax.reload();
});

$('#refresh-customers').on('click', function() {
  window.customersTable.ajax.reload();
});