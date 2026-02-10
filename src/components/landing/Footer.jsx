import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="w-full flex justify-center py-8 px-10 border-t border-[#f1f3f1] bg-white">
            <div className="w-full max-w-[1200px] flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">spa</span>
                        <span className="text-sm font-semibold"><span className="text-[#131613]">Agro</span><span className="text-primary">Sense</span> <span className="text-[#131613]">AI</span></span>
                    </div>
                    <div className="flex gap-6 text-xs font-normal text-gray-500">
                        <Link className="hover:text-primary" to="/privacy-policy">Privacy Policy</Link>
                        <Link className="hover:text-primary" to="/terms-of-service">Terms of Service</Link>
                        <Link className="hover:text-primary" to="/contact-us">Contact Us</Link>
                    </div>
                </div>
                <div className="border-t border-[#f1f3f1] w-full"></div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] text-gray-400 text-center md:text-left">
                    <p>© 2026 <span className="font-semibold"><span className="text-[#131613]">Agro</span><span className="text-primary">Sense</span> AI</span>. All rights reserved.</p>
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px]">shield</span>
                        <span>Developed by Team Fourth X Born</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
