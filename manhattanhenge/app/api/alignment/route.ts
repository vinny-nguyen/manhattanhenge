import SunCalc from "suncalc";
import { NextRequest } from "next/server";

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
        // 1. Calculate sun azimuth
        const date = new Date(datetime);
        const pos = SunCalc.getPosition(date, lat, lng);
        const sunAzimuth = ((pos.azimuth * 180) / Math.PI + 180) % 360;
        const sunAltitude = (pos.altitude * 180) / Math.PI;

        console.log(`☀️ Sun: azimuth=${sunAzimuth.toFixed(2)}°, altitude=${sunAltitude.toFixed(2)}°`);

        // 2. Fetch streets dynamically from OSM
        const streetsRes = await fetch(
            `${req.nextUrl.origin}/api/streets?lat=${lat}&lng=${lng}`
        );
        const { streets } = await streetsRes.json();

        // 3. Filter aligned streets
        const aligned = streets.filter((street: any) => {
            const diff = Math.abs(street.azimuth - sunAzimuth);
            const isAligned = diff <= tolerance || diff >= (360 - tolerance);
            
            if (isAligned) {
                console.log(`✅ ${street.name}: ${street.azimuth}° (diff: ${diff.toFixed(2)}°)`);
            }
            return isAligned;
        });

        console.log(`🎯 ${aligned.length}/${streets.length} streets aligned`);

        return Response.json({
            sunAzimuth: Math.round(sunAzimuth * 100) / 100,
            sunAltitude: Math.round(sunAltitude * 100) / 100,
            aligned,
            totalStreets: streets.length,
        });
    } catch (error) {
        console.error("Error calculating alignment:", error);
        return Response.json({ error: "Calculation failed" }, { status: 500 });
    }
}