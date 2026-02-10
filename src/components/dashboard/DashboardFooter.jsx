import React from "react";
import { Link } from "react-router-dom";

const DashboardFooter = () => {
    return (
        <footer className="bg-white border-t border-gray-100 mt-8">
            <div className="max-w-[1200px] mx-auto px-6 py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-base">spa</span>
                        <span className="text-xs font-bold"><span className="text-[#131613]">Agro</span><span className="text-primary">Sense</span> <span className="text-[#131613]">AI</span></span>
                    </Link>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="text-gray-500 text-xs hover:text-gray-700">Privacy Policy</Link>
                        <Link to="/terms" className="text-gray-500 text-xs hover:text-gray-700">Terms of Service</Link>
                        <Link to="/contact" className="text-gray-500 text-xs hover:text-gray-700">Contact Us</Link>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400">© 2026 <span className="font-semibold"><span className="text-gray-500">Agro</span><span className="text-primary">Sense</span> AI</span>. All rights reserved.</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                        <span className="material-symbols-outlined text-xs">code</span>
                        Developed by Team Forth X Born
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default DashboardFooter;
