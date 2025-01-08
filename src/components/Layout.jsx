import React, { useState } from 'react';
import ChatWidget from './ChatWidget';
import { ChevronDown } from 'lucide-react';

const Layout = ({ webhookUrl, apiKey }) => {
    const [language, setLanguage] = useState('en');
    const [expandedItem, setExpandedItem] = useState(null);

    const menuItems = {
        en: [
            { id: 'packages', label: 'Packages' },
            { id: 'experience', label: 'Experience', subItems: ['The Sky Lagoon Experience', 'Skjól Ritual'] },
            { id: 'plan', label: 'Plan Your Visit' },
            { id: 'food', label: 'Food' },
            { id: 'stories', label: 'Our Stories' }
        ],
        is: [
            { id: 'packages', label: 'Pakkar' },
            { id: 'experience', label: 'Upplifun', subItems: ['Sky Lagoon Upplifunin', 'Skjól Ritúalið'] },
            { id: 'plan', label: 'Skipuleggja Heimsókn' },
            { id: 'food', label: 'Veitingar' },
            { id: 'stories', label: 'Sögur Okkar' }
        ]
    };

    return (
        <div className="min-h-screen bg-[#f5f5f3]">
            {/* Hero Section */}
            <div className="h-screen flex">
                <div className="max-w-[1400px] mx-auto flex flex-1">
                    {/* Left Side - Menu */}
                    <div className="w-[600px] flex-shrink-0">
                        {/* Language selector */}
                        <div className="p-8">
                            <button 
                                onClick={() => setLanguage(lang => lang === 'en' ? 'is' : 'en')} 
                                className="text-[#4D5645]"
                            >
                                {language === 'en' ? 'IS / EN' : 'EN / IS'}
                            </button>
                            <button className="ml-4 text-[#4D5645]">KR ISK</button>
                        </div>
                        
                        {/* Menu */}
                        <div className="p-8 pb-0">
                            <nav>
                                {menuItems[language].map((item) => (
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
                    <div className="flex-1">
                        <img 
                            src="/Sky_Lagoon_Ritual.jpg"
                            alt="Sky Lagoon" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="max-w-[1400px] mx-auto py-20 px-8">
                {/* Embark Section */}
                <section className="mb-32">
                    <div className="text-center mb-16">
                        <img 
                            src="/sky-lagoon-logo.jpg" 
                            alt="Sky Lagoon Logo" 
                            className="w-24 mx-auto mb-8"
                        />
                        <h2 className="text-6xl font-caudex text-[#4D5645]">
                            {language === 'en' ? 'Embark on your journey' : 'Hefja ferðalagið'}
                        </h2>
                    </div>
                    <img 
                        src="/Embark_on_your_Journey.png"
                        alt="Embark on your journey" 
                        className="w-full rounded-lg shadow-lg"
                    />
                </section>

                {/* For Two Section */}
                <section className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-caudex text-[#4D5645]">
                            {language === 'en' ? 'Sky Lagoon for Two' : 'Sky Lagoon fyrir tvo'}
                        </h2>
                    </div>
                    <img 
                        src="/Sky_Lagoon_For_Two.png"
                        alt="Sky Lagoon for Two" 
                        className="w-full rounded-lg shadow-lg"
                    />
                </section>

                {/* Footer Section */}
                <section className="text-center py-16 border-t border-[#4D5645]/20">
                    <h2 className="text-4xl font-caudex text-[#4D5645] mb-6">Sky Lagoon 2025</h2>
                    <p className="text-[#4D5645] max-w-2xl mx-auto">
                        {language === 'en' 
                            ? 'Experience tranquility where the sky meets the ocean. Join us for an unforgettable journey of relaxation and renewal.' 
                            : 'Upplifðu ró þar sem himinn og haf renna saman. Taktu þátt í ógleymanlegri slökunarferð.'}
                    </p>
                </section>
            </div>

            {/* Chat Widget */}
            <ChatWidget webhookUrl={webhookUrl} apiKey={apiKey} />
        </div>
    );
};

export default Layout;
