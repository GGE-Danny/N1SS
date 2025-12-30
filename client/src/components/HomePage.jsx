import React from 'react';
import Hero from './Hero';
import TopProducts from './TopProducts';
import TopReviews from './TopReviews';
import Newsletter from './Newsletter';

const HomePage = () => {
    return (
        <div className="home-page">
            <Hero />
            <TopProducts />
            <TopReviews />
            <Newsletter />
        </div>
    );
};

export default HomePage;
