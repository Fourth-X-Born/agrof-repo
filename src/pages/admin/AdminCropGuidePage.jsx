import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import adminService from "../../services/adminService";

export default function AdminCropGuidePage() {
    const [formData, setFormData] = useState({
        cropId: "",
        stageId: "",
        guidelineType: "DO",
        description: "",
        priority: 1,
    });

    const [cropGuidelines, setCropGuidelines] = useState([]);
    const [crops, setCrops] = useState([]);
    const [growthStages, setGrowthStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");

    const guidelineTypes = ["DO", "DONT"];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [guidelinesRes, cropsRes, stagesRes] = await Promise.all([
                adminService.getCropGuides(),
                adminService.getCrops(),
                adminService.getGrowthStages ? adminService.getGrowthStages() : Promise.resolve([]),
            ]);
            setCropGuidelines(guidelinesRes || []);
            setCrops(cropsRes || []);
            setGrowthStages(stagesRes || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load data");
            setCropGuidelines([]);
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
            stageId: "",
            guidelineType: "DO",
            description: "",
            priority: 1,
        });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.cropId || !formData.guidelineType || !formData.description) {
            alert("Please fill in required fields (Crop, Type, Description)");
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                cropId: parseInt(formData.cropId),
                stageId: formData.stageId ? parseInt(formData.stageId) : null,
                guidelineType: formData.guidelineType,
                description: formData.description,
                priority: parseInt(formData.priority) || 1,
            };

            if (editingId) {
                await adminService.updateCropGuide(editingId, payload);
            } else {
                await adminService.createCropGuide(payload);
            }

            resetForm();
            fetchData();
        } catch (err) {
            console.error("Error saving guideline:", err);
            alert("Failed to save guideline");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (guideline) => {
        setFormData({
            cropId: guideline.crop?.id || guideline.cropId || "",
            stageId: guideline.stage?.id || guideline.stageId || "",
            guidelineType: guideline.guidelineType || "DO",
            description: guideline.description || "",
            priority: guideline.priority || 1,
        });
        setEditingId(guideline.id);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this guideline?")) return;
        try {
            await adminService.deleteCropGuide(id);
            fetchData();
        } catch (err) {
            console.error("Error deleting guideline:", err);
            alert("Failed to delete");
        }
    };

    const getTypeColor = (type) => {
        switch (type?.toUpperCase()) {
            case "DO": return "bg-green-100 text-green-700";
            case "DONT": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    // Get crop name helper
    const getCropName = (guideline) => {
        return guideline.crop?.name || crops.find(c => c.id === guideline.cropId)?.name || "Unknown";
    };

    // Get stage name helper
    const getStageName = (guideline) => {
        if (!guideline.stage && !guideline.stageId) return "All Stages";
        return guideline.stage?.stageName || growthStages.find(s => s.id === guideline.stageId)?.stageName || "All Stages";
    };

    // Get available stages for selected crop
    const getStagesForCrop = () => {
        if (!formData.cropId) return [];
        return growthStages.filter(stage => stage.crop?.id === parseInt(formData.cropId) || stage.cropId === parseInt(formData.cropId));
    };

    // Filter guidelines
    const filteredGuidelines = cropGuidelines.filter((guideline) => {
        const matchesSearch = 
            getCropName(guideline).toLowerCase().includes(searchQuery.toLowerCase()) ||
            guideline.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === "all" || guideline.guidelineType?.toUpperCase() === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <AdminLayout>
            <div className="animate-fade-in">
                {/* Header */}
                <div className="mb-6 animate-fade-in-up">
                    <h1 className="text-2xl font-bold text-[#131613]">Crop Guidelines</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage DO's and DON'T guidelines for different crops and growth stages.
                    </p>
                </div>

                {/* Search and Controls */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6 animate-fade-in-up delay-100">
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Search guidelines..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>

                        {/* Filter & Action Buttons */}
                        <div className="flex items-center gap-3">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            >
                                <option value="all">All Types</option>
                                <option value="DO">DO's Only</option>
                                <option value="DONT">DON'T's Only</option>
                            </select>
                            <button
                                onClick={fetchData}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Refresh"
                            >
                                <span className="material-symbols-outlined text-gray-500">refresh</span>
                            </button>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="p-8 text-center text-gray-500">
                            <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
                            <p className="mt-2">Loading guidelines...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="p-8 text-center text-red-500">
                            <span className="material-symbols-outlined text-2xl">error</span>
                            <p className="mt-2">{error}</p>
                            <button onClick={fetchData} className="mt-2 text-primary hover:underline">
                                Try again
                            </button>
                        </div>
                    )}

                    {/* Table */}
                    {!loading && !error && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-t border-b border-gray-100 bg-gray-50/50">
                                        <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">Crop</th>
                                        <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">Stage</th>
                                        <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                                        <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                                        <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th>
                                        <th className="text-right py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredGuidelines.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-gray-400">
                                                No guidelines found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredGuidelines.map((guideline, index) => (
                                            <tr
                                                key={guideline.id}
                                                className="border-b border-gray-50 hover:bg-gray-50 transition-colors animate-fade-in"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <td className="py-4 px-5 text-sm font-medium text-[#131613]">
                                                    {getCropName(guideline)}
                                                </td>
                                                <td className="py-4 px-5 text-sm text-gray-600">
                                                    {getStageName(guideline)}
                                                </td>
                                                <td className="py-4 px-5">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(guideline.guidelineType)}`}>
                                                        {guideline.guidelineType === "DO" ? "DO" : "DON'T"}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5 text-sm text-gray-600 max-w-xs truncate" title={guideline.description}>
                                                    {guideline.description}
                                                </td>
                                                <td className="py-4 px-5 text-sm text-gray-500">
                                                    {guideline.priority || "-"}
                                                </td>
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(guideline)}
                                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                                                        >
                                                            <span className="material-symbols-outlined text-gray-400 text-lg group-hover:text-gray-600">
                                                                edit
                                                            </span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(guideline.id)}
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
                    )}
                </div>

                {/* Add/Edit Form */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-fade-in-up delay-200">
                    <div className="mb-5">
                        <h3 className="text-base font-bold text-[#131613]">
                            {editingId ? "Edit" : "Add New"} Guideline
                        </h3>
                        <p className="text-gray-400 text-xs mt-1">
                            Enter DO's or DON'T's for crop cultivation.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Row 1: Crop, Stage, Type, Priority */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Target Crop *</label>
                                <select
                                    name="cropId"
                                    value={formData.cropId}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Select Crop...</option>
                                    {crops.map((crop) => (
                                        <option key={crop.id} value={crop.id}>{crop.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Growth Stage</label>
                                <select
                                    name="stageId"
                                    value={formData.stageId}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                                    disabled={!formData.cropId}
                                >
                                    <option value="">All Stages</option>
                                    {getStagesForCrop().map((stage) => (
                                        <option key={stage.id} value={stage.id}>{stage.stageName}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Type *</label>
                                <select
                                    name="guidelineType"
                                    value={formData.guidelineType}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                                >
                                    {guidelineTypes.map((type) => (
                                        <option key={type} value={type}>{type === "DO" ? "DO (Recommended)" : "DON'T (Avoid)"}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Priority</label>
                                <input
                                    type="number"
                                    name="priority"
                                    min="1"
                                    max="100"
                                    value={formData.priority}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        {/* Row 2: Description */}
                        <div className="mb-6">
                            <label className="block text-xs font-medium text-gray-600 mb-2">Description *</label>
                            <textarea
                                name="description"
                                placeholder="Enter the guideline description..."
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md btn-hover disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                                ) : (
                                    <span className="material-symbols-outlined text-lg">{editingId ? "save" : "add"}</span>
                                )}
                                {submitting ? "Saving..." : (editingId ? "Update Guideline" : "Add Guideline")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
