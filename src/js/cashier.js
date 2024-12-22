document.addEventListener("DOMContentLoaded", function () {
  updateCheckoutButton();
  fetchMenuData("");
});

// Initialize
localStorage.removeItem("selectedItems");
let selectedItems = JSON.parse(localStorage.getItem("selectedItems")) || [];
let currentCategory = "All"; // Default ke "All" untuk menampilkan semua menu
let currentPage = 1;
let menuDataCache = [];

// Fetch menu data
function fetchMenuData(category = "") {
  const categoryParam = category === "All" ? "" : category;
  fetch(
    `/menu?category=${encodeURIComponent(
      categoryParam
    )}&start=0&length=500&draw=1`
  )
    .then((response) => response.json())
    .then((data) => {
      menuDataCache = data.data;
      renderMenu(menuDataCache);
    })
    .catch((error) => console.error("Error fetching menu data:", error));
}

// Render menu items
function renderMenu(menuData) {
  const menuContainer =
    currentCategory === "All"
      ? document.querySelector("#makanan") // Pilih salah satu kategori default
      : document.querySelector(`#${currentCategory.toLowerCase()}`);

  if (!menuContainer) {
    console.error("Error: Invalid category container.");
    return;
  }

  menuContainer.innerHTML = ""; // Kosongkan kontainer sebelum render
  menuData.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("menu-card");
    card.setAttribute("data-menu-id", item.id);

    // Tambahkan struktur list dan grid
    card.innerHTML = `
      ${
        item.menu_images
          ? `<img src="${item.menu_images}" alt="${item.nama_menu}">`
          : `
        <div style="width: 150px; height: 150px; display: flex; justify-content: center; align-items: center; font-size: 48px; font-weight: bold;">
          ${item.nama_menu
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase())
            .join("")}
        </div>
      `
      }
          <div class="card-body">
              <h5 class="card-title">${item.nama_menu}</h5>
              <p class="card-text">Rp ${item.harga.toLocaleString("id-ID")}</p>
              <div class="list-details d-none">
                  <p class="card-text">Subkategori: ${
                    item.sub_kategori || "-"
                  }</p>
                  <p class="card-text">Deskripsi: ${item.deskripsi || "-"}</p>
              </div>
          </div>
      `;

    card.addEventListener("click", () => addItemToOrder(item));
    menuContainer.appendChild(card);
  });
}

// Update category
function updateActiveCategory(selectedCategory) {
  document
    .querySelectorAll(".content")
    .forEach((category) => category.classList.add("d-none"));
  document.querySelector(`#${selectedCategory}`).classList.remove("d-none");
  fetchMenuData(selectedCategory, currentPage);
}

// Add item to order
function addItemToOrder(menuItem) {
  let existingItem = selectedItems.find((item) => item.menuId === menuItem.id);
  if (existingItem) {
    existingItem.quantity++;
    existingItem.totalPrice = existingItem.quantity * menuItem.harga; // Hitung ulang total harga
  } else {
    selectedItems.push({
      menuId: menuItem.id,
      menuName: menuItem.nama_menu,
      quantity: 1,
      totalPrice: menuItem.harga, // Set harga awal berdasarkan harga satuan
    });
  }
  localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
  updateOrderList();
}

// Fungsi untuk mengatur tombol aktif
function setActiveButton(activeButtonId) {
  document.querySelectorAll(".btn-menu").forEach((button) => {
    button.classList.remove("active");
  });
  document.getElementById(activeButtonId).classList.add("active");
}

function setActiveCategory(category) {
  // Reset kolom pencarian
  document.getElementById("menu-search").value = "";

  // Sembunyikan semua kategori
  document.querySelectorAll(".content").forEach((content) => {
    content.classList.add("d-none");
  });

  // Tampilkan kategori yang dipilih
  const activeCategory = document.getElementById(category.toLowerCase());
  if (activeCategory) activeCategory.classList.remove("d-none");
}

document.getElementById("food-btn").addEventListener("click", () => {
  setActiveButton("food-btn");
  setActiveCategory("makanan");
  currentCategory = "Makanan";
  fetchMenuData("Makanan");
});

document.getElementById("drink-btn").addEventListener("click", () => {
  setActiveButton("drink-btn");
  setActiveCategory("minuman");
  currentCategory = "Minuman";
  fetchMenuData("Minuman");
});

