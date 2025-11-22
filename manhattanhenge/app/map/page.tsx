import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function MapPage() {
    return (
        <main className="flex min-h screen 
        items-center justify-center 
        bg-zinc-50 dark:bg-black">
            <div className="w-full max-w-3xl 
            p-8 bg-white dark:bg-black 
            round shadow">
                <h1 className="text-3xl font-bold mb-4">Manhattanhenge Map</h1>
                <Map/>
            </div>
        </main>
    );
}