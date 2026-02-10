import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const CTASection = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="w-full flex justify-center py-12 px-10">
            <div className="w-full max-w-[1200px]">
                <div className={`bg-[#2f7f33] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg overflow-hidden relative ${isVisible ? 'animate-scale-in' : 'opacity-0'
                    }`}>
                    {/* Decorative Pattern */}
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-black/10 rounded-full blur-2xl animate-float delay-500"></div>
                    <div className={`flex flex-col gap-2 relative z-10 text-center md:text-left ${isVisible ? 'animate-fade-in-left delay-200' : 'opacity-0'}`}>
                        <h2 className="text-white text-xl md:text-2xl font-bold">Ready to modernize your farm?</h2>
                        <p className="text-white/90 text-sm max-w-md">Join thousands of Sri Lankan farmers using <span className="font-bold">Agro<span className="text-green-300">Sense</span> AI</span> today.</p>
                    </div>
                    <div className={`relative z-10 w-full md:w-auto flex justify-center md:justify-end ${isVisible ? 'animate-fade-in-right delay-400' : 'opacity-0'}`}>
                        <Link
                            to="/register"
                            className="h-10 px-6 rounded-lg bg-white text-[#2f7f33] text-sm font-medium hover:bg-gray-100 transition-colors shadow-md whitespace-nowrap flex items-center justify-center btn-hover hover-scale"
                        >
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
