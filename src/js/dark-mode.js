// Function to initialize dark mode functionality
export function setupDarkMode() {
    const darkModeCheckbox = $("#checkbox");
  
    // Helper to toggle dark mode classes
    const toggleDarkMode = (isChecked) => {
      $("body, canvas, .form-text").toggleClass("dark", isChecked);
    };
  
    if (darkModeCheckbox.length) {
      // Check stored state and apply it
      const isChecked = JSON.parse(localStorage.getItem("isChecked")) || false;
      darkModeCheckbox.prop("checked", isChecked);
      toggleDarkMode(isChecked);
  
      // Update state on checkbox change
      darkModeCheckbox.on("change", () => {
        const isChecked = darkModeCheckbox.prop("checked");
        localStorage.setItem("isChecked", isChecked);
        toggleDarkMode(isChecked);
      });
    }
  }
  