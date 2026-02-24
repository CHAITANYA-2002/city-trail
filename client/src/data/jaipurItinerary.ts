export type ItineraryStop = {
  time?: string;
  title: string;
  description?: string;
  type?: string;
  area?: string;
  notes?: string;
  duration?: number;
};

export type ExcursionOption = {
  destination: string;
  driveTime?: number;
};

export type DayItinerary = {
  day: number;
  title: string;
  stops: ItineraryStop[];
  overview?: string;
  options?: ExcursionOption[];
};

export const JAIPUR_ITINERARY: Record<number, DayItinerary[]> = {
  /* ===================== 1 DAY ===================== */
  1: [
    {
      day: 1,
      title: "The Quintessential Pink City",
      overview: "One perfect day through Jaipur's grandest icons — from the Palace of Winds at dawn to the Water Palace at golden hour. This is the journey every traveller dreams of.",
      stops: [
        {
          time: "07:30–08:30",
          title: "Hawa Mahal",
          type: "Monument",
          area: "Pink City",
          duration: 60,
          notes: "Arrive at first light for the most magical facade photographs — the honeycomb stone radiates rose gold as the sun rises behind it. Fewer crowds, softer light, and the call to prayer echoing across the lanes.",
          description: "The iconic five-story Palace of Winds, adorned with 953 latticed windows through which royal women observed the world in secret."
        },
        {
          time: "09:00–11:00",
          title: "City Palace",
          type: "Palace / Museum",
          area: "Pink City",
          duration: 120,
          notes: "Explore the sprawling palace complex in the cool morning air. Don't miss the Chandra Mahal roof terrace, the gorgeous Peacock courtyard, and the world's largest sterling silver urns in the Diwan-e-Khas.",
          description: "A living royal palace blending Rajput and Mughal grandeur — part palace, part museum, entirely magnificent."
        },
        {
          time: "11:00–12:15",
          title: "Jantar Mantar",
          type: "UNESCO Observatory",
          area: "Pink City",
          duration: 75,
          notes: "Walk between the towering stone instruments that still predict the monsoon to within two minutes. The Samrat Yantra — the world's largest sundial — is a feat of 18th-century genius. Hire a guide for a truly mind-expanding experience.",
          description: "A UNESCO World Heritage astronomical observatory with 19 architectural instruments of extraordinary precision."
        },
        {
          time: "12:30–13:30",
          title: "Lunch",
          type: "Dining",
          area: "Pink City",
          notes: "Head to LMB (Laxmi Mishthan Bhandar) on Johari Bazaar for the city's finest Rajasthani thali — a royal spread of dal baati churma, ker sangri, and ghevar. A Jaipur institution since 1727.",
          description: "Authentic Rajasthani cuisine in the heart of the old city."
        },
        {
          time: "14:30–16:30",
          title: "Amber Fort",
          type: "Fort",
          area: "Amer",
          duration: 120,
          notes: "Visit the Sheesh Mahal (Hall of Mirrors) — a single candle illuminates the entire chamber through ten thousand mirror fragments. Walk through the Ganesha Pol gate and pause on the ramparts overlooking the Maota Lake below.",
          description: "A hilltop fortress of red sandstone and marble rising dramatically above the Aravalli hills — arguably India's most beautiful fort complex."
        },
        {
          time: "17:30–18:15",
          title: "Jal Mahal",
          type: "Viewpoint",
          area: "Amer Road",
          duration: 45,
          notes: "Drive lakeside as the afternoon cools — the five-storey palace appears to float on Man Sagar Lake, framed by the Nahargarh and Jaigarh forts on the ridge above. An unmissable sunset composition. Stay until the palace is reflected in still golden water.",
          description: "A 18th-century water palace that appears to float serenely on Man Sagar Lake — the most romantic viewpoint in Jaipur."
        }
      ]
    }
  ],

  /* ===================== 2 DAYS ===================== */
  2: [
    {
      day: 1,
      title: "The Pink City & Fort Hill",
      overview: "Spend your first day immersed in the walled city's grandeur — iconic monuments by morning, the legendary fort complex by afternoon, and the city's most spectacular sunset vantage at dusk.",
      stops: [
        {
          time: "08:00–12:00",
          title: "Pink City Highlights (Hawa Mahal, City Palace, Jantar Mantar)",
          area: "Pink City",
          type: "Monument",
          notes: "Begin at Hawa Mahal at dawn for the most dramatic facade light. Work through the City Palace complex — give yourself at least 90 minutes to absorb the museums and courtyards. End at Jantar Mantar's extraordinary astronomical instruments.",
          description: "A morning through three UNESCO-adjacent icons in the heart of the old city: the Palace of Winds, the living royal palace, and the stone observatory."
        },
        {
          time: "13:00–16:30",
          title: "Amber Fort & Panna Meena ka Kund",
          area: "Amer",
          type: "Fort",
          notes: "After lunch, head to Amer. Before entering the fort, duck into the nearby Panna Meena Ka Kund stepwell — a geometric masterpiece of crisscrossing stairs that few tourists visit. Then ascend to the fort proper and spend two hours exploring Sheesh Mahal and the palace ramparts.",
          description: "The crown jewel of Jaipur's heritage — a hilltop fortress of breathtaking scale, paired with a hidden geometric stepwell."
        },
        {
          time: "17:30–19:00",
          title: "Nahargarh Fort",
          type: "Fort",
          area: "Aravallis",
          duration: 90,
          notes: "Ride up to Nahargarh as the sun drops. The panoramic view of the Pink City stretching to the horizon, bathed in amber light, is one of the most striking views in all of India. Stay for the full sunset — the city lights gradually bloom as darkness falls.",
          description: "Jaipur's crown — a hilltop fort on the Aravalli ridge with the most breathtaking panoramic sunset view of the entire city."
        }
      ]
    },
    {
      day: 2,
      title: "Fort Chain, Art & Bazaars",
      overview: "Complete the legendary fort triangle before diving into Jaipur's rich cultural life and ending the evening in the vibrant old city bazaars.",
      stops: [
        {
          time: "08:30–10:30",
          title: "Jaigarh Fort",
          type: "Fort",
          area: "Amer",
          duration: 120,
          notes: "Connected to Amber Fort by an underground passage, Jaigarh houses the Jaivana — the world's largest cannon on wheels, which has never been fired in war. The fort also has spectacular views over the entire Amber valley. Go early before tour buses arrive.",
          description: "The military stronghold above Amber Fort — home to the world's largest wheeled cannon and dramatic Aravalli valley vistas."
        },
        {
          time: "11:00–11:30",
          title: "Jal Mahal",
          type: "Viewpoint",
          area: "Amer Road",
          duration: 30,
          notes: "On the drive back to the city, stop at the water palace viewpoint for morning photographs — the light is different, softer and more blue than evening, with Mirror Lake reflecting the forts above.",
          description: "The enchanting water palace floating on Man Sagar Lake — magical in morning light."
        },
        {
          time: "13:00–15:30",
          title: "Albert Hall Museum",
          type: "Museum",
          area: "New City",
          duration: 150,
          notes: "Rajasthan's oldest museum is a masterpiece of Indo-Saracenic architecture. Explore its eclectic collection: the Egyptian mummy, Mughal miniature paintings, royal costumes, and the extraordinary carpet gallery. The building itself — illuminated at dusk — is worth the visit alone.",
          description: "Rajasthan's finest museum in a grand colonial-era building, housing an extraordinary collection from Egyptian mummies to Mughal miniatures."
        },
        {
          time: "17:00–19:30",
          title: "Johari Bazaar",
          type: "Market",
          area: "Pink City",
          duration: 150,
          notes: "Jaipur is the gem capital of the world — every second shop on Johari Bazaar deals in precious and semi-precious stones. Beyond gems, explore the Lac bangle sellers, the block-printed fabric stalls, and the antique jewellery dealers in the narrow lane behind the main street.",
          description: "The legendary historic gem and jewellery market at the heart of the Pink City — a treasure trove for collectors and browsers alike."
        }
      ]
    }
  ],

  /* ===================== 3 DAYS ===================== */
  3: [
    {
      day: 1,
      title: "The Walled City",
      overview: "An immersive day in the historic Pink City — from architectural icons to ancient observatories and vibrant bazaar streets.",
      stops: [
        {
          time: "08:00",
          title: "Hawa Mahal",
          type: "Monument",
          area: "Pink City",
          duration: 60,
          notes: "Arrive early for the best light on the 953-window facade. Climb to the upper levels for views over the bazaar streets below.",
          description: "The Palace of Winds — Jaipur's most photographed icon, a five-story latticed sandstone screen."
        },
        {
          time: "09:30",
          title: "City Palace",
          type: "Palace / Museum",
          area: "Pink City",
          duration: 120,
          notes: "Allow full two hours. The Bhaggi Khana (carriage museum), the Maharani's palace, and the textile galleries are not to be missed beyond the main courtyard.",
          description: "The living royal palace of Jaipur — a stunning blend of Rajput and Mughal architecture spanning seven courtyards."
        },
        {
          time: "11:30",
          title: "Jantar Mantar",
          type: "UNESCO Observatory",
          area: "Pink City",
          duration: 75,
          notes: "The Lok Yantra (small dial) tells time to 2-second accuracy. Hire an official guide here — the instruments are meaningless without explanation and extraordinary with it.",
          description: "An 18th-century stone observatory with 19 architectural instruments including the world's largest sundial."
        },
        {
          time: "15:00",
          title: "Local Bazaar Walk",
          type: "Market",
          area: "Pink City",
          duration: 120,
          notes: "Walk the stretch from Hawa Mahal Chowk to Johari Bazaar. Stop at the Itr (perfume) sellers, watch the block printers at work in the side lanes, and sample street food at Pyaaz Kachori sellers who have been at the same spot for generations.",
          description: "A winding exploration through the old city's most characterful lanes and historic bazaars."
        }
      ]
    },
    {
      day: 2,
      title: "The Fort Circuit",
      overview: "A full day conquering Jaipur's legendary fort triangle — three dramatically positioned fortresses linked by history, ramparts, and spectacular views.",
      stops: [
        {
          time: "08:30",
          title: "Amber Fort",
          type: "Fort",
          area: "Amer",
          duration: 120,
          notes: "Arrive before 10am. The Sheesh Mahal (Hall of Mirrors) is the highlight — arrive when sunlight streams in through the southern window, setting a thousand mirror fragments ablaze. The Ganesha Pol gate is a triumph of painted plaster craftsmanship.",
          description: "India's most magnificent fort palace — a hilltop complex of red sandstone, marble, and ten thousand mirrors."
        },
        {
          time: "10:30",
          title: "Jaigarh Fort",
          type: "Fort",
          area: "Amer",
          duration: 90,
          notes: "Walk or drive the 1km between the two forts (ticket includes both). See the Jaivana cannon up close — its barrel is 20 feet long and fired once in a test shot, creating a crater 3km away. The underground water tank here once supplied both forts.",
          description: "The military fortress above Amber — the guardian of the Jaivana, the world's largest wheeled cannon."
        },
        {
          time: "13:00",
          title: "Jal Mahal",
          type: "Viewpoint",
          area: "Amer Road",
          duration: 30,
          notes: "A short stop on the drive back for photographs — try the view from both sides of the road. In monsoon, the lake is full and the effect doubly magical.",
          description: "The palace that appears to float on Man Sagar Lake — an inevitable photo stop between Amer and the city."
        },
        {
          time: "17:30",
          title: "Nahargarh Fort",
          type: "Fort",
          area: "Aravallis",
          duration: 90,
          notes: "End your fort day at the highest point — Nahargarh's sunset view across the entire Pink City is transcendent. The Madhavendra Bhawan inside the fort is also worth a visit, with a unique maze-like palace built for nine queens.",
          description: "Sunset from Jaipur's highest rampart — the panoramic view of the Pink City is the finest in Rajasthan."
        }
      ]
    },
    {
      day: 3,
      title: "Culture, Gardens & Hidden Jaipur",
      overview: "A quieter, more personal day exploring the cultural and natural dimensions of Jaipur that most visitors miss entirely.",
      stops: [
        {
          time: "09:00",
          title: "Albert Hall Museum",
          type: "Museum",
          area: "New City",
          duration: 120,
          notes: "The Indo-Saracenic building alone repays the visit. Inside, seek out the Egyptian mummy, the Persian carpet (one of the finest in the world), and the Maharaja's coronation robe embedded with gemstones.",
          description: "Rajasthan's finest museum — a treasury of art, history, and craft in a magnificent colonial building."
        },
        {
          time: "11:30",
          title: "Patrika Gate",
          type: "Landmark",
          area: "Jawahar Circle",
          duration: 45,
          notes: "Nine arches depicting the nine stories of Rajasthan's culture — painted in vivid Rajasthani motifs. Go on a weekday morning for photographs without crowds. Located adjacent to Jawahar Circle park.",
          description: "A stunning painted gateway celebrating Rajasthani heritage — one of Jaipur's most striking modern landmarks."
        },
        {
          time: "14:00",
          title: "Galtaji Temple",
          type: "Temple",
          area: "Aravallis",
          duration: 90,
          notes: "The hidden valley temple complex is a world away from the city. Hundreds of monkeys inhabit the natural spring tanks alongside pilgrims. Climb to the Sun Temple at the summit for views over the Aravalli hills stretching to the horizon.",
          description: "An ancient sacred temple complex tucked into a wild valley in the Aravalli hills — the legendary Monkey Temple of Jaipur."
        },
        {
          time: "16:00",
          title: "Sisodia Rani Garden",
          type: "Garden",
          area: "Agra Road",
          duration: 75,
          notes: "These terraced Mughal gardens were built for the queen of Sisodia in the 18th century. The murals around the pavilions depict scenes from the Krishna legend in remarkably vivid colour. Most beautiful after monsoon when every fountain runs.",
          description: "A tiered Mughal-style garden of fountains, pavilions, and Krishna murals — one of Jaipur's most romantic hidden escapes."
        },
        {
          time: "18:30",
          title: "Central Park",
          type: "Nature",
          area: "New City",
          duration: 60,
          notes: "Jaipur's most beloved evening park — 200 acres of manicured lawns along the longest tricolour flag mast in India. Come at dusk when the city's families promenade and the lights of the city flicker to life around the park's edge.",
          description: "The green heart of new Jaipur — a gorgeous evening stroll under India's tallest flagpole."
        }
      ]
    }
  ],

  /* ===================== 4 DAYS ===================== */
  4: [
    {
      day: 1,
      title: "The Walled Pink City",
      overview: "A deep immersion in the historic old city — Jaipur's most iconic monuments by morning, the gem markets by afternoon.",
      stops: [
        {
          time: "08:00",
          title: "Hawa Mahal",
          type: "Monument",
          area: "Pink City",
          duration: 60,
          notes: "First light on the facade is everything — the sandstone turns a deep rose-pink that no photograph fully captures. Arrive at 7:30 if possible.",
          description: "The Palace of Winds — Jaipur's most iconic structure with 953 ornate latticed windows."
        },
        {
          time: "09:30",
          title: "City Palace",
          type: "Palace / Museum",
          area: "Pink City",
          duration: 120,
          notes: "Your City Palace ticket includes the Maharaja Sawai Man Singh II Museum. The silver urns in Diwan-e-Khas — used to carry Ganges water to London for a royal visit — are a world record entry at over 300kg each.",
          description: "A living royal palace of extraordinary scale, presently occupied by the descendants of the Maharaja of Jaipur."
        },
        {
          time: "11:30",
          title: "Jantar Mantar",
          type: "UNESCO Observatory",
          area: "Pink City",
          duration: 75,
          notes: "Book an official guide in advance for maximum insight. The 90-minute tour transforms these stone instruments from curiosities to revelations.",
          description: "A UNESCO World Heritage observatory — 19 architectural instruments measuring time, latitude, and celestial positions with extraordinary accuracy."
        },
        {
          time: "16:00",
          title: "Johari Bazaar",
          type: "Market",
          area: "Pink City",
          duration: 120,
          notes: "The best gem deals require patience and knowledge — visit multiple shops, compare prices, and don't buy on the first approach. Kundan and Meenakari jewellery are the Jaipur specialties unique to this city.",
          description: "The legendary gem market of Jaipur — since the city was founded, the world's finest gems have passed through these lanes."
        }
      ]
    },
    {
      day: 2,
      title: "The Fort Triangle",
      overview: "Three magnificent fortresses on a single ridge — one of India's most dramatic heritage routes.",
      stops: [
        {
          time: "08:00",
          title: "Amber Fort",
          type: "Fort",
          area: "Amer",
          duration: 120,
          notes: "Spend the full two hours — the exit through the Suraj Pol gate reveals a great view back to the fort rising above Maota lake. Don't rush the Sheesh Mahal.",
          description: "The crown of Rajput architecture — a hilltop palace-fortress of red sandstone, marble, and ten thousand mirror-studded walls."
        },
        {
          time: "10:30",
          title: "Jaigarh Fort",
          type: "Fort",
          area: "Amer",
          duration: 90,
          notes: "Connected to Amber by a walled pathway through the hills. The fort is also home to an extensive armoury museum — cannons, swords, and armour that tell the story of Rajput military power.",
          description: "The guardian fortress above Amber — housing the world's largest wheeled cannon, never fired in war."
        },
        {
          time: "14:00",
          title: "Nahargarh Fort",
          type: "Fort",
          area: "Aravallis",
          duration: 90,
          notes: "The Madhavendra Bhawan inside Nahargarh is an architectural puzzle — a palace of identical suites built for nine queens, connected by a central corridor that gave the Maharaja access to each. The wax museum attached is a bonus for families.",
          description: "Sunset stronghold — Nahargarh's ramparts offer the most breathtaking panoramic view in Jaipur."
        },
        {
          time: "17:30",
          title: "Jal Mahal",
          type: "Viewpoint",
          area: "Amer Road",
          duration: 45,
          notes: "End your fort day at the water palace as the sun disappears behind the Aravallis and the lake turns silver. The roadside sunset here is one of the most mesmerising in Rajasthan.",
          description: "The floating water palace of Man Sagar Lake — a magical silhouette against the Amer sunset sky."
        }
      ]
    },
    {
      day: 3,
      title: "Art, Culture & Hidden Gems",
      overview: "Jaipur's quieter cultural dimension — museums, sacred sites, and the architectural marvels most visitors never find.",
      stops: [
        {
          time: "09:00",
          title: "Albert Hall Museum",
          type: "Museum",
          area: "New City",
          duration: 120,
          notes: "The Persian carpet alone is worth an hour — one of the world's great textile masterpieces, with 5.5 million knots per square meter. The Egyptian mummy and the royal armour gallery complete the essential visit.",
          description: "Rajasthan's oldest museum — an Indo-Saracenic treasure house of art, history, natural specimens, and one very famous mummy."
        },
        {
          time: "11:30",
          title: "Patrika Gate",
          type: "Landmark",
          area: "Jawahar Circle",
          duration: 45,
          notes: "Built to celebrate Jaipur's 75th anniversary as a planned city — nine arches painted with the nine stories of Rajasthani art and culture. Best photographed in early morning or late afternoon light.",
          description: "A spectacular painted gateway — nine vaulted arches celebrating the heritage of Rajasthan in vivid colour."
        },
        {
          time: "14:00",
          title: "Galtaji Temple",
          type: "Temple",
          area: "Aravallis",
          duration: 90,
          notes: "The trek through the narrow limestone gorge is part of the experience. Sacred natural springs feed five kunds (tanks) with fresh water year-round — pilgrims still bathe here daily as they have for centuries.",
          description: "An ancient pilgrimage site tucked into a dramatic limestone gorge in the Aravalli hills — sacred, wild, and utterly memorable."
        },
        {
          time: "16:00",
          title: "Sisodia Rani Garden",
          type: "Garden",
          area: "Agra Road",
          duration: 75,
          notes: "A quiet Mughal garden that rewards slow exploration — each terrace reveals a different fountain garden. The murals around the pavilion depict the Raas Leela (Krishna's dance) in remarkable detail.",
          description: "A romantic 18th-century terraced garden built for the queen of Sisodia — fountains, pavilions, and extraordinary Krishna murals."
        }
      ]
    },
    {
      day: 4,
      title: "Excursion Day",
      overview: "Choose your perfect day excursion from Jaipur — each destination within easy reach by car.",
      stops: [],
      options: [
        {
          destination: "Chand Baori (Abhaneri)",
          driveTime: 2
        },
        {
          destination: "Sambhar Lake",
          driveTime: 1.5
        },
        {
          destination: "Elephant Experience (Elefantastic)",
          driveTime: 0.5
        },
        {
          destination: "Samode Palace",
          driveTime: 1
        }
      ]
    }
  ]
};

