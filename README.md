# Printing Application

This is a Node.js-based web application for managing and printing bills. It uses Express for server handling, EJS for templates, and Body-Parser for request body parsing.

## Features
- Create, edit, view, and print bills.
- Simple UI using EJS templates.
- Default shop details provided in the app (can be customized).

---

## Prerequisites
To run this application, ensure you have the following installed:

1. **Node.js** (v16 or above)
2. **npm** (Node Package Manager, typically comes with Node.js)

---

## Installation

1. **Clone or extract the repository:**
   If you have the zip file, extract it, or clone the repository if it is hosted on a version control platform.

2. **Navigate to the project directory:**
   ```bash
   cd /path/to/printing
   ```

3. **Install dependencies:**
   Run the following command to install the required npm modules:
   ```bash
   npm install
   ```

   This will install the following dependencies:
   - `express`: A web framework for Node.js
   - `body-parser`: Middleware to parse incoming request bodies
   - `ejs`: Template engine for rendering views

---

## Running the Application

1. **Start the server:**
   Use the following command to start the server:
   ```bash
   node index.js
   ```

2. **Access the application:**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Project Structure

- **`index.js`**: The main server file where the Express app is configured and started.
- **`package.json`**: Metadata and dependencies for the project.
- **`views/`**: Contains EJS templates for rendering pages:
  - `allBills.ejs`
  - `editBill.ejs`
  - `home.ejs`
  - `newBill.ejs`
  - `printBill.ejs`

---

## Notes
- Ensure all `.ejs` files are in the `views` folder as they are necessary for rendering the templates.
- If the application requires a database or persistent storage, you might need to integrate MongoDB or another database solution (not included in the current setup).

