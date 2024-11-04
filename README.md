# Expense Tracker

An Expense Tracker app built with the MERN stack (MongoDB, Express, React, Node.js). This project allows users to track their daily expenses, view summaries, and manage their budgets effectively. Developed collaboratively to gain hands-on experience with Git, version control, and full-stack development.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

The Expense Tracker app helps users manage their personal finances by logging expenses, categorizing transactions, and viewing monthly summaries. It’s designed with a focus on secure, efficient data handling and a smooth, responsive UI.

---

## Features

- **Add Expenses**: Users can log expenses with details like category, amount, and date.
- **View Transactions**: Filtered views for better tracking of expenses.
- **Summary Dashboard**: Visualize spending patterns with charts and statistics.
- **Budget Management**: Set and monitor budgets for various categories.

---

## Technologies Used

- **Frontend**: React, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Other**: Git/GitHub for version control, Nodemon for development

---

## Getting Started

### Prerequisites

- **Node.js** and **npm** installed
- **MongoDB** installed locally or a MongoDB Atlas account

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Jayesh0726/ExpenseTrackkingSystem.git
   cd ExpenseTrackkingSystem
   ```

2. **Backend Setup**:
   - Navigate to the server folder:
     ```bash
     cd server
     ```
   - Install backend dependencies:
     ```bash
     npm install
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup**:
   - Open a new terminal, navigate to the client folder:
     ```bash
     cd client
     ```
   - Install frontend dependencies:
     ```bash
     npm install
     ```
   - Start the frontend development server:
     ```bash
     npm start
     ```

---

## Environment Variables

Create a `.env` file in the `server` directory and add the following environment variables:

```plaintext
PORT=8000
```

Make sure to keep these variables secure and not share them publicly.

---

## Contributing

We’re using a branch-based workflow to collaborate effectively. Here’s how to contribute:

1. **Clone the repo and create a new branch** for your feature:
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Make your changes and commit** them with clear messages:
   ```bash
   git commit -m "feat: add transaction filter feature"
   ```

3. **Push to GitHub** and create a Pull Request:
   ```bash
   git push origin feature/feature-name
   ```

4. **Review and Merge**: Tag a teammate to review your PR. Once approved, it can be merged into the `dev` branch.

---

## License

This project is open-source and available under the MIT License.

