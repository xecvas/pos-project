import {
  DateTime,
  initCalculator,
  createCalculator,
  initializeImagePreview,
} from "./utils.js";
import {
  initReleaseModals,
  initForgotPasswordModal,
  renderReleaseNotesAccordion,
  renderLoginPageAccordion,
  initDeleteButton,
  initEditAddButtons
} from "./modal-handler.js";
import { initDataTable } from "./datatable-init.js";
import { setupDarkMode } from "./dark-mode.js";
import { addGlobalEventListeners, setupCashierPage } from "./event-handlers.js";

// Entry point
$(document).ready(function () {
  // utils.js
  DateTime();
  initializeImagePreview();
  createCalculator();
  initCalculator();

  // modal-handler.js
  initReleaseModals();
  initForgotPasswordModal();
  renderReleaseNotesAccordion();
  renderLoginPageAccordion();
  initDeleteButton();
  initEditAddButtons();

  // datatable-init.js
  initDataTable();

  // dark-mode.js
  setupDarkMode();

  // event-handlers.js
  addGlobalEventListeners();

  // Get user role from a hidden element or template variable
  const userRole = $("meta[name='user-role']").attr("content") || "undefined";
  const pageName = window.location.pathname.split("/").pop() || "index";
  const setupCompleted =
    $("meta[name='setup-completed']").attr("content") || "undefined";
  setupCashierPage(userRole, setupCompleted);
  if (window.location.pathname.includes("login")) {
    console.log(new Date());
  } else {
    console.log(new Date());
    console.log(`Detected user: ${userRole}, accessing ${pageName} page`);
  }
  setupCashierPage(userRole, setupCompleted);
});