export const COORDS: Record<string, [number, number]> = {
  "Amber Fort": [26.9855, 75.8513],
  "Hawa Mahal": [26.9239, 75.8267],
  "City Palace": [26.9258, 75.8237],
  "Jantar Mantar": [26.9247, 75.8245],
  "Albert Hall Museum": [26.9114, 75.8197],
  "Jal Mahal": [26.9534, 75.8462],
  "Nahargarh Fort": [26.9372, 75.8154],
  "Jaigarh Fort": [26.9427, 75.8480],
  "Chokhi Dhani": [26.7996, 75.8214],
  "Galta Ji (Monkey Temple)": [26.9072, 75.8578],
  "Galtaji Temple": [26.9072, 75.8578],
  "Sisodia Rani Ka Bagh": [26.8642, 75.8714],
  "Sisodia Rani Garden": [26.8642, 75.8714],
  "Johari Bazaar": [26.9234, 75.8256],
  "Bapu Bazaar": [26.9186, 75.8247],
  "Panna Meena Ka Kund": [26.9833, 75.8523],
  "Panna Meena ka Kund": [26.9833, 75.8523],
  "Pink City Highlights (Hawa Mahal, City Palace, Jantar Mantar)": [26.9247, 75.8245],
  "Amer Fort & Panna Meena ka Kund": [26.9855, 75.8513],
  "Patrika Gate": [26.8528, 75.8058],
  "Central Park": [26.9037, 75.8080],
  "Local Bazaar Walk": [26.9234, 75.8256],
  "Lunch": [26.9227, 75.8245],
  "Chand Baori (Abhaneri)": [27.0071, 76.6063],
  "Sambhar Lake": [26.9167, 75.1667],
  "Elephant Experience (Elefantastic)": [26.9612, 75.8289],
  "Samode Palace": [27.3015, 75.8154],
  "World Trade Park": [26.9139, 75.7966],
  "Gaurav Tower": [26.9151, 75.7995],
  "Jawahar Circle": [26.9126, 75.8085],
  "Masala Chowk": [26.9167, 75.8301],
};