document.getElementById("snack-btn").addEventListener("click", () => {
  setActiveButton("snack-btn");
  setActiveCategory("snack");
  currentCategory = "Snack";
  fetchMenuData("Snack");
});

document.getElementById("all-btn").addEventListener("click", () => {
  setActiveButton("all-btn");
  currentCategory = "All";
  fetchMenuData(""); // Ambil semua data
  document.querySelectorAll(".content").forEach((content) => {
    content.classList.remove("d-none"); // Tampilkan semua kategori
  });
  // Reset kolom pencarian
  document.getElementById("menu-search").value = "";
});

// Search menu
function searchMenu(keyword) {
  const menuItems = document.querySelectorAll(".menu-card"); // Ambil semua menu
  menuItems.forEach((menuItem) => {
    const menuTitle = menuItem
      .querySelector(".card-title")
      .textContent.toLowerCase();
    const match = menuTitle.includes(keyword.toLowerCase());
    menuItem.style.display = match ? "" : "none"; // Tampilkan/hilangkan menu berdasarkan pencarian
  });
}

document.getElementById("menu-search").addEventListener("input", function () {
  const keyword = this.value.trim();

  if (keyword === "") {
    // Jika input kosong, reset ke kategori aktif
    document.querySelectorAll(".menu-card").forEach((menuItem) => {
      menuItem.style.display = ""; // Tampilkan semua menu
    });
  } else {
    // Pastikan semua kategori terlihat untuk pencarian lintas kategori
    document.querySelectorAll(".content").forEach((content) => {
      content.classList.remove("d-none");
    });
    searchMenu(keyword); // Lakukan pencarian
  }
});

fetchMenuData(currentCategory, currentPage);

function calculateSubtotal() {
  return selectedItems.reduce((total, item) => total + item.totalPrice, 0);
}

function calculateDiscountedTotal(discountType, discountValue) {
  let subtotal = calculateSubtotal();
  let discountedTotal = subtotal;

  if (discountType === "percent") {
    // Jika diskon 100%, langsung set total ke 0
    if (discountValue === 100) {
      discountedTotal = 0;
    } else {
      // Hitung diskon dalam bentuk persentase
      let percentageDiscount = Math.floor((discountValue * subtotal) / 100);

      // Pembulatan ke bawah dua digit terakhir
      percentageDiscount = Math.floor(percentageDiscount / 100) * 100;

      discountedTotal -= percentageDiscount;
    }
  } else if (discountType === "rp") {
    // Diskon nominal langsung dikurangkan
    discountedTotal -= discountValue;
  }

  return discountedTotal > 0 ? discountedTotal : 0; // Pastikan total tidak negatif
}

