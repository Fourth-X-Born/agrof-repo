import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ricePlantImg from "../assets/images/rice-plant-white-background-vector-eps-10_638232-733-removebg-preview.png";
import dataService from "../services/dataService";
import authService from "../services/authService";

export default function ProfileCompletionPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [districtOpen, setDistrictOpen] = useState(false);
    const [cropOpen, setCropOpen] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [crops, setCrops] = useState([]);
    const districtDropdownRef = useRef(null);
    const cropDropdownRef = useRef(null);

    const [formData, setFormData] = useState({
        phone: "",
        districtId: "",
        districtName: "",
        cropId: "",
        cropName: "",
    });

    // Fetch districts and crops on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [districtsRes, cropsRes] = await Promise.all([
                    dataService.getDistricts(),
                    dataService.getCrops()
                ]);
                if (districtsRes.success && districtsRes.data) {
                    setDistricts(districtsRes.data);
                }
                if (cropsRes.success && cropsRes.data) {
                    setCrops(cropsRes.data);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                // Fallback districts if API fails
                setDistricts([
                    { id: 1, name: "Ampara" }, { id: 2, name: "Anuradhapura" }, { id: 3, name: "Badulla" },
                    { id: 4, name: "Batticaloa" }, { id: 5, name: "Colombo" }, { id: 6, name: "Galle" },
                    { id: 7, name: "Gampaha" }, { id: 8, name: "Hambantota" }, { id: 9, name: "Jaffna" },
                    { id: 10, name: "Kalutara" }, { id: 11, name: "Kandy" }, { id: 12, name: "Kegalle" },
                    { id: 13, name: "Kilinochchi" }, { id: 14, name: "Kurunegala" }, { id: 15, name: "Mannar" },
                    { id: 16, name: "Matale" }, { id: 17, name: "Matara" }, { id: 18, name: "Monaragala" },
                    { id: 19, name: "Mullaitivu" }, { id: 20, name: "Nuwara Eliya" }, { id: 21, name: "Polonnaruwa" },
                    { id: 22, name: "Puttalam" }, { id: 23, name: "Ratnapura" }, { id: 24, name: "Trincomalee" },
                    { id: 25, name: "Vavuniya" },
                ]);
                // Fallback crops if API fails
                setCrops([
                    { id: 1, name: "Rice" }, { id: 2, name: "Maize" }, { id: 3, name: "Tomato" }
                ]);
            }
        };
        fetchData();
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (districtDropdownRef.current && !districtDropdownRef.current.contains(event.target)) {
                setDistrictOpen(false);
            }
            if (cropDropdownRef.current && !cropDropdownRef.current.contains(event.target)) {
                setCropOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDistrictSelect = (district) => {
        setFormData(prev => ({
            ...prev,
            districtId: district.id,
            districtName: district.name
        }));
        setDistrictOpen(false);
    };

    const handleCropSelect = (crop) => {
        setFormData(prev => ({
            ...prev,
            cropId: crop.id,
            cropName: crop.name
        }));
        setCropOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.phone || !formData.districtId || !formData.cropId) {
            setError("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            // Update profile with phone, district, and crop
            const response = await authService.updateProfile({
                phone: formData.phone,
                districtId: parseInt(formData.districtId),
                cropId: parseInt(formData.cropId),
            });

            if (response.success) {
                navigate("/dashboard");
            } else {
                setError(response.message || "Failed to update profile");
            }
        } catch (err) {
            console.error("Profile update error:", err);
            setError(err.message || "Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const user = authService.getCurrentUser();

    return (
        <div className="h-screen bg-[#f6f8f6] flex items-center justify-center overflow-hidden relative p-6">
            {/* Animated Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Subtle gradient ambient */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

                {/* Left Side Plants - Dense cluster */}
                <div className="absolute left-0 bottom-0 flex items-end">
                    <img src={ricePlantImg} alt="" className="h-[280px] opacity-35"
                        style={{ animation: 'sway 2.5s ease-in-out infinite', transformOrigin: 'bottom center' }} />
                    <img src={ricePlantImg} alt="" className="h-[220px] opacity-28 -ml-8"
                        style={{ animation: 'sway 3.2s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.3s' }} />
                    <img src={ricePlantImg} alt="" className="h-[180px] opacity-22 -scale-x-100 -ml-6"
                        style={{ animation: 'sway 2.8s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.7s' }} />
                    <img src={ricePlantImg} alt="" className="h-[250px] opacity-30 -ml-10"
                        style={{ animation: 'sway 3.5s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.5s' }} />
                    <img src={ricePlantImg} alt="" className="h-[160px] opacity-20 -scale-x-100 -ml-5"
                        style={{ animation: 'sway 2.4s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.9s' }} />
                    <img src={ricePlantImg} alt="" className="h-[200px] opacity-25 -ml-7"
                        style={{ animation: 'sway 3.8s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.2s' }} />
                    <img src={ricePlantImg} alt="" className="h-[140px] opacity-18 -scale-x-100 -ml-4"
                        style={{ animation: 'sway 2.6s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '1.1s' }} />
                    <img src={ricePlantImg} alt="" className="h-[120px] opacity-15 -ml-3"
                        style={{ animation: 'sway 3.1s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.4s' }} />
                    <img src={ricePlantImg} alt="" className="h-[100px] opacity-12 -scale-x-100 -ml-2"
                        style={{ animation: 'sway 4.0s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.8s' }} />
                </div>

                {/* Right Side Plants - Dense cluster */}
                <div className="absolute right-0 bottom-0 flex items-end flex-row-reverse">
                    <img src={ricePlantImg} alt="" className="h-[260px] opacity-32 -scale-x-100"
                        style={{ animation: 'sway 2.7s ease-in-out infinite', transformOrigin: 'bottom center' }} />
                    <img src={ricePlantImg} alt="" className="h-[200px] opacity-26 -mr-8"
                        style={{ animation: 'sway 3.3s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.4s' }} />
                    <img src={ricePlantImg} alt="" className="h-[240px] opacity-30 -scale-x-100 -mr-9"
                        style={{ animation: 'sway 2.9s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.6s' }} />
                    <img src={ricePlantImg} alt="" className="h-[170px] opacity-22 -mr-6"
                        style={{ animation: 'sway 3.6s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.2s' }} />
                    <img src={ricePlantImg} alt="" className="h-[190px] opacity-24 -scale-x-100 -mr-7"
                        style={{ animation: 'sway 2.5s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.8s' }} />
                    <img src={ricePlantImg} alt="" className="h-[150px] opacity-20 -mr-5"
                        style={{ animation: 'sway 4.2s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.1s' }} />
                    <img src={ricePlantImg} alt="" className="h-[220px] opacity-28 -scale-x-100 -mr-8"
                        style={{ animation: 'sway 3.0s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '1.0s' }} />
                    <img src={ricePlantImg} alt="" className="h-[130px] opacity-16 -mr-4"
                        style={{ animation: 'sway 3.4s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.5s' }} />
                    <img src={ricePlantImg} alt="" className="h-[110px] opacity-14 -scale-x-100 -mr-3"
                        style={{ animation: 'sway 2.8s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.9s' }} />
                </div>
            </div>

            {/* Main Card */}
            <div className="w-full max-w-[450px] bg-white rounded-xl shadow-xl animate-scale-in z-10">
                <div className="p-6">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="text-[#131613] text-sm font-bold">Agro<span className="text-primary">Sense</span> AI</span>
                        </div>
                        <h1 className="text-xl font-bold text-[#131613]">Complete Your Profile</h1>
                        <p className="text-gray-500 text-xs mt-1">
                            {user?.name ? `Welcome ${user.name}! ` : ""}Just a few more details to personalize your experience.
                        </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="w-8 h-1 rounded-full bg-primary"></div>
                        <div className="w-8 h-1 rounded-full bg-primary"></div>
                        <div className="w-8 h-1 rounded-full bg-gray-200"></div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-xs text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Mobile Number */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-medium text-[#131613]">Mobile Number</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">phone</span>
                                <input
                                    type="tel"
                                    placeholder="e.g. 0771234567"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full h-9 pl-9 pr-3 rounded-lg border-2 border-gray-300 text-xs focus:outline-none focus:border-primary"
                                />
                            </div>
                            <p className="text-[10px] text-gray-400">We'll use this to send you important alerts.</p>
                        </div>

                        {/* District - Custom Dropdown */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-medium text-[#131613]">District</label>
                            <div className="relative" ref={districtDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setDistrictOpen(!districtOpen)}
                                    className="w-full h-9 pl-9 pr-8 rounded-lg border-2 border-gray-300 text-xs text-left focus:outline-none focus:border-primary bg-white cursor-pointer flex items-center"
                                >
                                    <span className="material-symbols-outlined absolute left-3 text-gray-400 text-base">location_on</span>
                                    <span className={formData.districtName ? "text-gray-700" : "text-gray-500"}>
                                        {formData.districtName || "Select your farming district"}
                                    </span>
                                    <span className="material-symbols-outlined absolute right-3 text-gray-400 text-base">expand_more</span>
                                </button>

                                {districtOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-32 overflow-y-auto">
                                        {districts.map((district) => (
                                            <div
                                                key={district.id}
                                                onClick={() => handleDistrictSelect(district)}
                                                className="px-3 py-1.5 text-xs text-gray-700 hover:bg-primary/10 cursor-pointer"
                                            >
                                                {district.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="text-[10px] text-gray-400">We use this to provide localized weather and soil alerts.</p>
                        </div>

                        {/* Crop - Custom Dropdown */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-medium text-[#131613]">Primary Crop</label>
                            <div className="relative" ref={cropDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setCropOpen(!cropOpen)}
                                    className="w-full h-9 pl-9 pr-8 rounded-lg border-2 border-gray-300 text-xs text-left focus:outline-none focus:border-primary bg-white cursor-pointer flex items-center"
                                >
                                    <span className="material-symbols-outlined absolute left-3 text-gray-400 text-base">eco</span>
                                    <span className={formData.cropName ? "text-gray-700" : "text-gray-500"}>
                                        {formData.cropName || "Select your primary crop"}
                                    </span>
                                    <span className="material-symbols-outlined absolute right-3 text-gray-400 text-base">expand_more</span>
                                </button>

                                {cropOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-32 overflow-y-auto">
                                        {crops.map((crop) => (
                                            <div
                                                key={crop.id}
                                                onClick={() => handleCropSelect(crop)}
                                                className="px-3 py-1.5 text-xs text-gray-700 hover:bg-primary/10 cursor-pointer"
                                            >
                                                {crop.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="text-[10px] text-gray-400">We'll provide tailored recommendations for your crop.</p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-9 mt-2 rounded-lg bg-primary text-white text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Continue to Dashboard
                                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Animation Keyframes */}
            <style>{`
                @keyframes sway {
                    0%, 100% { transform: rotate(-2deg); }
                    50% { transform: rotate(2deg); }
                }
                @keyframes scale-in {
                    0% { transform: scale(0.95); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
