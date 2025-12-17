import { type User, type InsertUser, type City, type InsertCity, type Location, type InsertLocation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCities(): Promise<City[]>;
  getCity(id: string): Promise<City | undefined>;
  createCity(city: InsertCity): Promise<City>;
  
  getLocations(cityId?: string): Promise<Location[]>;
  getLocation(id: string): Promise<Location | undefined>;
  getLocationsByCategory(cityId: string, category: string): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;
  searchLocations(cityId: string, query: string): Promise<Location[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private cities: Map<string, City>;
  private locations: Map<string, Location>;

  constructor() {
    this.users = new Map();
    this.cities = new Map();
    this.locations = new Map();
    
    this.seedData();
  }

  private seedData() {
    const jaipurId = "jaipur-001";
    const jaipur: City = {
      id: jaipurId,
      name: "Jaipur",
      country: "India",
      description: "The Pink City - Known for its stunning palaces, vibrant bazaars, and rich Rajasthani heritage",
      imageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
      latitude: 26.9124,
      longitude: 75.7873,
      isDefault: true
    };
    this.cities.set(jaipurId, jaipur);

    const delhiId = "delhi-001";
    const delhi: City = {
      id: delhiId,
      name: "Delhi",
      country: "India",
      description: "The heart of India - Where ancient history meets modern ambition",
      imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
      latitude: 28.6139,
      longitude: 77.2090,
      isDefault: false
    };
    this.cities.set(delhiId, delhi);

    const udaipurId = "udaipur-001";
    const udaipur: City = {
      id: udaipurId,
      name: "Udaipur",
      country: "India",
      description: "The City of Lakes - Romantic palaces rising from shimmering waters",
      imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
      latitude: 24.5854,
      longitude: 73.7125,
      isDefault: false
    };
    this.cities.set(udaipurId, udaipur);

    const jaipurLocations: Omit<Location, 'id'>[] = [
      {
        name: "Amber Fort",
        description: "Amber Fort, also known as Amer Fort, is a magnificent fortress complex that sits atop a hill overlooking Maota Lake. Built in red sandstone and marble, this UNESCO World Heritage Site exemplifies the perfect blend of Hindu and Mughal architecture. The fort features stunning artistic elements including the famous Sheesh Mahal (Mirror Palace), Diwan-i-Aam (Hall of Public Audience), and the beautiful Sukh Niwas with its ivory doors.",
        shortDescription: "Majestic hilltop fortress with stunning Rajput architecture",
        category: "history",
        cityId: jaipurId,
        latitude: 26.9855,
        longitude: 75.8513,
        imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
        gallery: [
          "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400",
          "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400"
        ],
        rating: 4.7,
        reviewCount: 45234,
        openingHours: "8:00 AM",
        closingHours: "5:30 PM",
        entryFee: "INR 500 (Foreigners), INR 100 (Indians)",
        address: "Devisinghpura, Amer, Jaipur, Rajasthan 302001",
        phone: "+91 141 253 0293",
        website: "https://www.rajasthantourism.gov.in",
        tags: ["UNESCO", "Fort", "Rajput Architecture", "Photography", "Must Visit"],
        isFeatured: true
      },
      {
        name: "Hawa Mahal",
        description: "Hawa Mahal, or the 'Palace of Winds', is Jaipur's most iconic landmark. Built in 1799 by Maharaja Sawai Pratap Singh, this five-story pink sandstone structure features 953 small windows decorated with intricate latticework. The unique honeycomb design was created to allow royal women to observe street festivals and daily life without being seen from outside.",
        shortDescription: "Iconic pink palace with 953 ornate windows",
        category: "history",
        cityId: jaipurId,
        latitude: 26.9239,
        longitude: 75.8267,
        imageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
        gallery: [
          "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400",
          "https://images.unsplash.com/photo-1558431382-27e303142255?w=400"
        ],
        rating: 4.5,
        reviewCount: 38562,
        openingHours: "9:00 AM",
        closingHours: "4:30 PM",
        entryFee: "INR 200 (Foreigners), INR 50 (Indians)",
        address: "Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Jaipur 302002",
        phone: "+91 141 261 8862",
        website: null,
        tags: ["Landmark", "Architecture", "Photography", "Iconic"],
        isFeatured: true
      },
      {
        name: "City Palace",
        description: "The City Palace is a stunning complex of courtyards, gardens, and buildings in the heart of the old city. Built by Maharaja Sawai Jai Singh II, this palace blends Rajasthani and Mughal architecture. It houses the Chandra Mahal (still a royal residence), Mubarak Mahal, Maharani's Palace, and several museums displaying royal costumes, armory, and paintings.",
        shortDescription: "Royal palace complex with museums and royal artifacts",
        category: "history",
        cityId: jaipurId,
        latitude: 26.9258,
        longitude: 75.8237,
        imageUrl: "https://images.unsplash.com/photo-1574767722061-9b9d5eb5d3f5?w=800",
        gallery: [],
        rating: 4.6,
        reviewCount: 28945,
        openingHours: "9:30 AM",
        closingHours: "5:00 PM",
        entryFee: "INR 700 (Foreigners), INR 200 (Indians)",
        address: "Tripolia Bazar, near Jantar Mantar, Jaipur 302002",
        phone: "+91 141 408 8888",
        website: "https://www.royaljaipur.com",
        tags: ["Palace", "Museum", "Royal Heritage", "Architecture"],
        isFeatured: true
      },
      {
        name: "Jantar Mantar",
        description: "Jantar Mantar is the largest of five astronomical observation sites built by Maharaja Sawai Jai Singh II. This UNESCO World Heritage Site contains 19 architectural astronomical instruments including the world's largest stone sundial. The instruments were used to observe celestial positions with the naked eye and remain surprisingly accurate even today.",
        shortDescription: "UNESCO World Heritage astronomical observation site",
        category: "history",
        cityId: jaipurId,
        latitude: 26.9247,
        longitude: 75.8245,
        imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
        gallery: [],
        rating: 4.4,
        reviewCount: 15678,
        openingHours: "9:00 AM",
        closingHours: "4:30 PM",
        entryFee: "INR 200 (Foreigners), INR 50 (Indians)",
        address: "Gangori Bazaar, J.D.A. Market, Pink City, Jaipur 302002",
        phone: "+91 141 261 0494",
        website: null,
        tags: ["UNESCO", "Science", "Astronomy", "Architecture"],
        isFeatured: false
      },
      {
        name: "Albert Hall Museum",
        description: "Albert Hall Museum is the oldest museum in Rajasthan, located in Ram Niwas Garden. Built in Indo-Saracenic style, this grand building houses an extensive collection of artifacts including paintings, sculptures, textiles, and the famous Egyptian mummy. The museum is especially beautiful when illuminated at night.",
        shortDescription: "Rajasthan's oldest museum with diverse collections",
        category: "history",
        cityId: jaipurId,
        latitude: 26.9114,
        longitude: 75.8197,
        imageUrl: "https://images.unsplash.com/photo-1587399425506-4aca6fd2a4e5?w=800",
        gallery: [],
        rating: 4.3,
        reviewCount: 12456,
        openingHours: "9:00 AM",
        closingHours: "5:00 PM",
        entryFee: "INR 300 (Foreigners), INR 40 (Indians)",
        address: "Museum Road, Ram Niwas Garden, Jaipur 302004",
        phone: "+91 141 257 0099",
        website: null,
        tags: ["Museum", "Art", "History", "Night Visit"],
        isFeatured: false
      },
      {
        name: "Jal Mahal",
        description: "Jal Mahal, or the 'Water Palace', appears to float serenely in the middle of Man Sagar Lake. This 18th-century palace combines Rajput and Mughal architectural styles. While the palace itself is not open to visitors, the surrounding lake and gardens offer spectacular photo opportunities, especially at sunset when the palace is beautifully reflected in the waters.",
        shortDescription: "Stunning water palace floating on Man Sagar Lake",
        category: "history",
        cityId: jaipurId,
        latitude: 26.9534,
        longitude: 75.8462,
        imageUrl: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800",
        gallery: [],
        rating: 4.5,
        reviewCount: 23456,
        openingHours: "Open 24 hours",
        closingHours: null,
        entryFee: "Free (Viewpoint only)",
        address: "Amer Road, Jaipur, Rajasthan 302002",
        phone: null,
        website: null,
        tags: ["Lake", "Photography", "Sunset", "Architecture"],
        isFeatured: true
      },
      {
        name: "Nahargarh Fort",
        description: "Nahargarh Fort stands on the edge of the Aravalli Hills, offering breathtaking panoramic views of Jaipur city. Built in 1734, the fort was part of the city's defense ring. Today, it's famous for its stunning sunset views and the newly developed sculpture park. The fort also houses a wax museum and offers excellent dining options with a view.",
        shortDescription: "Hilltop fort with panoramic city views",
        category: "history",
        cityId: jaipurId,
        latitude: 26.9372,
        longitude: 75.8154,
        imageUrl: "https://images.unsplash.com/photo-1598441916403-05e9c52a6855?w=800",
        gallery: [],
        rating: 4.4,
        reviewCount: 18234,
        openingHours: "10:00 AM",
        closingHours: "5:30 PM",
        entryFee: "INR 200 (Foreigners), INR 50 (Indians)",
        address: "Krishna Nagar, Brahampuri, Jaipur 302002",
        phone: "+91 141 518 6007",
        website: null,
        tags: ["Fort", "Sunset", "Views", "Photography"],
        isFeatured: false
      },
      {
        name: "Laxmi Mishthan Bhandar (LMB)",
        description: "Established in 1727, LMB is one of Jaipur's most legendary restaurants and sweet shops. Famous for its authentic Rajasthani thali, the restaurant serves traditional vegetarian cuisine in an elegant heritage setting. Their ghevar, paneer ghevar, and pyaaz kachori are legendary. The sweet shop section offers an incredible variety of traditional Indian sweets.",
        shortDescription: "Legendary heritage restaurant famous for Rajasthani thali",
        category: "food",
        cityId: jaipurId,
        latitude: 26.9227,
        longitude: 75.8245,
        imageUrl: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800",
        gallery: [],
        rating: 4.5,
        reviewCount: 8934,
        openingHours: "8:00 AM",
        closingHours: "11:00 PM",
        entryFee: null,
        address: "Johari Bazaar, Jaipur 302003",
        phone: "+91 141 256 5844",
        website: "https://www.laxmimishtanbhandar.com",
        tags: ["Restaurant", "Sweets", "Rajasthani", "Heritage"],
        isFeatured: true
      },
      {
        name: "Rawat Mishtan Bhandar",
        description: "Rawat is famous throughout India for its legendary pyaaz kachori - a crispy, spiced onion-filled pastry. This no-frills establishment has been serving some of Jaipur's best street food since 1954. Beyond the kachori, try their samosas, mirchi vadas, and extensive selection of traditional sweets. Best visited for a quick breakfast or snack.",
        shortDescription: "Famous for the best pyaaz kachori in Jaipur",
        category: "food",
        cityId: jaipurId,
        latitude: 26.9172,
        longitude: 75.8036,
        imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800",
        gallery: [],
        rating: 4.6,
        reviewCount: 12567,
        openingHours: "6:30 AM",
        closingHours: "10:00 PM",
        entryFee: null,
        address: "Station Road, Sindhi Camp, Jaipur 302001",
        phone: "+91 141 262 2690",
        website: null,
        tags: ["Street Food", "Kachori", "Snacks", "Local Favorite"],
        isFeatured: true
      },
      {
        name: "Masala Chowk",
        description: "Masala Chowk is Jaipur's premier food court dedicated to street food and local cuisine. Located near Ram Niwas Garden, this open-air food court brings together over 20 stalls offering everything from dal baati churma to kulfi, chaat to tandoori delights. It's a hygienic, tourist-friendly way to sample Jaipur's diverse street food culture.",
        shortDescription: "Open-air food court with diverse street food stalls",
        category: "food",
        cityId: jaipurId,
        latitude: 26.9098,
        longitude: 75.8199,
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
        gallery: [],
        rating: 4.2,
        reviewCount: 5678,
        openingHours: "3:00 PM",
        closingHours: "11:00 PM",
        entryFee: null,
        address: "Ram Niwas Garden, Jaipur 302004",
        phone: null,
        website: null,
        tags: ["Street Food", "Food Court", "Family", "Evening"],
        isFeatured: false
      },
      {
        name: "Johari Bazaar",
        description: "Johari Bazaar is Jaipur's premier jewelry market, famous for precious and semi-precious gems, kundan and meenakari jewelry. This historic market has been the heart of the gem trade since the founding of the city. Beyond jewelry, you'll find beautiful textiles, lac bangles, and authentic Jaipuri crafts. The narrow lanes are lined with centuries-old shops.",
        shortDescription: "Historic jewelry market with gems and traditional crafts",
        category: "shopping",
        cityId: jaipurId,
        latitude: 26.9234,
        longitude: 75.8256,
        imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
        gallery: [],
        rating: 4.4,
        reviewCount: 7856,
        openingHours: "10:00 AM",
        closingHours: "8:00 PM",
        entryFee: null,
        address: "Johari Bazaar, Pink City, Jaipur 302003",
        phone: null,
        website: null,
        tags: ["Jewelry", "Shopping", "Gems", "Traditional"],
        isFeatured: true
      },
      {
        name: "Bapu Bazaar",
        description: "Bapu Bazaar is a vibrant market famous for textiles, fabrics, and mojari (traditional Rajasthani footwear). This colorful bazaar offers everything from block-printed fabrics and bandhani sarees to camel leather goods and handicrafts. It's an excellent place to buy gifts and experience the bustling commerce of the Pink City.",
        shortDescription: "Colorful market for textiles and traditional footwear",
        category: "shopping",
        cityId: jaipurId,
        latitude: 26.9186,
        longitude: 75.8247,
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        gallery: [],
        rating: 4.2,
        reviewCount: 5432,
        openingHours: "10:00 AM",
        closingHours: "8:00 PM",
        entryFee: null,
        address: "M.I. Road, Jaipur 302001",
        phone: null,
        website: null,
        tags: ["Textiles", "Shopping", "Mojari", "Handicrafts"],
        isFeatured: false
      },
      {
        name: "Anokhi Museum of Hand Printing",
        description: "Located in a restored haveli in Amber, this museum celebrates the traditional art of hand block printing. The museum showcases historical printing blocks, textiles, and the evolution of this craft. You can witness artisans at work and participate in block printing workshops. The attached cafe and boutique shop complete the experience.",
        shortDescription: "Museum celebrating traditional hand block printing art",
        category: "culture",
        cityId: jaipurId,
        latitude: 26.9851,
        longitude: 75.8518,
        imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
        gallery: [],
        rating: 4.5,
        reviewCount: 3456,
        openingHours: "10:30 AM",
        closingHours: "5:00 PM",
        entryFee: "INR 30",
        address: "Kheri Gate, Amber, Jaipur 302028",
        phone: "+91 141 253 0226",
        website: "https://www.anokhi.com/museum",
        tags: ["Museum", "Craft", "Workshop", "Art"],
        isFeatured: false
      },
      {
        name: "Jaipur Literature Festival",
        description: "The Jaipur Literature Festival, held annually at Diggi Palace, is the world's largest free literary festival. It brings together acclaimed writers, thinkers, and artists from around the globe for five days of sessions, readings, and cultural performances. The festival attracts over 500,000 visitors and features music, food, and art alongside literary events.",
        shortDescription: "World's largest free literary festival",
        category: "events",
        cityId: jaipurId,
        latitude: 26.9016,
        longitude: 75.8053,
        imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
        gallery: [],
        rating: 4.8,
        reviewCount: 15678,
        openingHours: "10:00 AM",
        closingHours: "8:00 PM",
        entryFee: "Free (Registration required)",
        address: "Diggi Palace, Shivaji Marg, C Scheme, Jaipur 302004",
        phone: "+91 141 237 3091",
        website: "https://jaipurliteraturefestival.org",
        tags: ["Festival", "Literature", "Culture", "Annual"],
        isFeatured: true
      },
      {
        name: "Sisodia Rani Garden",
        description: "Built in the 18th century for the Rajput queen Sisodia, these tiered gardens are a romantic retreat from the city bustle. The Mughal-style garden features multiple levels of fountains, pavilions, and murals depicting scenes from the Krishna legend. The gardens are especially beautiful in the monsoon season when the fountains are at full flow.",
        shortDescription: "Historic Mughal-style terraced gardens",
        category: "nature",
        cityId: jaipurId,
        latitude: 26.8642,
        longitude: 75.8714,
        imageUrl: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800",
        gallery: [],
        rating: 4.1,
        reviewCount: 2345,
        openingHours: "8:00 AM",
        closingHours: "5:00 PM",
        entryFee: "INR 50",
        address: "Ghat Ki Guni, Jaipur 302017",
        phone: null,
        website: null,
        tags: ["Garden", "Nature", "Photography", "Peaceful"],
        isFeatured: false
      },
      {
        name: "Galtaji Temple (Monkey Temple)",
        description: "Galtaji is an ancient Hindu pilgrimage site set in a narrow crevice in the Aravalli Hills. Known locally as the Monkey Temple due to the large tribe of macaques living here, the complex features natural water tanks (kunds) fed by a sacred spring, ancient temples, and pavilions. The climb to the Sun Temple at the top offers stunning views.",
        shortDescription: "Sacred temple complex in the hills with natural springs",
        category: "popular",
        cityId: jaipurId,
        latitude: 26.9072,
        longitude: 75.8578,
        imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
        gallery: [],
        rating: 4.3,
        reviewCount: 6789,
        openingHours: "5:00 AM",
        closingHours: "9:00 PM",
        entryFee: "Free",
        address: "Sri Galta Ji, Jaipur 302002",
        phone: null,
        website: null,
        tags: ["Temple", "Nature", "Pilgrimage", "Adventure"],
        isFeatured: false
      },
      {
        name: "Panna Meena Ka Kund",
        description: "This stunning 16th-century stepwell near Amber Fort is one of India's most photogenic structures. The geometric pattern created by the crisscrossing stairs is architecturally unique and visually mesmerizing. Unlike the more famous Chand Baori, this stepwell receives fewer tourists, making it perfect for photography and peaceful contemplation.",
        shortDescription: "Stunning geometric stepwell near Amber Fort",
        category: "hidden",
        cityId: jaipurId,
        latitude: 26.9833,
        longitude: 75.8523,
        imageUrl: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800",
        gallery: [],
        rating: 4.6,
        reviewCount: 4567,
        openingHours: "6:00 AM",
        closingHours: "6:00 PM",
        entryFee: "Free",
        address: "Near Amber Fort, Amer, Jaipur 302001",
        phone: null,
        website: null,
        tags: ["Stepwell", "Architecture", "Photography", "Off-beat"],
        isFeatured: true
      },
      {
        name: "Elefantastic",
        description: "A responsible elephant sanctuary where you can interact with rescued elephants in an ethical, safe environment. Activities include feeding, bathing, painting with elephants, and walking alongside these gentle giants. The sanctuary prioritizes elephant welfare and provides a meaningful alternative to traditional elephant rides.",
        shortDescription: "Ethical elephant sanctuary experience",
        category: "hidden",
        cityId: jaipurId,
        latitude: 26.9612,
        longitude: 75.8289,
        imageUrl: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800",
        gallery: [],
        rating: 4.7,
        reviewCount: 3456,
        openingHours: "9:00 AM",
        closingHours: "5:00 PM",
        entryFee: "Varies by package",
        address: "Village Kukas, Jaipur-Amer Road, Jaipur 303101",
        phone: "+91 98280 24250",
        website: "https://www.elefantastic.com",
        tags: ["Animals", "Ethical", "Experience", "Family"],
        isFeatured: false
      },
      {
        name: "Chokhi Dhani",
        description: "Chokhi Dhani is an ethnic village resort that recreates the traditional Rajasthani village experience. Spread across 10 acres, this cultural theme park offers traditional dining, folk performances, puppet shows, camel and elephant rides, magic shows, and artisan demonstrations. It's an immersive way to experience Rajasthani culture in one evening.",
        shortDescription: "Cultural village with authentic Rajasthani experiences",
        category: "culture",
        cityId: jaipurId,
        latitude: 26.7996,
        longitude: 75.8214,
        imageUrl: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800",
        gallery: [],
        rating: 4.3,
        reviewCount: 12345,
        openingHours: "5:00 PM",
        closingHours: "11:00 PM",
        entryFee: "INR 1100 (with dinner)",
        address: "12 Mile, Tonk Road, Sitapura, Jaipur 302029",
        phone: "+91 141 277 0555",
        website: "https://www.chokhidhani.com",
        tags: ["Culture", "Dining", "Entertainment", "Family"],
        isFeatured: true
      },
      {
        name: "Birla Mandir",
        description: "Also known as Laxmi Narayan Temple, this stunning white marble temple sits at the base of Moti Dungri hill. Built by the Birla family in 1988, the temple is dedicated to Lord Vishnu and Goddess Laxmi. The temple is beautifully lit at night and offers panoramic views of the city from its elevated position.",
        shortDescription: "Stunning white marble temple with city views",
        category: "popular",
        cityId: jaipurId,
        latitude: 26.8922,
        longitude: 75.8160,
        imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        gallery: [],
        rating: 4.5,
        reviewCount: 8765,
        openingHours: "6:00 AM",
        closingHours: "12:00 PM, 3:00 PM - 9:00 PM",
        entryFee: "Free",
        address: "Jawahar Lal Nehru Marg, Tilak Nagar, Jaipur 302004",
        phone: null,
        website: null,
        tags: ["Temple", "Architecture", "Night Visit", "Peaceful"],
        isFeatured: false
      }
    ];

    jaipurLocations.forEach((loc, index) => {
      const id = `loc-jaipur-${String(index + 1).padStart(3, '0')}`;
      this.locations.set(id, { ...loc, id } as Location);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCities(): Promise<City[]> {
    return Array.from(this.cities.values());
  }

  async getCity(id: string): Promise<City | undefined> {
    return this.cities.get(id);
  }

  async createCity(insertCity: InsertCity): Promise<City> {
    const id = randomUUID();
    const city: City = { ...insertCity, id };
    this.cities.set(id, city);
    return city;
  }

  async getLocations(cityId?: string): Promise<Location[]> {
    const allLocations = Array.from(this.locations.values());
    if (cityId) {
      return allLocations.filter(loc => loc.cityId === cityId);
    }
    return allLocations;
  }

  async getLocation(id: string): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async getLocationsByCategory(cityId: string, category: string): Promise<Location[]> {
    return Array.from(this.locations.values()).filter(
      loc => loc.cityId === cityId && loc.category === category
    );
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = randomUUID();
    const location: Location = { ...insertLocation, id };
    this.locations.set(id, location);
    return location;
  }

  async searchLocations(cityId: string, query: string): Promise<Location[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.locations.values()).filter(loc => 
      loc.cityId === cityId && (
        loc.name.toLowerCase().includes(lowerQuery) ||
        loc.description.toLowerCase().includes(lowerQuery) ||
        loc.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    );
  }
}

export const storage = new MemStorage();
