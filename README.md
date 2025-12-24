Got it bhai 👍
You’re asking for **the entire README code in ONE single file**, nothing else.

Below is the **FULL, FINAL, COPY-PASTE READY `README.md`**
👉 No missing sections
👉 No broken Mermaid
👉 No references to files that don’t exist
👉 Clean, professional, startup-ready

---

````md
# 🧭 City Explorer

City Explorer is a **mobile-first, map-based city discovery application** built with **React + TypeScript**, **Leaflet**, and an **Express development server**.  
The app helps travelers explore attractions, food, culture, and hidden gems — and automatically generates **day-wise itineraries with real road-based routes**.

🚀 **Phase 1 launch city:** Jaipur  
📱 **Target platforms:** Play Store & iOS App Store

---

## ✨ Key Features

### 🗺️ Map-First Experience
- Interactive map powered by **Leaflet**
- Smooth pan, zoom, and marker interactions
- Clean, mobile-friendly UI

### 🔍 Smart Discovery
- Search places, food, and attractions
- Filter by categories:
  - History
  - Food Trails
  - Shopping
  - Nature
  - Culture & Experiences
  - Events
  - Popular Places
  - Hidden Gems

### 📍 Advanced Map Markers
- Category-based markers
- Numbered itinerary pins
- Place name labels and visual hierarchy
- User location marker

### 🧭 Itinerary Generator
- Auto-generated itineraries for **1–4 days**
- Day-wise travel plan
- Switch days directly on the map
- Real road-based routes (not straight lines)

### 🛣️ Real Road Routing
- Uses **OSRM (Open Source Routing Machine)**
- Routes follow actual roads
- Polylines drawn between itinerary stops

### 💾 Lightweight State Persistence
- Uses `sessionStorage`
- No heavy global state libraries
- Fast and reliable navigation flow

---

## 🧠 Application Flow

```text
Welcome Screen
   ↓
City Selection
   ↓
Trip Preferences
   ├─ Explore on my own
   │    ↓
   │  Explore Map
   │    ├─ Search
   │    ├─ Category Filters
   │    └─ Create Itinerary
   │         ↓
   │      Itinerary Page
   │
   └─ Auto-generate Itinerary
        ↓
     Itinerary Page
        ↓
     Map with Day Switcher
````

---

## 🏗️ Architecture Overview

```text
Frontend (React + TypeScript)
 ├─ Pages (Routing & Screens)
 ├─ Components (Map, Filters, Itinerary UI)
 ├─ Hooks (User location, Mobile detection)
 ├─ Data (Jaipur itinerary dataset)
 └─ Tailwind CSS (UI styling)

Backend (Express)
 ├─ Cities API
 ├─ Locations API
 ├─ Search API
 └─ Vite middleware (dev)
```

---

## 📁 Project Structure

```text
.
├─ server/
│  ├─ index.ts        # Express server entry
│  ├─ routes.ts       # API endpoints
│  ├─ storage.ts      # Sample data
│  └─ vite.ts         # Vite middleware
│
├─ client/
│  ├─ index.html
│  └─ src/
│     ├─ main.tsx
│     ├─ App.tsx
│     ├─ pages/
│     │  ├─ Home.tsx
│     │  ├─ CitySelectionPage.tsx
│     │  ├─ TripPreferencePage.tsx
│     │  ├─ MapPage.tsx
│     │  └─ ItineraryPage.tsx
│     │
│     ├─ components/
│     │  ├─ MapView.tsx
│     │  ├─ ItineraryPreview.tsx
│     │  ├─ DaySwitcher.tsx
│     │  ├─ CategoryFilters.tsx
│     │  └─ ui/
│     │
│     ├─ hooks/
│     │  ├─ use-mobile-location.ts
│     │  └─ use-mobile.tsx
│     │
│     ├─ data/
│     │  └─ jaipurItinerary.ts
│     │
│     └─ index.css
│
├─ shared/
│  └─ schema.ts       # Category & model definitions
│
├─ package.json
└─ README.md
```

---

## 🧭 How the App Works

### 1️⃣ City Selection

User selects a city (Jaipur in Phase 1).

### 2️⃣ Trip Preferences

* Select number of days (1–4)
* Choose:

  * Explore on your own
  * Auto-generate itinerary

### 3️⃣ Explore Mode

* Browse places on the map
* Search & filter categories
* Tap markers for details
* Create itinerary anytime

### 4️⃣ Itinerary Mode

* Full day-wise itinerary view
* Switch days on map
* Numbered markers + route
* Change plan anytime

---

## 🛣️ Routing & Directions

* Powered by **OSRM**
* API:

  ```
  https://router.project-osrm.org
  ```
* Ensures:

  * Road-accurate navigation
  * Realistic travel paths
  * Better user trust

> Google Maps integration is planned in later phases.

---

## 💾 Session Storage Keys

```text
selectedCity   → Selected city object
tripDays       → Number of days (1–4)
exploreMode    → "map" | "itinerary"
```

---

## 🔧 Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Leaflet

### Backend

* Express
* Vite middleware

### Maps & Routing

* OpenStreetMap
* OSRM

### UI

* Radix UI
* Lucide Icons

---

## ⚡ Development

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Open in browser:

```
http://127.0.0.1:5000
```

---

## 📦 Production Build

```bash
npm run build
npm start
```

---

## 🚀 Roadmap

* ✅ Jaipur (Phase 1)
* ⏳ Multi-city expansion
* ⏳ Smart itinerary optimization
* ⏳ Google Maps fallback
* ⏳ User accounts & saved trips
* ⏳ Offline mode (PWA)

---

## 📜 License

MIT License

---

## 👨‍💻 Maintainer

**Chaitanya & Aryan**
Founder – City Explorer
Launching soon on Play Store & iOS

---

✨ City Explorer is built to make city travel **simple, visual, and intelligent**.

```
