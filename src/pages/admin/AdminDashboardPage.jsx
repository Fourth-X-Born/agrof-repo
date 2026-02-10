import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import adminService from "../../services/adminService";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalCrops: 0,
        totalDistricts: 0,
        totalFarmers: 0,
        totalFertilizers: 0,
    });
    const [recentPrices, setRecentPrices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [cropsRes, districtsRes, pricesRes, fertilizersRes, farmersRes] = await Promise.all([
                adminService.getCrops(),
                adminService.getDistricts(),
                adminService.getMarketPrices(),
                adminService.getFertilizers(),
                adminService.getFarmers(),
            ]);

            setStats({
                totalCrops: cropsRes?.length || 0,
                totalDistricts: districtsRes?.length || 0,
                totalFarmers: farmersRes?.length || 0,
                totalFertilizers: fertilizersRes?.length || 0,
            });

            // Get recent 5 market prices
            setRecentPrices((pricesRes || []).slice(0, 5));
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: "Total Crops", value: stats.totalCrops, icon: "eco", iconBg: "bg-green-50", iconColor: "text-primary" },
        { label: "Total Districts", value: stats.totalDistricts, icon: "location_on", iconBg: "bg-blue-50", iconColor: "text-blue-500" },
        { label: "Total Farmers", value: stats.totalFarmers, icon: "groups", iconBg: "bg-orange-50", iconColor: "text-orange-500" },
        { label: "Fertilizer Recs", value: stats.totalFertilizers, icon: "science", iconBg: "bg-purple-50", iconColor: "text-purple-500" },
    ];

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <AdminLayout>
            <div className="animate-fade-in">
                {/* Header */}
                <div className="mb-8 animate-fade-in-up">
                    <h1 className="text-2xl font-bold text-[#131613]">Welcome, Admin</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage your platform data from this central dashboard.
                    </p>
                </div>

                {/* Analytics Overview */}
                <div className="mb-8 animate-fade-in-up delay-100">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                        Analytics Overview
                    </h2>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                                    <div className="h-10 w-10 bg-gray-100 rounded-lg mb-3"></div>
                                    <div className="h-6 w-16 bg-gray-100 rounded mb-2"></div>
                                    <div className="h-4 w-24 bg-gray-100 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {statCards.map((stat, index) => (
                                <div
                                    key={stat.label}
                                    className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all card-interactive animate-fade-in-up"
                                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                                >
                                    <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center mb-3`}>
                                        <span className={`material-symbols-outlined ${stat.iconColor}`}>{stat.icon}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#131613]">{stat.value}</h3>
                                    <p className="text-gray-500 text-sm">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Market Prices */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm animate-fade-in-up delay-300">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-[#131613]">Recent Market Prices</h3>
                            <p className="text-gray-400 text-xs mt-0.5">Latest price entries across all districts</p>
                        </div>
                        <button onClick={fetchDashboardData} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-gray-500">refresh</span>
                        </button>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">
                            <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/50">
                                            <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                                            <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">Crop</th>
                                            <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">District</th>
                                            <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">Price (Rs/Kg)</th>
                                            <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentPrices.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="py-8 text-center text-gray-400">No market prices found</td>
                                            </tr>
                                        ) : (
                                            recentPrices.map((price, index) => (
                                                <tr
                                                    key={price.id}
                                                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="py-4 px-5">
                                                        <span className="text-sm text-gray-600">#{price.id}</span>
                                                    </td>
                                                    <td className="py-4 px-5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                            <span className="text-sm font-medium text-[#131613]">{price.cropName || price.crop?.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-5 text-sm text-gray-500">{price.districtName || price.district?.name}</td>
                                                    <td className="py-4 px-5 text-sm font-semibold text-primary">{parseFloat(price.pricePerKg || price.price || 0).toFixed(2)}</td>
                                                    <td className="py-4 px-5 text-sm text-gray-400">{formatDate(price.priceDate || price.date)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4 border-t border-gray-100">
                                <Link
                                    to="/admin/market-prices"
                                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center gap-1"
                                >
                                    View all market prices
                                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
