"use client";

import { useState } from "react";
import axios from "axios";

export default function DateCityForm({ onSubmit }: { onSubmit: (data: { city: string, latitude: number, longitude: number, datetime: string }) => void }) {
    const [datetime, setDatetime] = useState("");
    const [city, setCity] = useState("");
    const [selectedCity, setSelectedCity] = useState<{ name: string, latitude: number, longitude: number } | null>(null);
    const [suggestions, setSuggestions] = useState<{ name: string, latitude: number, longitude: number }[]>([]);

    async function fetchSuggestions(query: string) {
        if (!query) return setSuggestions([]);
        try {
            const res = await axios.get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
                {
                    params: {
                        access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
                        types: "place",
                        limit: 5
                    }
                }
            );
            setSuggestions(
                res.data.features.map((f: any) => ({
                    name: f.place_name,
                    latitude: f.center[1],
                    longitude: f.center[0]
                }))
            );
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedCity || !datetime) {
            alert("Please select a city and date/time");
            return;
        }
        onSubmit({
            city: selectedCity.name,
            latitude: selectedCity.latitude,
            longitude: selectedCity.longitude,
            datetime
        });
    }

    return (
        <form className="flex flex-col gap-4 mb-8" onSubmit={handleSubmit}>
            <label className="text-base text-zinc-700 dark:text-zinc-300 font-bold"
                style={{ fontFamily: "var(--font-playfair)" }}>
                City
                <div className="relative">
                    <input 
                        type="text"
                        value={city}
                        onChange={e => {
                            setCity(e.target.value);
                            fetchSuggestions(e.target.value);
                        }}
                        className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-base bg-white dark:bg-zinc-900 dark:text-zinc-100 font-medium"
                        placeholder="Enter City (e.g. New York, NY)"
                        autoComplete="off"
                    />
                    {suggestions.length > 0 && (
                        <ul className="absolute z-50 w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 mt-1 rounded shadow-lg max-h-48 overflow-y-auto">
                            {suggestions.map((s, i) => (
                                <li 
                                    key={i} 
                                    className="px-3 py-2 text-sm cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900 dark:text-zinc-100 font-medium"
                                    onClick={() => {
                                        setCity(s.name);
                                        setSelectedCity(s);
                                        setSuggestions([]);
                                    }}
                                >
                                    {s.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </label>

            <label className="text-base text-zinc-700 dark:text-zinc-300 font-bold"
                style={{ fontFamily: "var(--font-playfair)" }}>
                Date & Time
                <input
                    type="datetime-local"
                    value={datetime}
                    onChange={e => setDatetime(e.target.value)}
                    className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 bg-white dark:bg-zinc-900 dark:text-zinc-100 font-medium"
                />
            </label>

            <button
                type="submit"
                className="mt-2 w-full rounded bg-indigo-600 text-white py-2 font-semibold hover:bg-indigo-700 transition"
            >
                Show Alignment
            </button>
        </form>
    );
}