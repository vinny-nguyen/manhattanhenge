"use client";

// Imports:
import { useState } from "react";
import dynamic from "next/dynamic";
import HomeHeader from "./components/HomeHeader";
import DateCityForm from "./components/DateCityForm";

const Map = dynamic(() => import("./components/Map"), { ssr: false });

export default function Home() {
  const [alignedStreets, setAlignedStreets] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-73.9857, 40.7484]);

  async function handleFormSubmit({ city, latitude, longitude, datetime}: { city: string, latitude: number, longitude: number, datetime: string}) {
    setMapCenter([longitude, latitude]);
    const res = await fetch(`/api/alignment?lat=${latitude}&lng=${longitude}&datetime=${datetime}`);
    const data = await res.json();
    setAlignedStreets(data.aligned || []);
  }

  return (
    <main className="relative min-h-screen w-full">
      {/* Full-Screen Map */}
      <div className="absolute inset-0 z-0">
        <Map alignedStreets={alignedStreets} mapCenter={mapCenter}/>
      </div>
      
      {/* Floating Overlay Panel */}
      <div className="absolute top-8 left-8 z-10 bg-white/50 dark:bg-black/50 backdrop-blur-lg rounded-xl shadow-lg p-6 pb-2 max-w-sm w-[320px] gap-2">
        <HomeHeader/>
        <DateCityForm onSubmit={handleFormSubmit}/>
      </div>
    </main>
  );
}
