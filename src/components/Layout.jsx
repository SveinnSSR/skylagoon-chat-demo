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
        <div className="min-h-screen">
            <div className="flex min-h-screen">
                {/* Left Navigation */}
                <div className="w-[500px] bg-[#f5f5f3] p-12 flex flex-col relative">
                    <div className="flex justify-between items-center mb-12">
                        <div className="flex items-center gap-6">
                            <Globe size={20} className="text-[#4D5645]" />
                            <button className="language-button">
                                IS / EN
                            </button>
                            <button className="language-button">
                                KR ISK
                            </button>
                        </div>
                    </div>
                    
                    <nav className="flex-1">
                        {menuItems.map((item) => (
                            <div key={item.id} className="mb-8">
                                <button
                                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                                    className="menu-item w-full flex justify-between items-center"
                                >
                                    {item.label}
                                    {item.subItems && (
                                        expandedItem === item.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />
                                    )}
                                </button>
                                
                                {item.subItems && expandedItem === item.id && (
                                    <div className="mt-4 ml-4 space-y-4">
                                        {item.subItems.map((subItem) => (
                                            <button key={subItem} className="submenu-item">
                                                {subItem}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    <button className="absolute top-8 right-8 text-[#4D5645]">
                        <X size={24} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 relative">
                    <div 
                        className="h-screen w-full bg-cover bg-center bg-no-repeat fixed"
                        style={{ backgroundImage: 'url("/Sky_Lagoon_Ritual.jpg")' }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h1 className="text-white text-7xl font-caudex">
                                Where the Sea<br />
                                Meets the Sky
                            </h1>
                        </div>
                    </div>
                    <ChatWidget webhookUrl={webhookUrl} apiKey={apiKey} language={language} />
                </div>
            </div>
        </div>
    );
};

export default Layout;