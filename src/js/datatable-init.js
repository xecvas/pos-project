// Format currency to Rupiah
const formatRupiah = (value) =>
  `Rp. ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

// Function to initialize DataTable
export function initDataTable() {
  // Initialize the Menu DataTable
  window.menuTable = $("#mymenu").DataTable({
      columnDefs: [
          { visible: false, targets: 0 }, // Hide ID column
          { className: "dt-left", targets: 1 }, // Left-align name column
          { className: "dt-center", targets: [2, 3, 4, 5, 6, 7] }, // Center-align specified columns
      ],
      processing: true,
      serverSide: true,
      ajax: {
          url: "/menu", // Server endpoint
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
          { data: "harga", title: "Price", render: formatRupiah, width: "200px" },
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
          "<'row'<'col-sm-6'l><'col-sm-6'f>>" + 
          "<'row'<'col-sm-12't>>" + 
          "<'row'<'col-sm-4'i><'col-sm-4 d-flex justify-content-center'p><'col-sm-4'>>",
      language: {
          search: "Search:",
          paginate: { previous: "&lt;", next: "&gt;" },
      },
      initComplete: function () {
          this.api().columns().header().to$().addClass("text-center");
      },
  });

  // Initialize the Customers DataTable
  window.customersTable = $("#mycustomer").DataTable({
      columnDefs: [
          { visible: false, targets: 0 }, // Hide ID column
          { className: "dt-left", targets: 1 }, // Left-align name column
          { className: "dt-center", targets: [2, 3, 4, 5, 6, 8, 9, 10, 11, 12] }, // Center-align specified columns
      ],
      processing: true,
      serverSide: true,
      ajax: {
          url: "/data-customers", // Server endpoint
          type: "GET",
          data: (d) => {
              d.page = Math.ceil(d.start / d.length) + 1; // Calculate current page
              d.per_page = d.length; // Items per page
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
                  <button class="btn btn-warning btn-sm view-btn" data-id="${row.id}" style="margin-right: 3px;">View</button>
                  <button class="btn btn-primary btn-sm edit-btn" data-id="${row.id}" style="margin-right: 3px;">Edit</button>
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
      initComplete: function () {
          this.api().columns().header().to$().addClass("text-center");
      },
  });
}