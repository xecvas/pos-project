// Function to format currency to Rupiah
export function formatRupiah(value) {
    return "Rp. " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  
  // Debounce function to limit the rate of function execution
  export function debounce(func, delay = 300) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }
  
  // Function to check if a click occurred outside an element
  export function isClickOutside(targetElement, event) {
    return !targetElement.is(event.target) && targetElement.has(event.target).length === 0;
  }
  