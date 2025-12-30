# Premium Boutique Backend

This is the Node.js/Express backend for the Premium Boutique e-commerce platform. It uses SQLite for data storage and Ethereal for free email testing.

## Prerequisites
- [Node.js](https://nodejs.org/) (Version 14 or higher)
- npm (comes with Node.js)

## Setup & Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Seed the Database**:
   This will initialize the SQLite database with 100+ products, categories, and sample data.
   ```bash
   node seed.js
   ```

## Running the Server

Start the development server:
```bash
node index.js
```
The server will be running at `http://localhost:3001`.

## Email Testing (Free)
This project uses **Ethereal Email** for sending registration confirmations and invoices. 
- You do **not** need to configure any SMTP settings.
- When an email is sent, look at your **terminal console**.
- You will see a `[VIEW EMAIL] Preview URL`. 
- Copy and paste that URL into your browser to see the actual HTML email.

## API Endpoints
- `GET /api/products`: Fetch products (supports filtering and sorting)
- `GET /api/categories`: Fetch categories
- `POST /api/users/identify`: Identity/Register users via Device ID
- `GET /api/users/confirm/:token`: Confirm email
- `POST /api/orders`: Create a new boutique order
