const { db, initDb } = require('./db');

// Seed database with products, categories, users, reviews, and hero products
const seed = async () => {
    await initDb();

    const categories = [
        { name: 'Computers & Accessories', icon: 'Laptop' },
        { name: 'Video Games', icon: 'Gamepad' },
        { name: 'Toys & Games', icon: 'ToyBox' },
        { name: 'Electronics', icon: 'Cpu' },
        { name: 'Home & Kitchen', icon: 'Home' },
        { name: 'Fashion', icon: 'Shirt' }
    ];

    const uniqueProducts = [
        {
            id: 1,
            name: 'ZenBook Pro Ultra',
            description: 'The ZenBook Pro Ultra is designed for productivity and creative professionals. Featuring a 4K OLED display and the latest high-end processor, it is as beautiful as it is powerful.',
            price: 1899.99,
            categoryId: 1,
            images: [
                { path: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=600&h=600', is_primary: 1 },
                { path: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=600&h=600', is_primary: 0 }
            ],
            rating: 4.9,
            reviews: 1240,
            badge: '#1 in Computers'
        },
        {
            id: 2,
            name: 'Aether Noise-Canceling Headphones',
            description: 'Experience pure sound with the Aether Wireless Headphones. Over 30 hours of battery life and industry-leading noise cancellation for the ultimate listening experience.',
            price: 349.00,
            categoryId: 4,
            images: [
                { path: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600&h=600', is_primary: 1 },
                { path: 'https://images.unsplash.com/photo-1546435770-a3e426ff472b?auto=format&fit=crop&q=80&w=600&h=600', is_primary: 0 }
            ],
            rating: 4.8,
            reviews: 850,
            badge: 'Must Have'
        },
        {
            id: 3,
            name: 'Artisan Barista Espresso Machine',
            description: 'Bring the cafe experience home with the Artisan Barista. Precision temperature control and a powerful steam wand for perfect lattes every morning.',
            price: 599.50,
            categoryId: 5,
            images: [
                { path: 'https://images.unsplash.com/photo-1510551310160-589462daf284?auto=format&fit=crop&q=80&w=600&h=600', is_primary: 1 },
                { path: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600&h=600', is_primary: 0 }
            ],
            rating: 4.7,
            reviews: 430,
            badge: 'Top Gift'
        },
        {
            id: 4,
            name: 'Nova Core Smart Watch S7',
            description: 'A revolutionary smart watch with advanced health sensors, GPS, and a stunning Sapphire glass display. Designed for athletes and tech enthusiasts alike.',
            price: 299.00,
            categoryId: 4,
            images: [
                { path: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600&h=600', is_primary: 1 }
            ],
            rating: 4.6,
            reviews: 2100,
            badge: 'New Arrival'
        },
        {
            id: 5,
            name: 'QuestMaster VR Pro 3',
            description: 'Dive into wireless VR with the QuestMaster Pro 3. Features high-resolution lenses and spatial audio for an immersive gaming experience.',
            price: 499.00,
            categoryId: 2,
            images: [
                { path: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600&h=600', is_primary: 1 }
            ],
            rating: 4.9,
            reviews: 670,
            badge: 'Best in Gaming'
        },
        {
            id: 6,
            name: 'Mechanical Force RGB Keyboard',
            description: 'Built for gamers, the MechForce features custom tactile switches and fully customizable per-key RGB lighting.',
            price: 129.99,
            categoryId: 1,
            images: [
                { path: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=600&h=600', is_primary: 1 }
            ],
            rating: 4.5,
            reviews: 1200,
            badge: null
        },
        {
            id: 7,
            name: 'Leather Knight Signature Jacket',
            description: 'Handcrafted from genuine full-grain leather, this jacket offers a timeless silhouette that only gets better with age.',
            price: 450.00,
            categoryId: 6,
            images: [
                { path: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600&h=600', is_primary: 1 }
            ],
            rating: 4.9,
            reviews: 150,
            badge: 'Luxury Select'
        },
        {
            id: 8,
            name: 'Velvet Dream Sofa Cushion Set',
            description: 'Soft, luxurious velvet cushions available in a variety of jewel tones. Perfect for adding a pop of color to any boutique living space.',
            price: 75.00,
            categoryId: 5,
            images: [
                { path: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=600&h=600', is_primary: 1 }
            ],
            rating: 4.4,
            reviews: 80,
            badge: null
        }
    ];

    // Add more fillers to reach ~30+ products for a good grid
    for (let i = 9; i <= 35; i++) {
        uniqueProducts.push({
            id: i,
            name: `Premium Item #${i}`,
            description: `A high-quality boutique item from our curated collection. Item ${i} represents the peak of craftsmanship and design.`,
            price: parseFloat((20 + Math.random() * 200).toFixed(2)),
            categoryId: (i % 6) + 1,
            images: [
                { path: `https://picsum.photos/seed/prod${i}/600/600`, is_primary: 1 }
            ],
            rating: parseFloat((4 + Math.random()).toFixed(1)),
            reviews: Math.floor(Math.random() * 500),
            badge: i % 7 === 0 ? 'Trending' : null
        });
    }

    const users = [
        { device_id: 'user-01', username: 'Alex Sterling', email: 'alex@example.com', phone_number: '123-456-7890', is_confirmed: 1, avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', location: 'London, UK' },
        { device_id: 'user-02', username: 'Sophia Valentine', email: 'sophia@example.com', phone_number: '234-567-8901', is_confirmed: 1, avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', location: 'Paris, FR' },
        { device_id: 'user-03', username: 'Marco Rossi', email: 'marco@example.com', phone_number: '345-678-9012', is_confirmed: 1, avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden', location: 'Milan, IT' },
        { device_id: 'user-04', username: 'Elena Gilbert', email: 'elena@example.com', phone_number: '456-789-0123', is_confirmed: 1, avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe', location: 'New York, USA' }
    ];

    const reviews = [
        { product_id: 1, device_id: 'user-01', rating: 5, comment: "Absolutely breathtaking performance. The ZenBook Pro has completely changed my video editing workflow. Worth every penny.", likes_count: 125 },
        { product_id: 2, device_id: 'user-02', rating: 5, comment: "I've owned many headphones, but the Aether silence is on another level. The build quality feels incredibly premium.", likes_count: 98 },
        { product_id: 3, device_id: 'user-03', rating: 5, comment: "The coffee quality is identical to my favorite local cafe. Easy to clean and looks stunning on my kitchen counter.", likes_count: 110 },
        { product_id: 4, device_id: 'user-04', rating: 4, comment: "Great watch, battery lasts for days even with constant GPS tracking. The screen is incredibly bright.", likes_count: 45 },
        { product_id: 5, device_id: 'user-01', rating: 5, comment: "VR has never felt this real. The QuestMaster Pro 3 is light and comfortable for long sessions.", likes_count: 32 },
        { product_id: 7, device_id: 'user-02', rating: 5, comment: "The leather is so soft and the fit is perfect. This is a true investment piece for any wardrobe.", likes_count: 67 }
    ];

    db.serialize(() => {
        db.run('DELETE FROM categories');
        db.run('DELETE FROM products');
        db.run('DELETE FROM product_images');
        db.run('DELETE FROM users');
        db.run('DELETE FROM reviews');

        const categoryStmt = db.prepare(`INSERT INTO categories (id, name, icon) VALUES (?, ?, ?)`);
        categories.forEach((c, idx) => categoryStmt.run(idx + 1, c.name, c.icon));
        categoryStmt.finalize();

        const productStmt = db.prepare(`INSERT INTO products (id, name, description, price, category_id, average_rating, review_count, badge) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
        const imageStmt = db.prepare(`INSERT INTO product_images (product_id, image_path, is_primary) VALUES (?, ?, ?)`);

        uniqueProducts.forEach(p => {
            productStmt.run(p.id, p.name, p.description, p.price, p.categoryId, p.rating, p.reviews, p.badge);
            p.images.forEach(img => {
                imageStmt.run(p.id, img.path, img.is_primary);
            });
        });
        productStmt.finalize();
        imageStmt.finalize();

        const userStmt = db.prepare(`INSERT INTO users (device_id, username, email, phone_number, is_confirmed, avatar_url, location) VALUES (?, ?, ?, ?, ?, ?, ?)`);
        users.forEach(u => userStmt.run(u.device_id, u.username, u.email, u.phone_number, u.is_confirmed, u.avatar_url, u.location));
        userStmt.finalize();

        const reviewStmt = db.prepare(`INSERT INTO reviews (product_id, device_id, rating, comment, likes_count) VALUES (?, ?, ?, ?, ?)`);
        reviews.forEach(r => reviewStmt.run(r.product_id, r.device_id, r.rating, r.comment, r.likes_count));
        reviewStmt.finalize();

        // Seed hero products
        const heroProducts = [
            { product_id: 1, detail_text: 'M3 Max Chip | 128GB Unified Memory', display_order: 1, is_active: 1 },
            { product_id: 2, detail_text: '40mm Drivers | 60h Battery Life', display_order: 2, is_active: 1 },
            { product_id: 3, detail_text: 'A17 Pro | Pro Camera System', display_order: 3, is_active: 1 }
        ];

        const heroStmt = db.prepare(`INSERT INTO hero_products (product_id, detail_text, display_order, is_active) VALUES (?, ?, ?, ?)`);
        heroProducts.forEach(hp => heroStmt.run(hp.product_id, hp.detail_text, hp.display_order, hp.is_active));
        heroStmt.finalize(() => {
            console.log('Database seeded with high-quality unique products, reviews, and hero products!');
            process.exit(0);
        });
    });
};

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
