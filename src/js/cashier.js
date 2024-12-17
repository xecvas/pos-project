document.addEventListener("DOMContentLoaded", function () {
  updateCheckoutButton();
});

// Initialize
localStorage.removeItem("selectedItems");
let selectedItems = JSON.parse(localStorage.getItem("selectedItems")) || [];
let currentCategory = "makanan";
let currentPage = 1;

// Fetch menu data
function fetchMenuData(category, page) {
  const pageSize = 200;
  const offset = (page - 1) * pageSize;
  fetch(`/menu?category=${category}&start=${offset}&length=${pageSize}&draw=1`)
    .then((response) => response.json())
    .then((data) => renderMenu(data.data, category));
}

// Render menu items
function renderMenu(menuData, category) {
  const menuContainer = document.querySelector(`#${category}`);
  if (!menuContainer) return;

  menuContainer.innerHTML = "";

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
    existingItem.totalPrice = existingItem.quantity * menuItem.harga;
  } else {
    selectedItems.push({
      menuId: menuItem.id,
      menuName: menuItem.nama_menu,
      quantity: 1,
      totalPrice: menuItem.harga,
    });
  }
  localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
  updateOrderList();
}

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

  orderList.innerHTML = "";
  let totalAmount = 0;

  selectedItems.forEach((item, index) => {
    totalAmount += item.totalPrice;
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <span>${(index + 1).toString().padStart(2, "0")}. ${item.menuName}</span>
      <span>${item.quantity}</span>
      <span>Rp ${item.totalPrice.toLocaleString("id-ID")}</span>`;

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-trash delete-icon";
    deleteIcon.addEventListener("click", () => removeItemFromOrder(item.menuId));
    div.appendChild(deleteIcon);
    orderList.appendChild(div);
  });

  // Update Subtotal
  document.querySelector("#Subtotal span").textContent = totalAmount.toLocaleString("id-ID");

  // Perbarui tombol checkout
  updateCheckoutButton();
}

function updateCheckoutButton() {
  const subtotal = calculateSubtotal();
  const discountText = document.getElementById("Discount").querySelector("span").textContent;

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
    checkoutButton.textContent = `Checkout - Rp ${total.toLocaleString("id-ID")}`;
  }
}

// Remove item from order
function removeItemFromOrder(menuId) {
  selectedItems = selectedItems.filter((item) => item.menuId !== menuId);
  localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
  updateOrderList();
}

// Search menu
function searchMenu(keyword) {
  const menuItems = document.querySelectorAll(`#${currentCategory} .menu-card`);
  menuItems.forEach((menuItem) => {
    const menuTitle = menuItem
      .querySelector(".card-title")
      .textContent.toLowerCase();
    menuItem.style.display = menuTitle.includes(keyword.toLowerCase())
      ? ""
      : "none";
  });
}

document.getElementById("menu-search").addEventListener("input", function () {
  searchMenu(this.value.trim());
});

fetchMenuData(currentCategory, currentPage);

// Fungsi untuk membuka modal dengan konten dinamis
function openModal(title, bodyContent) {
  document.getElementById("modal-title").innerText = title;
  document.getElementById("modal-body").innerHTML = bodyContent;
  const modal = new bootstrap.Modal(
    document.getElementById("ButtonGrouplModal")
  );
  modal.show();
  window.currentModal = modal; // Simpan modal untuk bisa ditutup nanti
}

// Fungsi untuk mengganti teks tombol
function updateButtonText(buttonId, newText) {
  document.getElementById(buttonId).innerText = newText;
}

// Fungsi khusus untuk tombol Member
window.openMemberModal = async function () {
  try {
    const response = await fetch("/roles-types");
    const roles = await response.json();
    const rolesButtons = roles
      .map(
        (role) =>
          `<button class="btn btn-outline-primary m-1" onclick="selectMember('${role}')">${role}</button>`
      )
      .join("");
    openModal("Pilih Member", `<div class="text-center">${rolesButtons}</div>`);
  } catch (error) {
    console.error("Error fetching roles types:", error);
    openModal("Error", "<p class='text-danger'>Gagal memuat data member.</p>");
  }
};

window.selectMember = function (role) {
  const button = document.getElementById("member-btn");
  button.innerHTML = `<strong>Member:</strong> ${role}`; // Buat "Member:" tebal
  window.currentModal.hide(); // Tutup modal
};

// Fungsi khusus untuk tombol Discount dengan Toggle
window.openDiscountModal = function () {
  const discountForm = `
    <div>
      <label class="form-label">Pilih Jenis Diskon</label>
      <div class="btn-group w-100 mb-3" role="group" aria-label="Toggle Discount Type">
        <button type="button" class="btn btn-outline-primary active" id="percent-btn" onclick="toggleDiscountInput('percent')">%</button>
        <button type="button" class="btn btn-outline-primary" id="rp-btn" onclick="toggleDiscountInput('rp')">RP</button>
        <button type="button" class="btn btn-outline-primary" id="code-btn" onclick="toggleDiscountInput('code')">Code</button>
      </div>
      <div id="discount-input-container">
        <input type="number" id="discount-input" class="form-control mb-2" placeholder="Masukkan Diskon (%)" min="0">
      </div>
      <button type="button" class="btn btn-success" onclick="applyDiscount()">Terapkan</button>
    </div>
  `;
  openModal("Masukkan Diskon", discountForm);
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
        const formattedNumber = Number(discountValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
    <form>
      <label class="form-label">Pilih Jenis Layanan</label>
      <select id="dinein-type" class="form-select mb-3">
        <option value="Dine-in">Dine-in</option>
        <option value="Takeaway">Takeaway</option>
        <option value="Delivery">Delivery</option>
      </select>
      <label for="pax-input" class="form-label">Jumlah Pax (Orang)</label>
      <input type="number" id="pax-input" class="form-control mb-2" placeholder="Jumlah Pax" min="1">
      <button type="button" class="btn btn-success" onclick="applyDineIn()">Konfirmasi</button>
    </form>
  `;
  openModal("Pilih Layanan dan Jumlah Pax", dineInForm);
};

// Fungsi untuk memilih dine-in dan pax
window.applyDineIn = function () {
  const dineInType = document.getElementById("dinein-type").value;
  const pax = document.getElementById("pax-input").value;
  if (pax > 0) {
    const button = document.getElementById("dinein-btn");
    button.innerHTML = `<strong>Dine-in</strong><br><strong>Pax:</strong>${pax}`; // Menggunakan innerHTML agar <br> berfungsi
    window.currentModal.hide(); // Tutup modal
  }
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