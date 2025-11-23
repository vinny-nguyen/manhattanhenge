import { NextRequest } from "next/server";

// Calculate azimuth between two points (compass direction)
function calculateAzimuth(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const dLon = toRad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(toRad(lat2));
    const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
              Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
    
    let azimuth = toDeg(Math.atan2(y, x));
    azimuth = (azimuth + 360) % 360;
    return azimuth;
}

// Fetch streets from OpenStreetMap
async function fetchOSMStreets(lat: number, lng: number, radius: number = 0.02) {
    const bbox = `${lat - radius},${lng - radius},${lat + radius},${lng + radius}`;
    
    const query = `
        [out:json][timeout:25];
        (
          way["highway"~"primary|secondary|tertiary|residential|trunk"]
          (${bbox});
        );
        out geom;
    `;

    console.log(`🔍 Fetching streets near [${lat}, ${lng}]...`);

    const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
        headers: { "Content-Type": "text/plain" }
    });

    if (!response.ok) {
        throw new Error(`OSM API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.elements || [];
}

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));

    if (!lat || !lng) {
        return Response.json({ error: "Missing lat/lng" }, { status: 400 });
    }

    try {
        const osmWays = await fetchOSMStreets(lat, lng);
        const streets: any[] = [];

        console.log(`📍 Processing ${osmWays.length} OSM ways...`);

        for (const way of osmWays) {
            if (!way.geometry || way.geometry.length < 2) continue;

            const coords = way.geometry.map((node: any) => [node.lon, node.lat]);
            const name = way.tags?.name || `Street ${way.id}`;

            // Calculate average azimuth
            const azimuths: number[] = [];
            for (let i = 0; i < coords.length - 1; i++) {
                const [lon1, lat1] = coords[i];
                const [lon2, lat2] = coords[i + 1];
                azimuths.push(calculateAzimuth(lat1, lon1, lat2, lon2));
            }
            
            if (azimuths.length === 0) continue;
            
            const avgAzimuth = azimuths.reduce((a, b) => a + b, 0) / azimuths.length;

            streets.push({
                name,
                azimuth: Math.round(avgAzimuth),
                coordinates: coords,
            });
        }

        console.log(`✅ Found ${streets.length} streets`);
        return Response.json({ streets });
        
    } catch (error) {
        console.error("❌ Error:", error);
        return Response.json({ 
            error: "Failed to fetch streets",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}