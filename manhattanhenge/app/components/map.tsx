"use client";

// Imports:
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.MAPBOX_TOKEN as string;

export default function Map() {
    const mapContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapContainer.current) return;
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/light-v11",
            center: [-73.9857, 40.7484],
            zoom: 12,
        });

        return () => map.remove();
    }, []);

    return (
        <div ref={mapContainer} 
        className="w-full h-96 rounded border border-black/[.08]"
        />
    );
}