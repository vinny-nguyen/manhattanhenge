import SunCalc from "suncalc";
import { NextRequest } from "next/server";
import streets from "@/data/manhattan_streets.json";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));
    const datetime = searchParams.get("datetime");
    const tolerance = Number(searchParams.get("tolerance") ?? 1);

    if (!lat || !lng || !datetime) {
        return Response.json({ error: "Missing parameters" }, { status: 400});
    }

    const pos = SunCalc.getPosition(new Date(datetime), lat, lng);
    const azimuthdegrees = (pos.azimuth * 180) / Math.PI + 180;

    // Find Aligned Streets:
    const aligned = streets.filter(street =>
        Math.abs(street.azimuth - azimuthdegrees) <= tolerance
    );

    return Response.json({ azimuthdegrees, aligned });
}