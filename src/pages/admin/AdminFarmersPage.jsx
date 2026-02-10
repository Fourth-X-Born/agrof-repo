import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import adminService from "../../services/adminService";

export default function AdminFarmersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const itemsPerPage = 10;

    // Fetch farmers from API
    useEffect(() => {
        const fetchFarmers = async () => {
            try {
                setLoading(true);
                const response = await adminService.getFarmers();
                const farmersData = response?.data || response || [];
                setFarmers(Array.isArray(farmersData) ? farmersData : []);
            } catch (err) {
                console.error("Error fetching farmers:", err);
                setError("Failed to load farmers");
            } finally {
                setLoading(false);
            }
        };
        fetchFarmers();
    }, []);

    // Get crop color based on crop name
    const getCropColor = (cropName) => {
        const colors = {
            'Rice': 'bg-green-100 text-green-700',
            'Paddy': 'bg-green-100 text-green-700',
            'Maize': 'bg-yellow-100 text-yellow-700',
            'Tomato': 'bg-red-100 text-red-700',
            'Chili': 'bg-red-100 text-red-700',
            'Onion': 'bg-purple-100 text-purple-700',
            'Wheat': 'bg-amber-100 text-amber-700',
            'Cotton': 'bg-blue-100 text-blue-700',
            'Tea': 'bg-emerald-100 text-emerald-700',
            'Rubber': 'bg-orange-100 text-orange-700',
            'Coconut': 'bg-teal-100 text-teal-700',
        };
        return colors[cropName] || 'bg-gray-100 text-gray-700';
    };

    // Filter farmers based on search
    const filteredFarmers = farmers.filter(
        (farmer) =>
            farmer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            farmer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            farmer.district?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            farmer.phone?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Paginate farmers
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedFarmers = filteredFarmers.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage);

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    return (
        <AdminLayout>
            <div className="animate-fade-in">
                {/* Header */}
                <div className="mb-6 animate-fade-in-up">
                    <h1 className="text-2xl font-bold text-[#131613]">Farmers</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        View registered farmers and their primary crop information.
                    </p>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm animate-fade-in-up delay-100">
                    {/* Search and Controls */}
                    <div className="p-4 flex items-center justify-between gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Search farmers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>

                        {/* Total Count */}
                        <span className="text-xs text-gray-500">
                            Total: {filteredFarmers.length} farmers
                        </span>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                                <p className="text-gray-500 mt-3 text-sm">Loading farmers...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
                                <p className="text-red-600 mt-2">{error}</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-t border-b border-gray-100 bg-gray-50/50">
                                            <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Phone
                                            </th>
                                            <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                District
                                            </th>
                                            <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Primary Crop
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedFarmers.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="py-8 text-center text-gray-500">
                                                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">person_off</span>
                                                    <p className="text-sm">No farmers found</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedFarmers.map((farmer, index) => (
                                                <tr
                                                    key={farmer.id}
                                                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors animate-fade-in"
                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                >
                                                    <td className="py-4 px-5 text-sm text-gray-500">#{farmer.id}</td>
                                                    <td className="py-4 px-5 text-sm font-medium text-[#131613]">{farmer.name}</td>
                                                    <td className="py-4 px-5 text-sm text-gray-500">{farmer.email || '-'}</td>
                                                    <td className="py-4 px-5 text-sm text-gray-500">{farmer.phone || '-'}</td>
                                                    <td className="py-4 px-5 text-sm text-gray-500">{farmer.district?.name || '-'}</td>
                                                    <td className="py-4 px-5">
                                                        {farmer.crop ? (
                                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getCropColor(farmer.crop.name)}`}>
                                                                {farmer.crop.name}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">-</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {filteredFarmers.length > 0 && (
                                <div className="p-4 flex items-center justify-between border-t border-gray-100">
                                    <p className="text-sm text-gray-500">
                                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredFarmers.length)} of{" "}
                                        {filteredFarmers.length} results
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-sm text-gray-500">
                                            Page {currentPage} of {totalPages || 1}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages || totalPages === 0}
                                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
