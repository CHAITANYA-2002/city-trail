# City Explorer

A mobile-friendly, real-time city discovery app built with React + TypeScript and an Express development server. The project provides a map-first experience (Leaflet) to explore points of interest, filter by category, search places, and generate day-wise itineraries automatically.

---

## 🚀 Key Features

- Map-first exploration using react-leaflet
  - Search across all places (city locations + itinerary stops)
  - Category filters (History, Food, Shopping, Nature, Culture, Events, Popular, Hidden)
  - Custom markers per category and numbered itinerary pins
  - User start/end markers and route polyline (vibrant blue) for itinerary mode
- Itinerary support
  - Quick itinerary preview in app bottom tab
  - Full, day-wise itinerary page (1–4 days) with flow-style list
  - "Create My Itinerary" from the Map page (respects chosen days or prompts for days)
  - "Change my plan" on Itinerary page (Change City or Change Days → 1–4 days)
- Persistent lightweight state via sessionStorage keys (`selectedCity`, `tripDays`, `exploreMode`) for simple flows
- Tailwind CSS powered UI with reusable components (modals/sheets, day switcher, search, filters)
- Simple search API on the server to query locations per city

---

## 🏗 Architecture (file structure)

Below is a compact file-tree of the repository so you can see where each responsibility lives:

```text
.
├─ README.md
├─ package.json
├─ script/
│  └─ build.ts
├─ server/
│  ├─ index.ts        # Express server entry
│  ├─ routes.ts       # API endpoints (cities, locations, search)
│  ├─ storage.ts      # data access / sample data
│  └─ vite.ts         # Vite middleware integration
├─ client/
│  ├─ index.html
│  ├─ src/
│  │  ├─ main.tsx
│  │  ├─ App.tsx
│  │  ├─ index.css
│  │  ├─ components/
│  │  │  ├─ MapView.tsx
│  │  │  ├─ SearchBar.tsx
│  │  │  ├─ CategoryFilters.tsx
│  │  │  ├─ ItineraryPreview.tsx
│  │  │  └─ ui/ (Radix/Tailwind primitives)
│  │  ├─ pages/
│  │  │  ├─ Home.tsx
│  │  │  ├─ MapPage.tsx
│  │  │  └─ ItineraryPage.tsx
│  │  ├─ data/
│  │  │  └─ jaipurItinerary.ts
│  │  └─ hooks/
│  │     └─ use-mobile-location.ts
│  └─ public/
└─ shared/
   └─ schema.ts       # DB models, Category definitions
```

---

## 🔁 Application Flow (flowchart)

The diagram below shows the primary user flows (city selection → preference → explore → create/view itinerary).

```mermaid
flowchart LR
  %% -- User flow
  W[Welcome] --> CS[City Selection]
  CS --> TP[Trip Preferences]

  subgraph Decision [User choice]
    TP -->|Explore on my own| EXP[Explore (Map)]
    TP -->|Auto-generate itinerary| ITN[Itinerary Page]
  end

  %% -- Explore interactions
  EXP --> SEARCH[Search & Category Filters]
  SEARCH --> PL[Select Place / Marker]
  PL -->|See on Itinerary| ITN
  EXP -->|Create My Itinerary| CH{Has days set?}
  CH -->|Yes| ITN
  CH -->|No| DAYCHOICE[Pick 1-4 days] --> ITN

  %% -- Itinerary interactions
  ITN --> DS[Day Switcher / Route on Map]
  DS -->|View route| MAPROUTE[OSRM route / Polyline]
  ITN -->|Change my plan| CHANGE[Change City or Change Days]
  CHANGE --> CS
  CHANGE --> DAYCHOICE

  %% -- Data & services
  subgraph Data [Data & Services]
    LOC[Server Locations / DB]
    ITD[Itinerary Data (jaipurItinerary.ts)]
    OSRM[OSRM Directions API]
  end

  LOC --> EXP
  ITD --> EXP
  ITD --> ITN
  OSRM --> MAPROUTE

  %% -- Styling hints
  classDef ui fill:#fff7ed,stroke:#f59e0b;
  classDef map fill:#fef3c7,stroke:#f59e0b;
  classDef itin fill:#dbeafe,stroke:#2563eb;
  class EXP,SEARCH,PL ui;
  class ITN,DS itin;
  class MAPROUTE map;
```

