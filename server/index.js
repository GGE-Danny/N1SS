const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { db } = require('./db');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Get all categories
app.get('/api/categories', (req, res) => {
    db.all('SELECT * FROM categories', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

const crypto = require('crypto');

const { sendEmail } = require('./email');

// User identification/registration
app.post('/api/users/identify', (req, res) => {
    const { device_id, username, email, phone_number, avatar_url, location } = req.body;

    db.get('SELECT * FROM users WHERE device_id = ?', [device_id], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });

        if (user) {
            res.json(user);
        } else if (username && email && phone_number) {
            const token = crypto.randomBytes(32).toString('hex');
            db.run('INSERT INTO users (device_id, username, email, phone_number, avatar_url, location, is_confirmed, confirmation_token) VALUES (?, ?, ?, ?, ?, ?, 0, ?)',
                [device_id, username, email, phone_number, avatar_url, location, token], async (err) => {
                    if (err) return res.status(500).json({ error: err.message });

                    // Send confirmation email via Ethereal
                    const confirmUrl = `http://localhost:3001/api/users/confirm/${token}`;
                    try {
                        await sendEmail({
                            to: email,
                            subject: "Confirm your Boutique Registration",
                            html: `
                            <div style="font-family: Arial, sans-serif; padding: 20px;">
                                <h1 style="color: #ff9900;">Welcome to the Boutique!</h1>
                                <p>Hi ${username},</p>
                                <p>Please click the link below to confirm your registration:</p>
                                <a href="${confirmUrl}" style="background: #ff9900; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirm Email</a>
                                <p>If you didn't sign up, you can safely ignore this email.</p>
                            </div>
                        `
                        });
                    } catch (emailErr) {
                        console.error('Failed to send confirmation email:', emailErr);
                    }

                    res.json({ device_id, username, email, phone_number, is_confirmed: 0, message: 'Please confirm your email. Check the server logs for the Ethereal preview link.' });
                });
        } else {
            res.status(404).json({ message: 'User not found. Registration required.' });
        }
    });
});

// Confirm Email
app.get('/api/users/confirm/:token', (req, res) => {
    const { token } = req.params;

    db.run('UPDATE users SET is_confirmed = 1, confirmation_token = NULL WHERE confirmation_token = ?', [token], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        if (this.changes > 0) {
            res.send('<h1>Email Confirmed!</h1><p>You can now return to the site.</p>');
        } else {
            res.status(400).send('<h1>Invalid Token</h1>');
        }
    });
});

// Get active hero products
app.get('/api/hero-products', (req, res) => {
    const query = `
        SELECT 
            hp.id,
            hp.detail_text,
            hp.display_order,
            p.id as product_id,
            p.name,
            p.description,
            p.price,
            p.badge,
            c.name as category,
            GROUP_CONCAT(pi.image_path) as images
        FROM hero_products hp
        INNER JOIN products p ON hp.product_id = p.id
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE hp.is_active = 1
        GROUP BY hp.id
        ORDER BY hp.display_order ASC
    `;

    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const heroProducts = rows.map(row => ({
            id: row.product_id,
            tag: row.category,
            title: row.name,
            description: row.description,
            price: `$${row.price.toFixed(2)}`,
            oldPrice: `$${(row.price * 1.2).toFixed(2)}`, // Calculate old price
            badge: row.badge || 'NEW',
            image: row.images ? row.images.split(',')[0] : '',
            detail: row.detail_text
        }));

        res.json(heroProducts);
    });
});

// Get products with filtering, popularity sorting, and images
app.get('/api/products', (req, res) => {
    const { category, search, sort } = req.query;
    let query = `
        SELECT p.*, GROUP_CONCAT(pi.image_path) as images
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
    `;
    let params = [];
    let conditions = [];

    if (category && category !== 'All') {
        conditions.push('p.category_id = (SELECT id FROM categories WHERE name = ?)');
        params.push(category);
    }

    if (search) {
        conditions.push('p.name LIKE ?');
        params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY p.id';

    // Popularity logic: Sort by average_rating * review_count
    if (sort === 'popular' || !sort) {
        query += ' ORDER BY (p.average_rating * p.review_count) DESC';
    } else if (sort === 'price_low') {
        query += ' ORDER BY p.price ASC';
    } else if (sort === 'price_high') {
        query += ' ORDER BY p.price DESC';
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Transform images string back to array
        const products = rows.map(row => ({
            ...row,
            images: row.images ? row.images.split(',') : []
        }));
        res.json(products);
    });
});

// Get reviews for a product (including reviewer info)
app.get('/api/products/:id/reviews', (req, res) => {
    const query = `
        SELECT r.*, u.username, u.avatar_url
        FROM reviews r 
        JOIN users u ON r.device_id = u.device_id 
        WHERE r.product_id = ? 
        ORDER BY r.likes_count DESC, r.created_at DESC
    `;
    db.all(query, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Like a review
app.post('/api/reviews/:id/like', (req, res) => {
    db.run('UPDATE reviews SET likes_count = likes_count + 1 WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Review liked', likes_count: this.changes });
    });
});

// Get top reviews for home page
app.get('/api/reviews/top', (req, res) => {
    db.all(`SELECT r.*, u.username, u.avatar_url, u.location, p.name as product_name, pi.image_path as product_image 
            FROM reviews r 
            JOIN users u ON r.device_id = u.device_id
            JOIN products p ON r.product_id = p.id
            JOIN product_images pi ON p.id = pi.product_id
            WHERE pi.is_primary = 1
            ORDER BY r.likes_count DESC LIMIT 10`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create an order (Checkout)
app.post('/api/orders', (req, res) => {
    const { device_id, total_amount, items } = req.body;

    if (!device_id || !total_amount || !items || items.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    db.run('INSERT INTO orders (device_id, total_amount) VALUES (?, ?)', [device_id, total_amount], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        const orderId = this.lastID;
        const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');

        items.forEach(item => {
            stmt.run(orderId, item.id, item.quantity, item.price);
        });

        stmt.finalize(() => {
            res.json({ success: true, orderId });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
