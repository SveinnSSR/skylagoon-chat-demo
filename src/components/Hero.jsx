import React from 'react';

const Hero = () => {
    return (
        <div style={{
            height: '100vh',
            width: '100%',
            position: 'relative',
            background: 'url("/temp-hero.jpg") center/cover no-repeat',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <h1 className="hero-text">
                Where the Sea<br />
                Meets the Sky
            </h1>
        </div>
    );
};

export default Hero;