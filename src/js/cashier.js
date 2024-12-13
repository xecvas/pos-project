// Fungsi untuk menghitung total
function calculateTotal() {
    const items = document.querySelectorAll('.order-content .item span');
    const subtotalElement = document.querySelector('.order-total .total span');
    const discountElement = document.querySelector('.order-total .total:nth-child(2) span');
    const checkoutButton = document.querySelector('.checkout-btn');

    let subtotal = 0;

    // Iterasi setiap item untuk menjumlahkan harga
    items.forEach(item => {
        const priceText = item.textContent.replace(/IDR|,/g, '').trim(); // Hapus "IDR" dan koma
        const price = parseFloat(priceText);
        if (!isNaN(price)) {
            subtotal += price;
        }
    });

    // Tentukan diskon
    const discount = 100000;

    // Hitung total bayar
    const totalBayar = subtotal - discount;

    // Perbarui elemen DOM
    subtotalElement.textContent = `IDR ${subtotal.toLocaleString()}`;
    discountElement.textContent = `IDR ${discount.toLocaleString()}`;
    checkoutButton.textContent = `Total: IDR ${totalBayar.toLocaleString()}`;
}

// Panggil fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', calculateTotal);