Notes:
- The `Explore (Map)` node includes ability to search all places (server locations + itinerary stops) and filter by categories.
- The `Itinerary Mode` node represents the full day-wise itinerary view with route rendering.

---

## Routing & Directions

- Road-following routes are fetched from OSRM (`router.project-osrm.org`) in itinerary mode.
- Optional: Google Maps / Directions API integration is planned (requires API key & billing).

---

## 📁 Repo Structure (important files)

- `server/` — Express server + API endpoints, vite setup
- `client/` — React app (index.html, src/...)
- `client/src/components` — MapView, SearchBar, CategoryFilters, ItineraryPreview, DaySwitcher, UI components
- `client/src/data/jaipurItinerary.ts` — Example itinerary dataset used in the app
- `shared/schema.ts` — DB models and Category definitions
- `package.json` (root) — dev & start scripts (server + vite dev middleware)

---

## 🔧 Prerequisites

- Node.js (Recommended 18.x or later)
- npm (or yarn/pnpm) — this repository uses standard npm scripts
- Optional: PostgreSQL (if you plan to run DB-backed features locally)

---

## ⚡ Development

1. Install dependencies

```bash
npm install
```

2. Start dev server (runs Express + Vite middleware, serves client)

```bash
npm run dev
```

3. Open http://localhost:5173 (or the port Vite reports) in your browser.

Notes:
- The `dev` script uses `tsx server/index.ts` to run the server that hosts the client via Vite middleware.
- The Map UI will fetch locations from `/api/locations?cityId=...` — the server `storage` may return sample/static locations or read from DB.

---

## ✅ Build & Production

1. Create a production build:

```bash
npm run build
```

2. Start the production server (after building):

```bash
npm start
```

This starts the compiled server entry point (see `script/build.ts` for packaging steps).

---

## 🧭 How to Use the App (quick guide)

- Choose a city → set trip preferences (days and mode) → Explore
- In Explore (Map) mode you can:
  - Search across places (server locations + itinerary stops)
  - Filter results by category
  - Tap a place to open details (Navigate / See on Itinerary)
  - Press "Create My Itinerary" to create/view full itinerary
- In Itinerary mode:
  - Use Day Switcher to change active day and see route/pins
  - Route starts & ends at user's location (if geolocation allowed)
  - Use "Change my plan" to change city or number of days

---

## API Endpoints (server)

- GET `/api/cities` - list cities
- GET `/api/cities/:id` - city detail
- GET `/api/categories` - categories (CATEGORIES from `shared/schema.ts`)
- GET `/api/locations?cityId=...&category=...` - locations list
- GET `/api/search?cityId=...&q=...` - search locations by text

---

## Data & Configuration Notes

- `client/src/data/jaipurItinerary.ts` contains sample itineraries for 1–4 days (the app shows these as an example dataset).
- Map coordinate lookup is in `MapView.tsx` (exported `COORDS`) so itinerary stops appear on the map.
- Session keys used for simple client state:
  - `selectedCity` — JSON of selected city
  - `tripDays` — selected number of days
  - `exploreMode` — `"map"` or `"itinerary"`

Optional: For Google Maps integration (Directions API): add an environment variable `GOOGLE_MAPS_API_KEY` and wire client/server code accordingly.

---

## Tests & Validation

- Run TypeScript checks:

```bash
npm run check
```

- Linting/formatting not configured centrally — consider adding ESLint and Prettier as next steps.

---

## ☁️ Publishing to GitHub (quick steps)

1. Make sure no secrets/API keys are committed. Add `.env` to `.gitignore`.
2. Initialize git (if not already):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

3. Create a repo on GitHub (or use `gh` CLI):

```bash
# if gh CLI is authenticated
gh repo create your-username/city-explorer --public --source=. --remote=origin --push
```

Or add remote and push manually:

```bash
git remote add origin git@github.com:USERNAME/City-Explorer.git
git push -u origin main
```

---

## Contributing

- Fork, create a feature branch, add tests, and open a PR.
- Preferred contributions:
  - Improve marker icons and a legend for category colors
  - Server-side itinerary generator (optimize day splits by distance/time)
  - Optional Google Maps provider fallback & Directions API integration

---

## License

This project uses the MIT license (see `LICENSE` if included).

---

## Contact / Maintainer Notes

If you'd like, I can:
- Help create a GitHub remote and push this repository, or
- Implement Google Maps integration or a server-side itinerary generator next.

Enjoy building with City Explorer! 🧭✨
