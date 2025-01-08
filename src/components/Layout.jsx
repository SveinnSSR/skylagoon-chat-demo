import React, { useState } from 'react';
import ChatWidget from './ChatWidget';
import '../styles/Layout.css';
import { ChevronDown, ChevronUp, Globe, X } from 'lucide-react';

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
        <div className="min-h-screen bg-[#f5f5f3]">
            <div className="flex flex-col">
                {/* Top Image */}
                <div className="w-full h-[70vh]">
                    <img 
                        src="/Sky_Lagoon_Ritual.jpg" 
                        alt="Sky Lagoon Ritual"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Bottom Content */}
                <div className="flex">
                    {/* Left Menu */}
                    <div className="w-[400px] p-12">
                        <div className="flex items-center gap-6 mb-16">
                            <Globe size={16} className="text-[#4D5645]" />
                            <button className="nav-btn">IS / EN</button>
                            <button className="nav-btn">KR ISK</button>
                        </div>
                        
                        <nav>
                            {menuItems.map((item) => (
                                <div key={item.id} className="menu-item">
                                    <button
                                        onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                                        className="menu-btn group flex items-center justify-between w-full"
                                    >
                                        {item.label}
                                        {item.subItems && (
                                            <ChevronDown 
                                                size={24}
                                                className={`transform transition-transform ${expandedItem === item.id ? 'rotate-180' : ''}`}
                                            />
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

                    {/* Right Content Area */}
                    <div className="flex-1 p-12">
                        <h1 className="text-6xl font-caudex text-[#4D5645]">
                            Where the Sea<br />
                            Meets the Sky
                        </h1>
                    </div>
                </div>
            </div>
            <ChatWidget webhookUrl={webhookUrl} apiKey={apiKey} language={language} />
        </div>
    );
};

export default Layout;