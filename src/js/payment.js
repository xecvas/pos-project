function showPaymentOption(option) {
    const display = document.getElementById('payment-display');
    let content = '';

    switch (option) {
        case 'cash':
            content = `
                <h3>Cash Payment</h3>
                <p>Please enter the amount received:</p>
                <input type="number" class="form-control mb-3" placeholder="Amount Received">
                <button class="btn btn-success w-100">Confirm</button>
            `;
            break;
        case 'debit-credit':
            content = `
                <h3>Debit/Credit Payment</h3>
                <p>Enter card details:</p>
                <input type="text" class="form-control mb-3" placeholder="Card Number">
                <input type="text" class="form-control mb-3" placeholder="Card Holder Name">
                <input type="text" class="form-control mb-3" placeholder="Expiry Date">
                <button class="btn btn-success w-100">Confirm</button>
            `;
            break;
        case 'qris':
            content = `
                <h3>QRIS Payment</h3>
                <p>Select your e-wallet:</p>
                <div class="e-wallet">
                    <img src="https://via.placeholder.com/30" alt="GoPay">
                    <span>GoPay</span>
                </div>
                <div class="e-wallet">
                    <img src="https://via.placeholder.com/30" alt="OVO">
                    <span>OVO</span>
                </div>
                <div class="e-wallet">
                    <img src="https://via.placeholder.com/30" alt="DANA">
                    <span>DANA</span>
                </div>
                <div class="e-wallet">
                    <img src="https://via.placeholder.com/30" alt="ShopeePay">
                    <span>ShopeePay</span>
                </div>
            `;
            break;
        case 'voucher':
            content = `
                <h3>Voucher Payment</h3>
                <p>Enter voucher code:</p>
                <input type="text" class="form-control mb-3" placeholder="Voucher Code">
                <button class="btn btn-success w-100">Apply</button>
            `;
            break;
        default:
            content = '<h3 class="text-center">Select a payment option</h3>';
    }

    display.innerHTML = content;
}

// Tambahkan ke objek `window`
window.showPaymentOption = showPaymentOption;

// Set initial payment display ke "cash"
document.addEventListener("DOMContentLoaded", function () {
    window.showPaymentOption('cash');
});
