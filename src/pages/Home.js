import React from 'react';
import '../styles/Home.css'; 

const Home = () => {
    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-text">
                    <h1>Discover the Rich Heritage of African Instruments</h1>
                    <p>Explore, learn, and immerse yourself in the world of African musical instruments through history, images, and sounds.</p>
                    <a href="/signup" className="cta-button">Get Started</a>
                </div>
                <div className="hero-image">
                    <img src="../assets/images/hero-instrument.jpg" alt="Hero Instrument" />
                </div>
            </section>

            {/* Modules Overview */}
            <section className="modules">
                <h2 className="modules-title">Explore Our Modules</h2>
                <div className="module">
                    <h3>Historical Context</h3>
                    <p>Discover the rich history behind each instrument, its origins, and cultural significance.</p>
                </div>
                <div className="module">
                    <h3>Visual Representation</h3>
                    <p>Browse high-resolution images to appreciate the craftsmanship of each instrument.</p>
                </div>
                <div className="module">
                    <h3>Sound Module</h3>
                    <p>Listen to authentic audio samples for a true experience of each instrument's sound.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
