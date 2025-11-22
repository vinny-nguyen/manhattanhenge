// Imports
import Image from "next/image";
import dynamic from "next/dynamic";
import HomeHeader from "./components/HomeHeader";
import DateCityForm from "./components/DateCityForm";

const Map = dynamic(() => import("./components/Map"), { ssr: !!false });

export default function Home() {
  return (
    <main className="relative min-h-screen w-full">
      {/* Full-Screen Map */}
      <div className="absolute inset-0 z-0">
        <Map/>
      </div>

      {/* Floating Overlay Panel */}
      <div className="absolute top-8 left-8 z-8 bg-white/50 dark:bg-black/50 backdrop-blur-lg rounded-xl shadow-lg p-6 max-w-sm w-[320px] gap-2">
        <HomeHeader/>
        <DateCityForm/>
      </div>
    </main>
  );
}
