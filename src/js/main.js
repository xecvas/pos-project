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
import { addGlobalEventListeners, setupCashierPage } from "./event-handlers.js";

// Entry point
$(document).ready(function () {

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

  // Get user role from a hidden element or template variable
  const userRole = $("meta[name='user-role']").attr("content") || "undefined";
  const pageName = window.location.pathname.split("/").pop() || "index";
  const setupCompleted =
    $("meta[name='setup-completed']").attr("content") || "undefined";
  setupCashierPage(userRole, setupCompleted);
  if (window.location.pathname.includes("login")) {
    console.log("App initialized:", new Date());
  } else {
    console.log("App initialized:", new Date());
    console.log(`Detected user: ${userRole}, accessing ${pageName} page`);
  }
  // Initialize modal for cashier if user role is provided
  setupCashierPage(userRole, setupCompleted);
  // Render release notes and login page accordions
  renderReleaseNotesAccordion();
  renderLoginPageAccordion();
});
