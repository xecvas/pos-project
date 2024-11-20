// Import other JavaScript files (using ES6 modules or other methods)
import { initModals } from './modal-handler.js'; // Modal-related logic
import { initDataTable } from './datatable-init.js'; // DataTable initialization
import { setupDarkMode } from './dark-mode.js'; // Dark mode handling
import { addGlobalEventListeners } from './event-handlers.js'; // Event listeners
import { renderReleaseNotesAccordion, renderLoginPageAccordion } from './modal-handler.js'; //Modal Handler

// Entry point
$(document).ready(function () {
  console.log("App initialized:", new Date());

  // Initialize modals
  initModals();

  // Initialize DataTable
  initDataTable();

  // Setup dark mode functionality
  setupDarkMode();

  // Add global event listeners
  addGlobalEventListeners();

  // Render release notes and login page accordions
  renderReleaseNotesAccordion();
  renderLoginPageAccordion();
});