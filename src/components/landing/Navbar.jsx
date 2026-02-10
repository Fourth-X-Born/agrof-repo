import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#f1f3f1]">
            <div className="flex justify-center w-full">
                <div className="flex items-center justify-between w-full max-w-[1200px] px-6 py-3">
                    <Link to="/" className="flex items-center gap-2 cursor-pointer mr-auto group">
                        <span className="material-symbols-outlined text-primary text-xl group-hover:animate-pulse-subtle">spa</span>
                        <h2 className="text-base font-bold leading-tight tracking-[-0.015em]"><span className="text-[#131613]">Agro</span><span className="text-primary">Sense</span> <span className="text-[#131613]">AI</span></h2>
                    </Link>
                    <nav className="hidden md:flex items-center justify-center gap-10">
                        <a className="text-[#131613] text-sm font-normal hover:text-primary transition-colors link-underline" href="/#">Home</a>
                        <a className="text-[#131613] text-sm font-normal hover:text-primary transition-colors link-underline" href="/#features">Features</a>
                        <a className="text-[#131613] text-sm font-normal hover:text-primary transition-colors link-underline" href="/#how-it-works">How it works</a>
                        <Link className="text-[#131613] text-sm font-normal hover:text-primary transition-colors link-underline" to="/contact-us">Contact Us</Link>
                    </nav>
                    <div className="flex gap-2 ml-auto">
                        <Link
                            to="/login"
                            className="hidden sm:flex h-8 items-center justify-center rounded-lg px-4 bg-transparent border border-gray-300 text-[#131613] text-xs font-medium hover:bg-gray-50 hover:border-primary transition-all btn-hover"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="flex h-8 items-center justify-center rounded-lg px-4 bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors btn-hover hover-glow"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
