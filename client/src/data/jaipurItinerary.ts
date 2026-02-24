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
      title: "Pink City + Amer Highlights",
      overview: "Essential Jaipur highlights covering Pink City and Amer side.",
      stops: [
        {
          time: "08:00-09:00",
          title: "Hawa Mahal",
          type: "Monument",
          area: "Pink City",
          duration: 45,
          notes: "Best visited early morning for facade lighting and fewer crowds.",
          description: "Iconic pink palace with 953 ornate windows."
        },
        {
          time: "09:00-11:00",
          title: "City Palace",
          type: "Palace/Museum",
          area: "Pink City",
          duration: 120,
          notes: "Explore courtyards and museum galleries.",
          description: "Royal palace complex with museums and royal artifacts."
        },
        {
          time: "11:00-12:00",
          title: "Jantar Mantar",
          type: "UNESCO Observatory",
          area: "Pink City",
          duration: 60,
          notes: "Ancient astronomical instruments.",
          description: "UNESCO World Heritage astronomical observation site."
        },
        {
          time: "13:00-14:00",
          title: "Lunch",
          type: "Activity",
          area: "Pink City",
          notes: "Traditional Rajasthani cuisine recommended.",
          description: "Authentic local food experience."
        },
        {
          time: "15:00-17:00",
          title: "Amer Fort",
          type: "Fort",
          area: "Amer",
          duration: 120,
          notes: "Visit Sheesh Mahal and main courtyards.",
          description: "Majestic hilltop fortress with stunning Rajput architecture."
        },
        {
          time: "17:30-18:00",
          title: "Jal Mahal",
          type: "Lake Viewpoint",
          area: "Amer Road",
          duration: 30,
          notes: "Sunset photo stop.",
          description: "Stunning water palace floating on Man Sagar Lake."
        }
      ]
    }
  ],

  /* ===================== 2 DAYS ===================== */
  2: [
    {
      day: 1,
      title: "Pink City + Amer",
      stops: [
        {
          time: "08:00-12:00",
          title: "Pink City Highlights (Hawa Mahal, City Palace, Jantar Mantar)",
          area: "Pink City",
          description: "Exploring the core landmarks of the historic Pink City."
        },
        {
          time: "14:00-17:00",
          title: "Amer Fort & Panna Meena ka Kund",
          area: "Amer",
          description: "Majestic fortress and a stunning historic stepwell."
        },
        {
          time: "17:30-19:00",
          title: "Nahargarh Fort",
          type: "Fort",
          notes: "Best sunset viewpoint of Jaipur.",
          description: "Hilltop fort with panoramic city views."
        }
      ]
    },
    {
      day: 2,
      title: "Fort Chain + Culture",
      stops: [
        {
          time: "08:30-10:30",
          title: "Jaigarh Fort",
          type: "Fort",
          description: "Historical military fort with the world's largest cannon on wheels."
        },
        {
          time: "11:00-11:30",
          title: "Jal Mahal",
          type: "Photo Stop",
          description: "Stop for photography at the beautiful water palace."
        },
        {
          time: "14:00-16:00",
          title: "Albert Hall Museum",
          type: "Museum",
          description: "Rajasthan's oldest museum with diverse collections."
        },
        {
          time: "17:00-19:00",
          title: "Johari Bazaar",
          type: "Market",
          notes: "Shopping and street exploration.",
          description: "Historic jewelry market with gems and traditional crafts."
        }
      ]
    }
  ],

  /* ===================== 3 DAYS ===================== */
  3: [
    {
      day: 1,
      title: "Pink City Core",
      stops: [
        { title: "Hawa Mahal", description: "The Palace of Winds." },
        { title: "City Palace", description: "Royal heritage museum." },
        { title: "Jantar Mantar", description: "UNESCO observatory." },
        { title: "Local Bazaar Walk", description: "Explore traditional markets." }
      ]
    },
    {
      day: 2,
      title: "Fort Circuit",
      stops: [
        { title: "Amer Fort", description: "Main fortress visit." },
        { title: "Jaigarh Fort", description: "Military history and views." },
        { title: "Nahargarh Fort", description: "Panoramic sunset point." },
        { title: "Jal Mahal", description: "Water palace photo stop." }
      ]
    },
    {
      day: 3,
      title: "Culture & Gardens",
      stops: [
        { title: "Albert Hall Museum", description: "Classical museum visit." },
        { title: "Patrika Gate", description: "Colorful iconic entrance." },
        { title: "Galtaji Temple", description: "Monkey Temple in the hills." },
        { title: "Sisodia Rani Garden", description: "Royal terraced gardens." },
        { title: "Central Park", description: "Evening stroll in the city's lungs." }
      ]
    }
  ],

  /* ===================== 4 DAYS ===================== */
  4: [
    {
      day: 1,
      title: "Pink City",
      stops: [
        { title: "Hawa Mahal", description: "Morning landmark visit." },
        { title: "City Palace", description: "Palace and museum exploration." },
        { title: "Jantar Mantar", description: "Historical astronomy." },
        { title: "Johari Bazaar", description: "Shopping for gems and jewelry." }
      ]
    },
    {
      day: 2,
      title: "Forts",
      stops: [
        { title: "Amer Fort", description: "Explore the hilltop fortress." },
        { title: "Jaigarh Fort", description: "Visit the massive cannon." },
        { title: "Nahargarh Fort", description: "Sunset over the Pink City." },
        { title: "Jal Mahal", description: "Lakeside views." }
      ]
    },
    {
      day: 3,
      title: "Cultural Sites",
      stops: [
        { title: "Albert Hall Museum", description: "Art and history." },
        { title: "Patrika Gate", description: "Beautifully painted gateway." },
        { title: "Galtaji Temple", description: "Ancient pilgrimage site." },
        { title: "Sisodia Rani Garden", description: "Historic royal garden." }
      ]
    },
    {
      day: 4,
      title: "Excursion Options",
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
  "Pink City Highlights (Hawa Mahal, City Palace, Jantar Mantar)": [26.9247, 75.8245], // Center of these
  "Amer Fort & Panna Meena ka Kund": [26.9855, 75.8513],
  "Patrika Gate": [26.8528, 75.8058],
  "Central Park": [26.9037, 75.8080],
  "Local Bazaar Walk": [26.9234, 75.8256],
  "Lunch": [26.9227, 75.8245], // Assuming LMB location as center for lunch
  "Chand Baori (Abhaneri)": [27.0071, 76.6063],
  "Sambhar Lake": [26.9167, 75.1667],
  "Elephant Experience (Elefantastic)": [26.9612, 75.8289],
  "Samode Palace": [27.3015, 75.8154],
  "World Trade Park": [26.9139, 75.7966],
  "Gaurav Tower": [26.9151, 75.7995],
  "Jawahar Circle": [26.9126, 75.8085],
  "Masala Chowk": [26.9167, 75.8301],
};
