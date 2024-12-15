document.addEventListener("DOMContentLoaded", function () {
  localStorage.removeItem("selectedItems");
  let selectedItems = JSON.parse(localStorage.getItem("selectedItems")) || [];
  let currentCategory = "makanan"; // Default category
  let currentPage = 1;
  

  // Fetch menu data for the selected category
  function fetchMenuData(category, page) {
    const pageSize = 200;
    const offset = (page - 1) * pageSize;
    fetch(
      `/menu?category=${category}&start=${offset}&length=${pageSize}&draw=1`
    )
      .then((response) => response.json())
      .then((data) => renderMenu(data.data, category));
  }

  // Render menu items for the selected category
  function renderMenu(menuData, category) {
    const menuContainer = document.querySelector(`#${category}`);
    if (!menuContainer) return;

    menuContainer.innerHTML = ""; // Clear current content

    menuData.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("menu-card");
      card.setAttribute("data-menu-id", item.id);
      card.innerHTML = `
          ${
            item.menu_images
              ? `<img src="${item.menu_images}" alt="${item.nama_menu}">`
              : `
            <div style="width: 100%; height: 150px; display: flex; justify-content: center; align-items: center; font-size: 48px; font-weight: bold;">
              ${item.nama_menu
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase())
                .join("")}
            </div>
          `
          }
          <div class="card-body">
            <h5 class="card-title">${item.nama_menu}</h5>
            <p class="card-text">Rp ${item.harga}</p>
          </div>
        `;
      card.addEventListener("click", () => addItemToOrder(item));
      menuContainer.appendChild(card);
    });
  }

  // Update active category and fetch new data
  function updateActiveCategory(selectedCategory) {
    const allCategories = document.querySelectorAll(".content");
    allCategories.forEach((category) => category.classList.add("d-none"));

    const activeCategory = document.querySelector(`#${selectedCategory}`);
    if (activeCategory) activeCategory.classList.remove("d-none");

    fetchMenuData(selectedCategory, currentPage);
  }

  // Add item to order
  function addItemToOrder(menuItem) {
    let existingItem = selectedItems.find(
      (item) => item.menuId === menuItem.id
    );
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

  // Update order list
  function updateOrderList() {
    const orderList = document.getElementById("order-list");
    if (!orderList) return;
  
    orderList.innerHTML = ""; // Kosongkan daftar sebelumnya
    let totalAmount = 0;
  
    selectedItems.forEach((item, index) => {
      totalAmount += item.totalPrice;
  
      const div = document.createElement("div");
      div.className = "item";
  
      // Format nomor urut menjadi 01, 02, dst.
      const formattedIndex = (index + 1).toString().padStart(2, "0");
  
      div.innerHTML = `
        <span>${formattedIndex}. ${item.menuName}</span>
        <span>${item.quantity}</span>
        <span>Rp ${item.totalPrice.toLocaleString("id-ID")}</span>
      `;
  
      // Tambahkan ikon delete secara dinamis
      const deleteIcon = document.createElement("i");
      deleteIcon.className = "fas fa-trash delete-icon";
      deleteIcon.addEventListener("click", () => removeItemFromOrder(item.menuId));
      div.appendChild(deleteIcon);
  
      orderList.appendChild(div);
    });
  
    // Perbarui subtotal dan tombol checkout
    document.querySelector(
      "#Subtotal span"
    ).textContent = `Rp ${totalAmount.toLocaleString("id-ID")}`;
    document.querySelector(
      ".checkout-btn"
    ).textContent = `Total: Rp ${totalAmount.toLocaleString("id-ID")}`;
  }  

  // Fungsi untuk menghapus item dari pesanan
  function removeItemFromOrder(menuId) {
    selectedItems = selectedItems.filter((item) => item.menuId !== menuId);
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    updateOrderList();
  }

  // Fungsi untuk mencari menu
  function searchMenu(keyword) {
    const activeCategory = document.querySelector(`#${currentCategory}`);
    if (!activeCategory) return;

    const menuItems = activeCategory.querySelectorAll(".menu-card");
    menuItems.forEach((menuItem) => {
      const menuTitle = menuItem.querySelector(".card-title").textContent.toLowerCase();
      if (menuTitle.includes(keyword.toLowerCase())) {
        menuItem.style.display = ""; // Tampilkan
      } else {
        menuItem.style.display = "none"; // Sembunyikan
      }
    });
  }

  // Event listener untuk input pencarian
  const searchInput = document.getElementById("menu-search");
  searchInput.addEventListener("input", function () {
    const keyword = searchInput.value.trim();
    searchMenu(keyword);
  });

  // Add event listeners to category buttons
  document.querySelectorAll(".btn-outline-primary").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.id.replace("-btn", "");
      updateActiveCategory(category);
    });
  });

  // Initial load
  fetchMenuData(currentCategory, currentPage);
});
