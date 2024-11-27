// Function to initialize dark mode functionality
export function setupDarkMode() {
  const darkModeCheckbox = $("#checkbox");

  // Helper to toggle dark mode classes
  const toggleDarkMode = (isChecked) => {
    document.documentElement.setAttribute(
      "data-theme",
      isChecked ? "dark" : "light"
    );
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

  // Select the HTML element and the logo
  const html = document.documentElement;
  const brandLogo = document.getElementById('brand-logo');

  // Function to switch theme
  function toggleTheme(theme) {
      if (theme === 'dark') {
          html.setAttribute('data-theme', 'dark');
          brandLogo.src = "{{ url_for('images', filename='light-banner-page.png') }}";
      } else {
          html.setAttribute('data-theme', 'light');
          brandLogo.src = "{{ url_for('images', filename='dark-banner-page.png') }}";
      }
  }
}
