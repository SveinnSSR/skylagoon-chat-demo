import React, { useState, useEffect } from 'react';
import ChatWidget from './ChatWidget';
import '../styles/Layout.css';

const Layout = ({ webhookUrl, apiKey }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [bgPosition, setBgPosition] = useState(0);
    const [language, setLanguage] = useState('en');

    // Translations object
    const translations = {
        en: {
            heroTitle: 'Where the Sea\nMeets the Sky',
            experienceTitle: 'Experience Tranquility',
            experienceText: 'Immerse yourself in the warmth of our geothermal lagoon, where modern comfort meets Icelandic tradition. Our infinity edge seamlessly blends with the ocean horizon, creating an unforgettable experience of relaxation and natural beauty.',
            journeyTitle: 'Choose Your Journey',
            packageText: 'Experience the perfect blend of relaxation and rejuvenation with our',
            packageSuffix: 'package',
            bookNow: 'Book Now',
            copyright: '© 2024 Sky Lagoon. All rights reserved.',
            contact: 'Contact',
            terms: 'Terms',
            privacy: 'Privacy'
        },
        is: {
            heroTitle: 'Finndu hugarró þar sem himinn og haf renna saman',
            experienceTitle: 'Upplifðu ró og frið',
            experienceText: 'Njóttu ylsins í jarðsjávarlauginni okkar, þar sem nútímaþægindi mæta íslenskri hefð. Óendanleikabrúnin okkar rennur saman við sjóndeildarhringinn og skapar ógleymanlega upplifun af slökun og náttúrufegurð.',
            journeyTitle: 'Veldu þína leið',
            packageText: 'Upplifðu fullkomna blöndu af slökun og endurnæringu með',
            packageSuffix: 'pakkanum',
            bookNow: 'Bóka',
            copyright: '© 2024 Sky Lagoon. Allur réttur áskilinn.',
            contact: 'Hafa samband',
            terms: 'Skilmálar',
            privacy: 'Persónuvernd'
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            document.querySelectorAll('.section-fade-in').forEach(section => {
                const rect = section.getBoundingClientRect();
                const isVisible = rect.top <= window.innerHeight * 0.8;
                if (isVisible) {
                    section.classList.add('visible');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);

        const interval = setInterval(() => {
            setBgPosition(prev => (prev + 1) % 4);
        }, 5000);

        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, []);

    const bgColors = [
        'linear-gradient(45deg, #4D5645 0%, #5B654E 100%)',
        'linear-gradient(45deg, #5B654E 0%, #687657 100%)',
        'linear-gradient(45deg, #687657 0%, #4D5645 100%)',
        'linear-gradient(45deg, #5B654E 0%, #4D5645 100%)',
    ];

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'is' : 'en');
    };

    const t = translations[language];

    return (
        <div style={{ overflow: 'hidden' }}>
            {/* Navigation */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: '20px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 100,
                background: isScrolled ? 'rgba(77, 86, 69, 0.95)' : 'transparent',
                transition: 'all 0.4s ease',
                backdropFilter: isScrolled ? 'blur(8px)' : 'none'
            }}>
                <img 
                    src="/sky-lagoon-logo.jpg" 
                    alt="Sky Lagoon"
                    style={{
                        height: '35px',
                        width: 'auto',
                        cursor: 'pointer',
                        transition: 'opacity 0.3s ease'
                    }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                />

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <button 
                        className="nav-link"
                        onClick={toggleLanguage}
                    >
                        {language === 'en' ? 'IS / EN' : 'EN / IS'}
                    </button>

                    <button className="book-now-button">
                        {t.bookNow}
                    </button>

                    <button className="menu-button">
                        <span style={{ fontSize: '20px', lineHeight: 1 }}>☰</span>
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div 
                className="hero-section"
                style={{
                    height: '100vh',
                    background: bgColors[bgPosition],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    padding: '0 20px',
                    textAlign: 'center'
                }}
            >
                <h1 style={{
                    fontFamily: 'Caudex, serif',
                    fontSize: 'clamp(36px, 6vw, 64px)',
                    maxWidth: '800px',
                    margin: '0',
                    lineHeight: '1.2',
                    opacity: '0',
                    animation: 'fadeIn 1s ease forwards 0.5s'
                }}>
                    {t.heroTitle}
                </h1>
            </div>

            {/* Content Sections */}
            <div style={{
                padding: '160px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '160px'
            }}>
                {/* Experience Section */}
                <section className="section-fade-in" style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    width: '100%',
                    padding: '0 20px'
                }}>
                    <h2 style={{
                        fontFamily: 'Caudex, serif',
                        fontSize: 'clamp(28px, 4vw, 36px)',
                        marginBottom: '40px',
                        textAlign: 'center'
                    }}>
                        {t.experienceTitle}
                    </h2>
                    <p style={{
                        fontSize: '18px',
                        lineHeight: '1.8',
                        color: '#333',
                        textAlign: 'center',
                        margin: '0 auto',
                        maxWidth: '700px'
                    }}>
                        {t.experienceText}
                    </p>
                </section>

                {/* Packages Section */}
                <section className="section-fade-in" style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    width: '100%'
                }}>
                    <h2 style={{
                        fontFamily: 'Caudex, serif',
                        fontSize: 'clamp(28px, 4vw, 36px)',
                        marginBottom: '60px',
                        textAlign: 'center'
                    }}>
                        {t.journeyTitle}
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '40px',
                        padding: '0 20px'
                    }}>
                        {['Sér', 'Saman'].map(packageType => (
                            <div key={packageType} className="package-card">
                                <h3 style={{
                                    fontFamily: 'Caudex, serif',
                                    fontSize: '24px',
                                    marginBottom: '20px',
                                    color: '#2c2c2c'
                                }}>
                                    {packageType}
                                </h3>
                                <p style={{
                                    fontSize: '16px',
                                    lineHeight: '1.6',
                                    color: '#4a4a4a'
                                }}>
                                    {`${t.packageText} ${packageType} ${t.packageSuffix}.`}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer style={{
                backgroundColor: '#4D5645',
                color: 'white',
                padding: '50px 40px',
                marginTop: '120px'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '30px'
                }}>
                    <div style={{ opacity: 0.9 }}>
                        {t.copyright}
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '25px',
                        alignItems: 'center'
                    }}>
                        {[
                            { key: 'contact', text: t.contact },
                            { key: 'terms', text: t.terms },
                            { key: 'privacy', text: t.privacy }
                        ].map(item => (
                            <button 
                                key={item.key}
                                className="nav-link footer-link"
                            >
                                {item.text}
                            </button>
                        ))}
                    </div>
                </div>
            </footer>

            {/* Chat Widget */}
            <ChatWidget 
                webhookUrl={webhookUrl} 
                apiKey={apiKey}
                language={language}
            />
        </div>
    );
};

export default Layout;