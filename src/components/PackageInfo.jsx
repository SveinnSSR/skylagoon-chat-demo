import React from 'react';

const PackageInfo = ({ language }) => {
  const content = {
    en: {
      heading: "Embark on your journey",
      packages: [
        {
          id: "ser",
          image: "/Sér",
          title: "Sér",
          tags: ["THE SKJÓL RITUAL", "PRIVATE CHANGE ROOM"],
          description: "Discover the ultimate Sky Lagoon experience. Our premium package includes Sky Lagoon's signature Skjól ritual and access to our private changing facilities.",
          price: "ISK 15,990",
          perPerson: "PER ADULT",
          button: "Book Now"
        },
        {
          id: "saman",
          image: "/Saman",
          title: "Saman",
          tags: ["THE SKJÓL RITUAL"],
          description: "Our classic and most popular package includes Sky Lagoon's signature Skjól ritual and access to public changing facilities.",
          price: "ISK 12,990",
          perPerson: "PER ADULT",
          button: "Book Now"
        },
        {
          id: "transfer",
          image: "/Book with Transfer",
          title: "Book with Transfer",
          description: "Choose this option if you require shuttle transfer for a small additional fee.",
          subtitle: "Operated by Reykjavik Excursions.",
          button: "Select",
          showForLanguages: ["en"]
        }
      ],
      forTwo: {
        heading: "Sky Lagoon for two",
        packages: [
          {
            title: "Sér for two",
            price: "ISK 41,480",
            items: [
              "2 x Sér Passes",
              "One Drink per Guest",
              "Sky Platter from Smakk Bar"
            ],
            button: "Book Now"
          },
          {
            title: "Saman for Two",
            price: "ISK 35,480",
            items: [
              "2 x Saman Passes",
              "One Drink per Guest",
              "Sky Platter from Smakk Bar"
            ],
            button: "Book Now"
          }
        ]
      }
    },
    is: {
      heading: "Finndu þína leið að hugarró",
      packages: [
        {
          id: "ser",
          image: "/Sér",
          title: "Sér",
          tags: ["SKJÓL RITUAL", "VEL BÚNIR EINKAKLEFAR"],
          description: "Viltu meira næði og þægindi? Sér leiðin veitir aðgang að vel búnum einkaklefa með snyrtiaðstöðu og sturtu.",
          price: "ISK 15.990",
          perPerson: "Á MANN",
          button: "Bóka"
        },
        {
          id: "saman",
          image: "/Saman",
          title: "Saman",
          tags: ["SKJÓL RITUAL"],
          description: "Skjól Ritúal meðferðin er innifalin í klassísku Saman leiðinni.",
          price: "ISK 12.990",
          perPerson: "Á MANN",
          button: "Bóka"
        }
      ],
      forTwo: {
        heading: "Njótið saman",
        packages: [
          {
            title: "Sér Stefnumót",
            price: "ISK 41.480",
            items: [
              "2 x Sér Passar",
              "Drykkur á mann (vín hússins, af krana eða óáfengt)",
              "Sky sælkeraplatti á Smakk Bar"
            ],
            button: "Bóka"
          },
          {
            title: "Saman Stefnumót",
            price: "ISK 35.480",
            items: [
              "2 x Saman Passar",
              "Drykkur á mann (vín hússins, af krana eða óáfengt)",
              "Sky sælkeraplatti á Smakk Bar"
            ],
            button: "Bóka"
          }
        ]
      }
    }
  };

  const text = content[language];

  return (
    <div className="py-20 px-8">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <img src="/sun-icon.svg" alt="Sky Lagoon" className="h-12" />
      </div>
      
      {/* Main heading */}
      <h2 className="text-5xl font-caudex text-[#4D5645] text-center mb-16">
        {text.heading}
      </h2>

      {/* Package cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
        {text.packages.map((pkg) => (
          <div 
            key={pkg.id}
            className="bg-white rounded-2xl overflow-hidden shadow-lg"
          >
            <div className="relative">
              <img 
                src={pkg.image} 
                alt={pkg.title}
                className="w-full h-64 object-cover"
              />
              {pkg.tags && (
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {pkg.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-white text-[#4D5645] text-sm px-4 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-caudex text-[#4D5645] mb-4">{pkg.title}</h3>
              <p className="text-[#4D5645] mb-6">{pkg.description}</p>
              {pkg.subtitle && (
                <p className="text-[#4D5645] text-sm mb-6">{pkg.subtitle}</p>
              )}
              <div className="flex justify-between items-end">
                {pkg.price && (
                  <div>
                    <div className="text-sm text-[#4D5645] mb-1">FROM</div>
                    <div className="text-xl font-bold text-[#4D5645]">{pkg.price}</div>
                    <div className="text-sm text-[#4D5645]">{pkg.perPerson}</div>
                  </div>
                )}
                <button className="bg-[#4D5645] text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity">
                  {pkg.button}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* For Two section */}
      <div className="mb-32">
        <h2 className="text-4xl font-caudex text-[#4D5645] text-center mb-12">
          {text.forTwo.heading}
        </h2>
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {text.forTwo.packages.map((pkg, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-2xl font-caudex text-[#4D5645] mb-4">{pkg.title}</h3>
                  <div className="text-[#4D5645] mb-4">
                    <div className="text-sm mb-1">FROM</div>
                    <div className="text-2xl font-bold">{pkg.price}</div>
                  </div>
                  <ul className="text-[#4D5645] mb-6 text-left">
                    {pkg.items.map((item, idx) => (
                      <li key={idx} className="mb-2">{item}</li>
                    ))}
                  </ul>
                  <button className="bg-[#4D5645] text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity">
                    {pkg.button}
                  </button>
                </div>
              ))}
            </div>
            <div className="relative h-full min-h-[400px]">
              <img 
                src="/Sky Lagoon for two"
                alt="Sky Lagoon for two"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageInfo;