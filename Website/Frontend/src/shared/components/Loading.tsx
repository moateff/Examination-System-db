export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
            <div className="relative flex flex-col items-center">

                <div className="mb-8 animate-pulse">
                    <img src="/iti-logo.png" alt="ITI Logo" className="h-24 w-auto drop-shadow-xl" />
                </div>

                {/* Fading Text */}
                <div className="flex space-x-0.5">
                    {['L', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.'].map((char, index) => (
                        <span
                            key={index}
                            className="text-lg font-bold text-red-600 animate-reveal"
                            style={{
                                animationDelay: `${index * 150}ms`
                            }}
                        >
                            {char}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}