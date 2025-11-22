// Playfair Display: https://fonts.google.com/specimen/Playfair+Display?preview.text=Manhattanhenge

export default function HomeHeader() {
    return (
        <div className="mb-5">
            <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-1 tracking-tight" 
            style={{ fontFamily: "var(--font-playfair)" }}>
                Manhattanhenge
            </h1>
            <p className="text-lg top-5 text-zinc-500 dark:text-zinc-400 mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}>
                /ˌmænˈhætnˌhɛndʒ/ • noun
            </p>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
                <span className="font-medium text-zinc-700 dark:text-zinc-300"
                style={{ fontFamily: "var(--font-playfair)" }}>
                    A phenomenon when the setting sun aligns perfectly with the streets and buildings of Manhattan, New York.
                </span>
            </p>
        </div>
    );
}