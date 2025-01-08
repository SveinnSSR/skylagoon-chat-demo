import React, { useState } from 'react';
import ChatWidget from './ChatWidget';
import '../styles/Layout.css';
import { ChevronDown, ChevronUp, Globe } from 'lucide-react';

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
        <div className="min-h-screen bg-[#4D5645]">
            <div className="flex min-h-screen">
                {/* Left Navigation */}
                <div className="w-96 bg-[#f5f5f3] p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4 text-sm">
                            <Globe size={16} className="text-[#4D5645]" />
                            <button 
                                className="text-[#4D5645]"
                                onClick={() => setLanguage(prev => prev === 'en' ? 'is' : 'en')}
                            >
                                IS / EN
                            </button>
                        </div>
                    </div>
                    
                    <nav className="flex-1">
                        {menuItems.map((item) => (
                            <div key={item.id} className="mb-6">
                                <button
                                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                                    className="w-full flex justify-between items-center text-[#4D5645] text-xl font-light border-b border-[#4D5645] pb-2"
                                >
                                    {item.label}
                                    {item.subItems && (
                                        expandedItem === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />
                                    )}
                                </button>
                                
                                {item.subItems && expandedItem === item.id && (
                                    <div className="mt-4 ml-4 space-y-3">
                                        {item.subItems.map((subItem) => (
                                            <button key={subItem} className="text-[#4D5645] text-lg font-light">
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
                        className="h-screen w-full bg-cover bg-center bg-no-repeat fixed"
                        style={{ backgroundImage: 'url("/Sky_Lagoon_Ritual.jpg")' }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h1 className="text-white text-6xl font-light text-center font-serif">
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