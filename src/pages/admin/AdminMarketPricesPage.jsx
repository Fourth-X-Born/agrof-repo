import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import adminService from "../../services/adminService";

export default function AdminMarketPricesPage() {
    const [formData, setFormData] = useState({
        cropId: "",
        districtId: "",
        price: "",
        date: "",
    });

    const [priceEntries, setPriceEntries] = useState([]);
    const [crops, setCrops] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [pricesRes, cropsRes, districtsRes] = await Promise.all([
                adminService.getMarketPrices(),
                adminService.getCrops(),
                adminService.getDistricts(),
            ]);
            setPriceEntries(pricesRes || []);
            setCrops(cropsRes || []);
            setDistricts(districtsRes || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.cropId || !formData.districtId || !formData.price || !formData.date) {
            alert("Please fill in all fields");
            return;
        }

        try {
            setSubmitting(true);
            await adminService.createMarketPrice({
                cropId: parseInt(formData.cropId),
                districtId: parseInt(formData.districtId),
                price: parseFloat(formData.price),
                date: formData.date,
            });
            setFormData({ cropId: "", districtId: "", price: "", date: "" });
            fetchData();
        } catch (err) {
            console.error("Error creating market price:", err);
            alert("Failed to create market price");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this price entry?")) return;
        try {
            await adminService.deleteMarketPrice(id);
            fetchData();
        } catch (err) {
            console.error("Error deleting market price:", err);
            alert("Failed to delete market price");
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <AdminLayout>
            <div className="animate-fade-in">
                {/* Header */}
                <div className="mb-6 animate-fade-in-up">
                    <h1 className="text-2xl font-bold text-[#131613]">Market Prices Management</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage daily market rates for agricultural commodities across districts.
                    </p>
                </div>

                {/* Recent Price Entries Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6 animate-fade-in-up delay-100">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-base font-bold text-[#131613]">All Price Entries ({priceEntries.length})</h3>
                        <button onClick={fetchData} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-gray-500">refresh</span>
                        </button>
                    </div>

                    {loading && (
                        <div className="p-8 text-center text-gray-500">
                            <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
                            <p className="mt-2">Loading market prices...</p>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="p-8 text-center text-red-500">
                            <span className="material-symbols-outlined text-2xl">error</span>
                            <p className="mt-2">{error}</p>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                                        <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">Crop</th>
                                        <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">District</th>
                                        <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">Price (Rs/Kg)</th>
                                        <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="text-right py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {priceEntries.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-gray-400">No price entries found</td>
                                        </tr>
                                    ) : (
                                        priceEntries.map((entry, index) => (
                                            <tr
                                                key={entry.id}
                                                className="border-b border-gray-50 hover:bg-gray-50 transition-colors animate-fade-in"
                                                style={{ animationDelay: `${Math.min(index, 10) * 50}ms` }}
                                            >
                                                <td className="py-4 px-5 text-sm text-gray-400">{entry.id}</td>
                                                <td className="py-4 px-5 text-sm font-medium text-[#131613]">{entry.cropName || entry.crop?.name}</td>
                                                <td className="py-4 px-5 text-sm text-primary">{entry.districtName || entry.district?.name}</td>
                                                <td className="py-4 px-5 text-sm font-semibold text-primary">{parseFloat(entry.pricePerKg || entry.price || 0).toFixed(2)}</td>
                                                <td className="py-4 px-5 text-sm text-gray-400">{formatDate(entry.priceDate || entry.date)}</td>
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center justify-end">
                                                        <button
                                                            onClick={() => handleDelete(entry.id)}
                                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                                                        >
                                                            <span className="material-symbols-outlined text-gray-400 text-lg group-hover:text-red-500">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Add Market Price Form */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-fade-in-up delay-200">
                    <h3 className="text-base font-bold text-[#131613] mb-5">Add Market Price</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Crop</label>
                                <select
                                    name="cropId"
                                    value={formData.cropId}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Select Crop</option>
                                    {crops.map((crop) => (
                                        <option key={crop.id} value={crop.id}>{crop.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">District</label>
                                <select
                                    name="districtId"
                                    value={formData.districtId}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Select District</option>
                                    {districts.map((district) => (
                                        <option key={district.id} value={district.id}>{district.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Price Per KG</label>
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    min="0"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md btn-hover disabled:opacity-50"
                        >
                            {submitting ? (
                                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                            ) : (
                                <span className="material-symbols-outlined text-lg">save</span>
                            )}
                            {submitting ? "Saving..." : "Save Price"}
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
