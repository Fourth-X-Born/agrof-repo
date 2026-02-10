import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import dataService from "../../services/dataService";

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    // Get user's districtId from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const districtId = user.districtId || 1;

    // Fetch notifications (weather alerts)
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const alertsResponse = await dataService.getWeatherAlerts(districtId);

            if (alertsResponse.success && alertsResponse.data) {
                // Transform weather alerts into notifications
                const weatherNotifications = alertsResponse.data.map((alert, index) => ({
                    id: `weather-${index}`,
                    type: "weather",
                    title: alert.alertType?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Weather Alert",
                    message: alert.message,
                    severity: alert.severity,
                    icon: getAlertIcon(alert.alertType, alert.severity),
                    time: alert.validUntil || "Now",
                    read: false,
                    link: "/weather",
                }));

                // Add user-specific notifications
                const systemNotifications = [];

                // Check if user is missing profile photo
                if (!user.profilePhoto || user.profilePhoto.length === 0) {
                    systemNotifications.push({
                        id: "profile-photo",
                        type: "action",
                        title: "Complete Your Profile",
                        message: "Add a profile photo to personalize your account",
                        severity: "LOW",
                        icon: "add_a_photo",
                        time: "Action needed",
                        read: false,
                        link: "/settings",
                    });
                }

                // Welcome notification for users
                systemNotifications.push({
                    id: "welcome",
                    type: "welcome",
                    title: `Welcome, ${user.name?.split(' ')[0] || 'Farmer'}!`,
                    message: "Explore crop risk analysis, weather forecasts, and market prices for your district",
                    severity: "LOW",
                    icon: "waving_hand",
                    time: "Just now",
                    read: localStorage.getItem('welcomeRead') === 'true',
                    link: "/dashboard",
                });

                // Add farming tip
                systemNotifications.push({
                    id: "system-1",
                    type: "tip",
                    title: "Farming Tip",
                    message: `Best time to irrigate during ${getCurrentSeason()} season is early morning`,
                    severity: "LOW",
                    icon: "lightbulb",
                    time: "Today",
                    read: true,
                    link: "/crop-guide",
                });

                const allNotifications = [...weatherNotifications, ...systemNotifications];
                setNotifications(allNotifications);
                setUnreadCount(allNotifications.filter((n) => !n.read).length);
            }
        } catch (err) {
            console.error("Error fetching notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    // Get current season
    const getCurrentSeason = () => {
        const month = new Date().getMonth();
        return month >= 3 && month <= 7 ? "Yala" : "Maha";
    };

    // Get icon based on alert type
    const getAlertIcon = (alertType, severity) => {
        const type = (alertType || "").toLowerCase();
        if (type.includes("heat") || type.includes("temperature")) return "thermostat";
        if (type.includes("rain") || type.includes("flood")) return "water_drop";
        if (type.includes("wind")) return "air";
        if (type.includes("humidity") || type.includes("pest")) return "bug_report";
        if (type.includes("storm") || type.includes("thunder")) return "thunderstorm";
        if (severity === "HIGH") return "warning";
        return "notifications";
    };

    // Get severity color
    const getSeverityColor = (severity) => {
        switch (severity) {
            case "HIGH":
            case "CRITICAL":
                return "bg-red-100 text-red-600";
            case "MEDIUM":
                return "bg-orange-100 text-orange-600";
            default:
                return "bg-green-100 text-green-600";
        }
    };

    // Get severity badge color
    const getSeverityBadge = (severity) => {
        switch (severity) {
            case "HIGH":
            case "CRITICAL":
                return "bg-red-500";
            case "MEDIUM":
                return "bg-orange-500";
            default:
                return "bg-green-500";
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch notifications on mount and periodically
    useEffect(() => {
        fetchNotifications();
        // Refresh every 5 minutes
        const interval = setInterval(fetchNotifications, 300000);
        return () => clearInterval(interval);
    }, [districtId]);

    // Mark all as read
    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        localStorage.setItem('welcomeRead', 'true');
    };

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            fetchNotifications(); // Refresh when opening
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell Button */}
            <button
                onClick={toggleDropdown}
                className="relative w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
            >
                <span className="material-symbols-outlined text-gray-600 text-base">notifications</span>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 min-w-[14px] h-[14px] flex items-center justify-center bg-red-500 text-white text-[8px] font-bold rounded-full px-0.5">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-down">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-[#131613]">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-primary hover:text-primary/80 font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
                                <p className="text-sm">No notifications</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notification) => (
                                    <Link
                                        key={notification.id}
                                        to={notification.link}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex gap-3 p-3 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-primary/5" : ""
                                            }`}
                                    >
                                        {/* Icon */}
                                        <div
                                            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${getSeverityColor(
                                                notification.severity
                                            )}`}
                                        >
                                            <span className="material-symbols-outlined text-lg">{notification.icon}</span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-xs font-medium text-[#131613] truncate">
                                                    {notification.title}
                                                </p>
                                                {!notification.read && (
                                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getSeverityBadge(notification.severity)}`}></span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1">{notification.time}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <Link
                        to="/weather"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2.5 text-center text-xs font-medium text-primary hover:bg-gray-50 border-t border-gray-100"
                    >
                        View All Weather Alerts
                    </Link>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
