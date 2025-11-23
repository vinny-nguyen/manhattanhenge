import SunCalc from "suncalc";
import { NextRequest } from "next/server";

// Example Manhattan streets - replace with real data later
const streets = [
    { name: "14th St", azimuth: 119, coordinates: [[-74.0094, 40.7379], [-73.9745, 40.7317]] },
    { name: "23rd St", azimuth: 119, coordinates: [[-74.0094, 40.7463], [-73.9745, 40.7401]] },
    { name: "34th St", azimuth: 119, coordinates: [[-74.0019, 40.7549], [-73.9710, 40.7489]] },
    { name: "42nd St", azimuth: 119, coordinates: [[-73.9988, 40.7580], [-73.9685, 40.7520]] },
    { name: "57th St", azimuth: 119, coordinates: [[-73.9885, 40.7649], [-73.9582, 40.7589]] }
];

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));
    const datetime = searchParams.get("datetime");
    const tolerance = Number(searchParams.get("tolerance") ?? 5);

    if (!lat || !lng || !datetime) {
        return Response.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        // Calculate sun azimuth
        const pos = SunCalc.getPosition(new Date(datetime), lat, lng);
        // Convert from radians to degrees, adjust to compass bearing (0° = North)
        const sunAzimuth = ((pos.azimuth * 180) / Math.PI + 180) % 360;

        // Find aligned streets
        const aligned = streets.filter(street => {
            const diff = Math.abs(street.azimuth - sunAzimuth);
            return diff <= tolerance || diff >= (360 - tolerance);
        });

        return Response.json({ 
            sunAzimuth: Math.round(sunAzimuth * 100) / 100,
            aligned 
        });
    } catch (error) {
        console.error("Error calculating alignment:", error);
        return Response.json({ error: "Calculation failed" }, { status: 500 });
    }
}