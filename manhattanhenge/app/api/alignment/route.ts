import SunCalc from "suncalc";
import { NextRequest } from "next/server";

// Example Manhattan streets - you'll expand this later
const manhattanStreets = [
    { name: "14th St", azimuth: 119, coordinates: [[-74.0094, 40.7379], [-73.9745, 40.7317]] },
    { name: "23rd St", azimuth: 119, coordinates: [[-74.0094, 40.7463], [-73.9745, 40.7401]] },
    { name: "34th St", azimuth: 119, coordinates: [[-74.0019, 40.7549], [-73.9710, 40.7489]] },
    { name: "42nd St", azimuth: 119, coordinates: [[-73.9988, 40.7580], [-73.9685, 40.7520]] },
    { name: "57th St", azimuth: 119, coordinates: [[-73.9885, 40.7649], [-73.9582, 40.7589]] },
    { name: "79th St", azimuth: 119, coordinates: [[-73.9799, 40.7838], [-73.9495, 40.7778]] }
];

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));
    const datetime = searchParams.get("datetime");
    const tolerance = Number(searchParams.get("tolerance") ?? 30);
    const demo = searchParams.get("demo") === "true"; // Demo mode

    if (!lat || !lng || !datetime) {
        return Response.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        // Calculate sun position
        const date = new Date(datetime);
        const pos = SunCalc.getPosition(date, lat, lng);
        
        // Convert azimuth from radians to degrees, normalized to 0-360
        const sunAzimuth = ((pos.azimuth * 180) / Math.PI + 180) % 360;
        const sunAltitude = (pos.altitude * 180) / Math.PI;

        console.log(`Sun azimuth: ${sunAzimuth.toFixed(2)}°, altitude: ${sunAltitude.toFixed(2)}°`);

        // In demo mode, always show streets
        let aligned;
        if (demo) {
            aligned = manhattanStreets;
            console.log("🎬 DEMO MODE: Showing all streets");
        } else {
            // Find aligned streets
            aligned = manhattanStreets.filter(street => {
                const diff = Math.abs(street.azimuth - sunAzimuth);
                const isAligned = diff <= tolerance || diff >= (360 - tolerance);
                if (isAligned) {
                    console.log(`✅ ${street.name} aligned! Street: ${street.azimuth}°, Sun: ${sunAzimuth.toFixed(2)}°, Diff: ${diff.toFixed(2)}°`);
                }
                return isAligned;
            });
        }

        console.log(`Total aligned streets: ${aligned.length}`);

        return Response.json({ 
            sunAzimuth: Math.round(sunAzimuth * 100) / 100,
            sunAltitude: Math.round(sunAltitude * 100) / 100,
            aligned,
            totalStreets: manhattanStreets.length,
            tolerance,
            demo
        });
    } catch (error) {
        console.error("Error calculating alignment:", error);
        return Response.json({ error: "Calculation failed" }, { status: 500 });
    }
}