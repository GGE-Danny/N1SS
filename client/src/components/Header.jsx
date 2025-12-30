import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useAppContext } from '../App';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const {
        categories,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        cart,
        user,
        setIsCartOpen
    } = useAppContext();

    return (
        <header className="header glass">
            <div className="container header-container-inner">
                {/* Row 1: Logo and Profile */}
                <div className="header-top-row">
                    <div className="logo-section" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <span className="logo">BOUTIQUE</span>
                    </div>
                    <div className="user-info" onClick={() => navigate('/')}>
                        <User size={20} />
                        <span>{user ? user.username.split(' ')[0] : 'Guest'}</span>
                    </div>
                </div>

                {/* Row 2: Home, Shop, and Cart */}
                <div className="header-bottom-row">
                    <nav className="main-nav">
                        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
                        <NavLink to="/shop" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Shop</NavLink>
                    </nav>
                    <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
                        <ShoppingCart size={20} />
                        <span className="header-cart-label">Cart</span>
                        <span className="cart-count">{cart.length}</span>
                    </div>
                </div>

                {!isHomePage && (
                    <div className="search-section">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="search-btn" onClick={() => navigate('/shop')}><Search size={18} /></button>
                        </div>
                    </div>
                )}
            </div>

            {!isHomePage && (
                <nav className="category-nav container">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`nav-item ${selectedCategory === cat.name ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedCategory(cat.name);
                                navigate('/shop');
                            }}
                        >
                            {cat.name}
                        </button>
                    ))}
                </nav>
            )}
        </header>
    );
};

export default Header;
