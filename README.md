# React Geo Data Dashboard

A React-based dashboard that visualizes spatial + tabular project data with a synchronized table + map UI.

## Tech
- React + Vite + TypeScript
- MUI for UI components
- react-window for table virtualization (performance for 5k+ rows)
- Leaflet + react-leaflet for map rendering

## Features
### Data Table
- Uses a mock API (local JSON) with pagination simulation + latency
- Columns:
  - Project Name, Latitude, Longitude, Status, Last Updated
- Client-side sorting
- Client-side filtering (search + status filter)
- Virtualized rendering to avoid lag with large datasets

### Map Integration
- Leaflet map plotting projects by lat/long
- Click table row → highlights marker + pans map
- Click marker → highlights row + scrolls to row

### State Management
- Local component state only (no Redux)
- Clear separation:
  - `src/api/*` for mock API
  - `src/hooks/*` for data fetching + caching logic
  - `src/components/*` for UI

## Decisions & Rationale
### Why react-window?
Rendering 5000 rows as normal DOM nodes causes sluggish scrolling and re-render overhead.
`react-window` keeps DOM size small by only rendering visible rows, making scrolling smooth.

### Why CircleMarker instead of default marker pins?
CircleMarker is lightweight, easy to style for highlight state, and avoids icon asset pitfalls.
Leaflet default marker icons are still fixed via `leafletFix.ts` for compatibility.

### Pagination vs large-data performance
The mock API supports pagination. The dashboard includes a "Load all" action to simulate
bringing the full dataset (5k+) into memory for client-side filtering/sorting + map plotting.
In a real API scenario, server-side filtering/sorting would be recommended.

## How to run
```bash
npm install
npm run dev
