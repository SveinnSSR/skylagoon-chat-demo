import React from 'react';
import { theme } from '../styles/theme';
import LanguageCurrencySelector from './LanguageCurrencySelector';

const Navbar = () => {
    return (
        <nav className="nav-bar">
            <div className="logo">
                {/* Temporarily use text until we have the logo */}
                <span style={{ color: 'white', fontFamily: theme.fonts.body }}>SKY LAGOON</span>
            </div>
            <div className="nav-items" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <LanguageCurrencySelector />
                <button 
                    style={{ 
                        background: '#4D5645',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        fontFamily: theme.fonts.body
                    }}
                >
                    Book Now
                </button>
            </div>
        </nav>
    );
};

export default Navbar;