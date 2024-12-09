// Import other JavaScript files (using ES6 modules)
import { utils } from "./utils.js";
import { initCalculator, createCalculator } from "./utils.js";
import { initializeImagePreview } from "./utils.js";
import {
  initModals,
  initDeleteModals,
  renderReleaseNotesAccordion,
  renderLoginPageAccordion,
} from "./modal-handler.js";
import { initDataTable } from "./datatable-init.js";
import { setupDarkMode } from "./dark-mode.js";
import {
  addGlobalEventListeners,
  setupCashierModal,
} from "./event-handlers.js";

// Entry point
$(document).ready(function () {
  console.log("App initialized:", new Date());

  // Initialize Utilities
  utils();
  createCalculator();
  initCalculator();

  // Initialize modals
  initModals();
  initDeleteModals();
  initializeImagePreview();

  // Initialize DataTable
  initDataTable();

  // Setup dark mode functionality
  setupDarkMode();

  // Add global event listeners
  addGlobalEventListeners();

  // Initialize modal for cashier
  setupCashierModal();

  // Render release notes and login page accordions
  renderReleaseNotesAccordion();
  renderLoginPageAccordion();
});
