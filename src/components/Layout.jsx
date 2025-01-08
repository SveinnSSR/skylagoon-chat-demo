import React, { useState } from 'react';
import ChatWidget from './ChatWidget';
import '../styles/Layout.css';
import { ChevronDown, Globe } from 'lucide-react';

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
        <div className="grid grid-cols-[minmax(600px,_1fr)_1fr] h-screen">
            <div className="grid grid-rows-[auto_1fr_600px]">
                {/* Top Nav */}
                <div className="bg-[#f5f5f3] p-8">
                    <div className="flex items-center gap-6">
                        <Globe size={16} className="text-[#4D5645]" />
                        <button className="nav-btn">IS / EN</button>
                        <button className="nav-btn">KR ISK</button>
                    </div>
                </div>

                {/* Menu */}
                <div className="bg-[#f5f5f3] p-8">
                    <nav>
                        {menuItems.map((item) => (
                            <div key={item.id} className="menu-item">
                                <button
                                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                                    className="menu-btn group flex items-center justify-between w-full"
                                >
                                    {item.label}
                                    {item.subItems && <ChevronDown size={24} />}
                                </button>
                                {item.subItems && expandedItem === item.id && (
                                    <div className="pl-4 mt-4 space-y-3">
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
                </div>

                {/* Image */}
                <div>
                    <img 
                        src="/Sky_Lagoon_Ritual.jpg" 
                        alt="Sky Lagoon"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <div className="bg-white"></div>
            <ChatWidget webhookUrl={webhookUrl} apiKey={apiKey} language={language} />
        </div>
    );
};

export default Layout;