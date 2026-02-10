import React, { useState, useEffect, useRef } from "react";

const Features = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const features = [
        {
            icon: "leak_add",
            title: "Crop Risk Prediction",
            description: "Analyze soil and environmental data using AI to predict potential disease risks before they spread, saving your harvest."
        },
        {
            icon: "opacity",
            title: "Weather Advisory",
            description: "Localized, hyper-accurate weather forecasts to help you plan your planting, irrigation, and harvesting schedules effectively."
        },
        {
            icon: "trending_up",
            title: "Market Prices",
            description: "Real-time updates on vegetable and crop prices across major economic centers in Sri Lanka to help you sell at the right time."
        }
    ];

    return (
        <section ref={sectionRef} className="w-full flex justify-center py-10 px-10" id="features">
            <div className="w-full max-w-[1200px]">
                <div className={`flex flex-col gap-1 mb-6 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                    <h2 className="text-[#131613] text-xl font-bold leading-tight tracking-tight">Our Key Features</h2>
                    <p className="text-gray-500 text-sm">Everything you need to manage your farm efficiently.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`flex flex-col gap-3 rounded-lg border border-[#e5e7e5] bg-white p-5 shadow-sm card-interactive ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                                }`}
                            style={{ animationDelay: `${(index + 1) * 150}ms` }}
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary icon-hover">
                                <span className="material-symbols-outlined text-xl">{feature.icon}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-[#131613] text-base font-semibold leading-tight">{feature.title}</h3>
                                <p className="text-[#6b806c] text-xs font-normal leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
