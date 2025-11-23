"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

export default function Map({ alignedStreets, mapCenter }: { alignedStreets?: any[], mapCenter?: [number, number] }) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [styleLoaded, setStyleLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const initialized = useRef(false); // Track if map has been initialized

    // Initialize map ONCE
    useEffect(() => {
        if (!mapContainer.current) return;
        if (initialized.current) return; // Prevent double initialization
        if (mapRef.current) return;

        // Check if token exists
        if (!mapboxgl.accessToken) {
            setError("Mapbox token is missing!");
            console.error("NEXT_PUBLIC_MAPBOX_TOKEN is not set");
            return;
        }

        console.log("Initializing map...");
        initialized.current = true;

        try {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/mapbox/outdoors-v12",
                center: mapCenter || [-73.9857, 40.7484],
                zoom: 8,
            });

            mapRef.current = map;

            map.on("load", () => {
                console.log("Map loaded successfully!");
                setStyleLoaded(true);
            });

            map.on("error", (e) => {
                console.error("Map error:", e);
                setError(`Map error: ${e.error.message}`);
            });

        } catch (err) {
            console.error("Failed to initialize map:", err);
            setError("Failed to initialize map");
            initialized.current = false;
        }

        return () => {
            console.log("Cleaning up map...");
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
            initialized.current = false;
        };
    }, []); // Empty deps - only run once

    // Update map center when city changes
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !mapCenter) return;
        console.log("Flying to:", mapCenter);
        map.flyTo({ center: mapCenter, zoom: 13 });
    }, [mapCenter]);

    // Overlay aligned streets
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !styleLoaded) return;

        console.log("Updating aligned streets:", alignedStreets?.length || 0);

        // Remove previous layer/source if exists
        if (map.getLayer("aligned-streets")) {
            map.removeLayer("aligned-streets");
        }
        if (map.getSource("aligned-streets")) {
            map.removeSource("aligned-streets");
        }

        // Add new overlay if there are aligned streets
        if (alignedStreets && alignedStreets.length > 0) {
            console.log("Adding aligned streets overlay");
            map.addSource("aligned-streets", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: alignedStreets.map(street => ({
                        type: "Feature",
                        properties: { name: street.name },
                        geometry: {
                            type: "LineString",
                            coordinates: street.coordinates
                        }
                    }))
                }
            });

            map.addLayer({
                id: "aligned-streets",
                type: "line",
                source: "aligned-streets",
                paint: {
                    "line-color": "#ff6600",
                    "line-width": 5,
                    "line-opacity": 0.8
                }
            });
        }
    }, [alignedStreets, styleLoaded]);

    if (error) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-red-100">
                <p className="text-red-600 font-bold">{error}</p>
            </div>
        );
    }

    return (
        <div ref={mapContainer} className="w-full h-screen" />
    );
}