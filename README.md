# manhattanhenge

1. **Sun Azimuth Calculation:**
   ```typescript
   // Use SunCalc to get sun position
   const pos = SunCalc.getPosition(date, lat, lng);
   const sunAzimuth = (pos.azimuth * 180 / Math.PI + 180) % 360;
   ```
   - Converts sun's position to compass bearing (0° = North, 90° = East, etc.)

2. **Street Azimuth Calculation:**
   ```typescript
   // Calculate bearing between two GPS points
   azimuth = atan2(
     sin(Δλ) × cos(φ2),
     cos(φ1) × sin(φ2) - sin(φ1) × cos(φ2) × cos(Δλ)
   )
   ```
   - Fetches street geometries from OpenStreetMap
   - Calculates each street segment's compass direction
   - Averages azimuths for entire street

3. **Alignment Detection:**
   ```typescript
   // Compare sun and street directions
   const isAligned = Math.abs(streetAzimuth - sunAzimuth) <= 5°
   ```
   - ±5° tolerance accounts for street irregularities

### **Data Flow**

```
User enters city → Mapbox Geocoding API → Get coordinates
User selects datetime → Frontend sends to /api/alignment
Backend calls /api/streets → OpenStreetMap Overpass API
Calculate street azimuths → Compare with sun azimuth
Return aligned streets → Frontend overlays on Mapbox
```