// Update order list
function updateOrderList() {
  const orderList = document.getElementById("order-list");
  if (!orderList) return;

  orderList.innerHTML = ""; // Kosongkan daftar sebelum render ulang
  let totalAmount = 0;

  selectedItems.forEach((item, index) => {
    totalAmount += item.totalPrice; // Tambahkan ke total subtotal
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <span>${(index + 1).toString().padStart(2, "0")}. ${item.menuName}</span>
      <span>${item.quantity}</span>
      <span>Rp ${item.totalPrice.toLocaleString("id-ID")}</span>
      <i class="fas fa-trash delete-icon"></i>
    `;

    // Tambahkan event listener untuk klik item
    div.addEventListener("click", () => openQuantityModal(item));

    // Tambahkan tombol hapus
    const deleteIcon = div.querySelector(".delete-icon");
    deleteIcon.addEventListener("click", (e) => {
      e.stopPropagation(); // Jangan buka modal saat tombol delete diklik
      removeItemFromOrder(item.menuId);
    });

    orderList.appendChild(div);
  });

  // Update Subtotal
  document.querySelector("#Subtotal span").textContent =
    totalAmount.toLocaleString("id-ID");
  updateCheckoutButton(); // Perbarui tombol checkout
}

function openQuantityModal(menuItem) {
  // Konten dinamis untuk modal
  const modalBody = `
    <h5 class="text-center">Update Quantity : ${menuItem.menuName}</h5>
    <div class="input-group mt-3" style="width: 120px; margin: 0 auto;">
  <button class="btn" type="button" id="decrease-quantity">
    <i class="fas fa-chevron-left"></i>
  </button>
  <input type="text" id="quantity-input" class="form-control text-center" 
         value="${menuItem.quantity}" min="1" style="width: 50px;">
  <button class="btn" type="button" id="increase-quantity">
    <i class="fas fa-chevron-right"></i>
  </button>
</div>
    <div class="d-flex justify-content-center mt-4">
      <button class="btn btn-primary" id="ok-button">OK</button>
    </div>
  `;

  // Gunakan fungsi `openModal` untuk menampilkan modal
  openModal("", modalBody);

  // Tambahkan event listener untuk tombol di modal
  const quantityInput = document.getElementById("quantity-input");
  document.getElementById("decrease-quantity").addEventListener("click", () => {
    if (quantityInput.value > 1) quantityInput.value--;
  });
  document.getElementById("increase-quantity").addEventListener("click", () => {
    quantityInput.value++;
  });
  document.getElementById("ok-button").addEventListener("click", () => {
    const newQuantity = parseInt(quantityInput.value, 10);
    updateOrderQuantity(menuItem.menuId, newQuantity); // Panggil fungsi untuk memperbarui jumlah
    window.currentModal.hide(); // Tutup modal setelah selesai
  });
}

function updateOrderQuantity(menuId, newQuantity) {
  // Cari item berdasarkan menuId
  const item = selectedItems.find((item) => item.menuId === menuId);
  if (item) {
    const unitPrice = item.totalPrice / item.quantity; // Harga satuan menu
    item.quantity = newQuantity;
    item.totalPrice = unitPrice * newQuantity; // Total harga = harga satuan * jumlah baru
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems)); // Simpan ke localStorage
    updateOrderList(); // Perbarui tampilan order list
  }
}

function updateCheckoutButton() {
  const subtotal = calculateSubtotal();
  const discountText = document
    .getElementById("Discount")
    .querySelector("span").textContent;

  let discountType = "code";
  let discountValue = 0;

  // Tentukan jenis diskon (persentase atau nominal)
  if (discountText.endsWith("%")) {
    discountType = "percent";
    discountValue = parseInt(discountText.replace("%", ""), 10);
  } else if (discountText.startsWith("Rp")) {
    discountType = "rp";
    discountValue = parseInt(discountText.replace(/[^\d]/g, ""), 10);
  }

  const checkoutButton = document.querySelector(".checkout-btn");

  // Jika order list kosong, tampilkan teks "Checkout"
  if (subtotal === 0) {
    checkoutButton.textContent = "Checkout";
  } else {
    // Jika ada item, hitung total dengan diskon
    const total = calculateDiscountedTotal(discountType, discountValue);
    checkoutButton.textContent = `Rp ${total.toLocaleString("id-ID")}`;
  }
}

// Remove item from order
function removeItemFromOrder(menuId) {
  selectedItems = selectedItems.filter((item) => item.menuId !== menuId);
  localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
  updateOrderList();
}

// Fungsi untuk membuka modal dengan konten dinamis
function openModal(title, bodyContent, iconClass = null) {
  const modal = document.getElementById("ButtonGrouplModal");
  const modalTitle = modal.querySelector("#modal-title");
  const modalBody = modal.querySelector("#modal-body");

  // Set judul dengan atau tanpa ikon
  modalTitle.innerHTML = iconClass
    ? `<i class="${iconClass} me-2"></i>${title}`
    : title;

  // Set konten tubuh modal
  modalBody.innerHTML = bodyContent;

  const bootstrapModal = new bootstrap.Modal(modal);
  bootstrapModal.show();
  window.currentModal = bootstrapModal; // Simpan modal untuk referensi
}

// Fungsi untuk mengganti teks tombol
function updateButtonText(buttonId, newText) {
  document.getElementById(buttonId).innerText = newText;
}

// Fungsi untuk menampilkan modal pencarian member
window.openMemberModal = async function () {
  const bodyContent = `
      <button class="btn btn-warning text-white w-100 mb-2" id="add-customers" data-bs-toggle="modal" data-bs-target="#CustomersModals">
          <i class="fa fa-plus me-2"></i>Add Customers
      </button>
      <input type="text" id="search-input" class="form-control" placeholder="Cari nama, telepon, atau email...">
      <div id="dropdown-results" class="list-group mt-2"></div>
  `;
  openModal("Pencarian Customer", bodyContent, "fas fa-user");

  const searchInput = document.getElementById("search-input");
  const dropdown = document.getElementById("dropdown-results");

  // Event listener untuk pencarian real-time
  searchInput.addEventListener("input", async function () {
    const query = searchInput.value.trim();
    if (query.length < 2) {
      dropdown.innerHTML = ""; // Kosongkan jika input terlalu pendek
      return;
    }

    try {
      const response = await fetch(
        `/search_customers?query=${encodeURIComponent(query)}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const results = await response.json();
      dropdown.innerHTML = results
        .map(
          (customer) => `
            <button type="button" class="list-group-item list-group-item-action" onclick="selectMember('${customer.name}')">
                <strong>${customer.name}</strong> - ${customer.email} (${customer.phone})
            </button>
        `
        )
        .join("");
    } catch (error) {
      console.error("Error fetching customers:", error);
      dropdown.innerHTML = `<div class="text-danger">Terjadi kesalahan. Coba lagi.</div>`;
    }
  });
};

