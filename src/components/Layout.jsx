import React, { useState } from 'react';
import ChatWidget from './ChatWidget';
import PackageInfo from './PackageInfo';
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
            { id: 'packages', label: 'Leiðir til að njóta' },
            { id: 'experience', label: 'Upplifunin', subItems: ['Sky Lagoon Upplifunin', 'Skjól Ritúalið'] },
            { id: 'plan', label: 'Heimsóknin þín' },
            { id: 'food', label: 'Veitingar' },
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
            <div className="max-w-[1400px] mx-auto">
                {/* Initial Section */}
                <section className="mb-32 pt-20">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-caudex text-[#4D5645] mb-6">
                            {language === 'en' ? 'Experience Tranquility' : 'Upplifðu Kyrrð'}
                        </h2>
                        <p className="text-[#4D5645] max-w-3xl mx-auto leading-relaxed text-lg px-8">
                            {language === 'en' 
                                ? 'Immerse yourself in the warmth of our geothermal lagoon, where modern comfort meets Icelandic tradition. Our infinity edge seamlessly blends with the ocean horizon, creating an unforgettable experience of relaxation and natural beauty.'
                                : 'Njóttu þín hjá okkur, þar sem nútímaþægindi mæta íslenskri hefð. Óendanleikinn rennur saman við sjóndeildarhringinn og skapar ógleymanlega upplifun af slökun og náttúrufegurð.'}
                        </p>
                    </div>
                </section>

                {/* Package Info Section */}
                <PackageInfo 
                    language={language} 
                    images={{
                        ser: "/Ser.jpg",
                        saman: "/Saman.jpg",
                        transfer: "/Book_with_Transfer.jpg",
                        forTwo: "/Sky_Lagoon_for_two.jpg"
                    }}
                />

                {/* Footer Section */}
                <section className="text-center py-16 border-t border-[#4D5645]/20">
                    <h2 className="text-4xl font-caudex text-[#4D5645] mb-6">
                        Sky Lagoon 2025
                    </h2>
                    <p className="text-[#4D5645] max-w-2xl mx-auto px-8">
                        {language === 'en' 
                            ? 'Where serenity meets the sea. Join us for an unforgettable journey of relaxation and renewal.' 
                            : 'Þú finnur okkur þar sem himinn og haf renna saman.'}
                    </p>
                </section>
            </div>

            {/* Chat Widget */}
            <ChatWidget 
                webhookUrl={webhookUrl} 
                apiKey={apiKey} 
                language={language}
            />
        </div>
    );
};

export default Layout;
