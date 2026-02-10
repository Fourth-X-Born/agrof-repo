import React from "react";
import { Link } from "react-router-dom";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import DashboardFooter from "../components/dashboard/DashboardFooter";

export default function TermsOfServicePage() {
    const lastUpdated = "February 1, 2026";
    const effectiveDate = "January 1, 2026";

    const sections = [
        {
            title: "Acceptance of Terms",
            icon: "handshake",
            content: [
                "By accessing or using AgroSense AI, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
                "If you do not agree with any of these terms, you are prohibited from using or accessing this platform.",
                "We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.",
                "You must be at least 18 years old to use this service, or have parental/guardian consent."
            ]
        },
        {
            title: "Account Registration",
            icon: "person_add",
            content: [
                "You must provide accurate, complete, and current information during registration.",
                "You are responsible for maintaining the confidentiality of your account credentials.",
                "You agree to notify us immediately of any unauthorized use of your account.",
                "One person may not maintain multiple accounts without explicit permission.",
                "We reserve the right to suspend or terminate accounts that violate these terms."
            ]
        },
        {
            title: "Use of Services",
            icon: "apps",
            content: [
                "AgroSense AI provides agricultural guidance, weather information, crop management tools, and market insights for informational purposes.",
                "Our recommendations are based on AI analysis and should be used as guidance, not as definitive agricultural advice.",
                "You acknowledge that farming decisions involve inherent risks, and AgroSense AI is not liable for crop losses or damages.",
                "You agree to use the platform only for lawful purposes related to agricultural activities.",
                "Automated scraping, data harvesting, or unauthorized access to our systems is strictly prohibited."
            ]
        },
        {
            title: "Subscription & Payments",
            icon: "payments",
            content: [
                "Basic features of AgroSense AI are provided free of charge to support Sri Lankan farmers.",
                "Premium features may require a subscription, with pricing clearly displayed before purchase.",
                "Subscription fees are billed in advance on a monthly or annual basis.",
                "Refunds are available within 7 days of purchase if you are unsatisfied with premium services.",
                "We reserve the right to modify pricing with 30 days advance notice to existing subscribers."
            ]
        },
        {
            title: "Intellectual Property",
            icon: "copyright",
            content: [
                "All content, features, and functionality of AgroSense AI are owned by us and protected by intellectual property laws.",
                "You may not copy, modify, distribute, or create derivative works from our content without permission.",
                "User-generated content (such as farm data) remains your property, but you grant us a license to use it for service improvement.",
                "The AgroSense AI name, logo, and branding are our trademarks and may not be used without authorization."
            ]
        },
        {
            title: "Data & Privacy",
            icon: "security",
            content: [
                "Your use of AgroSense AI is also governed by our Privacy Policy.",
                "By using our services, you consent to the collection and use of data as described in our Privacy Policy.",
                "You are responsible for ensuring the accuracy of the farm data you provide.",
                "We implement industry-standard security measures but cannot guarantee absolute security."
            ]
        },
        {
            title: "Disclaimers",
            icon: "warning",
            content: [
                "AgroSense AI is provided \"as is\" without warranties of any kind, express or implied.",
                "We do not guarantee that our services will be uninterrupted, timely, secure, or error-free.",
                "Weather forecasts, market prices, and crop recommendations are based on available data and may not be 100% accurate.",
                "We are not responsible for any decisions made based on information provided by our platform.",
                "Agricultural outcomes depend on many factors beyond our control, including weather, soil conditions, and farming practices."
            ]
        },
        {
            title: "Limitation of Liability",
            icon: "gavel",
            content: [
                "In no event shall AgroSense AI be liable for any indirect, incidental, special, or consequential damages.",
                "Our total liability for any claims shall not exceed the amount you paid for our services in the past 12 months.",
                "This limitation applies to all causes of action, whether in contract, tort, or otherwise.",
                "Some jurisdictions do not allow limitation of liability, so these limits may not apply to you."
            ]
        },
        {
            title: "Termination",
            icon: "block",
            content: [
                "You may terminate your account at any time through your account settings.",
                "We may terminate or suspend your account immediately for violations of these terms.",
                "Upon termination, your right to use the platform ceases, but certain provisions of these terms survive.",
                "We may retain your data for legal compliance purposes even after account termination."
            ]
        },
        {
            title: "Governing Law",
            icon: "balance",
            content: [
                "These terms shall be governed by and construed in accordance with the laws of Sri Lanka.",
                "Any disputes arising from these terms shall be resolved in the courts of Colombo, Sri Lanka.",
                "You agree to submit to the personal jurisdiction of such courts.",
                "If any provision of these terms is found unenforceable, the remaining provisions remain in effect."
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#f6f8f6] flex flex-col">
            <DashboardNavbar />

            <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-6 animate-fade-in-up">
                {/* Page Header */}
                <div className="mb-6 animate-fade-in-down">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span>Terms of Service</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#131613]">Terms of Service</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Please read these terms carefully before using AgroSense AI
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-400">
                        <span>Effective: {effectiveDate}</span>
                        <span>•</span>
                        <span>Last updated: {lastUpdated}</span>
                    </div>
                </div>

                {/* Introduction */}
                <div className="bg-gradient-to-r from-primary to-green-600 rounded-xl p-5 mb-6 text-white animate-fade-in-down">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-2xl">description</span>
                        <div>
                            <h2 className="text-sm font-bold mb-2">Welcome to AgroSense AI</h2>
                            <p className="text-xs text-white/90 leading-relaxed">
                                These Terms of Service ("Terms") govern your access to and use of AgroSense AI's platform, including our website, mobile applications, and all related services. By creating an account or using our services, you agree to these Terms. Our mission is to empower Sri Lankan farmers with AI-driven agricultural insights while maintaining fair and transparent service conditions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Summary */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 animate-fade-in-down">
                    <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-amber-600 text-lg">lightbulb</span>
                        <div>
                            <h3 className="text-xs font-bold text-amber-800 mb-2">Quick Summary</h3>
                            <ul className="text-xs text-amber-700 space-y-1">
                                <li>• Use AgroSense AI responsibly for agricultural purposes</li>
                                <li>• Our recommendations are guidance, not guarantees</li>
                                <li>• Keep your account secure and information accurate</li>
                                <li>• Basic features are free; premium features require subscription</li>
                                <li>• You own your farm data; we protect it carefully</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Terms Sections */}
                <div className="space-y-4">
                    {sections.map((section, index) => (
                        <div 
                            key={index}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow animate-scale-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-lg">{section.icon}</span>
                                </div>
                                <h2 className="text-sm font-bold text-[#131613]">{index + 1}. {section.title}</h2>
                            </div>
                            <ul className="space-y-2 pl-11">
                                {section.content.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-gray-400 text-xs mt-1">arrow_right</span>
                                        <p className="text-xs text-gray-600 leading-relaxed">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Agreement Section */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mt-6 animate-fade-in-up">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary text-xl">verified</span>
                        <div>
                            <h3 className="text-sm font-bold text-[#131613] mb-2">Your Agreement</h3>
                            <p className="text-xs text-gray-600 leading-relaxed mb-4">
                                By using AgroSense AI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you are using the platform on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link 
                                    to="/privacy" 
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">shield</span>
                                    View Privacy Policy
                                </Link>
                                <Link 
                                    to="/contact" 
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">mail</span>
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-primary/5 rounded-xl border border-primary/10 p-5 mt-6 animate-fade-in-up">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary">support_agent</span>
                        <div>
                            <h3 className="text-sm font-bold text-[#131613] mb-1">Questions About These Terms?</h3>
                            <p className="text-xs text-gray-600 mb-3">
                                If you have any questions about these Terms of Service, please contact our legal team.
                            </p>
                            <div className="flex flex-wrap gap-4 text-xs">
                                <a href="mailto:legal@agrosense.ai" className="flex items-center gap-1 text-primary hover:underline">
                                    <span className="material-symbols-outlined text-sm">mail</span>
                                    legal@agrosense.ai
                                </a>
                                <span className="text-gray-400">Tech Innovation Hub, Colombo 03, Sri Lanka</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <DashboardFooter />
        </div>
    );
}
