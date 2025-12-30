import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const ProductDetailCard = React.memo(({ slide }) => {
    return (
        <div className="product-detail-card product-detail-card--solid">
            <div className="product-card-header">
                <span className="product-category">{slide.tag}</span>
                <div className="product-badge-mini">{slide.badge}</div>
            </div>

            <h4 className="product-card-title">{slide.title}</h4>

            <div className="product-card-rating">
                <span className="stars">★★★★★</span>
                <span className="review-count">(1,245)</span>
            </div>

            <div className="product-card-price">
                <span className="price-current">{slide.price}</span>
                <span className="price-old">{slide.oldPrice}</span>
            </div>

            <p className="product-card-description">{slide.description}</p>
            <div className="product-card-specs">{slide.detail}</div>
        </div>
    );
});
ProductDetailCard.displayName = "ProductDetailCard";

// ✅ Static RIGHT copy
const HeroCopyRight = React.memo(({ onShop }) => {
    return (
        <div className="hero-text-section hero-text-section--right">
            <div className="hero-kicker">🔥 New drops • Limited stock</div>

            <h1 className="hero-main-title">
                Discover Premium <span className="hero-highlight">Technology</span>
            </h1>

            <p className="hero-subtitle">
                Curated collection of the finest tech products for modern living.
            </p>

            <div className="hero-cta">
                <button className="btn btn-primary btn-hero btn-hero-primary" onClick={onShop}>
                    Explore Collection <ArrowRight size={18} style={{ marginLeft: 8 }} />
                </button>

                <button className="btn btn-hero btn-hero-secondary" onClick={onShop}>
                    Shop Deals
                </button>
            </div>

            <div className="hero-proof">
                <div className="hero-proof-item">
                    <strong>4.8★</strong>
                    <span>avg rating</span>
                </div>
                <div className="hero-proof-item">
                    <strong>24h</strong>
                    <span>delivery</span>
                </div>
                <div className="hero-proof-item">
                    <strong>7-day</strong>
                    <span>returns</span>
                </div>
            </div>
        </div>
    );
});
HeroCopyRight.displayName = "HeroCopyRight";

export default function Hero() {
    const navigate = useNavigate();

    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentSlide, setCurrentSlide] = useState(0);
    const [paused, setPaused] = useState(false);

    // Load hero products once
    useEffect(() => {
        const fetchHeroProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/hero-products`);
                if (!res.ok) throw new Error("Failed to fetch hero products");
                const data = await res.json();

                const formatted = data.map((p) => ({
                    id: `product-${p.id}`,
                    tag: p.tag,
                    title: p.title,
                    description: p.description,
                    price: p.price,
                    oldPrice: p.oldPrice,
                    badge: p.badge,
                    image: p.image,
                    detail: p.detail,
                }));

                setSlides(formatted);
            } catch (e) {
                console.error("Error fetching hero products:", e);
                setSlides([
                    {
                        id: "macbook",
                        tag: "Computer & Accessories",
                        title: "MacBook Pro M3 Max",
                        description:
                            "Experience pure performance. The ultimate workstation for creative professionals and power users.",
                        price: "$2,499.00",
                        oldPrice: "$2,999.00",
                        badge: "15% OFF",
                        image: "/assets/macbook_hero.png",
                        detail: "M3 Max Chip | 128GB Unified Memory",
                    },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchHeroProducts();
    }, []);

    // Preload images
    useEffect(() => {
        slides.forEach((s) => {
            if (!s?.image) return;
            const img = new Image();
            img.src = s.image;
        });
    }, [slides]);

    // Auto rotate (pause on hover)
    useEffect(() => {
        if (!slides.length || paused) return;

        const timer = setInterval(() => {
            setCurrentSlide((p) => (p + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [slides.length, paused]);

    // keep index safe
    useEffect(() => {
        if (!slides.length) return;
        setCurrentSlide((p) => Math.min(p, slides.length - 1));
    }, [slides.length]);

    const active = useMemo(() => slides[currentSlide], [slides, currentSlide]);

    if (loading) {
        return (
            <section className="hero container">
                <div className="hero-reference-layout hero-reference-layout--flip">
                    <div className="hero-product-image-area">
                        <h1 className="hero-main-title">Loading...</h1>
                    </div>
                    <div className="hero-text-section hero-text-section--right" />
                </div>
            </section>
        );
    }

    if (!slides.length) return null;

    return (
        <section className="hero container">
            {/* ✅ No key={currentSlide} (no remounting the whole hero) */}
            <div className="hero-reference-layout hero-reference-layout--flip">


                {/* RIGHT (static) */}
                <HeroCopyRight onShop={() => navigate("/shop")} />

                {/* LEFT (dynamic only) */}
                {/* Product (dynamic) */}
                <div className="hero-product-image-area">
                    <div className="hero-product-stage">
                        <div className="hero-product-shadow" />

                        {/* carousel = images only */}
                        <div className="hero-carousel hero-carousel--stage">
                            <div
                                className="hero-carousel-track hero-carousel-track--stage"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {slides.map((s) => (
                                    <div className="hero-carousel-slide hero-carousel-slide--stage" key={s.id}>
                                        <div className="product-image-wrapper">
                                            <img
                                                src={s.image}
                                                alt={s.title}
                                                className={`hero-main-product hero-main-product--clean product-${s.id}`}
                                                loading="eager"
                                                decoding="async"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ✅ overlay card = active slide only (pops out of the carousel) */}
                        <div className="hero-card-overlay">
                            <ProductDetailCard slide={slides[currentSlide]} />
                        </div>
                    </div>
                </div>


                {/* optional hidden hook */}
                <div style={{ display: "none" }}>{active?.id}</div>
            </div>

            {/* dots (optional) */}
            <div className="hero-dots">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        className={`hero-dot ${idx === currentSlide ? "active" : ""}`}
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
