export function setupDarkMode() {
  // Toggle dark mode classes based on checkbox state
  const darkModeCheckbox = $("#checkbox");
  const toggleDarkMode = (isChecked) => {
      document.documentElement.setAttribute("data-theme", isChecked ? "dark" : "light");
  };

  if (darkModeCheckbox.length) {
      // Apply stored dark mode state
      const isChecked = JSON.parse(localStorage.getItem("isChecked")) || false;
      darkModeCheckbox.prop("checked", isChecked);
      toggleDarkMode(isChecked);

      // Update state and dark mode on checkbox change
      darkModeCheckbox.on("change", () => {
          const isChecked = darkModeCheckbox.prop("checked");
          localStorage.setItem("isChecked", isChecked);
          toggleDarkMode(isChecked);
      });
  }

  // Select the HTML element and the logo
  const html = document.documentElement;
  const brandLogo = document.getElementById("brand-logo");

  // Function to switch theme
  function toggleTheme(theme) {
      if (theme === "dark") {
          html.setAttribute("data-theme", "dark");
          brandLogo.src = "{{ url_for('images', filename='light-banner-page.png') }}";
      } else {
          html.setAttribute("data-theme", "light");
          brandLogo.src = "{{ url_for('images', filename='dark-banner-page.png') }}";
      }
  }
}