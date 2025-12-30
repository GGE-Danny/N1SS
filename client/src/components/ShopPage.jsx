import React from 'react';
import ProductGrid from './ProductGrid';
import { useAppContext } from '../App';

const ShopPage = () => {
    const { selectedCategory, searchQuery, setSelectedProduct, loading } = useAppContext();

    return (
        <div className="shop-page">
            <h2 className="section-title">
                {searchQuery ? `Search Results for "${searchQuery}"` : `${selectedCategory} Collection`}
            </h2>
            <ProductGrid onProductClick={setSelectedProduct} />
        </div>
    );
};

export default ShopPage;
