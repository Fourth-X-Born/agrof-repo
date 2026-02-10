import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import adminAuthService from "../../services/adminAuthService";

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    const navItems = [
        { path: "/admin", label: "Dashboard", icon: "dashboard" },
        { path: "/admin/crops", label: "Crops", icon: "eco" },
        { path: "/admin/crop-guides", label: "Crop Guides", icon: "menu_book" },
        { path: "/admin/market-prices", label: "Market Prices", icon: "trending_up" },
        { path: "/admin/fertilizer", label: "Fertilizer", icon: "science" },
        { path: "/admin/farmers", label: "Farmers", icon: "groups" },
        { path: "/admin/user-requests", label: "User Requests", icon: "contact_mail" },
    ];

    const handleSignOut = () => {
        // Clear admin auth tokens/state
        adminAuthService.logout();
        navigate("/admin/login");
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-[200px] bg-white border-r border-gray-100 flex flex-col animate-fade-in-left">
            {/* Logo */}
            <div className="px-4 py-5 border-b border-gray-100">
                <Link to="/admin" className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">spa</span>
                        <span className="text-[#131613] text-sm font-bold whitespace-nowrap">
                            Agro<span className="text-primary">Sense</span> AI
                        </span>
                    </div>
                    <span className="ml-7 px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-medium rounded w-fit">
                        Admin
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3">
                <ul className="space-y-1">
                    {navItems.map((item, index) => {
                        const isActive = currentPath === item.path;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? "bg-green-50 text-primary"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <span
                                        className={`material-symbols-outlined text-lg ${isActive ? "text-primary" : "text-gray-400"
                                            }`}
                                    >
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Sign Out */}
            <div className="px-3 py-4 border-t border-gray-100">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
                >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
