import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import DashboardFooter from "../components/dashboard/DashboardFooter";
import dataService from "../services/dataService";

export default function DashboardPage() {
  // User data from localStorage
  const [user, setUser] = useState({ name: "Farmer", district: "Your District", crop: "Crop" });

  // Weather data
  const [weatherData, setWeatherData] = useState(null);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Market prices
  const [marketPrices, setMarketPrices] = useState([]);
  const [pricesLoading, setPricesLoading] = useState(true);

  // Get current date
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });

  // Determine Sri Lankan farming season (Yala or Maha)
  const getCurrentSeason = () => {
    const month = today.getMonth(); // 0-indexed (0 = January)
    // Yala Season: April (3) to August (7) - cultivation during dry season using irrigation
    // Maha Season: September (8) to March (2) - cultivation during monsoon season
    if (month >= 3 && month <= 7) {
      return { name: "Yala", period: "Apr-Aug", icon: "sunny", type: "dry" };
    }
    return { name: "Maha", period: "Sep-Mar", icon: "rainy", type: "wet" };
  };

  const currentSeason = getCurrentSeason();

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.name) {
      setUser({
        name: storedUser.name,
        district: storedUser.district || "Your District",
        districtId: storedUser.districtId || 1,
        crop: storedUser.crop || "Crop",
        cropId: storedUser.cropId || null
      });
    }

    // Fetch weather data
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const districtId = storedUser.districtId || 1;

        // Fetch current weather
        const weatherResponse = await dataService.getWeather(districtId);
        if (weatherResponse.success && weatherResponse.data) {
          setWeatherData(weatherResponse.data);
        }

        // Fetch weather alerts
        const alertsResponse = await dataService.getWeatherAlerts(districtId);
        if (alertsResponse.success && alertsResponse.data) {
          setWeatherAlerts(alertsResponse.data);
        }
      } catch (err) {
        console.error("Error fetching weather:", err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch market prices
    const fetchMarketPrices = async () => {
      try {
        setPricesLoading(true);
        const response = await dataService.getMarketPrices();
        if (response.success && response.data) {
          // Get latest 3 prices
          setMarketPrices(response.data.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching market prices:", err);
      } finally {
        setPricesLoading(false);
      }
    };

    fetchWeatherData();
    fetchMarketPrices();
  }, []);

  // Extract weather values
  const temperature = weatherData?.main?.temp ? Math.round(weatherData.main.temp) : "--";
  const humidity = weatherData?.main?.humidity ? Math.round(weatherData.main.humidity) : "--";
  const weatherDescription = weatherData?.weather?.[0]?.description || "Loading...";
  const weatherMain = weatherData?.weather?.[0]?.main || "";

  // Get temperature status
  const getTempStatus = (temp) => {
    if (temp === "--") return { label: "Loading...", color: "bg-gray-400" };
    if (temp >= 35) return { label: "Hot", color: "bg-red-500" };
    if (temp >= 28) return { label: "Good", color: "bg-green-500" };
    if (temp >= 20) return { label: "Moderate", color: "bg-orange-400" };
    return { label: "Cool", color: "bg-blue-500" };
  };

  // Get humidity status
  const getHumidityStatus = (hum) => {
    if (hum === "--") return { label: "Loading...", color: "bg-gray-400" };
    if (hum >= 80) return { label: "Risky", color: "bg-orange-500" };
    if (hum >= 60) return { label: "Normal", color: "bg-orange-400" };
    return { label: "Good", color: "bg-green-500" };
  };

  // Get rainfall chance from weather condition
  const getRainfallChance = () => {
    if (!weatherMain) return { chance: "--", label: "Loading...", color: "bg-gray-400", description: "" };
    const main = weatherMain.toLowerCase();
    if (main.includes("rain") || main.includes("drizzle")) {
      return { chance: "High", label: "Expected", color: "bg-blue-500", description: weatherDescription };
    }
    if (main.includes("thunderstorm")) {
      return { chance: "Very High", label: "Storm", color: "bg-red-500", description: weatherDescription };
    }
    if (main.includes("cloud")) {
      return { chance: "Low", label: "Normal", color: "bg-orange-400", description: weatherDescription };
    }
    return { chance: "None", label: "Clear", color: "bg-green-500", description: weatherDescription };
  };

  // Get crop emoji
  const getCropEmoji = (cropName) => {
    const name = (cropName || "").toLowerCase();
    if (name.includes("tomato")) return "🍅";
    if (name.includes("carrot")) return "🥕";
    if (name.includes("rice") || name.includes("paddy")) return "🌾";
    if (name.includes("potato")) return "🥔";
    if (name.includes("onion")) return "🧅";
    if (name.includes("cabbage")) return "🥬";
    if (name.includes("chili") || name.includes("pepper")) return "🌶️";
    if (name.includes("corn") || name.includes("maize")) return "🌽";
    if (name.includes("bean")) return "🫘";
    if (name.includes("banana")) return "🍌";
    return "🌱";
  };

  // Get emoji background color
  const getEmojiBackground = (cropName) => {
    const name = (cropName || "").toLowerCase();
    if (name.includes("tomato")) return "bg-red-100";
    if (name.includes("carrot")) return "bg-orange-100";
    if (name.includes("rice") || name.includes("paddy")) return "bg-yellow-100";
    if (name.includes("potato")) return "bg-amber-100";
    if (name.includes("onion")) return "bg-purple-100";
    if (name.includes("cabbage")) return "bg-green-100";
    if (name.includes("chili") || name.includes("pepper")) return "bg-red-100";
    return "bg-green-100";
  };

  const tempStatus = getTempStatus(temperature);
  const humidityStatus = getHumidityStatus(humidity);
  const rainfallInfo = getRainfallChance();

  // Get first high-priority alert for AI Advisory
  const urgentAlert = weatherAlerts.find(a => a.severity === "HIGH" || a.severity === "CRITICAL") || weatherAlerts[0];

  // Generate crop-specific AI advice based on weather and user's crop
  const generateCropAdvice = () => {
    if (!weatherData) return null;

    const cropName = (user.crop || "").toLowerCase();
    const temp = temperature;
    const hum = humidity;
    const weather = weatherMain.toLowerCase();
    const season = currentSeason.name;
    const windSpeed = weatherData?.wind?.speed ? Math.round(weatherData.wind.speed * 3.6) : 0; // Convert to km/h

    let adviceTitle = "";
    let adviceMessage = "";
    let recommendations = [];
    let priority = "normal"; // normal, medium, high

    // === CRITICAL CONDITIONS (Check First) ===

    // Strong Wind Alert (applies to all crops)
    if (windSpeed >= 40) {
      adviceTitle = "⚠️ Strong Wind Warning";
      adviceMessage = `Wind speeds of ${windSpeed} km/h detected. This can cause significant damage to crops and farm structures.`;
      recommendations = [
        "Secure all farm equipment and structures",
        "Provide support stakes for tall crops",
        "Delay any spraying activities",
        "Check irrigation systems after wind subsides"
      ];
      priority = "high";
      return { title: adviceTitle, message: adviceMessage, recommendations, priority };
    }

    // Thunderstorm Alert (applies to all crops)
    if (weather.includes("thunderstorm")) {
      adviceTitle = "⛈️ Thunderstorm Alert";
      adviceMessage = `Thunderstorm conditions detected in ${user.district || 'your area'}. Take immediate precautions to protect crops and livestock.`;
      recommendations = [
        "Move livestock to sheltered areas",
        "Ensure proper drainage in fields",
        "Stay indoors and avoid field work",
        "Disconnect electrical equipment"
      ];
      priority = "high";
      return { title: adviceTitle, message: adviceMessage, recommendations, priority };
    }

    // === PADDY/RICE SPECIFIC RULES ===
    if (cropName.includes("rice") || cropName.includes("paddy")) {
      // Pest Risk based on humidity and temperature combination
      if (hum >= 75 && temp >= 25 && temp <= 30) {
        adviceTitle = "🐛 Brown Plant Hopper Risk - Paddy";
        adviceMessage = `Current conditions (${temp}°C, ${hum}% humidity) are ideal for Brown Plant Hopper (BPH) breeding. This is a major paddy pest in ${season} season.`;
        recommendations = [
          "Scout lower plant canopy for BPH nymphs",
          "Avoid excessive nitrogen fertilizer",
          "Maintain alternate wetting and drying (AWD)",
          "Consider neem-based treatments if infestation detected"
        ];
        priority = "high";
      }
      // Blast Disease Risk
      else if (hum >= 85 && temp >= 20 && temp <= 28) {
        adviceTitle = "🍂 Rice Blast Disease Risk";
        adviceMessage = `High humidity (${hum}%) with moderate temperature (${temp}°C) creates favorable conditions for Rice Blast fungus during ${season} season.`;
        recommendations = [
          "Inspect leaves for diamond-shaped lesions",
          "Reduce nitrogen application",
          "Apply Tricyclazole fungicide preventively",
          "Ensure adequate field drainage"
        ];
        priority = "high";
      }
      // Maha Season - Rainfall concerns
      else if (season === "Maha" && weather.includes("rain")) {
        adviceTitle = "🌧️ Rainfall Advisory - Maha Season";
        adviceMessage = `${weatherDescription} during Maha season. Monitor water levels to prevent waterlogging which can damage paddy root systems.`;
        recommendations = [
          "Check and clear drainage channels",
          "Maintain bund height at 15-20cm",
          "Delay top-dressing fertilizer",
          "Monitor for lodging in mature crops"
        ];
        priority = "medium";
      }
      // Yala Season - Heat and water stress
      else if (season === "Yala" && temp >= 35) {
        adviceTitle = "🌡️ Heat Stress Alert - Yala Season";
        adviceMessage = `High temperature (${temp}°C) during Yala season can cause spikelet sterility and reduce grain filling. Irrigation is critical.`;
        recommendations = [
          "Maintain 5-7cm water depth in fields",
          "Irrigate during early morning or evening",
          "Consider flash flooding during peak heat",
          "Monitor flowering stage crops closely"
        ];
        priority = "high";
      }
      // Good conditions for paddy
      else {
        adviceTitle = "✅ Good Paddy Growing Conditions";
        adviceMessage = `Weather conditions (${temp}°C, ${hum}% humidity) are favorable for paddy cultivation during ${season} season in ${user.district || 'your district'}.`;
        recommendations = [
          "Continue regular crop management",
          "Monitor water levels daily",
          "Scout for pests and diseases weekly",
          "Follow fertilizer schedule"
        ];
        priority = "normal";
      }
    }
    // === VEGETABLE CROPS (Tomato, Chili, Pepper, Beans) ===
    else if (cropName.includes("tomato") || cropName.includes("chili") || cropName.includes("pepper") || cropName.includes("bean")) {
      // Late Blight Risk for tomatoes
      if (cropName.includes("tomato") && hum >= 80 && temp >= 18 && temp <= 24) {
        adviceTitle = "🍂 Late Blight Risk - Tomato";
        adviceMessage = `Cool temperatures (${temp}°C) with high humidity (${hum}%) are ideal for Late Blight (Phytophthora infestans). Act quickly to prevent crop loss.`;
        recommendations = [
          "Apply Mancozeb or copper-based fungicide",
          "Remove and destroy infected leaves",
          "Improve air circulation between plants",
          "Avoid overhead irrigation"
        ];
        priority = "high";
      }
      // Fruit Set Issues in heat
      else if (temp >= 35) {
        adviceTitle = "🌡️ Poor Fruit Set Warning";
        adviceMessage = `High temperature (${temp}°C) can cause flower drop and poor fruit set in ${user.crop}. Pollen viability decreases above 32°C.`;
        recommendations = [
          "Install 50% shade nets",
          "Apply mulch to cool root zone",
          "Irrigate twice daily in small amounts",
          "Consider foliar spray of calcium"
        ];
        priority = "medium";
      }
      // Rain damage
      else if (weather.includes("rain")) {
        adviceTitle = "🌧️ Rain Protection Needed";
        adviceMessage = `Rainfall can cause flower damage and increase disease pressure in ${user.crop}. Take protective measures.`;
        recommendations = [
          "Stake and tie plants properly",
          "Apply preventive fungicide after rain",
          "Remove waterlogged fruits immediately",
          "Improve bed drainage"
        ];
        priority = "medium";
      }
      // Good conditions
      else {
        adviceTitle = "✅ Favorable Growing Conditions";
        adviceMessage = `Weather is suitable for ${user.crop} cultivation. Temperature ${temp}°C and ${hum}% humidity are within optimal range.`;
        recommendations = [
          "Continue regular watering schedule",
          "Apply balanced fertilizer weekly",
          "Monitor for aphids and whiteflies",
          "Harvest ripe fruits promptly"
        ];
        priority = "normal";
      }
    }
    // === ROOT CROPS (Potato, Carrot, Onion) ===
    else if (cropName.includes("potato") || cropName.includes("carrot") || cropName.includes("onion")) {
      if (weather.includes("rain") && hum >= 80) {
        adviceTitle = "⚠️ Root Rot Risk";
        adviceMessage = `Wet conditions (${weatherDescription}, ${hum}% humidity) increase the risk of root rot diseases in ${user.crop}.`;
        recommendations = [
          "Ensure raised bed planting",
          "Check drainage channels",
          "Apply Trichoderma-based bio-fungicide",
          "Avoid walking in wet fields"
        ];
        priority = "high";
      } else if (hum >= 85) {
        adviceTitle = "🧅 Storage Disease Risk";
        adviceMessage = `High humidity (${hum}%) can affect post-harvest quality and storage life of ${user.crop}.`;
        recommendations = [
          "Cure harvested produce properly",
          "Ensure good ventilation in storage",
          "Sort and remove damaged produce",
          "Consider early harvest if maturity allows"
        ];
        priority = "medium";
      } else {
        adviceTitle = "✅ Good Growing Conditions";
        adviceMessage = `Current conditions (${temp}°C, ${hum}% humidity) are suitable for ${user.crop} cultivation.`;
        recommendations = [
          "Maintain consistent soil moisture",
          "Hill up soil around plants",
          "Monitor for pest damage",
          "Plan harvest timing based on maturity"
        ];
        priority = "normal";
      }
    }
    // === DEFAULT RULES FOR ANY CROP ===
    else {
      // Extreme heat warning
      if (temp >= 38) {
        adviceTitle = "🔥 Extreme Heat Warning";
        adviceMessage = `Very high temperature (${temp}°C) can cause heat stress to most crops. Take immediate protective action.`;
        recommendations = [
          "Increase irrigation frequency",
          "Apply mulch to reduce soil temperature",
          "Provide temporary shade if possible",
          "Avoid field work during peak heat (11am-3pm)"
        ];
        priority = "high";
      }
      // Heavy rain
      else if (weather.includes("rain") && weather.includes("heavy")) {
        adviceTitle = "🌧️ Heavy Rain Advisory";
        adviceMessage = `Heavy rainfall expected. Check all drainage and protect vulnerable crops.`;
        recommendations = [
          "Clear drainage channels",
          "Harvest mature crops if possible",
          "Stake tall plants",
          "Apply fungicide after rain stops"
        ];
        priority = "high";
      }
      // High humidity pest risk
      else if (hum >= 85) {
        adviceTitle = "🐛 Pest & Disease Alert";
        adviceMessage = `High humidity (${hum}%) creates favorable conditions for pests and fungal diseases. Increase monitoring.`;
        recommendations = [
          "Scout crops daily for pest symptoms",
          "Ensure good plant spacing for airflow",
          "Apply preventive organic treatments",
          "Remove any infected plant material"
        ];
        priority = "medium";
      }
      // Moderate rain
      else if (weather.includes("rain") || weather.includes("drizzle")) {
        adviceTitle = "🌦️ Light Rain Expected";
        adviceMessage = `${weatherDescription} in ${user.district || 'your area'}. Good for natural irrigation but monitor for excess moisture.`;
        recommendations = [
          "Reduce manual irrigation",
          "Check drainage is functioning",
          "Delay fertilizer application",
          "Plan spraying for dry periods"
        ];
        priority = "normal";
      }
      // Good general conditions
      else {
        adviceTitle = "✅ Favorable Farming Conditions";
        adviceMessage = `Weather in ${user.district || 'your district'} (${temp}°C, ${hum}% humidity, ${weatherDescription}) is good for general farming activities during ${season} season.`;
        recommendations = [
          "Continue regular crop care",
          "This is a good time for fertilizer application",
          "Suitable conditions for spraying",
          "Monitor crop health and plan ahead"
        ];
        priority = "normal";
      }
    }

    return { title: adviceTitle, message: adviceMessage, recommendations, priority };
  };

  const cropAdvice = generateCropAdvice();

  // Show loading screen while fetching initial data
  if (loading && pricesLoading) {
    return (
      <div className="min-h-screen bg-[#f6f8f6] flex flex-col">
        <DashboardNavbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 animate-fade-in-up">
            {/* Animated Loader */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
              <span className="material-symbols-outlined text-primary text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                cloud_sync
              </span>
            </div>
            {/* Loading Text */}
            <div className="text-center">
              <p className="text-sm font-medium text-[#131613]">Fetching your farm data...</p>
              <p className="text-xs text-gray-500 mt-1">
                Loading weather, market prices & alerts for {user.district || 'your district'}
              </p>
            </div>
            {/* Progress Indicators */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <span className="material-symbols-outlined text-xs animate-pulse">thermostat</span>
                Weather
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <span className="material-symbols-outlined text-xs animate-pulse">trending_up</span>
                Prices
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <span className="material-symbols-outlined text-xs animate-pulse">notifications</span>
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
        {/* Greeting Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="animate-fade-in-left">
            <h1 className="text-2xl font-bold text-[#131613]">Ayubowan, {user.name?.split(' ')[0] || 'Farmer'}!</h1>
            <p className="text-gray-500 text-sm">
              Here is your farming overview for today, <span className="text-primary font-medium">{dateString}.</span>
            </p>
          </div>
          <div className="flex gap-2 mt-3 md:mt-0 animate-fade-in-right delay-100">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-sm text-gray-500">location_on</span>
              {user.district || "Your District"}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-sm text-amber-500">{currentSeason.icon === 'sunny' ? 'wb_sunny' : 'water_drop'}</span>
              <span>{user.crop || "Crop"}</span>
              <span className="text-primary font-medium">• {currentSeason.name} Season</span>
            </div>
          </div>
        </div>

        {/* Weather Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Temperature */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-scale-in delay-100 card-hover">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-500 text-xl">sunny</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-xs">Temperature</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#131613]">
                    {loading ? "--" : `${temperature}°C`}
                  </span>
                  <span className={`px-2 py-0.5 ${tempStatus.color} text-white text-[10px] font-medium rounded-full`}>
                    {loading ? "Loading" : tempStatus.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rainfall Chance */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-scale-in delay-200 card-hover">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-500 text-xl">rainy</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-xs">Rainfall Chance</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#131613]">
                    {loading ? "--" : rainfallInfo.chance}
                  </span>
                  <span className={`px-2 py-0.5 ${rainfallInfo.color} text-white text-[10px] font-medium rounded-full`}>
                    {loading ? "Loading" : rainfallInfo.label}
                  </span>
                  {rainfallInfo.description && (
                    <span className="text-gray-400 text-[10px] capitalize">{rainfallInfo.description}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-scale-in delay-300 card-hover">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-500 text-xl">water_drop</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-xs">Humidity</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#131613]">
                    {loading ? "--" : `${humidity}%`}
                  </span>
                  <span className={`px-2 py-0.5 ${humidityStatus.color} text-white text-[10px] font-medium rounded-full`}>
                    {loading ? "Loading" : humidityStatus.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - AI Advisory */}
          <div className="lg:col-span-2 animate-fade-in-up delay-400">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg animate-pulse-subtle">psychology</span>
                  <span className="font-semibold text-sm text-[#131613]">AI Advisory • {currentSeason.name} Season</span>
                </div>
                {cropAdvice?.priority === "high" && (
                  <span className="px-2.5 py-1 bg-red-50 text-red-500 text-[10px] font-medium rounded-full border border-red-200 animate-pulse">
                    Urgent Action
                  </span>
                )}
                {cropAdvice?.priority === "medium" && (
                  <span className="px-2.5 py-1 bg-orange-50 text-orange-500 text-[10px] font-medium rounded-full border border-orange-200">
                    Attention Required
                  </span>
                )}
                {cropAdvice?.priority === "normal" && (
                  <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-medium rounded-full border border-green-200">
                    All Good
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-[40%] h-48 md:h-auto overflow-hidden">
                  <img
                    src={cropAdvice?.priority === "high"
                      ? "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      : "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"}
                    alt="Crop field"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Text Content */}
                <div className="flex-1 p-4">
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                      <div className="h-16 bg-amber-50 rounded mb-4"></div>
                    </div>
                  ) : cropAdvice ? (
                    <>
                      <h3 className="text-lg font-bold text-[#131613] mb-2">
                        {cropAdvice.title}
                      </h3>
                      <p className="text-gray-500 text-xs leading-relaxed mb-4">
                        {cropAdvice.message}
                      </p>

                      {/* Recommended Action */}
                      {cropAdvice.recommendations && cropAdvice.recommendations.length > 0 && (
                        <div className={`border-l-3 p-3 rounded-r mb-4 ${cropAdvice.priority === "high" ? "bg-red-50 border-red-400" :
                          cropAdvice.priority === "medium" ? "bg-amber-50 border-amber-400" :
                            "bg-green-50 border-green-400"
                          }`}>
                          <p className="text-xs text-gray-700">
                            <span className={`font-semibold ${cropAdvice.priority === "high" ? "text-red-600" :
                              cropAdvice.priority === "medium" ? "text-amber-600" :
                                "text-green-600"
                              }`}>Recommended Actions: </span>
                            {cropAdvice.recommendations.join(". ")}.
                          </p>
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="flex gap-3">
                        <Link to="/crop-risk" className="px-4 py-2 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg btn-hover">
                          Read Full Analysis
                        </Link>
                        <Link to="/weather" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          View Weather Details
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">cloud_done</span>
                      <p className="text-gray-500 text-sm">Weather data loading...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Market Trends */}
          <div className="space-y-4 animate-fade-in-up delay-500">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-lg">bolt</span>
                <span className="font-semibold text-sm text-[#131613]">Quick Actions</span>
              </div>

              <div className="space-y-3">
                <Link to="/crop-risk" className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all group card-interactive">
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-gray-600 text-lg">analytics</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-xs font-medium text-[#131613]">Analyze Crop Risk</p>
                    <p className="text-[10px] text-gray-400">AI weather-based risk assessment</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-sm group-hover:text-gray-600 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </Link>

                <Link to="/market-prices" className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all group card-interactive">
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-gray-600 text-lg">shopping_cart</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-xs font-medium text-[#131613]">View Market Prices</p>
                    <p className="text-[10px] text-gray-400">Check current vegetable rates</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-sm group-hover:text-gray-600 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </Link>
              </div>
            </div>

            {/* Market Trends */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-sm text-[#131613]">Market Trends</span>
                <Link to="/market-prices" className="text-primary text-xs font-medium hover:underline">View All</Link>
              </div>

              <div className="space-y-3">
                {pricesLoading ? (
                  <div className="animate-pulse space-y-3">
                    {[1, 2].map(i => (
                      <div key={i} className="flex items-center gap-3 p-2">
                        <div className="w-9 h-9 rounded-full bg-gray-200"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                          <div className="h-2 bg-gray-200 rounded w-20"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-14"></div>
                      </div>
                    ))}
                  </div>
                ) : marketPrices.length === 0 ? (
                  <p className="text-gray-400 text-xs text-center py-4">No market data available</p>
                ) : (
                  marketPrices.slice(0, 2).map((price, index) => (
                    <div key={price.id || index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                      <div className={`w-9 h-9 rounded-full ${getEmojiBackground(price.cropName)} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <span className="text-lg">{getCropEmoji(price.cropName)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-[#131613]">{price.cropName}</p>
                        <p className="text-[10px] text-gray-400">{price.districtName || "Local Market"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-[#131613]">Rs. {price.price?.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400">/kg</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Latest Farming News */}
        <div className="mt-8 animate-fade-in-up delay-700">
          <h2 className="text-lg font-bold text-[#131613] mb-4">Latest Farming News</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* News Card 1 */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 card-interactive card-hover">
              <div className="h-40 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Farming tractor"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-4">
                <span className="text-primary text-[10px] font-medium">Government Scheme</span>
                <h3 className="text-sm font-semibold text-[#131613] mt-1 mb-2">New Fertilizer Subsidy Announced for Paddy Farmers</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  The Ministry of Agriculture has released new guidelines for the Yala season subsidy...
                </p>
              </div>
            </div>

            {/* News Card 2 */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 card-interactive card-hover delay-100">
              <div className="h-40 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Soil health"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-4">
                <span className="text-primary text-[10px] font-medium">Soil Health</span>
                <h3 className="text-sm font-semibold text-[#131613] mt-1 mb-2">5 Tips to Maintain Soil pH During Heavy Rains</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Heavy rainfall can drastically alter soil composition. Here is how you can manage...
                </p>
              </div>
            </div>

            {/* News Card 3 */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 card-interactive card-hover delay-200">
              <div className="h-40 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Tech update"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-4">
                <span className="text-primary text-[10px] font-medium">Tech Update</span>
                <h3 className="text-sm font-semibold text-[#131613] mt-1 mb-2">AgriAI Mobile App Update v2.4 Released</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  New offline capabilities for crop scanning and faster market price updates now available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
