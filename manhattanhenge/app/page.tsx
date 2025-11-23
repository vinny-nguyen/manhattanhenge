"use client";

// Imports:
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import HomeHeader from "./components/HomeHeader";
import DateCityForm from "./components/DateCityForm";

const Map = dynamic(() => import("./components/Map"), { ssr: false });

export default function Home() {
  const [alignedStreets, setAlignedStreets] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-73.9857, 40.7484]);
  const [panelPos, setPanelPos] = useState({ x: 32, y: 32 }); // Initial position (top-left)
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  async function handleFormSubmit({ city, latitude, longitude, datetime}: { city: string, latitude: number, longitude: number, datetime: string}) {
    setMapCenter([longitude, latitude]);
    const res = await fetch(`/api/alignment?lat=${latitude}&lng=${longitude}&datetime=${datetime}`);
    const data = await res.json();
    setAlignedStreets(data.aligned || []);
  }

  // Handle drag start
  function handleMouseDown(e: React.MouseEvent) {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  }

  // Handle drag move
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isDragging) return;
      setPanelPos({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }

    function handleMouseUp() {
      setIsDragging(false);
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <main className="relative min-h-screen w-full">
      {/* Full-Screen Map */}
      <div className="absolute inset-0 z-0">
        <Map alignedStreets={alignedStreets} mapCenter={mapCenter}/>
      </div>
      
      {/* Draggable Floating Overlay Panel */}
      <div 
        ref={panelRef}
        style={{
          position: "absolute",
          left: `${panelPos.x}px`,
          top: `${panelPos.y}px`,
          cursor: isDragging ? "grabbing" : "grab"
        }}
        className="z-10 bg-white/40 dark:bg-black/40 backdrop-blur-lg rounded-xl shadow-lg p-6 pb-3 max-w-sm w-[320px]"
        onMouseDown={handleMouseDown}
      >
        <HomeHeader/>
        <DateCityForm onSubmit={handleFormSubmit}/>
      </div>
    </main>
  );
}