// Fungsi untuk memilih customer dari hasil pencarian
window.selectMember = function (name) {
  const button = document.getElementById("member-btn");
  button.innerHTML = `<strong>${name}</strong> `; // Perbarui teks tombol
  window.currentModal.hide(); // Tutup modal
};

// Fungsi khusus untuk tombol Discount dengan Toggle
window.openDiscountModal = function () {
  const discountForm = `
      <div>
          <label class="form-label">Pilih Jenis Diskon</label>
          <div class="btn-group w-100 mb-3" role="group" aria-label="Toggle Discount Type">
              <button type="button" class="btn btn-outline-primary active" id="percent-btn" onclick="toggleDiscountInput('percent')">%</button>
              <button type="button" class="btn btn-outline-primary" id="rp-btn" onclick="toggleDiscountInput('rp')">Rp</button>
              <button type="button" class="btn btn-outline-primary" id="code-btn" onclick="toggleDiscountInput('code')">Code</button>
          </div>
          <div id="discount-input-container">
              <input type="number" id="discount-input" class="form-control mb-2" placeholder="Masukkan Diskon (%)" min="0">
          </div>
          <button type="button" class="btn btn-success" onclick="applyDiscount()">Terapkan</button>
      </div>
  `;
  openModal("Masukkan Diskon", discountForm, "fas fa-tag");
};

// Fungsi Toggle Input Diskon
window.toggleDiscountInput = function (type) {
  document.getElementById("percent-btn").classList.remove("active");
  document.getElementById("rp-btn").classList.remove("active");
  document.getElementById("code-btn").classList.remove("active");

  document.getElementById(`${type}-btn`).classList.add("active");

  let placeholderText = "";
  if (type === "percent") placeholderText = "Masukkan Diskon (%)";
  if (type === "rp") placeholderText = "Masukkan Diskon (RP)";
  if (type === "code") placeholderText = "Masukkan Kode Diskon";

  document.getElementById("discount-input-container").innerHTML = `
    <input type="${type === "code" ? "text" : "number"}" 
           id="discount-input" 
           class="form-control mb-2" 
           placeholder="${placeholderText}" 
           ${type !== "code" ? 'min="0"' : ""}>
  `;
};

// Fungsi untuk menerapkan diskon
window.applyDiscount = function () {
  const discountInput = document.getElementById("discount-input");
  const discountValue = discountInput.value.trim();

  if (discountValue !== "") {
    let formattedText = ""; // Variabel untuk teks di tombol
    let displayText = ""; // Variabel untuk teks di div total

    // Tentukan format berdasarkan tipe input
    if (discountInput.type === "number") {
      if (discountInput.placeholder.includes("%")) {
        // Format untuk persentase
        formattedText = `<strong>Discount:</strong><br>${discountValue}%`;
        displayText = `${discountValue}%`;
      } else {
        // Format untuk Rupiah
        const formattedNumber = Number(discountValue)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        formattedText = `<strong>Discount:</strong><br>Rp ${formattedNumber}`;
        displayText = `Rp ${formattedNumber}`;
      }
    } else if (discountInput.type === "text") {
      // Format untuk kode diskon
      formattedText = `<strong>Discount:</strong><br>Code`;
      displayText = `Code`;
    }

    // Update tombol dengan innerHTML
    const discountBtn = document.getElementById("discount-btn");
    discountBtn.innerHTML = formattedText;

    // Update teks di elemen dengan id="Discount"
    const discountDisplay = document.getElementById("Discount");
    const discountSpan = discountDisplay.querySelector("span");
    if (discountSpan) {
      discountSpan.textContent = displayText; // Update nilai span
    }

    // Tutup modal
    window.currentModal.hide();

    // Perbarui tombol checkout
    updateCheckoutButton();
  }
};

