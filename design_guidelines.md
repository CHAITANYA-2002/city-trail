# CityTrail Design Guidelines

## Design Approach
**System-Based Approach**: Material Design for Android with iOS-style refinements for cross-platform appeal. This app prioritizes usability, quick information access, and seamless map interaction over decorative elements.

**Reference Inspiration**: Google Maps (mapping UI), Airbnb (discovery cards), Uber (navigation patterns)

## Typography
- **Primary Font**: Inter or SF Pro for excellent mobile readability
- **Hierarchy**:
  - Hero/Welcome: 32px bold
  - Screen Titles: 24px semibold
  - Category Labels: 16px medium
  - Location Names: 18px semibold
  - Body Text: 14px regular
  - Metadata (hours, distance): 12px regular

## Layout System
**Spacing Units**: Tailwind units of 2, 3, 4, 6, and 8 (p-2, m-4, gap-6, py-8)
- Mobile viewport: Full-width components with edge padding of px-4
- Card spacing: gap-4 between elements
- Section padding: py-6 for screen sections
- Bottom navigation: Fixed with safe-area support

## Core Components

### Welcome Screen
- Full-screen branded splash with app logo
- Tagline underneath
- Prominent "Get Started" button (bottom third)
- Simple, clean background treatment

### City Selection
- Search input at top (sticky)
- Grid of city cards with images (2 columns)
- Each card: City name, iconic landmark image, "Select" button
- Jaipur pre-selected/featured

### Map Interface (Primary Screen)
- Full-screen map with minimal chrome
- Fixed search bar at top (px-4, rounded-full, shadow-lg)
- Horizontal scrolling category chips below search (gap-2, px-4)
- Floating action button for "My Location" (bottom-right)
- Bottom sheet for location details (swipe up/down)

### Category Filters
- Horizontal scroll chips with icons
- Active state: filled background
- Icons from Heroicons (map-pin, shopping-bag, sparkles, etc.)
- 8 categories as specified, each with distinct icon

### Location Cards
- Image at top (16:9 aspect ratio)
- Location name (18px semibold)
- Category badge, rating stars, distance
- Brief description (2 lines max)
- "View Details" or navigation arrow

### Location Detail Page
- Hero image (full-width, 40vh)
- Back button (top-left, blurred background circle)
- Share button (top-right, blurred background circle)
- Content section: Name, rating, category, description
- Info grid: Hours, Price, Distance (3 columns)
- "Get Directions" button (w-full, sticky bottom)
- Image gallery below

### Map Markers
- Category-specific colored pins
- Clustered markers for nearby locations
- Active marker: larger with pulse animation

### Bottom Navigation (if needed)
- 4 tabs: Explore, Saved, Routes, Profile
- Icon + label
- Active state with indicator

## Animations
- Screen transitions: Slide (300ms ease-out)
- Bottom sheet: Spring animation
- Map markers: Subtle bounce on appear
- Category chip selection: Scale (0.95) on press
- NO scroll-triggered or decorative animations

## Images
**Essential Image Locations**:
1. **Welcome Screen**: Stylized illustration or photo montage of Jaipur landmarks (Hawa Mahal, Amber Fort) - subtle, non-distracting
2. **City Selection Cards**: Representative landmark photo for each city (Jaipur: Hawa Mahal)
3. **Location Cards**: High-quality photos of each location
4. **Location Detail Hero**: Full-width immersive photo of the location
5. **Image Gallery**: 3-6 additional photos per location

Use placeholder services initially (Unsplash API with Jaipur/India keywords)

## Interaction Patterns
- Pull-to-refresh on map and lists
- Swipe gestures for bottom sheet
- Long-press on map for custom pin
- Tap category chip to filter, tap again to deselect
- Smooth zoom animations on map

## Mobile-Specific Considerations
- Safe area insets for notched devices
- Touch targets minimum 44px
- Swipeable cards and bottom sheets
- GPS permission flow (clear messaging)
- Offline mode indicators
- Loading states for map tiles and location data

## Accessibility
- High contrast ratios (4.5:1 minimum)
- Screen reader labels for all interactive elements
- Haptic feedback for button presses
- Large touch targets throughout
- Focus indicators for keyboard navigation

**Critical**: Every screen should feel purposeful and information-rich. The map is the hero - keep chrome minimal but functional. Location discovery should be delightful through high-quality imagery and clear information hierarchy.