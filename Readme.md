# Inventory Management System

This project contains both the frontend (React) and backend (Node.js + Express) to manage inventory data, with features like uploading Excel files and displaying inventory information from a MySQL database.

---

## Backend Setup (Node.js + Express)

### 1. Clone the repository:
```bash
git clone https://github.com/sathishk-dev/inventory.git
cd backend
```
### 2. Install dependencies:
```bash
npm install
```

### 3. Create a .env file:
```bash
DB_HOST = localhost
DB_USER = root
DB_PASS =
DB_NAME = inventory

PORT = 3001

JWT_SECRET = "jwt-secret-key"
CLIENT_URL = 'http://localhost:3000'
```
# Environment Variables

The following environment variables are used for configuring the backend of the Inventory Management System:

- **DB_HOST**: Database host (usually `localhost` for local development).
- **DB_USER**: Database username (e.g., `root`).
- **DB_PASS**: Database password (empty for default local MySQL installation).
- **DB_NAME**: Name of the MySQL database (e.g., `inventory`).
- **PORT**: Port for the backend server (default `3001`).
- **JWT_SECRET**: Secret key for JWT authentication (can be any string for development).

### 4. MySQL Database Setup

```bash
CREATE DATABASE inventory;
```
### Create Inventory Table
```bash

CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);
```

Note: Table column dynamically change based on the excel data

### Create User Table
```bash
CREATE TABLE users (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```
### create webauthn table
```bash
CREATE TABLE webauthn_credentials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    key_id VARCHAR(255) NOT NULL,
    public_key VARCHAR(1024) NOT NULL,
    counter INT NOT NULL,
    device_type VARCHAR(50),
    backed_up BOOLEAN NOT NULL,
    transport JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```


### 5. Excel files
Sample Excel data are stored in "backend/upload/" directory, Use it.

### 6. Run the Backend
After setting up the .env file and database, start the backend server:
```bash
npm start
```
This will start the server on http://localhost:3001.

# Frontend Setup (React)

Follow the steps below to set up the frontend of the Inventory Management System:

## 1. Install Dependencies

Navigate to the frontend folder and install the dependencies:

```bash
cd frontend
npm install
```
## 2. Configure Environment Variables
Create a .env file in the root directory of the frontend and add the following variable:
```bash
REACT_APP_SERVER_URL=http://localhost:3001
```
## 3. Run the Frontend

After setting up the environment variables, run the frontend:
```bash
npm start
```
