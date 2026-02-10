import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <section className="w-full flex justify-center py-6 px-10">
            <div className="w-full max-w-[1200px]">
                <div className="relative overflow-hidden rounded-xl bg-gray-900 shadow-xl animate-fade-in">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-MHVQ6SMBhv2jiLr4fjZ8HHgsgPf7zeMsg5H9BTvoZEV_31GJXs5uExv7XuTzvSrS8t8NW9EAq5kEeArT4t4z1i89utWyOZ4MOyaNE_w1uqrjz6Cr4w4pwPSRRyHOv5HBa7zBj71VvZ7F1NXxk4kOwOQfLlJInXsrNwPfdKseDnFswLrdN2jbObYOXtgaIOFm3dAt29Voo25N-zEhfHAyWK5C0B2dmNu-fOK2UZ7tys34k7zXR3i-IBNKF42nwgfbrYW7vpBTEH8")' }}
                    >
                    </div>
                    {/* Overlay */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
                    {/* Content */}
                    <div className="relative z-20 flex flex-col items-center justify-center min-h-[400px] px-8 py-10 text-center">
                        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-3 max-w-2xl animate-fade-in-up">
                            AI-Powered Crop Risk Advisory for Smarter Farming
                        </h1>
                        <p className="text-gray-200 text-sm md:text-base font-normal leading-relaxed mb-6 max-w-xl animate-fade-in-up delay-200">
                            Empowering Sri Lankan farmers with real-time insights on weather, market trends, and crop health to maximize yield and minimize loss.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto animate-fade-in-up delay-400">
                            <Link
                                to="/register"
                                className="h-10 px-6 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-all shadow-md flex items-center justify-center btn-hover hover-glow"
                            >
                                Get Started
                            </Link>
                            <a
                                href="#features"
                                className="h-10 px-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/30 text-white text-sm font-medium hover:bg-white/20 transition-all flex items-center justify-center btn-hover"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
