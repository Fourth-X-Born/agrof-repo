import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

export default function LandingPrivacyPolicyPage() {
    const lastUpdated = "February 1, 2026";
    const [activeSection, setActiveSection] = useState(0);

    const sections = [
        {
            id: "information",
            title: "Information We Collect",
            icon: "database",
            color: "bg-blue-500",
            content: [
                { subtitle: "Personal Information", icon: "person", text: "When you register for AgroSense AI, we collect your name, email address, phone number, and farm location." },
                { subtitle: "Farm Data", icon: "agriculture", text: "We collect information about your crops, land area, soil type, and farming practices." },
                { subtitle: "Usage Data", icon: "analytics", text: "We automatically collect data about how you interact with our platform." },
                { subtitle: "Location Data", icon: "location_on", text: "With your permission, we collect location data to provide localized recommendations." }
            ]
        },
        {
            id: "usage",
            title: "How We Use Your Information",
            icon: "settings",
            color: "bg-green-500",
            content: [
                { subtitle: "Service Delivery", icon: "rocket_launch", text: "We use your information to provide personalized crop guidance, weather alerts, and market insights." },
                { subtitle: "Platform Improvement", icon: "trending_up", text: "Your usage data helps us improve our AI algorithms and develop new features." },
                { subtitle: "Communication", icon: "notifications", text: "We may send you important updates about your crops and market opportunities." },
                { subtitle: "Research & Analytics", icon: "science", text: "Aggregated data may be used for agricultural research to benefit the farming community." }
            ]
        },
        {
            id: "security",
            title: "Data Protection & Security",
            icon: "shield",
            color: "bg-purple-500",
            content: [
                { subtitle: "Encryption", icon: "lock", text: "All data is encrypted using industry-standard SSL/TLS protocols." },
                { subtitle: "Secure Storage", icon: "cloud_done", text: "Your data is stored in secure, encrypted databases with restricted access." },
                { subtitle: "Regular Audits", icon: "verified", text: "We conduct regular security audits and vulnerability assessments." },
                { subtitle: "Employee Access", icon: "admin_panel_settings", text: "Only authorized personnel have access to user data." }
            ]
        },
        {
            id: "sharing",
            title: "Data Sharing",
            icon: "share",
            color: "bg-orange-500",
            content: [
                { subtitle: "Third-Party Services", icon: "handshake", text: "We may share data with trusted partners bound by confidentiality agreements." },
                { subtitle: "Government Agencies", icon: "account_balance", text: "Aggregated data may be shared for national food security initiatives." },
                { subtitle: "Legal Requirements", icon: "gavel", text: "We may disclose information if required by law." },
                { subtitle: "No Sale of Data", icon: "block", text: "We never sell your personal information to third parties." }
            ]
        },
        {
            id: "rights",
            title: "Your Rights",
            icon: "verified_user",
            color: "bg-teal-500",
            content: [
                { subtitle: "Access & Download", icon: "download", text: "Request a copy of all personal data we hold about you." },
                { subtitle: "Correction", icon: "edit", text: "Update or correct any inaccurate information in your profile." },
                { subtitle: "Deletion", icon: "delete", text: "Request deletion of your account and associated data." },
                { subtitle: "Opt-Out", icon: "notifications_off", text: "Opt out of non-essential communications at any time." }
            ]
        },
        {
            id: "cookies",
            title: "Cookies & Tracking",
            icon: "cookie",
            color: "bg-amber-500",
            content: [
                { subtitle: "Essential Cookies", icon: "key", text: "We use essential cookies to maintain your session." },
                { subtitle: "Analytics", icon: "bar_chart", text: "We use analytics tools to improve our services." },
                { subtitle: "Cookie Control", icon: "tune", text: "Manage cookie preferences through your browser settings." }
            ]
        }
    ];

    const stats = [
        { icon: "shield", value: "256-bit", label: "SSL Encryption" },
        { icon: "verified", value: "ISO 27001", label: "Certified" },
        { icon: "groups", value: "10,000+", label: "Farmers Trust Us" },
        { icon: "history", value: "24/7", label: "Data Protection" }
    ];

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 200;
            sections.forEach((s, index) => {
                const el = document.getElementById(s.id);
                if (el && scrollPosition >= el.offsetTop && scrollPosition < el.offsetTop + el.offsetHeight) {
                    setActiveSection(index);
                }
            });
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col font-display bg-gray-50 text-[#131613]">
            <Navbar />
            <main className="flex-grow">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-br from-primary via-green-600 to-emerald-700 overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
                        <div className="absolute top-20 right-20 w-48 h-48 border-2 border-white rounded-full"></div>
                        <div className="absolute bottom-10 left-1/3 w-24 h-24 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="max-w-[1200px] mx-auto px-6 py-16 relative z-10">
                        <div className="text-center text-white">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-xs mb-6">
                                <span className="material-symbols-outlined text-sm">verified_user</span>
                                Your Privacy Matters to Us
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                            <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto mb-6">
                                We're committed to protecting your personal and farm data. Learn how we collect, use, and safeguard your information.
                            </p>
                            <div className="flex items-center justify-center gap-2 text-xs text-white/70">
                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                Last updated: {lastUpdated}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center text-white">
                                    <span className="material-symbols-outlined text-2xl mb-2">{stat.icon}</span>
                                    <div className="text-xl font-bold">{stat.value}</div>
                                    <div className="text-xs text-white/70">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-[1200px] mx-auto w-full px-6 py-10">
                    <div className="flex gap-8">
                        {/* Sidebar Navigation */}
                        <div className="hidden lg:block w-64 flex-shrink-0">
                            <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Table of Contents</h3>
                                <nav className="space-y-1">
                                    {sections.map((section, index) => (
                                        <button key={index} onClick={() => scrollToSection(section.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all text-xs ${activeSection === index ? "bg-primary/10 text-primary font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                                            <span className={`w-6 h-6 rounded-lg ${section.color} text-white flex items-center justify-center`}>
                                                <span className="material-symbols-outlined text-sm">{section.icon}</span>
                                            </span>
                                            <span className="truncate">{section.title}</span>
                                        </button>
                                    ))}
                                </nav>
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <Link to="/terms-of-service" className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-sm">description</span>
                                        Terms of Service
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-white text-2xl">security</span>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-[#131613] mb-2">Our Commitment to Your Privacy</h2>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            At AgroSense AI, we understand that your farm data is sensitive and valuable. This Privacy Policy explains how we collect, use, share, and protect your information.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {sections.map((section, index) => (
                                    <div key={index} id={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-24">
                                        <div className={`${section.color} px-6 py-4 flex items-center gap-3`}>
                                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white text-xl">{section.icon}</span>
                                            </div>
                                            <div>
                                                <h2 className="text-base font-bold text-white">{section.title}</h2>
                                                <p className="text-xs text-white/80">{section.content.length} key points</p>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                {section.content.map((item, idx) => (
                                                    <div key={idx} className="group p-4 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all">
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                                <span className="material-symbols-outlined text-gray-600 text-lg">{item.icon}</span>
                                                            </div>
                                                            <div>
                                                                <h3 className="text-sm font-semibold text-[#131613] mb-1">{item.subtitle}</h3>
                                                                <p className="text-xs text-gray-600 leading-relaxed">{item.text}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Section */}
                            <div className="bg-gradient-to-r from-primary to-green-600 rounded-2xl p-8 mt-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                                <div className="relative z-10 text-center">
                                    <span className="material-symbols-outlined text-4xl mb-4">agriculture</span>
                                    <h3 className="text-xl font-bold mb-2">Ready to Start Farming Smarter?</h3>
                                    <p className="text-sm text-white/80 mb-6 max-w-md mx-auto">Join thousands of Sri Lankan farmers using AgroSense AI</p>
                                    <div className="flex justify-center gap-3">
                                        <Link to="/register" className="px-6 py-3 bg-white text-primary text-sm font-medium rounded-xl hover:bg-white/90 transition-all shadow-lg">Create Free Account</Link>
                                        <Link to="/terms-of-service" className="px-6 py-3 bg-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/20 transition-all">View Terms</Link>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Card */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6 mt-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-white text-xl">support_agent</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-bold text-[#131613] mb-1">Questions About Privacy?</h3>
                                        <p className="text-xs text-gray-600 mb-4">Contact our Data Protection Officer for any concerns.</p>
                                        <div className="flex flex-wrap gap-4">
                                            <a href="mailto:privacy@agrosense.ai" className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-xs text-blue-600 hover:bg-blue-50 transition-colors shadow-sm">
                                                <span className="material-symbols-outlined text-sm">mail</span>
                                                privacy@agrosense.ai
                                            </a>
                                            <a href="tel:+94771234567" className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-xs text-blue-600 hover:bg-blue-50 transition-colors shadow-sm">
                                                <span className="material-symbols-outlined text-sm">call</span>
                                                +94 77 123 4567
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
