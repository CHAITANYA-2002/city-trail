export type ItineraryStop = {
  time: string;
  title: string;
  description: string;
};

export type DayItinerary = {
  day: number;
  title: string;
  stops: ItineraryStop[];
};

export const JAIPUR_ITINERARY: Record<number, DayItinerary[]> = {
  /* ===================== 1 DAY ===================== */
  1: [
    {
      day: 1,
      title: "Jaipur in One Day",
      stops: [
        { time: "7:30 AM", title: "Amber Fort", description: "Explore Amber Fort early (2 hrs)." },
        { time: "9:30 AM", title: "Panna Meena Ka Kund", description: "Stepwell visit (30 mins)." },
        { time: "10:30 AM", title: "Jal Mahal", description: "Quick photo stop (15 mins)." },
        { time: "11:00 AM", title: "City Palace & Jantar Mantar", description: "Royal palace & observatory (2 hrs)." },
        { time: "1:00 PM", title: "Lunch – LMB", description: "Rajasthani thali." },
        { time: "2:30 PM", title: "Hawa Mahal", description: "Palace of Winds (30 mins)." },
        { time: "3:30 PM", title: "Johari & Bapu Bazaar", description: "Shopping time (1 hr)." },
        { time: "5:00 PM", title: "Nahargarh Fort", description: "Sunset views." },
        { time: "7:00 PM", title: "Dinner – Peacock / Handi", description: "Rooftop dining." },
      ],
    },
  ],

  /* ===================== 2 DAYS ===================== */
  2: [
    {
      day: 1,
      title: "Historic Jaipur",
      stops: [
        { time: "7:30 AM", title: "Amber Fort", description: "Morning fort visit." },
        { time: "9:30 AM", title: "Panna Meena Ka Kund", description: "Historic stepwell." },
        { time: "10:30 AM", title: "Jal Mahal", description: "Photography stop." },
        { time: "11:00 AM", title: "City Palace & Jantar Mantar", description: "Heritage exploration." },
        { time: "1:00 PM", title: "Lunch – LMB", description: "Local cuisine." },
        { time: "2:30 PM", title: "Hawa Mahal", description: "Iconic landmark." },
        { time: "5:00 PM", title: "Nahargarh Fort", description: "Sunset viewpoint." },
      ],
    },
    {
      day: 2,
      title: "Culture & Spirituality",
      stops: [
        { time: "8:00 AM", title: "Jaigarh Fort", description: "Military fort & views." },
        { time: "10:00 AM", title: "Sisodia Rani Ka Bagh", description: "Garden palace." },
        { time: "12:30 PM", title: "Lunch – Govindam Retreat", description: "Satvik food." },
        { time: "2:00 PM", title: "Galta Ji (Monkey Temple)", description: "Spiritual site." },
        { time: "4:00 PM", title: "Tapri Central", description: "Tea & leisure." },
        { time: "7:00 PM", title: "Chokhi Dhani", description: "Cultural dinner." },
      ],
    },
  ],

  /* ===================== 3 DAYS ===================== */
  3: [
    {
      day: 1,
      title: "Forts & Views",
      stops: [
        { time: "8:00 AM", title: "Amber Fort", description: "Fort exploration." },
        { time: "10:30 AM", title: "Panna Meena Ka Kund", description: "Stepwell visit." },
        { time: "12:00 PM", title: "Jaigarh Fort", description: "Cannon & views." },
        { time: "4:30 PM", title: "Nahargarh Fort", description: "Sunset café." },
      ],
    },
    {
      day: 2,
      title: "City Heritage",
      stops: [
        { time: "9:00 AM", title: "Hawa Mahal", description: "Morning visit." },
        { time: "10:00 AM", title: "City Palace", description: "Museum & palace." },
        { time: "12:00 PM", title: "Jantar Mantar", description: "Astronomy site." },
        { time: "4:00 PM", title: "Albert Hall Museum", description: "Historic museum." },
        { time: "6:30 PM", title: "Patrika Gate", description: "Photo spot." },
      ],
    },
    {
      day: 3,
      title: "Leisure & Culture",
      stops: [
        { time: "9:00 AM", title: "Jawahar Circle", description: "Morning walk." },
        { time: "11:00 AM", title: "Sisodia Rani Ka Bagh", description: "Garden palace." },
        { time: "2:00 PM", title: "Galta Ji", description: "Temple complex." },
        { time: "7:00 PM", title: "Chokhi Dhani", description: "Cultural night." },
      ],
    },
  ],

  /* ===================== 4 DAYS ===================== */
  4: [
    {
      day: 1,
      title: "City Palace Circuit",
      stops: [
        { time: "9:00 AM", title: "City Palace", description: "Royal complex." },
        { time: "11:00 AM", title: "Jantar Mantar", description: "Astronomical marvel." },
        { time: "4:00 PM", title: "Albert Hall Museum", description: "Evening visit." },
      ],
    },
    {
      day: 2,
      title: "Forts of Jaipur",
      stops: [
        { time: "8:00 AM", title: "Amber Fort", description: "Major fort." },
        { time: "11:00 AM", title: "Jaigarh Fort", description: "Historic cannons." },
        { time: "4:30 PM", title: "Nahargarh Fort", description: "Sunset views." },
      ],
    },
    {
      day: 3,
      title: "Gardens & Temples",
      stops: [
        { time: "9:00 AM", title: "Sisodia Rani Ka Bagh", description: "Garden palace." },
        { time: "12:00 PM", title: "Galta Ji", description: "Monkey Temple." },
        { time: "6:00 PM", title: "Masala Chowk", description: "Street food." },
      ],
    },
    {
      day: 4,
      title: "Day Trip & Shopping",
      stops: [
        { time: "9:00 AM", title: "Bapu Bazaar", description: "Textiles, handicrafts & local souvenirs." },
        { time: "11:00 AM", title: "World Trade Park", description: "Modern mall with shopping and cafes." },
        { time: "1:00 PM", title: "Gaurav Tower", description: "Browse local stores and lunch options." },
        { time: "3:00 PM", title: "Jawahar Circle", description: "Relax in the park and enjoy nearby cafes." },
        { time: "7:30 PM", title: "Chokhi Dhani", description: "Traditional Rajasthani dinner and cultural performances." },
      ],
    },

  ],
};
