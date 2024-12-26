import React from 'react';
import { theme } from '../styles/theme';

const LanguageCurrencySelector = () => {
    return (
        <div style={{ 
            display: 'flex', 
            gap: '20px',
            alignItems: 'center',
            color: 'white',
            fontFamily: theme.fonts.body
        }}>
            <div style={{ cursor: 'pointer' }}>
                <span style={{ opacity: 0.7 }}>IS</span>
                {' / '}
                <span style={{ fontWeight: 'bold' }}>EN</span>
            </div>
            <div style={{ cursor: 'pointer' }}>
                <span style={{ opacity: 0.7 }}>KR</span>
                {' / '}
                <span style={{ fontWeight: 'bold' }}>ISK</span>
            </div>
        </div>
    );
};

export default LanguageCurrencySelector;