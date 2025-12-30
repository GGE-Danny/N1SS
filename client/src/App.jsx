import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import './App.css';

// Context for User and Cart
const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProductModal from './components/ProductModal';
import RegistrationModal from './components/RegistrationModal';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import HomePage from './components/HomePage';
import ShopPage from './components/ShopPage';
import Footer from './components/Footer';

const App = () => {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const API_URL = 'http://localhost:3001/api';

  useEffect(() => {
    identifyUser();
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const identifyUser = async () => {
    let deviceId = localStorage.getItem('boutique_device_id');
    if (!deviceId) {
      deviceId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('boutique_device_id', deviceId);
    }

    try {
      const res = await axios.post(`${API_URL}/users/identify`, { device_id: deviceId });
      if (res.data && res.data.username) {
        setUser(res.data);
      } else {
        setIsRegistering(true);
      }
    } catch (err) {
      console.error('Identification error:', err);
      // Fallback to registration for any error (e.g. 404)
      setIsRegistering(true);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`);
      setCategories([{ id: 0, name: 'All' }, ...res.data]);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory,
        search: searchQuery,
        sort: 'popular'
      };
      const res = await axios.get(`${API_URL}/products`, { params });
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (formData) => {
    const deviceId = localStorage.getItem('boutique_device_id');
    try {
      const res = await axios.post(`${API_URL}/users/identify`, {
        device_id: deviceId,
        ...formData
      });
      setUser(res.data);
      setIsRegistering(false);
      alert('Registeration successful! Please check your email for confirmation link (see server console).');
    } catch (err) {
      alert('Registration failed. Please try again.');
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleCheckoutComplete = () => {
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      cart, setCart,
      isCartOpen, setIsCartOpen,
      categories, setCategories,
      products, setProducts,
      selectedCategory, setSelectedCategory,
      searchQuery, setSearchQuery,
      loading,
      API_URL,
      selectedProduct, setSelectedProduct
    }}>
      <Router>
        <div className="app">
          <Header />

          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
            </Routes>
          </main>

          <Footer />

          {isRegistering && (
            <RegistrationModal
              onRegister={registerUser}
              onSkip={() => setIsRegistering(false)}
            />
          )}

          {selectedProduct && (
            <ProductModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onAddToCart={addToCart}
              API_URL={API_URL}
            />
          )}

          <Cart
            cart={cart}
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onRemove={removeFromCart}
            onCheckout={() => setIsCheckoutOpen(true)}
          />

          {isCheckoutOpen && (
            <Checkout
              cart={cart}
              user={user}
              onClose={() => setIsCheckoutOpen(false)}
              onComplete={handleCheckoutComplete}
              API_URL={API_URL}
            />
          )}
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
