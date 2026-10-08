# PRAVAH: Integrated Geospatial & Telemetry Sources

| Provider / Agency | Dataset | Ingestion Method | Refresh / Latency | Fallback Strategy |
|:------------------|:--------|:-----------------|:------------------|:------------------|
| **IMD (India Meteorological Department)** | Complete 20-Service Official API Suite (`api.imd.gov.in`) | HTTP REST / API key | 1h - 3h | High-resolution open NWP feed / Grounded extreme scenario |
| **NDMA SACHET** | Common Alerting Protocol (CAP v1.2) Warnings | Public RSS / XML with ETag | Real-time / 5m TTL | Cached advisory bulletins |
| **India-WRIS / CWC** | River Water Levels, Danger Stages, Dam Discharge | Hydrometric Telemetry REST API | 1h | Labeled as "No recent observation" when absent |
| **Copernicus Data Space (ESA)** | Sentinel-1 SAR C-band Ground Range Detected (GRD) | OAuth2 Client Credentials Flow | 6-day orbital revisit | Grounded SAR backscatter baseline with radar physics notes |
| **ISRO MOSDAC** | INSAT-3DR Hydro-Estimator Precipitation Product | Username + Password Session Auth | Near-Real-Time (NRT) | Non-blocking execution without halting system |
| **NASA FIRMS** | Thermal Anomalies & Active Fire Detections (VIIRS) | REST MAP Key Query | 3h | Clean baseline during flood events |
| **Copernicus DEM** | 90m Digital Elevation Model (GLO-90) | Open-Meteo Public Elevation API | Static Cache | Survey of India benchmark elevations |
| **OpenStreetMap** | Arterial Highway, Medical, Shelter & Substation GIS | Overpass QL API | In-memory Cache | Grounded Chennai infrastructure dataset |
| **OSRM Engine** | Routing Network Topology & Detour Calculations | Dynamic Cost Function Proxy | Sub-second | Graph-based risk-weighted traversal |

---

## Official IMD (api.imd.gov.in) Supported Services & Endpoints

1. **City Weather Forecast (7 Days):** `https://api.imd.gov.in/api/v1/cityforecast?id=StationCode`
2. **City Weather Forecast with Lat/Lon (7 Days):** `https://api.imd.gov.in/api/v1/cityforecastloc?id=StationCode`
3. **Current Weather API:** `https://api.imd.gov.in/api/v1/current_wx?id=StationId` (MSLP, Wind speed/direction, Weather Code 01-99, Nebulosity, RH, 24h Rainfall)
4. **District-wise Nowcast:** `https://api.imd.gov.in/api/v1/districtnowcast` (Categories Cat 1 to 19, Color Codes 1 to 4)
5. **District-wise Rainfall:** `https://api.imd.gov.in/api/v1/districtrainfall?id=DistrictId` (Actual, Normal, Departure %, Category LE/E/N/D/LD/NR)
6. **District-wise Warnings:** `https://api.imd.gov.in/api/v1/districtwarning?id=ObjId` (Day 1-5 warning codes 1 to 17, Color Codes 1 to 4)
7. **Station-wise Nowcast:** `https://api.imd.gov.in/api/v1/stationnowcast?id=StationName`
8. **State-wise Rainfall:** `https://api.imd.gov.in/api/v1/staterainfall`
9. **AWS / ARG Station Data:** `https://api.imd.gov.in/api/v1/aws_data?sid=25` (Tamil Nadu AWS stations: Temp, Dew Point, RH, Wind, MSLP, Feels Like)
10. **River Basin Quantitative Precipitation Forecast (QPF):** `https://api.imd.gov.in/api/v1/basinqpf` (Day 1-5 QPF & AAP for river basins)
11. **Port Warning:** `https://api.imd.gov.in/api/v1/portwarning`
12. **Sea Area Bulletin:** `https://api.imd.gov.in/api/v1/seabulletin`
13. **Coastal Bulletin:** `https://api.imd.gov.in/api/v1/coastalbulletin`
14. **Subdivision-wise Warnings:** `https://api.imd.gov.in/api/v1/subdivisionwarning`
15. **Astronomical Sun / Moon Times:** `https://api.imd.gov.in/api/v1/sunmoon?lat=...&lon=...`
16. **Subdivisional Rainfall Forecast (7 Days):** `https://api.imd.gov.in/api/v1/subdivision_rainfall_forecast`
17. **State District Rainfall Forecast (5 Days):** `https://api.imd.gov.in/api/v1/state_district_rainfall_forecast`
18. **Cyclone Track:** `https://api.imd.gov.in/api/v1/cyclone_track` (Observed & forecast coordinates, category, MSW)
19. **Cyclone Wind Warning:** `https://api.imd.gov.in/api/v1/cyclone_wind` (MultiPolygon GeoJSON for 27kt, 34kt, 50kt, 64kt)
20. **Cyclone Cone of Uncertainty:** `https://api.imd.gov.in/api/v1/cyclone_cou` (MultiPolygon GeoJSON)