// Fungsi khusus untuk tombol Dine-in dengan Jenis Layanan
window.openDineInModal = function () {
  const dineInForm = `
      <form id="dinein-form">
          <label class="form-label">Pilih Jenis Layanan</label>
          <select id="dinein-type" class="form-select mb-3" onchange="togglePaxInput()" required>
              <option value="Dine-in">Dine-in</option>
              <option value="Takeaway">Takeaway</option>
              <option value="Delivery">Delivery</option>
          </select>
          <div id="pax-container">
              <label for="pax-input" class="form-label">Jumlah Pax (Orang)</label>
              <input type="number" id="pax-input" class="form-control mb-2" placeholder="Jumlah Pax" min="1" required>
          </div>
          <button type="submit" class="btn btn-success">Konfirmasi</button>
      </form>
  `;
  openModal("Pilih Layanan", dineInForm, "fa fa-glass-cheers");

  // Tambahkan event listener untuk validasi dan pengiriman form
  const form = document.getElementById("dinein-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Cegah pengiriman form default

    // Panggil fungsi applyDineIn hanya jika form valid
    if (form.checkValidity()) {
      applyDineIn();
    } else {
      form.reportValidity(); // Tampilkan validasi bawaan browser
    }
  });
};

window.togglePaxInput = function () {
  const dineInType = document.getElementById("dinein-type").value;
  const paxContainer = document.getElementById("pax-container");
  const paxInput = document.getElementById("pax-input");

  if (dineInType === "Dine-in") {
    paxContainer.style.display = "block"; // Tampilkan input pax
    paxInput.required = true; // Jadikan input required
  } else {
    paxContainer.style.display = "none"; // Sembunyikan input pax
    paxInput.required = false; // Hilangkan required
    paxInput.value = ""; // Kosongkan nilai input
  }
};

// Fungsi untuk memilih dine-in dan pax
window.applyDineIn = function () {
  const dineInType = document.getElementById("dinein-type").value;
  const paxInput = document.getElementById("pax-input");
  const pax = paxInput ? paxInput.value : null;

  let outputText;

  if (dineInType === "Dine-in") {
    outputText = `<strong>${dineInType}</strong><br><strong>Pax:</strong> ${pax}`;
  } else {
    outputText = `<strong>${dineInType}</strong>`;
  }

  const button = document.getElementById("dinein-btn");
  button.innerHTML = outputText; // Perbarui teks tombol

  window.currentModal.hide(); // Tutup modal
};

// Event Listener untuk tombol di button group
document
  .getElementById("member-btn")
  .addEventListener("click", openMemberModal);
document
  .getElementById("discount-btn")
  .addEventListener("click", openDiscountModal);
document
  .getElementById("dinein-btn")
  .addEventListener("click", openDineInModal);

// Tambahkan fungsi ke global scope
window.toggleViewMode = function (mode) {
  const menuCards = document.querySelectorAll(".menu-card");
  const gridBtn = document.getElementById("grid-view-btn");
  const listBtn = document.getElementById("list-view-btn");

  if (mode === "grid") {
    // Aktifkan Grid View
    menuCards.forEach((card) => {
      card.classList.remove("list-view");
      const listDetails = card.querySelector(".list-details");
      if (listDetails) listDetails.classList.add("d-none");
    });

    gridBtn.classList.add("active");
    listBtn.classList.remove("active");
  } else if (mode === "list") {
    // Aktifkan List View
    menuCards.forEach((card) => {
      card.classList.add("list-view");
      const listDetails = card.querySelector(".list-details");
      if (listDetails) listDetails.classList.remove("d-none");
    });

    listBtn.classList.add("active");
    gridBtn.classList.remove("active");
  }
};
