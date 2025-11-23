"use client";

import { useState } from "react";
import axios from "axios";

export default function DateCityForm({ onSubmit }: { onSubmit: (data: { city: string, latitude: number, longitude: number, datetime: string }) => void }) {
    const [date, setDate] = useState("");
    const [city, setCity] = useState("");
    const [suggestions, setSuggestions] = useState<{ name: string, latitude: number, longitude: number }[]>([]);
    const [selected, setSelected] = useState<{ name: string, latitude: number, longitude: number } | null>(null);

    async function fetchSuggestions(query: string) {
        if (!query) return setSuggestions([]);
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
    }

    return (
        <form className="flex flex-col gap-4 mb-8" onSubmit={e => {
            e.preventDefault();
            if (selected && date) {
                onSubmit({
                    city: selected.name,
                    latitude: selected.latitude,
                    longitude: selected.longitude,
                    datetime: date
                });
            }
        }}>
            <label className="text-base text-zinc-700 dark:text-zinc-300 bold font-bold"
            style={{ fontFamily: "var(--font-playfair)" }}>
                City
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
                    <ul className="bg-white border mt-1 rounded shadow absolute z-20 w-full">
                        {suggestions.map((s, i) => (
                            <li key={i} className="mt-1 px-3 py-2 text-base cursor-pointer hover:bg-indigo-100 font-medium"
                                onClick={() => {
                                    setCity(s.name);
                                    setSelected(s);
                                    setSuggestions([]);
                                }}>
                                {s.name}
                            </li>
                        ))}
                    </ul>
                )}
            </label>
            <label className="text-base text-zinc-700 dark:text-zinc-300 font-bold"
            style={{ fontFamily: "var(--font-playfair)" }}>
                Date & Time
                <input
                    type="datetime-local"
                    value={date}
                    onChange={e => setDate(e.target.value)}
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