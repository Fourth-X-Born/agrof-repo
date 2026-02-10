import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

export default function LandingTermsOfServicePage() {
    const lastUpdated = "February 1, 2026";
    const effectiveDate = "January 1, 2026";
    const [activeSection, setActiveSection] = useState(0);

    const sections = [
        {
            id: "acceptance",
            title: "Acceptance of Terms",
            icon: "handshake",
            color: "bg-blue-500",
            content: [
                "By accessing or using AgroSense AI, you agree to be bound by these Terms of Service.",
                "If you do not agree with any of these terms, you are prohibited from using this platform.",
                "We reserve the right to modify these terms at any time.",
                "You must be at least 18 years old to use this service."
            ]
        },
        {
            id: "account",
            title: "Account Registration",
            icon: "person_add",
            color: "bg-green-500",
            content: [
                "You must provide accurate, complete, and current information during registration.",
                "You are responsible for maintaining the confidentiality of your account credentials.",
                "You agree to notify us immediately of any unauthorized use of your account.",
                "One person may not maintain multiple accounts without explicit permission.",
                "We reserve the right to suspend or terminate accounts that violate these terms."
            ]
        },
        {
            id: "services",
            title: "Use of Services",
            icon: "apps",
            color: "bg-purple-500",
            content: [
                "AgroSense AI provides agricultural guidance, weather information, and market insights for informational purposes.",
                "Our recommendations are based on AI analysis and should be used as guidance, not as definitive advice.",
                "You acknowledge that farming decisions involve inherent risks.",
                "You agree to use the platform only for lawful purposes related to agricultural activities.",
                "Automated scraping or unauthorized access to our systems is strictly prohibited."
            ]
        },
        {
            id: "payments",
            title: "Subscription & Payments",
            icon: "payments",
            color: "bg-amber-500",
            content: [
                "Basic features of AgroSense AI are provided free of charge.",
                "Premium features may require a subscription with clear pricing.",
                "Subscription fees are billed in advance on a monthly or annual basis.",
                "Refunds are available within 7 days of purchase.",
                "We reserve the right to modify pricing with 30 days advance notice."
            ]
        },
        {
            id: "intellectual",
            title: "Intellectual Property",
            icon: "copyright",
            color: "bg-rose-500",
            content: [
                "All content and functionality of AgroSense AI are owned by us and protected by law.",
                "You may not copy, modify, or distribute our content without permission.",
                "User-generated content remains your property with a license granted to us.",
                "The AgroSense AI name and logo are our trademarks."
            ]
        },
        {
            id: "privacy",
            title: "Data & Privacy",
            icon: "security",
            color: "bg-teal-500",
            content: [
                "Your use of AgroSense AI is also governed by our Privacy Policy.",
                "By using our services, you consent to data collection as described in our Privacy Policy.",
                "You are responsible for ensuring the accuracy of the farm data you provide.",
                "We implement industry-standard security measures to protect your data."
            ]
        },
        {
            id: "disclaimers",
            title: "Disclaimers",
            icon: "warning",
            color: "bg-orange-500",
            content: [
                "AgroSense AI is provided \"as is\" without warranties of any kind.",
                "We do not guarantee uninterrupted, timely, secure, or error-free services.",
                "Weather forecasts and crop recommendations may not be 100% accurate.",
                "We are not responsible for decisions made based on our platform's information.",
                "Agricultural outcomes depend on many factors beyond our control."
            ]
        },
        {
            id: "liability",
            title: "Limitation of Liability",
            icon: "gavel",
            color: "bg-indigo-500",
            content: [
                "AgroSense AI shall not be liable for any indirect or consequential damages.",
                "Our total liability shall not exceed the amount you paid in the past 12 months.",
                "This limitation applies to all causes of action.",
                "Some jurisdictions do not allow limitation of liability."
            ]
        },
        {
            id: "termination",
            title: "Termination",
            icon: "block",
            color: "bg-red-500",
            content: [
                "You may terminate your account at any time through your settings.",
                "We may terminate or suspend your account immediately for violations.",
                "Upon termination, your right to use the platform ceases.",
                "We may retain your data for legal compliance purposes."
            ]
        },
        {
            id: "governing",
            title: "Governing Law",
            icon: "balance",
            color: "bg-slate-500",
            content: [
                "These terms shall be governed by the laws of Sri Lanka.",
                "Any disputes shall be resolved in the courts of Colombo, Sri Lanka.",
                "You agree to submit to the personal jurisdiction of such courts.",
                "If any provision is found unenforceable, the remaining provisions remain in effect."
            ]
        }
    ];

    const quickSummary = [
        { icon: "check_circle", text: "Use AgroSense AI responsibly for agricultural purposes" },
        { icon: "info", text: "Our recommendations are guidance, not guarantees" },
        { icon: "lock", text: "Keep your account secure and information accurate" },
        { icon: "card_giftcard", text: "Basic features are free; premium requires subscription" },
        { icon: "folder", text: "You own your farm data; we protect it carefully" }
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
                                <span className="material-symbols-outlined text-sm">description</span>
                                Legal Agreement
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
                            <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto mb-6">
                                Please read these terms carefully before using AgroSense AI. By using our platform, you agree to these terms.
                            </p>
                            <div className="flex items-center justify-center gap-4 text-xs text-white/70">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">event</span>
                                    Effective: {effectiveDate}
                                </span>
                                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">update</span>
                                    Updated: {lastUpdated}
                                </span>
                            </div>
                        </div>

                        {/* Quick Summary */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-12">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-amber-300">lightbulb</span>
                                <h3 className="text-sm font-bold text-white">Quick Summary</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                                {quickSummary.map((item, index) => (
                                    <div key={index} className="flex items-start gap-2 text-white/80">
                                        <span className="material-symbols-outlined text-green-300 text-sm mt-0.5">{item.icon}</span>
                                        <span className="text-xs">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1200px] mx-auto w-full px-6 py-10">
                    <div className="flex gap-8">
                        {/* Sidebar Navigation */}
                        <div className="hidden lg:block w-64 flex-shrink-0">
                            <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Sections</h3>
                                <nav className="space-y-1">
                                    {sections.map((section, index) => (
                                        <button key={index} onClick={() => scrollToSection(section.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all text-xs ${activeSection === index ? "bg-slate-100 text-slate-800 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                                            <span className={`w-5 h-5 rounded ${section.color} text-white flex items-center justify-center text-xs`}>
                                                {index + 1}
                                            </span>
                                            <span className="truncate">{section.title}</span>
                                        </button>
                                    ))}
                                </nav>
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <Link to="/privacy-policy" className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-sm">shield</span>
                                        Privacy Policy
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {/* Introduction Card */}
                            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 mb-8 text-white">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-2xl">description</span>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold mb-2">Welcome to AgroSense AI</h2>
                                        <p className="text-sm text-white/80 leading-relaxed">
                                            These Terms of Service govern your access to and use of AgroSense AI's platform. By creating an account or using our services, you agree to these Terms. Our mission is to empower Sri Lankan farmers with AI-driven agricultural insights.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Terms Sections */}
                            <div className="space-y-6">
                                {sections.map((section, index) => (
                                    <div key={index} id={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-24">
                                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl ${section.color} flex items-center justify-center`}>
                                                <span className="material-symbols-outlined text-white text-xl">{section.icon}</span>
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-base font-bold text-[#131613]">{index + 1}. {section.title}</h2>
                                            </div>
                                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{section.content.length} items</span>
                                        </div>
                                        <div className="p-6">
                                            <ul className="space-y-3">
                                                {section.content.map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-3 group">
                                                        <span className={`w-6 h-6 rounded-lg ${section.color}/10 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                            <span className="material-symbols-outlined text-sm text-gray-500">arrow_right</span>
                                                        </span>
                                                        <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">{item}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Section */}
                            <div className="bg-gradient-to-r from-primary to-green-600 rounded-2xl p-8 mt-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                                <div className="relative z-10 text-center">
                                    <span className="material-symbols-outlined text-4xl mb-4">task_alt</span>
                                    <h3 className="text-xl font-bold mb-2">Agree to Terms & Get Started</h3>
                                    <p className="text-sm text-white/80 mb-6 max-w-md mx-auto">By creating an account, you agree to these Terms of Service and our Privacy Policy</p>
                                    <div className="flex justify-center gap-3">
                                        <Link to="/register" className="px-6 py-3 bg-white text-primary text-sm font-medium rounded-xl hover:bg-white/90 transition-all shadow-lg">Create Free Account</Link>
                                        <Link to="/privacy-policy" className="px-6 py-3 bg-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/20 transition-all">View Privacy Policy</Link>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Card */}
                            <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border border-slate-200 p-6 mt-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-white text-xl">support_agent</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-bold text-[#131613] mb-1">Questions About These Terms?</h3>
                                        <p className="text-xs text-gray-600 mb-4">Contact our legal team for any questions or concerns.</p>
                                        <div className="flex flex-wrap gap-4">
                                            <a href="mailto:legal@agrosense.ai" className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                                                <span className="material-symbols-outlined text-sm">mail</span>
                                                legal@agrosense.ai
                                            </a>
                                            <span className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-xs text-slate-500 shadow-sm">
                                                <span className="material-symbols-outlined text-sm">location_on</span>
                                                Tech Innovation Hub, Colombo 03
                                            </span>
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
