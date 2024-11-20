# POS Project

## Overview
The POS Project is a web application designed to manage a point-of-sale system for the food and beverage industry. It provides functionalities for managing menus, release notes, user accounts, and settings.

## Features
- **User  Authentication**: Secure login and logout functionalities.
- **Dashboard**: Overview of menu statistics including total menu items, categorized counts, and active/inactive status.
- **Menu Management**: Ability to view, add, edit, and delete menu items.
- **Release Notes**: View and manage release notes for the application.
- **Settings**: User settings management including password changes.
- **Dark Mode**: Toggle between light and dark themes for better user experience.

## Technologies Used
- **Frontend**:
  - HTML
  - CSS
  - JavaScript (jQuery, Bootstrap)
- **Backend**:
  - Python (Flask)
  - SQLAlchemy for ORM
  - PostgreSQL for the database
- **Libraries**:
  - DataTables for enhanced table functionalities
  - Math.js for mathematical operations

## File Structure
```bash
src/ 
├── css/ 
│ ├── global.css 
│ └── index.css 
├── docs/ 
│ ├── index.html 
│ ├── login.html 
│ ├── release-note.html 
│ ├── settings.html 
│ └── list-menu.html 
├── js/ 
│ ├── main.js 
│ ├── event-handlers.js 
│ ├── modal-handler.js 
│ ├── datatable-init.js 
│ └── ReleaseData.js 
├── python/ 
│ ├── main.py 
│ └── database.py
└── README.md
```

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/xecvas/pos-project.git
   cd pos-project
2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
3. Set up the PostgreSQL database and update the DATABASE_URL in database.py with your credentials.
4. Run the application:
   ```bash
   python src/python/main.py

## Usage
Access the application via http://localhost:5000.
Use the provided login credentials to access the dashboard and other functionalities.

## Contributing
Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License - see the LICENSE file for details.

## Acknowledgements
Thanks to all contributors and libraries used in this project.

