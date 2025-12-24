# 🧭 City Explorer

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![Issues](https://img.shields.io/github/issues/CHAITANYA-2002/city-trail)](https://github.com/CHAITANYA-2002/city-trail/issues)

**City Explorer** is a mobile-first, map-based city discovery application built with **React + TypeScript**, **Leaflet**, and a lightweight **Express** backend. It helps travelers find attractions, food, and shopping, then generates **day-wise itineraries** (1–4 days) with road-accurate routes.

---

## Table of contents
- [🧭 City Explorer](#-city-explorer)
  - [Table of contents](#table-of-contents)
  - [Quick demo](#quick-demo)
  - [Features](#features)
  - [Quick start](#quick-start)
  - [Architecture \& file tree](#architecture--file-tree)
  - [Application flow](#application-flow)
  - [API endpoints](#api-endpoints)
  - [Development notes](#development-notes)
  - [Contributing](#contributing)
  - [Security](#security)
  - [License \& contact](#license--contact)

---

## Quick demo

> Use the app to pick a city (Jaipur), choose "Explore on my own" or "Create itinerary", search places, filter by categories, and press **Create My Itinerary** to generate a day-wise plan.

_Screenshots (replace these placeholders with real images from `client/attached_assets`):_

![Map view placeholder](client/attached_assets/Pasted-Create-a-mobile-travel-and-real-time-city-discovery-app_1765992926099.txt)

![Itinerary view placeholder](client/attached_assets/Pasted-Create-a-mobile-travel-and-real-time-city-discovery-app_1765992983268.txt)

---

## Features
- Searchable points of interest (server locations + itinerary stops)
- Category filters (History, Food, Shopping, Nature, Culture, Events, Popular, Hidden)
- Color-coded markers and numbered itinerary pins
- Itinerary generation for **1–4 days**, with day switcher
- Road-following routes (OSRM) drawn as vibrant blue polylines
- Simple persistence via `sessionStorage` for `selectedCity`, `tripDays`, `exploreMode`

---

## Quick start

```bash
# Install
npm install

# Development (Express server + Vite)
npm run dev

# Production build
npm run build
npm start

# TypeScript checks
npm run check
```

Open http://127.0.0.1:5000 (default) after starting the dev server.

---

## Architecture & file tree

```
.
├─ server/
│  ├─ index.ts        # Express server entry (dev + prod)
│  ├─ routes.ts       # API endpoints
│  ├─ storage.ts      # sample data / data access
│  └─ vite.ts         # Vite middleware
├─ client/
│  ├─ index.html
│  └─ src/
│     ├─ main.tsx
│     ├─ App.tsx
│     ├─ pages/
│     │  ├─ Home.tsx
│     │  ├─ MapPage.tsx
│     │  └─ ItineraryPage.tsx
│     ├─ components/
│     │  ├─ MapView.tsx
│     │  ├─ SearchBar.tsx
│     │  └─ CategoryFilters.tsx
│     ├─ data/
│     │  └─ jaipurItinerary.ts
│     └─ index.css
└─ shared/
   └─ schema.ts
```

---

## Application flow

```mermaid
flowchart LR
  W[Welcome] --> CS[City Selection]
  CS --> TP[Trip Preferences]

  subgraph Decision [User choice]
    TP -->|Explore on my own| EXP[Explore (Map)]
    TP -->|Auto-generate itinerary| ITN[Itinerary Page]
  end

  EXP --> SEARCH[Search & Category Filters]
  SEARCH --> PL[Select Place / Marker]
  PL -->|See on Itinerary| ITN

  EXP -->|Create My Itinerary| CH{Has days set?}
  CH -->|Yes| ITN
  CH -->|No| DAYCHOICE[Pick 1-4 days] --> ITN

  ITN --> DS[Day Switcher / Route on Map]
  DS --> MAPROUTE[OSRM route / Polyline]
  ITN --> CHANGE[Change my plan]
  CHANGE --> CS
  CHANGE --> DAYCHOICE

  subgraph Data [Data & Services]
    LOC[Server Locations / DB]
    ITD[Itinerary Data (jaipurItinerary.ts)]
    OSRM[OSRM Directions API]
  end

  LOC --> EXP
  ITD --> EXP
  ITD --> ITN
  OSRM --> MAPROUTE
```

---

## API endpoints
- GET `/api/cities` — list cities
- GET `/api/cities/:id` — city detail
- GET `/api/categories` — list categories
- GET `/api/locations?cityId=...&category=...` — locations list
- GET `/api/search?cityId=...&q=...` — text search

---

## Development notes
- Map routes are fetched from OSRM: `https://router.project-osrm.org/route/v1/driving/{coords}`
- Itinerary data (sample) lives in `client/src/data/jaipurItinerary.ts`
- Session keys: `selectedCity`, `tripDays`, `exploreMode`
- Optional: set `PORT` env var to change dev server port (default 5000)

---

## Contributing
1. Fork the repo
2. Create branch `feature/your-feature`
3. Add tests / commit messages
4. Open a PR and describe the change

Helpful contributions:
- Better marker icons / legend
- Server-side itinerary optimization
- Google Maps provider fallback

---

## Security
- Never commit API keys or secrets. Use `.env` and add it to `.gitignore`.
- For public deployments, ensure API keys and billing are configured securely.

---

## License & contact
- **License:** MIT
- **Maintainers:** Chaitanya & Aryan — open to help with repo setup, Google Maps integration, and server-side itinerary

---

_Powered with ❤️ for travelers._

