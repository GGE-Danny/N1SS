const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'ecommerce.db');
const db = new sqlite3.Database(dbPath);

const initDb = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Drop existing tables to ensure schema updates
            db.run(`DROP TABLE IF EXISTS order_items`);
            db.run(`DROP TABLE IF EXISTS orders`);
            db.run(`DROP TABLE IF EXISTS reviews`);
            db.run(`DROP TABLE IF EXISTS product_images`);
            db.run(`DROP TABLE IF EXISTS products`);
            db.run(`DROP TABLE IF EXISTS users`);
            db.run(`DROP TABLE IF EXISTS categories`);

            // Categories table
            db.run(`CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                icon TEXT
            )`);

            // Users table (Device ID tracking)
            db.run(`CREATE TABLE IF NOT EXISTS users (
                device_id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                email TEXT NOT NULL,
                phone_number TEXT NOT NULL,
                avatar_url TEXT,
                location TEXT,
                is_confirmed INTEGER DEFAULT 0,
                confirmation_token TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // Products table (Removed image_url as it's now in product_images)
            db.run(`CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                category_id INTEGER,
                average_rating REAL DEFAULT 0,
                review_count INTEGER DEFAULT 0,
                badge TEXT,
                FOREIGN KEY (category_id) REFERENCES categories (id)
            )`);

            // Product Images table
            db.run(`CREATE TABLE IF NOT EXISTS product_images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER,
                image_path TEXT NOT NULL,
                is_primary INTEGER DEFAULT 0,
                FOREIGN KEY (product_id) REFERENCES products (id)
            )`);

            // Reviews table (Linked to users via device_id)
            db.run(`CREATE TABLE IF NOT EXISTS reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER,
                device_id TEXT,
                rating INTEGER,
                comment TEXT,
                likes_count INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products (id),
                FOREIGN KEY (device_id) REFERENCES users (device_id)
            )`);

            // Orders table (Linked to users via device_id)
            db.run(`CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                device_id TEXT,
                total_amount REAL NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (device_id) REFERENCES users (device_id)
            )`);

            // Indexes for optimization
            db.run(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)`);
            db.run(`CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)`);
            db.run(`CREATE INDEX IF NOT EXISTS idx_products_popularity ON products(average_rating, review_count)`);
            db.run(`CREATE INDEX IF NOT EXISTS idx_images_product ON product_images(product_id)`);

            // Hero Products table
            db.run(`CREATE TABLE IF NOT EXISTS hero_products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER,
                detail_text TEXT,
                display_order INTEGER DEFAULT 0,
                is_active INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products (id)
            )`);

            // Order items table
            db.run(`CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER,
                product_id INTEGER,
                quantity INTEGER,
                price REAL,
                FOREIGN KEY (order_id) REFERENCES orders (id),
                FOREIGN KEY (product_id) REFERENCES products (id)
            )`, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
};

module.exports = { db, initDb };
