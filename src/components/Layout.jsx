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
        <div className="h-screen w-screen overflow-hidden bg-[#f5f5f3]">
            <div className="max-w-screen-2xl mx-auto h-full">
                <div className="flex h-full">
                    {/* Left Navigation */}
                    <div className="w-[500px] p-12 flex flex-col">
                        <div className="flex items-center gap-6 mb-16">
                            <Globe size={16} className="text-[#4D5645]" />
                            <button className="nav-btn">IS / EN</button>
                            <button className="nav-btn">KR ISK</button>
                        </div>
                        
                        <nav className="flex-1">
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

                    {/* Main Content */}
                    <div className="flex-1 relative">
                        <div 
                            className="h-full w-full"
                            style={{
                                backgroundImage: 'url("/Sky_Lagoon_Ritual.jpg")',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />
                        <button className="absolute top-8 right-8 text-white">
                            <X size={24} />
                        </button>
                        <ChatWidget webhookUrl={webhookUrl} apiKey={apiKey} language={language} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;