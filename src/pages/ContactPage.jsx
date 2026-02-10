import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import DashboardFooter from "../components/dashboard/DashboardFooter";

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    const contacts = [
        {
            department: "Department of Agriculture",
            description: "National agriculture policies, subsidies, and farmer support programs",
            phone: "+94 11 2869553",
            email: "info@agrimin.gov.lk",
            address: "80/5, Govijana Mandiraya, Rajamalwatta Rd, Battaramulla",
            icon: "agriculture",
            hours: "Mon-Fri: 8:30 AM - 4:30 PM",
            coordinates: [6.9014, 79.9188]
        },
        {
            department: "Agricultural Extension Service",
            description: "Farm advisory services, crop management guidance, and technical support",
            phone: "+94 11 2688954",
            email: "extension@doa.gov.lk",
            address: "Peradeniya Road, Gannoruwa, Peradeniya",
            icon: "support_agent",
            hours: "Mon-Fri: 8:00 AM - 5:00 PM",
            coordinates: [7.2607, 80.5850]
        },
        {
            department: "Agrarian Development Department",
            description: "Irrigation support, land management, and rural development initiatives",
            phone: "+94 11 2872506",
            email: "agrarian@add.gov.lk",
            address: "42, Kirula Road, Colombo 05",
            icon: "water_drop",
            hours: "Mon-Fri: 9:00 AM - 4:00 PM",
            coordinates: [6.8947, 79.8772]
        },
        {
            department: "Plant Protection Service",
            description: "Pest control advice, disease management, and crop protection solutions",
            phone: "+94 11 2689753",
            email: "pps@doa.gov.lk",
            address: "Horticultural Crop Research Station, Gannoruwa",
            icon: "pest_control",
            hours: "Mon-Fri: 8:30 AM - 4:30 PM",
            coordinates: [7.2717, 80.5917]
        },
        {
            department: "Seed Certification Service",
            description: "Quality seed certification, seed testing, and variety recommendations",
            phone: "+94 11 2693652",
            email: "seeds@doa.gov.lk",
            address: "Sarasavi Mawatha, Peradeniya",
            icon: "eco",
            hours: "Mon-Fri: 8:00 AM - 4:00 PM",
            coordinates: [7.2647, 80.5959]
        },
        {
            department: "AgroSense AI Support",
            description: "Technical support, app assistance, and feature inquiries",
            phone: "+94 77 1234567",
            email: "support@agrosense.ai",
            address: "Tech Innovation Hub, Colombo 03",
            icon: "smart_toy",
            hours: "24/7 Online Support",
            coordinates: [6.9167, 79.8489]
        }
    ];

    const emergencyContacts = [
        { name: "Crop Emergency Hotline", number: "1920", description: "For urgent crop disease outbreaks" },
        { name: "Weather Alerts", number: "1717", description: "Severe weather warnings for farmers" },
        { name: "Farmer Helpline", number: "1919", description: "General agricultural assistance" }
    ];

    return (
        <div className="min-h-screen bg-[#f6f8f6] flex flex-col">
            <DashboardNavbar />

            <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-6 animate-fade-in-up">
                {/* Page Header */}
                <div className="mb-6 animate-fade-in-down">
                    <h1 className="text-2xl font-bold text-[#131613]">Contact Us</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Get in touch with agricultural departments and experts for guidance and support
                    </p>
                </div>

                {/* Emergency Contacts Banner */}
                <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 mb-6 text-white shadow-lg animate-fade-in-down">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-xl animate-pulse">emergency</span>
                        <h2 className="text-sm font-bold">Emergency Hotlines</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {emergencyContacts.map((contact, index) => (
                            <div key={index} className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                <p className="text-lg font-bold">{contact.number}</p>
                                <p className="text-xs font-medium">{contact.name}</p>
                                <p className="text-[10px] text-white/80">{contact.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Contact Cards */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-sm font-bold text-[#131613] mb-2">Agricultural Departments & Services</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {contacts.map((contact, index) => (
                                <div 
                                    key={index} 
                                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all hover:-translate-y-0.5 animate-scale-in"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-primary text-xl">{contact.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-[#131613] truncate">{contact.department}</h3>
                                            <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{contact.description}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center gap-2 group">
                                            <span className="material-symbols-outlined text-gray-400 text-sm group-hover:text-primary transition-colors">call</span>
                                            <a href={`tel:${contact.phone}`} className="text-xs text-gray-600 hover:text-primary transition-colors">{contact.phone}</a>
                                        </div>
                                        <div className="flex items-center gap-2 group">
                                            <span className="material-symbols-outlined text-gray-400 text-sm group-hover:text-primary transition-colors">mail</span>
                                            <a href={`mailto:${contact.email}`} className="text-xs text-gray-600 hover:text-primary transition-colors truncate">{contact.email}</a>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="material-symbols-outlined text-gray-400 text-sm mt-0.5">location_on</span>
                                            <p className="text-xs text-gray-600 line-clamp-2">{contact.address}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-gray-400 text-sm">schedule</span>
                                            <p className="text-xs text-gray-500">{contact.hours}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold text-[#131613] mb-2">Send Us a Message</h2>
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-fade-in-right">
                            {submitted ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-green-500 text-3xl">check_circle</span>
                                    </div>
                                    <h3 className="text-sm font-bold text-[#131613]">Message Sent!</h3>
                                    <p className="text-xs text-gray-500 mt-1">We'll get back to you within 24-48 hours.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-medium text-[#131613] block mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your name"
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-[#131613] block mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your@email.com"
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-[#131613] block mb-1">Subject</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        >
                                            <option value="">Select a topic</option>
                                            <option value="crop-guidance">Crop Guidance</option>
                                            <option value="pest-disease">Pest & Disease Issues</option>
                                            <option value="weather-advisory">Weather Advisory</option>
                                            <option value="fertilizer">Fertilizer Recommendations</option>
                                            <option value="market-prices">Market Prices</option>
                                            <option value="technical-support">Technical Support</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-[#131613] block mb-1">Message</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={4}
                                            placeholder="Describe your inquiry..."
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-2.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-all hover:shadow-md flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-base">send</span>
                                        Send Message
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Quick Tips */}
                        <div className="bg-primary/5 rounded-xl border border-primary/10 p-4">
                            <h3 className="text-xs font-bold text-[#131613] mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-base">lightbulb</span>
                                Quick Tips
                            </h3>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                                    <p className="text-xs text-gray-600">Describe your crop issues in detail for accurate guidance</p>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                                    <p className="text-xs text-gray-600">Mention your location and crop type for relevant advice</p>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                                    <p className="text-xs text-gray-600">Visit local extension offices for hands-on assistance</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-fade-in-up">
                    <h2 className="text-sm font-bold text-[#131613] mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-base">map</span>
                        Find Agricultural Offices Near You
                    </h2>
                    <div className="rounded-lg h-64 overflow-hidden">
                        <MapContainer 
                            center={[7.0, 80.0]} 
                            zoom={8} 
                            style={{ height: "100%", width: "100%" }}
                            scrollWheelZoom={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {contacts.map((contact, index) => (
                                <Marker key={index} position={contact.coordinates}>
                                    <Popup>
                                        <div className="min-w-[200px]">
                                            <h3 className="font-bold text-sm text-primary mb-1">{contact.department}</h3>
                                            <p className="text-xs text-gray-600 mb-2">{contact.description}</p>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                                <span className="material-symbols-outlined text-xs">location_on</span>
                                                {contact.address}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                                <span className="material-symbols-outlined text-xs">phone</span>
                                                {contact.phone}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <span className="material-symbols-outlined text-xs">schedule</span>
                                                {contact.hours}
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 text-center">Click on markers to view office details</p>
                </div>
            </main>

            <DashboardFooter />
        </div>
    );
}
