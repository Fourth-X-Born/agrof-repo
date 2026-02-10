import api from './api';

// Public Data Service for fetching data
const dataService = {
    // Get all crops (public)
    getCrops: async () => {
        const response = await api.get('/crops');
        return response;
    },

    // Get all districts (public)
    getDistricts: async () => {
        const response = await api.get('/districts');
        return response;
    },

    // Get market prices with optional filters
    // Uses admin endpoint when no filters are applied (requires auth)
    // Falls back to public endpoint with filters
    getMarketPrices: async (cropId = null, districtId = null) => {
        // If no filters, use admin endpoint to get all data
        if (!cropId && !districtId) {
            try {
                const response = await api.get('/admin/market-prices');
                // Transform admin response to match expected format
                if (Array.isArray(response)) {
                    return {
                        success: true,
                        data: response.map(mp => ({
                            id: mp.id,
                            cropName: mp.crop?.name,
                            cropId: mp.crop?.id,
                            districtName: mp.district?.name,
                            districtId: mp.district?.id,
                            price: mp.pricePerKg,
                            date: mp.priceDate
                        }))
                    };
                }
                return { success: true, data: response };
            } catch (err) {
                console.error("Admin endpoint failed, market prices may be empty:", err);
                return { success: true, data: [] };
            }
        }

        // With filters, use public endpoint
        const params = new URLSearchParams();
        if (cropId) params.append('cropId', cropId);
        if (districtId) params.append('districtId', districtId);
        const url = `/market-prices?${params.toString()}`;
        const response = await api.get(url);
        return response;
    },

    // Get fertilizer recommendations with optional filters
    getFertilizers: async (cropId = null, type = null) => {
        // If no filters, use admin endpoint
        if (!cropId && !type) {
            try {
                const response = await api.get('/admin/fertilizers');
                if (Array.isArray(response)) {
                    return {
                        success: true,
                        data: response.map(f => ({
                            id: f.id,
                            fertilizerName: f.fertilizerName,
                            fertilizerType: f.fertilizerType,
                            cropName: f.crop?.name,
                            cropId: f.crop?.id,
                            dosagePerHectare: f.dosagePerHectare,
                            applicationStage: f.applicationStage,
                            applicationMethod: f.applicationMethod,
                            notes: f.notes
                        }))
                    };
                }
                return { success: true, data: response };
            } catch (err) {
                console.error("Admin endpoint failed:", err);
                return { success: true, data: [] };
            }
        }

        // With filters, use public endpoint
        const params = new URLSearchParams();
        if (cropId) params.append('cropId', cropId);
        if (type) params.append('type', type);
        const url = `/fertilizers?${params.toString()}`;
        const response = await api.get(url);
        return response;
    },

    // Get user profile
    getProfile: async (farmerId) => {
        const response = await api.get(`/profile/get?farmerId=${farmerId}`);
        return response;
    },

    // Update user profile
    updateProfile: async (farmerId, profileData) => {
        const response = await api.put(`/profile/update?farmerId=${farmerId}`, profileData);
        return response;
    },

    // ==================== CROP GUIDE ====================
    // Get crop guide by cropId (public endpoint)
    getCropGuide: async (cropId) => {
        const response = await api.get(`/crop-guide/${cropId}`);
        return response;
    },

    // ==================== WEATHER ====================
    // Get weather data for a district
    getWeather: async (districtId) => {
        const response = await api.get(`/weather?districtId=${districtId}`);
        return response;
    },

    // Get 7-day forecast for a district
    getForecast: async (districtId) => {
        const response = await api.get(`/weather/forecast?districtId=${districtId}`);
        return response;
    },

    // Get weather alerts for a district
    getWeatherAlerts: async (districtId) => {
        const response = await api.get(`/weather/alerts?districtId=${districtId}`);
        return response;
    },

    // ==================== RISK ANALYSIS ====================
    // Analyze crop risk based on crop and district
    analyzeRisk: async (cropId, districtId, farmerId = null) => {
        const response = await api.post('/risk/analyze', {
            cropId,
            districtId,
            farmerId
        });
        return response;
    },

    // Get risk analysis history for a farmer
    getRiskHistory: async (farmerId) => {
        const response = await api.get(`/risk/history?farmerId=${farmerId}`);
        return response;
    },

    // Upload profile photo
    uploadProfilePhoto: async (farmerId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/profile/photo/upload?farmerId=${farmerId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    },

    // Delete profile photo
    deleteProfilePhoto: async (farmerId) => {
        const response = await api.delete(`/profile/photo/delete?farmerId=${farmerId}`);
        return response;
    },

    // Change password
    changePassword: async (farmerId, currentPassword, newPassword) => {
        const response = await api.put(`/profile/change-password?farmerId=${farmerId}`, {
            currentPassword,
            newPassword
        });
        return response;
    },
};

export default dataService;
