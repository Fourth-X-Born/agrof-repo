import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import DashboardFooter from "../components/dashboard/DashboardFooter";
import dataService from "../services/dataService";

export default function WeatherPage() {
    const [weatherData, setWeatherData] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [weatherAlerts, setWeatherAlerts] = useState([]);
    const [cropGuide, setCropGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [forecastLoading, setForecastLoading] = useState(true);
    const [alertsLoading, setAlertsLoading] = useState(true);
    const [guideLoading, setGuideLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get user's districtId and cropId from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const districtId = user.districtId || 1; // Default to 1 if not set
    const cropId = user.cropId || 1; // Default to 1 if not set

    useEffect(() => {
        const fetchAllWeatherData = async () => {
            // Fetch current weather
            try {
                setLoading(true);
                const response = await dataService.getWeather(districtId);
                if (response.success && response.data) {
                    setWeatherData(response.data);
                }
            } catch (err) {
                console.error("Error fetching weather:", err);
                setError("Failed to fetch weather data");
            } finally {
                setLoading(false);
            }

            // Fetch 7-day forecast
            try {
                setForecastLoading(true);
                const forecastResponse = await dataService.getForecast(districtId);
                if (forecastResponse.success && forecastResponse.data) {
                    // Extend forecast with projected days if less than 8 days
                    const extendedForecast = extendForecastData(forecastResponse.data);
                    setForecast(extendedForecast);
                }
            } catch (err) {
                console.error("Error fetching forecast:", err);
            } finally {
                setForecastLoading(false);
            }

            // Fetch weather alerts
            try {
                setAlertsLoading(true);
                const alertsResponse = await dataService.getWeatherAlerts(districtId);
                if (alertsResponse.success && alertsResponse.data) {
                    setWeatherAlerts(alertsResponse.data);
                }
            } catch (err) {
                console.error("Error fetching alerts:", err);
            } finally {
                setAlertsLoading(false);
            }

            // Fetch crop guide for user's preferred crop
            try {
                setGuideLoading(true);
                const guideResponse = await dataService.getCropGuide(cropId);
                if (guideResponse?.data || guideResponse) {
                    setCropGuide(guideResponse?.data || guideResponse);
                }
            } catch (err) {
                console.error("Error fetching crop guide:", err);
            } finally {
                setGuideLoading(false);
            }
        };

        fetchAllWeatherData();
    }, [districtId, cropId]);

    // Helper function to extend forecast data with projected days
    const extendForecastData = (data) => {
        if (!data || data.length === 0) return data;
        
        const targetDays = 8;
        if (data.length >= targetDays) return data.slice(0, targetDays);
        
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const extended = [...data];
        
        // Calculate average temps and most common icon from existing data
        const avgHigh = Math.round(data.reduce((sum, d) => sum + d.high, 0) / data.length);
        const avgLow = Math.round(data.reduce((sum, d) => sum + d.low, 0) / data.length);
        const icons = data.map(d => d.icon);
        const mostCommonIcon = icons.sort((a, b) =>
            icons.filter(v => v === a).length - icons.filter(v => v === b).length
        ).pop();
        
        // Get the last day's date info to continue the pattern
        const lastDay = data[data.length - 1];
        const lastDayIndex = dayNames.indexOf(lastDay.day);
        
        // Add projected days
        while (extended.length < targetDays) {
            const nextDayIndex = (lastDayIndex + extended.length - data.length + 1) % 7;
            const variance = Math.floor(Math.random() * 3) - 1; // -1 to +1 variance
            
            extended.push({
                day: dayNames[nextDayIndex],
                high: avgHigh + variance,
                low: avgLow + variance,
                icon: mostCommonIcon,
                isProjected: true
            });
        }
        
        return extended;
    };

    // Helper function to get wind direction from degrees
    const getWindDirection = (deg) => {
        if (deg === undefined) return "N/A";
        const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
        const index = Math.round(deg / 45) % 8;
        return directions[index];
    };

    // Helper function to get humidity description
    const getHumidityDescription = (humidity) => {
        if (humidity >= 80) return "High moisture";
        if (humidity >= 60) return "Moderate moisture";
        if (humidity >= 40) return "Normal moisture";
        return "Low moisture";
    };

    // Helper function to get icon color class
    const getIconColor = (icon) => {
        switch (icon) {
            case 'sunny': return 'text-amber-400 animate-pulse-subtle';
            case 'rainy': return 'text-blue-400';
            case 'cloud': return 'text-gray-400';
            case 'thunderstorm': return 'text-purple-500';
            case 'ac_unit': return 'text-cyan-400';
            case 'foggy': return 'text-gray-300';
            default: return 'text-orange-300';
        }
    };

    // Helper function to get alert background color
    const getAlertBgColor = (severity) => {
        switch (severity) {
            case 'HIGH':
            case 'CRITICAL': return 'bg-red-500';
            case 'MEDIUM': return 'bg-orange-400';
            case 'LOW': return 'bg-green-500';
            default: return 'bg-gray-400';
        }
    };

    // Helper to format alert type for display
    const formatAlertType = (alertType) => {
        return alertType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    // Extract weather values
    const temperature = weatherData?.main?.temp ? Math.round(weatherData.main.temp) : "--";
    const humidity = weatherData?.main?.humidity || "--";
    const windSpeed = weatherData?.wind?.speed ? Math.round(weatherData.wind.speed * 3.6) : "--"; // Convert m/s to km/h
    const windDeg = weatherData?.wind?.deg;
    const weatherDescription = weatherData?.weather?.[0]?.description || "Loading...";
    const weatherMain = weatherData?.weather?.[0]?.main || "";

    // Get dynamic background image based on weather condition
    const getWeatherBackgroundImage = (condition) => {
        const weatherImages = {
            rain: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            drizzle: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            thunderstorm: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            clear: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            clouds: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            mist: 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            fog: 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            haze: 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        };
        const key = condition?.toLowerCase() || 'clouds';
        return weatherImages[key] || weatherImages.clouds;
    };

    const weatherBackgroundImage = getWeatherBackgroundImage(weatherMain);

    // Get current date
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const dayString = today.toLocaleDateString('en-US', { weekday: 'long' });

    // Loading screen while fetching all weather data
    if (loading || forecastLoading || alertsLoading) {
        const weatherLoaded = !!weatherData;
        const forecastLoaded = forecast.length > 0;
        const alertsLoaded = !alertsLoading;
        
        return (
            <div className="min-h-screen bg-[#f6f8f6] flex flex-col">
                <DashboardNavbar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4 animate-fade-in-up">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                            <span className="material-symbols-outlined text-blue-500 text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                cloud_sync
                            </span>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-[#131613]">
                                {weatherLoaded ? 'Loading Forecast & Alerts...' : 'Fetching Weather Data...'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Getting latest conditions for {user.district || 'your district'}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                            <div className={`flex items-center gap-1.5 text-[10px] ${weatherLoaded ? 'text-green-500' : 'text-gray-400'}`}>
                                <span className={`material-symbols-outlined text-xs ${weatherLoaded ? '' : 'animate-pulse'}`}>
                                    {weatherLoaded ? 'check_circle' : 'thermostat'}
                                </span>
                                Weather
                            </div>
                            <div className={`flex items-center gap-1.5 text-[10px] ${forecastLoaded ? 'text-green-500' : 'text-gray-400'}`}>
                                <span className={`material-symbols-outlined text-xs ${forecastLoaded ? '' : 'animate-pulse'}`}>
                                    {forecastLoaded ? 'check_circle' : 'calendar_month'}
                                </span>
                                Forecast
                            </div>
                            <div className={`flex items-center gap-1.5 text-[10px] ${alertsLoaded ? 'text-green-500' : 'text-gray-400'}`}>
                                <span className={`material-symbols-outlined text-xs ${alertsLoaded ? '' : 'animate-pulse'}`}>
                                    {alertsLoaded ? 'check_circle' : 'notifications'}
                                </span>
                                Alerts
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f6f8f6] flex flex-col">
            {/* Dashboard Navbar */}
            <DashboardNavbar />

            {/* Main Content */}
            <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-6 animate-fade-in-up">
                {/* Main Weather Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    {/* Main Weather Card */}
                    <div className="lg:col-span-2 relative rounded-2xl overflow-hidden min-h-[220px] shadow-lg transition-transform hover:scale-[1.01] duration-500 bg-gradient-to-br from-slate-700 to-slate-900">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-0 animate-fade-in"
                            style={{
                                backgroundImage: `url("${weatherBackgroundImage}")`,
                                animationDelay: '0.1s',
                                animationFillMode: 'forwards'
                            }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
                        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start animate-fade-in-down delay-100">
                                <div>
                                    <h1 className="text-5xl font-bold text-white mb-1">
                                        {loading ? "--" : `${temperature}°C`}
                                    </h1>
                                    <p className="text-white text-lg font-medium capitalize">
                                        {loading ? "Loading..." : weatherDescription}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white text-sm font-medium">{dateString}</p>
                                    <p className="text-white/70 text-xs">{dayString}</p>
                                </div>
                            </div>

                            <div className="animate-fade-in-up delay-200">
                                <p className="text-white/80 text-xs mb-3 max-w-md">
                                    Current conditions in your district. {windDeg !== undefined ? `Winds from ${getWindDirection(windDeg)}.` : ''} Weather data updated in real-time.
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-white text-lg">location_on</span>
                                    <span className="text-white font-medium text-sm">{user.district || 'Your District'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weather Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Humidity */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-in-up delay-100">
                            <div className="flex items-center gap-1 text-gray-400 text-[10px] mb-1">
                                <span className="material-symbols-outlined text-xs">humidity_percentage</span>
                                Humidity
                            </div>
                            <p className="text-xl font-bold text-[#131613]">
                                {loading ? "--" : `${humidity}%`}
                            </p>
                            <p className="text-[10px] text-gray-400">
                                {loading ? "Loading..." : getHumidityDescription(humidity)}
                            </p>
                        </div>

                        {/* Wind */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-in-up delay-200">
                            <div className="flex items-center gap-1 text-gray-400 text-[10px] mb-1">
                                <span className="material-symbols-outlined text-xs">air</span>
                                Wind
                            </div>
                            <p className="text-xl font-bold text-[#131613]">
                                {loading ? "--" : windSpeed} <span className="text-sm font-normal">km/h</span>
                            </p>
                            <p className="text-[10px] text-gray-400">
                                {loading ? "Loading..." : getWindDirection(windDeg)}
                            </p>
                        </div>

                        {/* Precipitation - Note: OpenWeatherMap free tier doesn't provide precipitation probability */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-in-up delay-300">
                            <div className="flex items-center gap-1 text-gray-400 text-[10px] mb-1">
                                <span className="material-symbols-outlined text-xs">water_drop</span>
                                Precipitation
                            </div>
                            <p className="text-xl font-bold text-[#131613]">
                                {loading ? "--" : (weatherMain.toLowerCase().includes('rain') ? "High" : "Low")}
                            </p>
                            <p className="text-[10px] text-gray-400">
                                {loading ? "Loading..." : (weatherMain.toLowerCase().includes('rain') ? "Rain expected" : "No rain expected")}
                            </p>
                        </div>

                        {/* UV Index - Note: OpenWeatherMap free tier doesn't provide UV index, showing feels_like instead */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-in-up delay-400">
                            <div className="flex items-center gap-1 text-gray-400 text-[10px] mb-1">
                                <span className="material-symbols-outlined text-xs">sunny</span>
                                Feels Like
                            </div>
                            <p className="text-xl font-bold text-[#131613]">
                                {loading ? "--" : `${Math.round(weatherData?.main?.feels_like || temperature)}°C`}
                            </p>
                            <p className="text-[10px] text-gray-400">
                                {loading ? "Loading..." : "Apparent temperature"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Extended Forecast */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 hover:shadow-md transition-shadow animate-fade-in-up delay-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
                            <span className="font-semibold text-sm text-[#131613]">8-Day Forecast</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {forecastLoading ? (
                            <div className="col-span-4 sm:col-span-8 text-center py-8 text-gray-400">
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                <p className="text-sm mt-2">Loading forecast...</p>
                            </div>
                        ) : forecast.length === 0 ? (
                            <div className="col-span-4 sm:col-span-8 text-center py-8 text-gray-400">
                                <span className="material-symbols-outlined">cloud_off</span>
                                <p className="text-sm mt-2">Forecast unavailable</p>
                            </div>
                        ) : (
                            forecast.map((day, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 hover:bg-gray-50 hover:scale-105 cursor-pointer ${index === 0 ? 'bg-gray-50 border border-gray-200 shadow-sm' : ''} ${day.isProjected ? 'opacity-75' : ''}`}
                                    style={{ animation: `fade-in-up 0.5s ease-out ${index * 100}ms backwards` }}
                                    title={day.isProjected ? 'Projected forecast' : ''}
                                >
                                    <span className={`text-xs font-medium mb-2 ${day.isProjected ? 'text-gray-400' : 'text-gray-600'}`}>{day.day}</span>
                                    <span className={`material-symbols-outlined text-2xl mb-2 ${getIconColor(day.icon)}`}>{day.icon}</span>
                                    <p className="text-sm font-bold text-[#131613]">{day.high}°<span className="text-gray-400 font-normal">/{day.low}°</span></p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Weather Alerts & Farming Recommendations */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Weather Alerts */}
                    <div className="animate-fade-in-left delay-500">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-orange-500 text-lg animate-pulse">warning</span>
                            <span className="font-semibold text-sm text-[#131613]">Weather Alerts</span>
                        </div>

                        <div className="space-y-3">
                            {alertsLoading ? (
                                <div className="bg-gray-100 rounded-xl p-4 text-center">
                                    <span className="material-symbols-outlined animate-spin text-gray-400">progress_activity</span>
                                    <p className="text-sm mt-2 text-gray-500">Loading alerts...</p>
                                </div>
                            ) : weatherAlerts.length === 0 ? (
                                <div className="bg-green-500 rounded-xl p-4 text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="material-symbols-outlined text-lg">check_circle</span>
                                        <span className="text-sm font-semibold">All Clear</span>
                                    </div>
                                    <p className="text-xs text-white/90">No weather alerts at this time.</p>
                                </div>
                            ) : (
                                weatherAlerts.map((alert, index) => (
                                    <div
                                        key={index}
                                        className={`${getAlertBgColor(alert.severity)} rounded-xl p-4 text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02]`}
                                        style={{ animation: `fade-in-up 0.3s ease-out ${index * 100}ms backwards` }}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-symbols-outlined text-lg">{alert.icon || 'warning'}</span>
                                            <span className="text-sm font-semibold">{formatAlertType(alert.alertType)}</span>
                                        </div>
                                        <p className="text-xs text-white/90 leading-relaxed mb-2">
                                            {alert.message}
                                        </p>
                                        {alert.precautions && alert.precautions.length > 0 && (
                                            <ul className="text-[10px] text-white/80 list-disc list-inside mb-2">
                                                {alert.precautions.slice(0, 2).map((precaution, i) => (
                                                    <li key={i}>{precaution}</li>
                                                ))}
                                            </ul>
                                        )}
                                        {alert.validUntil && (
                                            <span className="inline-block px-2 py-1 bg-white/20 text-[10px] font-medium rounded">
                                                {alert.validUntil}
                                            </span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Need Expert Help Card */}
                        <div className="mt-4 bg-primary rounded-xl p-4 text-white">
                            <h4 className="font-semibold text-sm mb-1">Need Expert Help?</h4>
                            <p className="text-xs text-white/80 mb-3">
                                Contact Agricultural Experts From Expertise of Crop Management
                            </p>
                            <Link 
                                to="/dashboard/contact" 
                                className="block w-full bg-white text-primary text-center text-xs font-medium py-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Contact Now
                            </Link>
                        </div>
                    </div>

                    {/* Crop Guidelines */}
                    <div className="lg:col-span-2 animate-fade-in-right delay-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">eco</span>
                                <span className="font-semibold text-sm text-[#131613]">
                                    {cropGuide?.crop?.name || user.crop || 'Crop'} Guidelines
                                </span>
                            </div>
                            <Link to="/dashboard/crop-guide" className="text-primary text-xs font-medium hover:underline">
                                View Full Guide
                            </Link>
                        </div>

                        {guideLoading ? (
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                                <span className="material-symbols-outlined animate-spin text-primary text-2xl">progress_activity</span>
                                <p className="text-sm text-gray-500 mt-2">Loading crop guidelines...</p>
                            </div>
                        ) : !cropGuide ? (
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                                <span className="material-symbols-outlined text-gray-300 text-3xl">eco</span>
                                <p className="text-sm text-gray-500 mt-2">No crop guide available</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {/* Do's Section */}
                                {cropGuide.guidelines?.dos && cropGuide.guidelines.dos.length > 0 && (
                                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all duration-300">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                                            <span className="text-sm font-semibold text-[#131613]">Best Practices</span>
                                        </div>
                                        <ul className="space-y-2">
                                            {cropGuide.guidelines.dos.slice(0, 3).map((tip, index) => (
                                                <li key={index} className="flex items-start gap-2 text-[11px] text-gray-600">
                                                    <span className="material-symbols-outlined text-green-400 text-sm mt-0.5">done</span>
                                                    <span>{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Don'ts Section */}
                                {cropGuide.guidelines?.donts && cropGuide.guidelines.donts.length > 0 && (
                                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all duration-300">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="material-symbols-outlined text-red-500 text-lg">cancel</span>
                                            <span className="text-sm font-semibold text-[#131613]">Avoid These</span>
                                        </div>
                                        <ul className="space-y-2">
                                            {cropGuide.guidelines.donts.slice(0, 3).map((tip, index) => (
                                                <li key={index} className="flex items-start gap-2 text-[11px] text-gray-600">
                                                    <span className="material-symbols-outlined text-red-400 text-sm mt-0.5">close</span>
                                                    <span>{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <DashboardFooter />
        </div>
    );
}
