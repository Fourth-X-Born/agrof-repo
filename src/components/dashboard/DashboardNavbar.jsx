import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";

const DashboardNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const [user, setUser] = useState({});

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(userData);

        // Listen for storage changes (when profile photo is updated)
        const handleStorageChange = () => {
            const updatedUser = JSON.parse(localStorage.getItem("user") || "{}");
            setUser({...updatedUser}); // Force new object reference to trigger re-render
        };
        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("userUpdated", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("userUpdated", handleStorageChange);
        };
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
    };

    const navItems = [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/crop-risk", label: "Crop Risk" },
        { path: "/weather", label: "Weather" },
        { path: "/market-prices", label: "Market Prices" },
        { path: "/crop-guide", label: "Crop Guide" },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
            <div className="flex items-center justify-between max-w-[1200px] mx-auto px-6 py-3">
                {/* Logo */}
                <Link to="/dashboard" className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">spa</span>
                    <span className="text-[#131613] text-sm font-bold">Agro<span className="text-primary">Sense</span> AI</span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`text-xs font-normal transition-colors ${currentPath === item.path
                                ? "text-[#131613] font-medium border-b-2 border-primary pb-1"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                    {/* Notification Dropdown */}
                    <NotificationDropdown />

                    {/* Profile Avatar */}
                    <Link to="/settings" className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden hover:ring-2 hover:ring-primary/30 transition-all flex items-center justify-center flex-shrink-0">
                        {user.profilePhoto && user.profilePhoto.length > 0 ? (
                            <img
                                src={user.profilePhoto}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="material-symbols-outlined text-gray-500 text-lg">person</span>
                        )}
                    </Link>

                    {/* Sign Out Button */}
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Sign Out"
                    >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default DashboardNavbar;

