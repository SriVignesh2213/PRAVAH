# PRAVAH: Official Data Provider Integration Guide

This guide details official access, registration, authentication protocols, environment configuration, and fallback behaviors for all external telemetry sources integrated into PRAVAH.

---

## 1. India Meteorological Department (IMD)

* **Official Portal:** [https://api.imd.gov.in](https://api.imd.gov.in) | Visual Portal: [https://mausam.imd.gov.in](https://mausam.imd.gov.in) | City Visualizer: [https://city.imd.gov.in](https://city.imd.gov.in)
* **Authentication Method:** API Key (`api-key` / `x-api-key` headers or `?api_key=...` query parameter)
* **Required Environment Variables:**
  ```env
  IMD_API_KEY=your_imd_api_key_here
  IMD_BASE_URL=https://api.imd.gov.in/api/v1
  ```
* **Supported 20 Official IMD Services:**
  1. City Weather Forecast 7 Days (`/cityforecast`)
  2. City Weather Forecast with Lat/Lon (`/cityforecastloc`)
  3. Current Weather API (`/current_wx`: MSLP, Wind speed/direction, Temp, Weather code 01-99, Nebulosity, RH, 24h Rain)
  4. District-wise Nowcast (`/districtnowcast`: Cat 1-19, Color Codes 1-4)
  5. District-wise Rainfall (`/districtrainfall`: Actual, Normal, Departure %, Category LE/E/N/D/LD/NR)
  6. District-wise Warnings 5 Days (`/districtwarning`: Warning codes 1-17, Colors 1-4)
  7. Station-wise Nowcast (`/stationnowcast`)
  8. State-wise Rainfall (`/staterainfall`)
  9. Automatic Weather Stations AWS/ARG (`/aws_data?sid=25` Tamil Nadu: Temp, Dew Point, RH, Wind, MSLP, Feels Like)
  10. River Basin Quantitative Precipitation Forecast QPF (`/basinqpf`: Day 1-5 QPF & AAP for river basins)
  11. Port Warning (`/portwarning`)
  12. Sea Area Bulletin (`/seabulletin`)
  13. Coastal Bulletin (`/coastalbulletin`)
  14. Subdivision-wise Warnings (`/subdivisionwarning`)
  15. Astronomical Sun & Moon Times (`/sunmoon`)
  16. Subdivisional Rainfall Forecast 7 Days (`/subdivision_rainfall_forecast`)
  17. State District Rainfall Forecast 5 Days (`/state_district_rainfall_forecast`)
  18. Cyclone Track (`/cyclone_track`: Observed & forecast coordinates, category, MSW)
  19. Cyclone Wind Warning (`/cyclone_wind`: MultiPolygon GeoJSON for 27kt, 34kt, 50kt, 64kt)
  20. Cyclone Cone of Uncertainty (`/cyclone_cou`: MultiPolygon GeoJSON)
* **PRAVAH Consumer Modules:**
  - `backend/app/integrations/imd/schemas.py`
  - `backend/app/integrations/imd/provider.py`
  - `backend/app/forecasting/flood_risk.py`
  - `backend/app/simulation/counterfactual.py`
  - `frontend/src/components/IMDWeatherModal.tsx`
* **Rate Limits:** Standard government API rate limits apply (approx. 60 requests/minute).
* **Fallback Behavior:** When credentials are unset or the government portal is undergoing maintenance, PRAVAH queries high-resolution open meteorological numerical feeds (Open-Meteo High-Resolution NWP) or activates the deterministic Chennai Extreme Monsoon baseline with explicit labeling.
* **Attribution Requirement:** "Data provided by India Meteorological Department (IMD), Ministry of Earth Sciences, Government of India."

---

## 2. NDMA SACHET (Common Alerting Protocol)

* **Official Portal:** [https://sachet.ndma.gov.in](https://sachet.ndma.gov.in)
* **Authentication Method:** Public Common Alerting Protocol (CAP) v1.2 XML / RSS feed. No private token required for public emergency broadcasts.
* **Required Environment Variables:**
  ```env
  SACHET_ENABLED=true
  SACHET_RSS_URL=https://sachet.ndma.gov.in/alerts/rss
  ```
* **PRAVAH Consumer Modules:**
  - `backend/app/integrations/sachet/provider.py`
  - `backend/app/api/v1/endpoints.py`
  - `frontend/src/components/AlertsFeed.tsx`
* **Rate Limits:** Ingested with HTTP `ETag` and conditional `If-None-Match` caching to avoid unnecessary repeated pulls. Cache TTL: 300 seconds.
* **Fallback Behavior:** If the upstream RSS endpoint is unreachable, PRAVAH displays last cached verified alerts or active disaster advisory alerts for Greater Chennai Corporation.
* **Attribution Requirement:** "Integrated Alerting System courtesy of National Disaster Management Authority (NDMA) - SACHET."

---

## 3. India-WRIS / Central Water Commission (CWC)

* **Official Portal:** [https://indiawris.gov.in](https://indiawris.gov.in) | National Water Informatics Centre
* **Authentication Method:** Registered API token / CWC telemetry endpoint header
* **Required Environment Variables:**
  ```env
  WRIS_API_KEY=your_india_wris_key_here
  WRIS_BASE_URL=https://indiawris.gov.in/wris/api
  ```
* **PRAVAH Consumer Modules:**
  - `backend/app/integrations/india_wris/provider.py`
  - `backend/app/forecasting/flood_risk.py`
  - `frontend/src/components/HydrometricPanel.tsx`
* **Rate Limits:** 100 requests per hour.
* **Fallback Behavior:** If an individual hydrometric station has no active observation (e.g., Buckingham Canal outfall), PRAVAH explicitly outputs `"No recent observation available from source"` rather than synthesizing an artificial stage height.
* **Attribution Requirement:** "Hydrological telemetry datasets courtesy of Central Water Commission (CWC), Ministry of Jal Shakti, Government of India."

---

## 4. Copernicus Data Space Ecosystem (Sentinel-1 SAR)

* **Official Portal:** [https://dataspace.copernicus.eu](https://dataspace.copernicus.eu)
* **Authentication Method:** OAuth2 Client Credentials Flow (`client_id` + `client_secret`) exchanging for a temporary Bearer token via CDSE Keycloak identity service.
* **Required Environment Variables:**
  ```env
  COPERNICUS_CLIENT_ID=your_cdse_client_id
  COPERNICUS_CLIENT_SECRET=your_cdse_client_secret
  COPERNICUS_TOKEN_URL=https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token
  COPERNICUS_CATALOG_URL=https://catalogue.dataspace.copernicus.eu/resto/api
  ```
* **PRAVAH Consumer Modules:**
  - `backend/app/integrations/copernicus/provider.py`
  - `backend/app/uncertainty/engine.py`
  - `frontend/src/components/HydrometricPanel.tsx`
* **Rate Limits:** Token lifetime: 3600 seconds. OpenSearch catalog query: 10 requests/second.
* **Fallback Behavior:** Displays validated Sentinel-1 C-SAR acquisition metadata over Chennai coastal basin with explicit disclosure that SAR provides indirect empirical evidence rather than absolute flood certainty.
* **Attribution Requirement:** "Contains modified Copernicus Sentinel data [2026], processed by European Space Agency (ESA)."

---

## 5. ISRO MOSDAC (Meteorological & Oceanographic Satellite Data Archival Centre)

* **Official Portal:** [https://www.mosdac.gov.in](https://www.mosdac.gov.in)
* **Authentication Method:** User account authentication (Username + Password session login, not an API key).
* **Required Environment Variables:**
  ```env
  MOSDAC_USERNAME=your_registered_username
  MOSDAC_PASSWORD=your_registered_password
  MOSDAC_BASE_URL=https://www.mosdac.gov.in/api
  ```
* **PRAVAH Consumer Modules:**
  - `backend/app/integrations/mosdac/provider.py`
* **Rate Limits:** Standard web session policies.
* **Fallback Behavior:** If user credentials are not provided, system flags MOSDAC status as `NO_CREDENTIALS` and maintains full operational functionality using IMD and Copernicus feeds without halting execution.
* **Attribution Requirement:** "Satellite products courtesy of Space Applications Centre (SAC), Indian Space Research Organisation (ISRO)."

---

## 6. NASA FIRMS (Fire Information for Resource Management System)

* **Official Portal:** [https://firms.modaps.eosdis.nasa.gov](https://firms.modaps.eosdis.nasa.gov) | MAP Key Registration: [https://firms.modaps.eosdis.nasa.gov/api/map_key](https://firms.modaps.eosdis.nasa.gov/api/map_key)
* **Authentication Method:** MAP Key query parameter.
* **Required Environment Variables:**
  ```env
  NASA_FIRMS_MAP_KEY=your_firms_map_key
  NASA_FIRMS_BASE_URL=https://firms.modaps.eosdis.nasa.gov/api
  ```
* **PRAVAH Consumer Modules:**
  - `backend/app/integrations/nasa_firms/provider.py`
* **Rate Limits:** 500 transactions per day for standard academic/developer keys.
* **Fallback Behavior:** Returns clean zero-anomaly baseline for flood scenarios.
* **Attribution Requirement:** "NASA FIRMS data provided by Land, Atmosphere Near real-time Capability for EOS (LANCE)."

---

## 7. Open-Meteo Copernicus DEM & Elevation

* **Official Portal:** [https://open-meteo.com/en/docs/elevation-api](https://open-meteo.com/en/docs/elevation-api)
* **Authentication Method:** Open public endpoint based on Copernicus DEM GLO-90. No private API key required.
* **Required Environment Variables:**
  ```env
  ELEVATION_API_URL=https://api.open-meteo.com/v1/elevation
  ```
* **PRAVAH Consumer Modules:**
  - `backend/app/integrations/elevation/provider.py`
  - `backend/app/geospatial/chennai_grid.py`
* **Rate Limits:** Up to 10,000 daily queries for non-commercial open scientific research.
* **Fallback Behavior:** Uses local verified Copernicus DEM 90m benchmarks for Chennai GCC zones.

---

## 8. OpenStreetMap / Overpass API

* **Official Portal:** [https://overpass-api.de](https://overpass-api.de)
* **Authentication Method:** Public Overpass QL API with compliant `User-Agent` headers.
* **Required Environment Variables:**
  ```env
  OVERPASS_API_URL=https://overpass-api.de/api/interpreter
  ```
* **PRAVAH Consumer Modules:**
  - `backend/app/integrations/osm/provider.py`
  - `backend/app/cascade/graph.py`
* **Rate Limits:** Concurrency limit: 2 simultaneous slots per IP. Strictly cached server-side.
* **Fallback Behavior:** Serves verified geocoded infrastructure repository for Chennai (Rajiv Gandhi Govt General Hospital, Stanley, MIOT, Apollo, GCC shelters, TANGEDCO substations, arterial roads).
* **Attribution Requirement:** "© OpenStreetMap contributors. Open Database License (ODbL)."

---

## 9. OSRM Routing Engine

* **Official Documentation:** [http://project-osrm.org](http://project-osrm.org)
* **Authentication Method:** Configurable REST endpoint.
* **Required Environment Variables:**
  ```env
  OSRM_BASE_URL=https://router.project-osrm.org
  ```
* **PRAVAH Consumer Modules:**
  - `backend/app/integrations/routing/provider.py`
* **Fallback Behavior:** Computes risk-adjusted resilient evacuation paths with penalty weights for inundated corridors.
