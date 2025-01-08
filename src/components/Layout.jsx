import React, { useState } from 'react';
import ChatWidget from './ChatWidget';
import '../styles/Layout.css';
import { ChevronDown, X } from 'lucide-react';

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
        <div className="h-screen overflow-hidden bg-[#4D5645] flex">
            {/* Left Navigation */}
            <div className="w-[400px] min-h-screen bg-[#f5f5f3] py-12 px-8 flex flex-col relative">
                <div className="flex items-center gap-6 mb-16">
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
                                        size={20} 
                                        className={`transition-transform ${expandedItem === item.id ? 'rotate-180' : ''}`}
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

                <button className="absolute top-8 right-8">
                    <X className="text-[#4D5645] hover:opacity-70" size={24} />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                <div 
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: 'url("/Sky_Lagoon_Ritual.jpg")' }}
                >
                    <div className="h-full flex items-center justify-center">
                        <h1 className="text-white text-7xl font-caudex leading-tight">
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