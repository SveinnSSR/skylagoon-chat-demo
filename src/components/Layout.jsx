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
        <div className="min-h-screen overflow-hidden">
            <div className="flex">
                {/* Left side */}
                <div className="w-[600px] min-h-screen flex flex-col">
                    {/* Top navigation */}
                    <div className="p-8 bg-[#f5f5f3]">
                        <div className="flex items-center gap-6">
                            <Globe size={16} className="text-[#4D5645]" />
                            <button className="nav-btn">IS / EN</button>
                            <button className="nav-btn">KR ISK</button>
                        </div>
                    </div>

                    {/* Menu */}
                    <div className="flex-1 p-8 bg-[#f5f5f3]">
                        <nav>
                            {menuItems.map((item) => (
                                <div key={item.id} className="menu-item">
                                    <button
                                        onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                                        className="menu-btn group flex items-center justify-between w-full"
                                    >
                                        {item.label}
                                        {item.subItems && (
                                            <ChevronDown size={24} className={`transform transition-transform ${expandedItem === item.id ? 'rotate-180' : ''}`} />
                                        )}
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

                    {/* Bottom image */}
                    <div className="h-[400px]">
                        <img 
                            src="/Sky_Lagoon_Ritual.jpg" 
                            alt="Sky Lagoon Ritual"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Right side - empty space */}
                <div className="flex-1 bg-white"></div>
            </div>

            <ChatWidget webhookUrl={webhookUrl} apiKey={apiKey} language={language} />
        </div>
    );
};

export default Layout;