import React from "react";
import { Link } from "react-router-dom";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import DashboardFooter from "../components/dashboard/DashboardFooter";

export default function PrivacyPolicyPage() {
    const lastUpdated = "February 1, 2026";

    const sections = [
        {
            title: "Information We Collect",
            icon: "database",
            content: [
                {
                    subtitle: "Personal Information",
                    text: "When you register for AgroSense AI, we collect your name, email address, phone number, and farm location. This information helps us provide personalized agricultural recommendations."
                },
                {
                    subtitle: "Farm Data",
                    text: "We collect information about your crops, land area, soil type, and farming practices to deliver accurate crop guides, weather alerts, and market insights."
                },
                {
                    subtitle: "Usage Data",
                    text: "We automatically collect data about how you interact with our platform, including pages visited, features used, and time spent on the application."
                },
                {
                    subtitle: "Location Data",
                    text: "With your permission, we collect location data to provide localized weather forecasts, market prices, and region-specific agricultural recommendations."
                }
            ]
        },
        {
            title: "How We Use Your Information",
            icon: "settings",
            content: [
                {
                    subtitle: "Service Delivery",
                    text: "We use your information to provide personalized crop guidance, weather alerts, market price updates, and risk assessments tailored to your specific farming needs."
                },
                {
                    subtitle: "Platform Improvement",
                    text: "Your usage data helps us improve our AI algorithms, enhance user experience, and develop new features that benefit the farming community."
                },
                {
                    subtitle: "Communication",
                    text: "We may send you important updates about your crops, weather warnings, market opportunities, and service announcements via email or SMS."
                },
                {
                    subtitle: "Research & Analytics",
                    text: "Aggregated and anonymized data may be used for agricultural research to benefit the broader farming community in Sri Lanka."
                }
            ]
        },
        {
            title: "Data Protection & Security",
            icon: "shield",
            content: [
                {
                    subtitle: "Encryption",
                    text: "All data transmitted between your device and our servers is encrypted using industry-standard SSL/TLS protocols."
                },
                {
                    subtitle: "Secure Storage",
                    text: "Your personal and farm data is stored in secure, encrypted databases with restricted access controls."
                },
                {
                    subtitle: "Regular Audits",
                    text: "We conduct regular security audits and vulnerability assessments to ensure your data remains protected."
                },
                {
                    subtitle: "Employee Access",
                    text: "Only authorized personnel with legitimate business needs have access to user data, and all access is logged and monitored."
                }
            ]
        },
        {
            title: "Data Sharing",
            icon: "share",
            content: [
                {
                    subtitle: "Third-Party Services",
                    text: "We may share data with trusted partners who help us deliver services, such as weather data providers and SMS services. These partners are bound by strict confidentiality agreements."
                },
                {
                    subtitle: "Government Agencies",
                    text: "Aggregated agricultural data may be shared with the Department of Agriculture to support national food security initiatives, but never individual farmer data without consent."
                },
                {
                    subtitle: "Legal Requirements",
                    text: "We may disclose information if required by law, court order, or government regulation."
                },
                {
                    subtitle: "No Sale of Data",
                    text: "We never sell your personal information to third parties for marketing or advertising purposes."
                }
            ]
        },
        {
            title: "Your Rights",
            icon: "gavel",
            content: [
                {
                    subtitle: "Access & Download",
                    text: "You can request a copy of all personal data we hold about you at any time through your account settings."
                },
                {
                    subtitle: "Correction",
                    text: "You have the right to update or correct any inaccurate information in your profile."
                },
                {
                    subtitle: "Deletion",
                    text: "You can request deletion of your account and associated data. Some data may be retained for legal compliance."
                },
                {
                    subtitle: "Opt-Out",
                    text: "You can opt out of non-essential communications at any time through your notification preferences."
                }
            ]
        },
        {
            title: "Cookies & Tracking",
            icon: "cookie",
            content: [
                {
                    subtitle: "Essential Cookies",
                    text: "We use essential cookies to maintain your session and remember your preferences."
                },
                {
                    subtitle: "Analytics",
                    text: "We use analytics tools to understand how users interact with our platform and improve our services."
                },
                {
                    subtitle: "Cookie Control",
                    text: "You can manage cookie preferences through your browser settings, though some features may not work properly without cookies."
                }
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
                        <span>Privacy Policy</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#131613]">Privacy Policy</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        How we collect, use, and protect your information
                    </p>
                    <p className="text-xs text-gray-400 mt-2">Last updated: {lastUpdated}</p>
                </div>

                {/* Introduction */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6 animate-fade-in-down">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-primary">verified_user</span>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-[#131613] mb-2">Our Commitment to Your Privacy</h2>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                At AgroSense AI, we understand that your farm data is sensitive and valuable. We are committed to protecting your privacy and ensuring that your personal and agricultural information is handled securely and transparently. This Privacy Policy explains how we collect, use, share, and protect your information when you use our platform.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Policy Sections */}
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
                                <h2 className="text-sm font-bold text-[#131613]">{section.title}</h2>
                            </div>
                            <div className="space-y-4 pl-11">
                                {section.content.map((item, idx) => (
                                    <div key={idx}>
                                        <h3 className="text-xs font-semibold text-[#131613] mb-1">{item.subtitle}</h3>
                                        <p className="text-xs text-gray-600 leading-relaxed">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="bg-primary/5 rounded-xl border border-primary/10 p-5 mt-6 animate-fade-in-up">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary">help</span>
                        <div>
                            <h3 className="text-sm font-bold text-[#131613] mb-1">Questions About Privacy?</h3>
                            <p className="text-xs text-gray-600 mb-3">
                                If you have any questions or concerns about our privacy practices, please contact our Data Protection Officer.
                            </p>
                            <div className="flex flex-wrap gap-4 text-xs">
                                <a href="mailto:privacy@agrosense.ai" className="flex items-center gap-1 text-primary hover:underline">
                                    <span className="material-symbols-outlined text-sm">mail</span>
                                    privacy@agrosense.ai
                                </a>
                                <a href="tel:+94771234567" className="flex items-center gap-1 text-primary hover:underline">
                                    <span className="material-symbols-outlined text-sm">call</span>
                                    +94 77 123 4567
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <DashboardFooter />
        </div>
    );
}
