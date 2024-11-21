// Format currency to Rupiah
const formatRupiah = (value) =>
  "Rp. " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// Function to initialize DataTable
export function initDataTable() {
  $("#testing").DataTable({}),
    $("#mymenu").DataTable({
      columnDefs: [
        { visible: false, targets: 0 }, // Hide ID column
        { className: "dt-left", targets: 1 },
        { className: "dt-center", targets: [2, 3, 4, 5, 6, 7] }, // Center content for specific columns
      ], // Hide ID column
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
        { data: "id", title: "ID" },
        { data: "nama_menu", title: "Name" },
        { data: "kode", title: "Code" },
        { data: "kategori", title: "Category" },
        { data: "sub_kategori", title: "Subcategory" },
        { data: "harga", title: "Price", render: formatRupiah },
        { data: "status", title: "Status" },
        {
          data: null,
          title: "Action",
          orderable: false,
          render: (row) => `
            <button class="btn btn-primary btn-sm edit-btn" data-id="${row.id}">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${row.id}">Delete</button>
          `,
        },
      ],
      pagingType: "simple_numbers", // Simplified pagination controls
      dom:
        "<'row'<'col-sm-6'l><'col-sm-6'f>>" + // Length changing and search input
        "<'row'<'col-sm-12't>>" + // Table
        "<'row'<'col-sm-4'i><'col-sm-4 d-flex justify-content-center'p><'col-sm-4'>>", // Info and pagination
      language: {
        search: "Search:", // Custom label for search box
        paginate: { previous: "&lt;", next: "&gt;" }, // Custom pagination symbols
      },
      initComplete: function () {
        // Center table headers
        this.api().columns().header().to$().addClass("text-center");
      },
    });
}
