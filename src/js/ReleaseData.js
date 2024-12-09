const ReleaseData = [
  {
    version: "2.5.0",
    date: "10/12/2024",
    features: {
      added: [
        "Integrated a Cashier section in the sidebar, accessible for admin accounts.",
        "Implemented a database system to store and manage cashier logs efficiently."
      ],
      fixed: [
        "Resolved issues in JavaScript and Python code, ensuring seamless functionality.",
        "Optimized multiple JavaScript functions to enhance overall page performance."
      ],
      improvements: [
        "Streamlined console logs for better clarity and reduced clutter.",
        "Implemented general bug fixes and performance enhancements across the system."
      ]
    }    
  },
  {
    version: "2.4.0",
    date: "09/12/2024",
    features: {
      added: [
        "Implemented separate login systems for Admin and Cashier roles.",
        "Restricted Cashier access to pages requiring Admin privileges.",
        "Login credentials are now securely stored in the database."
      ],
      fixed: [
        "Resolved issues with the login page functionality.",
        "Fixed JavaScript errors on specific pages, ensuring smoother user interaction.",
        "Addressed and optimized various JavaScript functions to improve page performance."
      ],
      improvements: [
        "General bug fixes and performance enhancements."
      ]
    }
  },
  {
    version: "2.3.0",
    date: "08/12/2024",
    features: {
      added: [
        "Age is now calculated automatically when adding or editing customer details.",
        "Added a calculator to calculate item prices.",
        "Disabled clicks outside of menus and customers modals for enhanced usability.",
        "Introduced the ability to add, view, and edit menu pictures."
      ],
      fixed: [
        "Fixed issues with the view functionality for menus and customers.",
        "Resolved problems with the edit functionality for menus and customers.",
        "Addressed various issues within the JavaScript code."
      ],
      improvements: [
        "General bug fixes and performance enhancements.",
        "Ensured no errors are present in the console."
      ]
    }
  },
  {
    version: "2.2.0",
    date: "02/12/2024",
    features: {
      added: [
        "Implemented the view functionality for menus and customers.",
        "Added edit functionality for menus and customers.",
        "Introduced new backend routes for improved system performance."
      ],
      fixed: [
        "Fixed issues with the view functionality.",
        "Updated DataTable initialization for better performance.",
        "Resolved various issues in HTML and JavaScript code."
      ],
      improvements: ["General bug fixes and performance enhancements."]
    }
  },
  {
    version: "2.1.0",
    date: "30/11/2024",
    features: {
      added: [
        "Added export-to-Excel functionality for customers.",
        "Implemented delete functionality for both menus and customers.",
        "Introduced corresponding modals for the delete function.",
        "Added new backend routes.",
        "Displayed live current time across all pages."
      ],
      fixed: [
        "Resolved issues with the delete functionality.",
        "Refreshed nearly all CSS code.",
        "Updated DataTable initialization.",
        "Addressed various code-related issues."
      ],
      improvements: ["General bug fixes and performance enhancements."]
    }
  },
  {
    version: "2.0.0",
    date: "24/11/2024",
    features: {
      added: [
        "Automatically calculates customer age.",
        "Automatically categorizes customers into role types based on their loyalty points.",
        "Modal for the 'forgot password' function.",
        "Displays total number of customers and their respective roles on the index page.",
        "Various settings added in the settings page."
      ],
      fixed: [
        "Resolved various issues in JavaScript.",
        "Fixed the issue with data not displaying correctly."
      ],
      improvements: ["General bug fixes and performance enhancements."]
    }
  },
  {
    version: "1.9.0",
    date: "22/11/2024",
    features: {
      added: ["Customer page and customer list."],
      fixed: [
        "Resolved various issues in JavaScript.",
        "Fixed the issue with data not displaying correctly."
      ],
      improvements: ["General bug fixes and performance enhancements."]
    }
  },
  {
    version: "1.8.0",
    date: "21/11/2024",
    features: {
      added: [
        "Button to show table by category.",
        "Form icon modal for adding and editing menu.",
        "New dark color theme."
      ],
      fixed: [
        "Fixed various issues in the list-menu page.",
        "Resolved the issue with menus not displaying correctly.",
        "Fixed sorting problems in the list-menu."
      ],
      improvements: ["General bug fixes and performance enhancements."]
    }
  },
  {
    version: "1.7.0",
    date: "20/11/2024",
    features: {
      added: [
        "Split JavaScript code into multiple files.",
        "Form modal for adding and editing menu."
      ],
      fixed: ["Fixed various issues in the list-menu page."],
      improvements: ["General bug fixes and performance enhancements."]
    }
  },
  {
    version: "1.6.0",
    date: "19/11/2024",
    features: {
      added: [
        "Search bar functionality in release notes.",
        "Settings page.",
        "Release notes section in the sidebar.",
        "Functional buttons on the menu page."
      ],
      moved: [
        "Moved list menu from the dashboard to the list-menu page.",
        "Moved ReleaseNote modal to a separate JavaScript file."
      ],
      removed: ["Removed ReleaseNote modal from all pages."],
      improved: [
        "Updated icons and colors.",
        "Improved CSS styling for main content.",
        "General bug fixes and performance enhancements."
      ]
    }
  },
  {
    version: "1.5.0",
    date: "18/11/2024",
    features: {
      added: [
        "Menu database.",
        "Pagination for the menu table.",
        "Total menu count displayed on the main page card."
      ],
      fixed: ["Fixed sidebar visual effects."],
      improvements: ["General bug fixes and performance enhancements."]
    }
  },
  {
    version: "1.4.0",
    date: "17/11/2024",
    features: {
      added: [
        "Card feature on the main page.",
        "Background image for the login page."
      ],
      fixed: [
        "Fixed pagination alignment on the page.",
        "Fixed positioning of the main content."
      ],
      improvements: ["General bug fixes and performance enhancements."]
    }
  },
  {
    version: "1.3.0",
    date: "16/11/2024",
    features: {
      added: ["View all release notes in the release-note page."],
      fixed: [
        "Fixed release-note page functionality.",
        "Adjusted font sizes across all pages.",
        "Ensured UI design consistency."
      ],
      improvements: [
        "Separated CSS files for each component.",
        "General bug fixes and performance enhancements."
      ]
    }
  },
  {
    version: "1.2.0",
    date: "13/11/2024",
    features: {
      added: [
        "Version information displayed next to the logo.",
        "Sidebar and burger menu button.",
        "New UI design enhancements."
      ],
      improvements: ["General bug fixes and performance enhancements."]
    }
  },
  {
    version: "1.1.0",
    date: "12/11/2024",
    features: {
      added: ["Notification icon on the main page."],
      fixed: [
        "Ensured dark/light mode compatibility across all pages.",
        "Improved user session handling during login."
      ],
      improvements: [
        "Redesigned user interface.",
        "General bug fixes and performance enhancements."
      ]
    }
  },
  {
    version: "1.0.0",
    date: "11/11/2024",
    features: {
      added: ["Password field toggle feature."],
      improved: [
        "Toggling functionality.",
        "User interface design.",
        "General bug fixes and performance enhancements."
      ]
    }
  }
];