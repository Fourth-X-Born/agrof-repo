import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import adminService from "../../services/adminService";

export default function AdminCropsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [newCropName, setNewCropName] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const itemsPerPage = 5;

    // Fetch crops from API
    useEffect(() => {
        fetchCrops();
    }, []);

    const fetchCrops = async () => {
        try {
            setLoading(true);
            const response = await adminService.getCrops();
            setCrops(response || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching crops:", err);
            setError("Failed to load crops");
            setCrops([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter crops based on search
    const filteredCrops = crops.filter((crop) =>
        crop.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Paginate crops
    const totalPages = Math.ceil(filteredCrops.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCrops = filteredCrops.slice(startIndex, startIndex + itemsPerPage);

    const handleAddCrop = async (e) => {
        e.preventDefault();
        if (!newCropName.trim()) return;

        try {
            setSubmitting(true);
            await adminService.createCrop({ name: newCropName.trim() });
            setNewCropName("");
            fetchCrops(); // Refresh list
        } catch (err) {
            console.error("Error creating crop:", err);
            alert("Failed to create crop");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (crop) => {
        const newName = prompt("Enter new crop name:", crop.name);
        if (newName && newName.trim() !== crop.name) {
            try {
                await adminService.updateCrop(crop.id, { name: newName.trim() });
                fetchCrops();
            } catch (err) {
                console.error("Error updating crop:", err);
                alert("Failed to update crop");
            }
        }
    };

    const handleDelete = async (cropId) => {
        if (!confirm("Are you sure you want to delete this crop?")) return;

        try {
            await adminService.deleteCrop(cropId);
            fetchCrops();
        } catch (err) {
            console.error("Error deleting crop:", err);
            alert("Failed to delete crop");
        }
    };

    return (
        <AdminLayout>
            <div className="animate-fade-in">
                {/* Header */}
                <div className="mb-6 animate-fade-in-up">
                    <h1 className="text-2xl font-bold text-[#131613]">Crops</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage master list of agricultural crops supported by the platform.
                    </p>
                </div>

                {/* Search and Controls */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6 animate-fade-in-up delay-100">
                    <div className="p-4 flex items-center justify-between gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Search crops..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={fetchCrops}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Refresh"
                            >
                                <span className="material-symbols-outlined text-gray-500">refresh</span>
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-gray-500">download</span>
                            </button>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="p-8 text-center text-gray-500">
                            <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
                            <p className="mt-2">Loading crops...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="p-8 text-center text-red-500">
                            <span className="material-symbols-outlined text-2xl">error</span>
                            <p className="mt-2">{error}</p>
                            <button onClick={fetchCrops} className="mt-2 text-primary hover:underline">
                                Try again
                            </button>
                        </div>
                    )}

                    {/* Table */}
                    {!loading && !error && (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-t border-b border-gray-100 bg-gray-50/50">
                                            <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Crop Name
                                            </th>
                                            <th className="text-right py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedCrops.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="py-8 text-center text-gray-400">
                                                    No crops found
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedCrops.map((crop, index) => (
                                                <tr
                                                    key={crop.id}
                                                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors animate-fade-in"
                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                >
                                                    <td className="py-4 px-5 text-sm text-gray-500">{crop.id}</td>
                                                    <td className="py-4 px-5 text-sm font-medium text-[#131613]">{crop.name}</td>
                                                    <td className="py-4 px-5">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEdit(crop)}
                                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                                                            >
                                                                <span className="material-symbols-outlined text-gray-400 text-lg group-hover:text-gray-600">
                                                                    edit
                                                                </span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(crop.id)}
                                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                                                            >
                                                                <span className="material-symbols-outlined text-gray-400 text-lg group-hover:text-red-500">
                                                                    delete
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="p-4 flex items-center justify-between border-t border-gray-100">
                                <p className="text-sm text-gray-500">
                                    Showing {filteredCrops.length > 0 ? startIndex + 1 : 0} to{" "}
                                    {Math.min(startIndex + itemsPerPage, filteredCrops.length)} of {filteredCrops.length} results
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Add New Crop Form */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-fade-in-up delay-200">
                    <h3 className="text-base font-bold text-[#131613] mb-4">Add New Crop</h3>
                    <form onSubmit={handleAddCrop} className="flex items-end gap-4">
                        <div className="flex-1 max-w-md">
                            <label className="block text-xs font-medium text-gray-600 mb-2">Crop Name</label>
                            <input
                                type="text"
                                placeholder="Enter crop name"
                                value={newCropName}
                                onChange={(e) => setNewCropName(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting || !newCropName.trim()}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md btn-hover disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                            ) : (
                                <span className="material-symbols-outlined text-lg">add</span>
                            )}
                            {submitting ? "Adding..." : "Add Crop"}
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
