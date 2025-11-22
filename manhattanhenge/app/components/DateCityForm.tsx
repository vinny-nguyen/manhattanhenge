"use client";

import { useState } from "react";

export default function DateCityForm() {
    const [date, setDate] = useState("");
    const [city, setCity] = useState("New York, NY");

    return (
        <form className="flex flex-col gap-4 mb-8">
            <label className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                City
                <input 
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-base bg-white dark:bg-zinc-900 dark:text-zinc-100"
                    placeholder="Enter City (e.g. New York, NY)"
                />
            </label>
            <label className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                Date & Time
                <input
                    type="datetime-local"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="mt-1 w-full rounded border border-zinc-300"
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