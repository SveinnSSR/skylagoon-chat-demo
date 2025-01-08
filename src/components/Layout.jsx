import React, { useState } from 'react';
import ChatWidget from './ChatWidget';
import '../styles/Layout.css';
import { X } from 'lucide-react';

const Layout = ({ webhookUrl, apiKey }) => {
    const [expandedItem, setExpandedItem] = useState(null);
    const [language, setLanguage] = useState('en');

    const menuItems = [
        { id: 'packages', label: 'Packages' },
        { id: 'experience', label: 'Experience', subItems: ['The Sky Lagoon Experience', 'Skjól Ritual'] },
        { id: 'plan', label: 'Plan Your Visit' },
        { id: 'food', label: 'Food' },
        { id: 'stories', label: 'Our Stories' }
    ];

    return (
        <div className="fixed inset-0 flex">
            {/* Left Navigation */}
            <div className="w-[400px] bg-[#f5f5f3] p-8 pt-12 flex flex-col">
                <div className="flex gap-4 mb-12">
                    <button className="nav-btn">IS / EN</button>
                    <button className="nav-btn">KR ISK</button>
                </div>
                
                <nav className="flex-1">
                    {menuItems.map((item) => (
                        <div key={item.id} className="mb-6">
                            <button
                                onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                                className="menu-btn"
                            >
                                {item.label}
                            </button>
                            
                            {item.subItems && expandedItem === item.id && (
                                <div className="ml-4 mt-4 space-y-3">
                                    {item.subItems.map((subItem) => (
                                        <button key={subItem} className="submenu-btn">
                                            {subItem}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                <button className="absolute top-8 right-8">
                    <X className="text-[#4D5645]" size={24} />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 relative">
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url("/Sky_Lagoon_Ritual.jpg")' }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-white text-7xl font-caudex text-center">
                            Where the Sea<br />
                            Meets the Sky
                        </h1>
                    </div>
                </div>
                <ChatWidget webhookUrl={webhookUrl} apiKey={apiKey} language={language} />
            </div>
        </div>
    );
};

export default Layout;