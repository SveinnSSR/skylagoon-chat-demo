import React, { useState } from 'react';
import ChatWidget from './ChatWidget';
import { ChevronDown } from 'lucide-react';

const Layout = ({ webhookUrl, apiKey }) => {
    const [expandedItem, setExpandedItem] = useState(null);

    const menuItems = [
        { id: 'packages', label: 'Packages' },
        { id: 'experience', label: 'Experience', subItems: ['The Sky Lagoon Experience', 'Skjól Ritual'] },
        { id: 'plan', label: 'Plan Your Visit' },
        { id: 'food', label: 'Food' },
        { id: 'stories', label: 'Our Stories' }
    ];

    return (
        <div className="h-screen bg-[#f5f5f3]">
            {/* Main content wrapper */}
            <div className="max-w-[1400px] h-full mx-auto flex">
                {/* Left Side - Menu */}
                <div className="w-[600px] flex-shrink-0">
                    {/* Language selector */}
                    <div className="p-8">
                        <button className="text-[#4D5645]">IS / EN</button>
                        <button className="ml-4 text-[#4D5645]">KR ISK</button>
                    </div>
                    
                    {/* Menu */}
                    <div className="p-8 pb-0">
                        <nav>
                            {menuItems.map((item) => (
                                <div key={item.id} className="mb-8">
                                    <button
                                        className="w-full text-[#4D5645] font-caudex text-2xl text-left pb-2 border-b border-[#4D5645]/20"
                                        onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                                    >
                                        <div className="flex justify-between items-center">
                                            {item.label}
                                            {item.subItems && (
                                                <ChevronDown className={`transform transition-transform ${
                                                    expandedItem === item.id ? 'rotate-180' : ''
                                                }`} />
                                            )}
                                        </div>
                                    </button>
                                    {item.subItems && expandedItem === item.id && (
                                        <div className="mt-4 ml-4 space-y-3">
                                            {item.subItems.map(subItem => (
                                                <button 
                                                    key={subItem} 
                                                    className="block text-[#4D5645] hover:opacity-70"
                                                >
                                                    {subItem}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Right Side - Image */}
                <div className="flex-1 h-full">
                    <img 
                        src="/Sky_Lagoon_Ritual.jpg"
                        alt="Sky Lagoon" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
            
            {/* Chat Widget */}
            <ChatWidget webhookUrl={webhookUrl} apiKey={apiKey} />
        </div>
    );
};

export default Layout;
