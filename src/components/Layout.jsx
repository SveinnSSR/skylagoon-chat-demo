import React, { useState } from 'react';
import ChatWidget from './ChatWidget';
import { ChevronDown } from 'lucide-react';

const Layout = () => {
    const [expandedItem, setExpandedItem] = useState(null);

    const menuItems = [
        { id: 'packages', label: 'Packages' },
        { id: 'experience', label: 'Experience', subItems: ['The Sky Lagoon Experience', 'Skjól Ritual'] },
        { id: 'plan', label: 'Plan Your Visit' },
        { id: 'food', label: 'Food' },
        { id: 'stories', label: 'Our Stories' }
    ];

    return (
        <div className="h-screen flex">
            {/* Left Menu */}
            <div className="w-[500px] bg-[#f5f5f3] p-12">
                <div className="flex gap-8 mb-12">
                    <button className="text-[#4D5645]">IS / EN</button>
                    <button className="text-[#4D5645]">KR ISK</button>
                </div>
                
                <nav>
                    {menuItems.map((item) => (
                        <div key={item.id} className="mb-8">
                            <button
                                className="w-full text-[#4D5645] font-caudex text-3xl text-left pb-2 border-b border-[#4D5645]/20"
                                onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                            >
                                <div className="flex justify-between items-center">
                                    {item.label}
                                    {item.subItems && <ChevronDown size={20} />}
                                </div>
                            </button>
                            {item.subItems && expandedItem === item.id && (
                                <div className="mt-4 ml-4">
                                    {item.subItems.map(subItem => (
                                        <button key={subItem} className="block text-[#4D5645]/80 text-xl mb-3">
                                            {subItem}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Right Image */}
            <div className="flex-1">
                <img 
                    src="/Sky_Lagoon_Ritual.jpg"
                    alt="Sky Lagoon" 
                    className="w-full h-full object-cover"
                />
            </div>
            
            <ChatWidget />
        </div>
    );
};

export default Layout;
