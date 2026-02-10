import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import adminService from "../../services/adminService";

export default function AdminFertilizerPage() {
    const formRef = useRef(null);
    const [formData, setFormData] = useState({
        cropId: "",
        fertilizerName: "",
        fertilizerType: "",
        applicationStage: "",
        dosagePerHectare: "",
        applicationMethod: "",
        notes: "",
    });

    const [recommendations, setRecommendations] = useState([]);
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [fertilizersRes, cropsRes] = await Promise.all([
                adminService.getFertilizers(),
                adminService.getCrops(),
            ]);
            setRecommendations(fertilizersRes || []);
            setCrops(cropsRes || []);
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

    const resetForm = () => {
        setFormData({
            cropId: "",
            fertilizerName: "",
            fertilizerType: "",
            applicationStage: "",
            dosagePerHectare: "",
            applicationMethod: "",
            notes: "",
        });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.cropId || !formData.fertilizerName || !formData.fertilizerType) {
            alert("Please fill in required fields (Crop, Name, Type)");
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                cropId: parseInt(formData.cropId),
                fertilizerName: formData.fertilizerName,
                fertilizerType: formData.fertilizerType,
                applicationStage: formData.applicationStage || "General",
                dosagePerHectare: formData.dosagePerHectare || "As recommended",
                applicationMethod: formData.applicationMethod,
                notes: formData.notes,
            };

            if (editingId) {
                await adminService.updateFertilizer(editingId, payload);
            } else {
                await adminService.createFertilizer(payload);
            }

            resetForm();
            fetchData();
        } catch (err) {
            console.error("Error saving fertilizer:", err);
            alert("Failed to save fertilizer recommendation");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (rec) => {
        setFormData({
            cropId: rec.cropId || rec.crop?.id || "",
            fertilizerName: rec.fertilizerName || "",
            fertilizerType: rec.fertilizerType || "",
            applicationStage: rec.applicationStage || "",
            dosagePerHectare: rec.dosagePerHectare || "",
            applicationMethod: rec.applicationMethod || "",
            notes: rec.notes || "",
        });
        setEditingId(rec.id);
        // Scroll to form section
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this recommendation?")) return;
        try {
            await adminService.deleteFertilizer(id);
            fetchData();
        } catch (err) {
            console.error("Error deleting fertilizer:", err);
            alert("Failed to delete");
        }
    };

    const getTypeColor = (type) => {
        const typeLower = type?.toLowerCase() || '';
        if (typeLower.includes('nitrogen')) return "bg-blue-100 text-blue-700";
        if (typeLower.includes('phosphorus')) return "bg-orange-100 text-orange-700";
        if (typeLower.includes('potassium')) return "bg-purple-100 text-purple-700";
        if (typeLower.includes('organic') || typeLower.includes('compost')) return "bg-green-100 text-green-700";
        if (typeLower.includes('compound')) return "bg-teal-100 text-teal-700";
        return "bg-gray-100 text-gray-700";
    };

    return (
        <AdminLayout>
            <div className="animate-fade-in">
                {/* Header */}
                <div className="mb-6 animate-fade-in-up">
                    <h1 className="text-2xl font-bold text-[#131613]">Fertilizer Recommendations</h1>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6 animate-fade-in-up delay-100">
                    {loading && (
                        <div className="p-8 text-center text-gray-500">
                            <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
                            <p className="mt-2">Loading...</p>
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
                                        <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase">Crop</th>
                                        <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase">Fertilizer Name</th>
                                        <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase">Type</th>
                                        <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase">Dosage</th>
                                        <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase">Application Stage</th>
                                        <th className="text-right py-3 px-5 text-xs font-medium text-gray-400 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recommendations.length === 0 ? (
                                        <tr><td colSpan="6" className="py-8 text-center text-gray-400">No recommendations found</td></tr>
                                    ) : (
                                        recommendations.map((rec, index) => (
                                            <tr key={rec.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                                <td className="py-4 px-5 text-sm font-medium text-[#131613]">{rec.cropName || rec.crop?.name}</td>
                                                <td className="py-4 px-5 text-sm text-gray-600">{rec.fertilizerName}</td>
                                                <td className="py-4 px-5">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(rec.fertilizerType)}`}>{rec.fertilizerType}</span>
                                                </td>
                                                <td className="py-4 px-5 text-sm text-gray-600">{rec.dosagePerHectare}</td>
                                                <td className="py-4 px-5 text-sm text-gray-500">{rec.applicationStage}</td>
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => handleEdit(rec)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                                                            <span className="material-symbols-outlined text-gray-400 text-lg group-hover:text-gray-600">edit</span>
                                                        </button>
                                                        <button onClick={() => handleDelete(rec.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors group">
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

                {/* Add/Edit Form */}
                <div ref={formRef} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-fade-in-up delay-200">
                    <div className="mb-5">
                        <h3 className="text-base font-bold text-[#131613]">{editingId ? "Edit" : "Add/Edit"} Recommendation</h3>
                        <p className="text-gray-400 text-xs mt-1">Enter details for a new fertilizer recommendation or modify existing data.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Target Crop *</label>
                                <select name="cropId" value={formData.cropId} onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer">
                                    <option value="">Select Crop...</option>
                                    {crops.map((crop) => <option key={crop.id} value={crop.id}>{crop.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Fertilizer Name *</label>
                                <input type="text" name="fertilizerName" placeholder="e.g. Urea" value={formData.fertilizerName} onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Fertilizer Type *</label>
                                <input type="text" name="fertilizerType" placeholder="e.g. Nitrogen, Organic" value={formData.fertilizerType} onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Application Stage</label>
                                <input type="text" name="applicationStage" placeholder="e.g. Vegetative Phase" value={formData.applicationStage} onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Dosage Per Hectare</label>
                                <input type="text" name="dosagePerHectare" placeholder="e.g. 50-100 kg/ha" value={formData.dosagePerHectare} onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Application Method</label>
                                <input type="text" name="applicationMethod" placeholder="e.g. Broadcasting, Foliar spray" value={formData.applicationMethod} onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-medium text-gray-600 mb-2">Additional Notes</label>
                            <textarea name="notes" placeholder="Enter any specific instructions or precautions..." value={formData.notes} onChange={handleInputChange} rows={3}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" />
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            {editingId && (
                                <button type="button" onClick={resetForm} className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                    <span className="material-symbols-outlined text-lg">add</span>
                                    Add New
                                </button>
                            )}
                            <button type="button" onClick={resetForm} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
                            <button type="submit" disabled={submitting}
                                className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md btn-hover disabled:opacity-50">
                                {submitting ? "Saving..." : (editingId ? "Update" : "Save Recommendation")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
