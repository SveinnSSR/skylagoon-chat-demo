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
        <div style={{ display: 'grid', gridTemplateColumns: '600px 1fr' }} className="h-screen">
            {/* Left Side */}
            <div className="h-full overflow-hidden">
                {/* Language */}
                <div className="p-8 bg-[#f5f5f3]">
                    <button>IS / EN</button>
                    <button className="ml-4">KR ISK</button>
                </div>
                
                {/* Menu */}
                <div className="p-8 pb-0 bg-[#f5f5f3] h-full">
                    <nav>
                        {menuItems.map((item) => (
                            <div key={item.id} className="mb-8">
                                <button
                                    className="w-full text-[#4D5645] font-caudex text-2xl text-left pb-2 border-b border-[#4D5645]/20"
                                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                                >
                                    <div className="flex justify-between items-center">
                                        {item.label}
                                        {item.subItems && <ChevronDown />}
                                    </div>
                                </button>
                                {item.subItems && expandedItem === item.id && (
                                    <div className="mt-4 ml-4">
                                        {item.subItems.map(subItem => (
                                            <button key={subItem} className="block text-[#4D5645] mb-3">
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

            {/* Right Side */}
            <div className="h-screen">
                <img 
                    src="/Sky_Lagoon_Ritual.jpg"
                    alt="Sky Lagoon" 
                    className="w-full h-full object-cover"
                />
            </div>
            
            <ChatWidget webhookUrl={webhookUrl} apiKey={apiKey} />
        </div>
    );
};

export default Layout;
