import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import DashboardFooter from "../components/dashboard/DashboardFooter";
import dataService from "../services/dataService";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function CropGuidePage() {
    const navigate = useNavigate();
    const [crops, setCrops] = useState([]);
    const [selectedCropId, setSelectedCropId] = useState(null);
    const [cropGuide, setCropGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [guideLoading, setGuideLoading] = useState(false);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);

    // Fetch crops on mount
    useEffect(() => {
        const fetchCrops = async () => {
            try {
                setLoading(true);
                const response = await dataService.getCrops();
                const cropsData = response?.data || response || [];
                setCrops(Array.isArray(cropsData) ? cropsData : []);
                
                // Get user's preferred crop from localStorage
                let userCropId = null;
                try {
                    const user = JSON.parse(localStorage.getItem("user") || "{}");
                    userCropId = user.cropId || null;
                } catch {
                    userCropId = null;
                }

                // Auto-select user's crop if available, else first crop
                if (userCropId && cropsData.some(c => c.id === userCropId)) {
                    setSelectedCropId(userCropId);
                } else if (cropsData.length > 0) {
                    setSelectedCropId(cropsData[0].id);
                }
            } catch (err) {
                console.error("Error fetching crops:", err);
                setError("Failed to load crops");
            } finally {
                setLoading(false);
            }
        };
        fetchCrops();
    }, []);

    // Fetch crop guide when crop is selected
    useEffect(() => {
        if (!selectedCropId) return;

        const fetchCropGuide = async () => {
            try {
                setGuideLoading(true);
                setError(null);
                const response = await dataService.getCropGuide(selectedCropId);
                setCropGuide(response?.data || response);
            } catch (err) {
                console.error("Error fetching crop guide:", err);
                setError("Failed to load crop guide for this crop");
                setCropGuide(null);
            } finally {
                setGuideLoading(false);
            }
        };
        fetchCropGuide();
    }, [selectedCropId]);

    // Format days range
    const formatDaysRange = (startDay, endDay) => {
        return `Day ${startDay}-${endDay}`;
    };

    // Generate and download PDF
    const handleDownloadPDF = async () => {
        if (!cropGuide) return;

        setDownloading(true);
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 15;
            let yPos = 15;

            // Helper function to add new page if needed
            const checkPageBreak = (requiredSpace = 25) => {
                if (yPos + requiredSpace > pageHeight - 25) {
                    doc.addPage();
                    yPos = 20;
                }
            };

            // ===== HEADER =====
            doc.setFillColor(22, 163, 74);
            doc.rect(0, 0, pageWidth, 35, "F");
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("AgroSense AI", margin, 15);
            
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text("Crop Cultivation Guide", margin, 25);
            
            // Date on the right
            doc.setFontSize(9);
            const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            doc.text(dateStr, pageWidth - margin, 25, { align: "right" });

            doc.setTextColor(0, 0, 0);
            yPos = 45;

            // ===== CROP NAME & SEASON =====
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(22, 100, 50);
            doc.text(cropGuide.crop?.name || "Crop Guide", margin, yPos);
            
            if (cropGuide.details?.seasonType) {
                const seasonText = cropGuide.details.seasonType === "Both" 
                    ? "All Seasons" 
                    : `${cropGuide.details.seasonType} Season`;
                doc.setFontSize(10);
                doc.setFont("helvetica", "italic");
                doc.setTextColor(180, 100, 20);
                doc.text(`( ${seasonText} )`, margin + doc.getTextWidth(cropGuide.crop?.name || "Crop Guide") + 5, yPos);
            }
            doc.setTextColor(0, 0, 0);
            yPos += 10;

            // ===== DESCRIPTION =====
            if (cropGuide.details?.description) {
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(80, 80, 80);
                const descLines = doc.splitTextToSize(cropGuide.details.description, pageWidth - 2 * margin);
                doc.text(descLines, margin, yPos);
                yPos += descLines.length * 5 + 8;
            }
            doc.setTextColor(0, 0, 0);

            // ===== CROP INFORMATION TABLE =====
            checkPageBreak(35);
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Crop Information", margin, yPos);
            yPos += 6;

            autoTable(doc, {
                startY: yPos,
                body: [
                    ["Growth Duration", `${cropGuide.details?.growthDurationDays || "N/A"} days`],
                    ["Optimal Temperature", cropGuide.details?.optimalTemperature || "N/A"],
                    ["Water Requirement", cropGuide.details?.waterRequirement || "N/A"],
                    ["Soil pH", cropGuide.details?.soilPH || "N/A"]
                ],
                margin: { left: margin, right: margin },
                theme: 'grid',
                styles: { fontSize: 10, cellPadding: 5 },
                columnStyles: {
                    0: { fontStyle: 'bold', fillColor: [240, 253, 244], cellWidth: 60 },
                    1: { cellWidth: 'auto' }
                }
            });
            yPos = doc.lastAutoTable.finalY + 12;

            // ===== GROWTH PHASES =====
            if (cropGuide.stages && cropGuide.stages.length > 0) {
                checkPageBreak(50);
                doc.setFontSize(12);
                doc.setFont("helvetica", "bold");
                doc.text("Growth Phases", margin, yPos);
                yPos += 6;

                const stageData = cropGuide.stages.map((stage, index) => [
                    `${index + 1}`,
                    stage.stageName || "-",
                    `Day ${stage.startDay || 0} - Day ${stage.endDay || 0}`,
                    stage.focusArea || "-"
                ]);

                autoTable(doc, {
                    startY: yPos,
                    head: [["#", "Stage Name", "Duration", "Focus Area"]],
                    body: stageData,
                    margin: { left: margin, right: margin },
                    headStyles: { 
                        fillColor: [22, 163, 74],
                        textColor: [255, 255, 255],
                        fontStyle: "bold",
                        halign: 'center'
                    },
                    columnStyles: {
                        0: { cellWidth: 15, halign: 'center' },
                        1: { cellWidth: 45 },
                        2: { cellWidth: 40, halign: 'center' },
                        3: { cellWidth: 'auto' }
                    },
                    alternateRowStyles: { fillColor: [248, 250, 248] },
                    styles: { fontSize: 9, cellPadding: 4 }
                });
                yPos = doc.lastAutoTable.finalY + 12;
            }

            // ===== FERTILIZER RECOMMENDATIONS =====
            if (cropGuide.fertilizers && cropGuide.fertilizers.length > 0) {
                checkPageBreak(50);
                doc.setFontSize(12);
                doc.setFont("helvetica", "bold");
                doc.text("Fertilizer Recommendations", margin, yPos);
                yPos += 6;

                const fertData = cropGuide.fertilizers.map((fert, index) => [
                    `${index + 1}`,
                    fert.fertilizerName || "-",
                    fert.dosagePerHectare || "-",
                    fert.applicationStage || "-"
                ]);

                autoTable(doc, {
                    startY: yPos,
                    head: [["#", "Fertilizer Name", "Dosage (per hectare)", "Application Stage"]],
                    body: fertData,
                    margin: { left: margin, right: margin },
                    headStyles: { 
                        fillColor: [22, 163, 74],
                        textColor: [255, 255, 255],
                        fontStyle: "bold",
                        halign: 'center'
                    },
                    columnStyles: {
                        0: { cellWidth: 15, halign: 'center' },
                        1: { cellWidth: 50 },
                        2: { cellWidth: 50 },
                        3: { cellWidth: 'auto' }
                    },
                    alternateRowStyles: { fillColor: [248, 250, 248] },
                    styles: { fontSize: 9, cellPadding: 4 }
                });
                yPos = doc.lastAutoTable.finalY + 12;
            }

            // ===== SUSTAINABLE PRACTICES =====
            const hasDos = cropGuide.guidelines?.dos && cropGuide.guidelines.dos.length > 0;
            const hasDonts = cropGuide.guidelines?.donts && cropGuide.guidelines.donts.length > 0;
            
            if (hasDos || hasDonts) {
                checkPageBreak(60);
                doc.setFontSize(12);
                doc.setFont("helvetica", "bold");
                doc.text("Sustainable Practices", margin, yPos);
                yPos += 8;

                // DO's Table
                if (hasDos) {
                    doc.setFontSize(11);
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(22, 163, 74);
                    doc.text("RECOMMENDED PRACTICES (DO's)", margin, yPos);
                    doc.setTextColor(0, 0, 0);
                    yPos += 5;

                    const dosData = cropGuide.guidelines.dos.map((item, index) => [
                        `${index + 1}.`,
                        item
                    ]);

                    autoTable(doc, {
                        startY: yPos,
                        body: dosData,
                        margin: { left: margin, right: margin },
                        theme: 'plain',
                        styles: { fontSize: 9, cellPadding: 3 },
                        columnStyles: {
                            0: { cellWidth: 12, fontStyle: 'bold', textColor: [22, 163, 74] },
                            1: { cellWidth: 'auto' }
                        },
                        didParseCell: function(data) {
                            if (data.column.index === 0) {
                                data.cell.styles.textColor = [22, 163, 74];
                            }
                        }
                    });
                    yPos = doc.lastAutoTable.finalY + 10;
                }

                // DON'Ts Table
                if (hasDonts) {
                    checkPageBreak(40);
                    doc.setFontSize(11);
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(200, 50, 50);
                    doc.text("PRACTICES TO AVOID (DON'Ts)", margin, yPos);
                    doc.setTextColor(0, 0, 0);
                    yPos += 5;

                    const dontsData = cropGuide.guidelines.donts.map((item, index) => [
                        `${index + 1}.`,
                        item
                    ]);

                    autoTable(doc, {
                        startY: yPos,
                        body: dontsData,
                        margin: { left: margin, right: margin },
                        theme: 'plain',
                        styles: { fontSize: 9, cellPadding: 3 },
                        columnStyles: {
                            0: { cellWidth: 12, fontStyle: 'bold' },
                            1: { cellWidth: 'auto' }
                        },
                        didParseCell: function(data) {
                            if (data.column.index === 0) {
                                data.cell.styles.textColor = [200, 50, 50];
                            }
                        }
                    });
                    yPos = doc.lastAutoTable.finalY + 10;
                }
            }

            // ===== FOOTER ON ALL PAGES =====
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                
                // Footer line
                doc.setDrawColor(200, 200, 200);
                doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
                
                // Footer text
                doc.setFontSize(8);
                doc.setTextColor(120, 120, 120);
                doc.text("Generated by AgroSense AI - Your Smart Farming Assistant", margin, pageHeight - 8);
                doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: "right" });
            }

            // Save the PDF
            const cropName = (cropGuide.crop?.name || "Crop").replace(/[^a-zA-Z0-9]/g, "_");
            const fileName = `${cropName}_Cultivation_Guide.pdf`;
            doc.save(fileName);
            
        } catch (err) {
            console.error("Error generating PDF:", err);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    const cropsLoaded = crops.length > 0;
    const guideLoaded = !!cropGuide;
    
    const renderLoadingState = () => (
        <div className="min-h-screen bg-[#f6f8f6] flex flex-col">
            <DashboardNavbar />
            <main className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 animate-fade-in-up">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-amber-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-amber-500 rounded-full animate-spin"></div>
                        <span className="material-symbols-outlined text-amber-600 text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            menu_book
                        </span>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-[#131613]">
                            {cropsLoaded ? 'Loading Crop Guidelines...' : 'Loading Crop Guide...'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Fetching cultivation guidelines & best practices</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                        <div className={`flex items-center gap-1.5 text-[10px] ${cropsLoaded ? 'text-green-500' : 'text-gray-400'}`}>
                            <span className={`material-symbols-outlined text-xs ${cropsLoaded ? '' : 'animate-pulse'}`}>
                                {cropsLoaded ? 'check_circle' : 'grass'}
                            </span>
                            Crops
                        </div>
                        <div className={`flex items-center gap-1.5 text-[10px] ${guideLoaded ? 'text-green-500' : 'text-gray-400'}`}>
                            <span className={`material-symbols-outlined text-xs ${guideLoaded ? '' : 'animate-pulse'}`}>
                                {guideLoaded ? 'check_circle' : 'schedule'}
                            </span>
                            Timelines
                        </div>
                        <div className={`flex items-center gap-1.5 text-[10px] ${guideLoaded ? 'text-green-500' : 'text-gray-400'}`}>
                            <span className={`material-symbols-outlined text-xs ${guideLoaded ? '' : 'animate-pulse'}`}>
                                {guideLoaded ? 'check_circle' : 'eco'}
                            </span>
                            Practices
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

    const renderErrorState = () => (
        <div className="min-h-screen bg-[#f6f8f6] flex flex-col">
            <DashboardNavbar />
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
                    <p className="text-red-600 mt-2">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                        Retry
                    </button>
                </div>
            </main>
        </div>
    );

    if (loading || guideLoading) return renderLoadingState();
    if (error && !cropGuide) return renderErrorState();

    return (
        <div className="min-h-screen bg-[#f6f8f6] flex flex-col">
            {/* Dashboard Navbar */}
            <DashboardNavbar />

            {/* Main Content */}
            <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-6 animate-fade-in-up">
                {/* Crop Selector & Download */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 animate-fade-in-down">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-[#131613]">Select Crop:</label>
                            <select
                                value={selectedCropId || ""}
                                onChange={(e) => setSelectedCropId(Number(e.target.value))}
                                className="w-40 px-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.5rem_center]"
                            >
                                {crops.map((crop) => (
                                    <option key={crop.id} value={crop.id}>
                                        {crop.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button 
                            onClick={handleDownloadPDF}
                            disabled={!cropGuide || downloading}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium text-[#131613] hover:bg-gray-50 transition-colors hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {downloading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-base">download</span>
                                    Download PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {guideLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                            <p className="text-gray-500 mt-3 text-sm">Loading crop guide...</p>
                        </div>
                    </div>
                ) : cropGuide ? (
                    <>
                        {/* Page Header */}
                        <div className="mb-6 animate-fade-in-down">
                            <h1 className="text-2xl font-bold text-[#131613]">
                                Crop Guide: {cropGuide.crop?.name || "Unknown Crop"}
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                {cropGuide.details?.description || "Recommended guide and growth schedule."}
                            </p>
                            {cropGuide.details?.seasonType && (
                                <div className="flex items-center gap-1.5 mt-2">
                                    <span className="material-symbols-outlined text-orange-400 text-sm animate-spin-slow">
                                        {cropGuide.details.seasonType === "Dry" ? "sunny" : cropGuide.details.seasonType === "Wet" ? "water_drop" : "eco"}
                                    </span>
                                    <span className="text-orange-500 text-xs font-medium">
                                        {cropGuide.details.seasonType === "Both" ? "All Seasons" : `${cropGuide.details.seasonType} Season`}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Growth Stage Timeline */}
                        {cropGuide.stages && cropGuide.stages.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6 animate-scale-in delay-100 hover:shadow-md transition-shadow">
                                <h3 className="text-sm font-bold text-[#131613] mb-4">Growth Phases</h3>
                                <div className="flex items-center justify-between relative">
                                    {/* Connection Line - spans all stages */}
                                    <div className="absolute top-4 left-[5%] right-[5%] h-0.5 bg-primary/30 z-0"></div>

                                    {cropGuide.stages.map((stage, index) => (
                                        <div 
                                            key={stage.id || index} 
                                            className="flex flex-col items-center relative z-10 flex-1"
                                            style={{ animationDelay: `${index * 150}ms` }}
                                        >
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white shadow-md">
                                                <span className="text-xs font-bold">{index + 1}</span>
                                            </div>
                                            <p className="text-xs font-semibold mt-2 text-[#131613] text-center">{stage.stageName}</p>
                                            <p className="text-[10px] text-gray-500">{formatDaysRange(stage.startDay, stage.endDay)}</p>
                                            {stage.focusArea && (
                                                <p className="text-[9px] text-gray-400 mt-0.5">{stage.focusArea}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Info Alert */}
                        {cropGuide.details && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3 animate-fade-in delay-200 hover:shadow-sm transition-shadow">
                                <span className="material-symbols-outlined text-blue-500 text-lg animate-pulse">info</span>
                                <div>
                                    <h4 className="text-sm font-semibold text-blue-800">Crop Information</h4>
                                    <p className="text-xs text-blue-700 leading-relaxed">
                                        Growth Duration: {cropGuide.details.growthDurationDays || "N/A"} days | 
                                        Optimal Temperature: {cropGuide.details.optimalTemperature || "N/A"} | 
                                        Water: {cropGuide.details.waterRequirement || "N/A"} | 
                                        Soil pH: {cropGuide.details.soilPH || "N/A"}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Main Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Main Content */}
                            <div className="lg:col-span-2 space-y-6 animate-fade-in-up delay-300">
                                {/* Fertilizer Recommendations */}
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-sm font-bold text-[#131613]">Fertilizer Recommendations</h3>
                                            <p className="text-[10px] text-gray-400">Recommended fertilizers for optimal growth</p>
                                        </div>
                                    </div>

                                    {/* Fertilizer Application */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="material-symbols-outlined text-primary text-base">science</span>
                                            <span className="text-xs font-semibold text-[#131613]">Fertilizer Application</span>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-gray-100">
                                                        <th className="text-left text-[10px] font-medium text-gray-500 pb-2">Fertilizer</th>
                                                        <th className="text-left text-[10px] font-medium text-gray-500 pb-2">Dosage (per hectare)</th>
                                                        <th className="text-left text-[10px] font-medium text-gray-500 pb-2">Application Stage</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cropGuide.fertilizers && cropGuide.fertilizers.length > 0 ? (
                                                        cropGuide.fertilizers.map((fert, index) => (
                                                            <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                                <td className="py-2.5 text-xs text-[#131613] font-medium">{fert.fertilizerName}</td>
                                                                <td className="py-2.5 text-xs text-gray-600">{fert.dosagePerHectare}</td>
                                                                <td className="py-2.5 text-xs text-gray-600">{fert.applicationStage}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={3} className="py-4 text-center text-xs text-gray-400">
                                                                No fertilizer recommendations available
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Crop Details Metrics */}
                                    {cropGuide.details && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="material-symbols-outlined text-blue-500 text-base">water_drop</span>
                                                <span className="text-xs font-semibold text-[#131613]">Growing Conditions</span>
                                            </div>

                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="bg-blue-50 rounded-lg p-3 text-center hover:scale-105 transition-transform duration-300">
                                                    <p className="text-lg font-bold text-blue-600">{cropGuide.details.waterRequirement || "N/A"}</p>
                                                    <p className="text-[9px] text-blue-500 uppercase tracking-wider">Water</p>
                                                </div>
                                                <div className="bg-green-50 rounded-lg p-3 text-center hover:scale-105 transition-transform duration-300">
                                                    <p className="text-lg font-bold text-green-600">{cropGuide.details.soilPH || "N/A"}</p>
                                                    <p className="text-[9px] text-green-500 uppercase tracking-wider">Soil pH</p>
                                                </div>
                                                <div className="bg-orange-50 rounded-lg p-3 text-center hover:scale-105 transition-transform duration-300">
                                                    <p className="text-lg font-bold text-orange-600">{cropGuide.details.optimalTemperature || "N/A"}</p>
                                                    <p className="text-[9px] text-orange-500 uppercase tracking-wider">Temperature</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column - Sidebar */}
                            <div className="space-y-4 animate-fade-in-right delay-500">
                                {/* Sustainable Practices */}
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                                    <h3 className="text-sm font-bold text-[#131613] mb-4">Sustainable Practices</h3>

                                    {/* Do's */}
                                    <div className="mb-4">
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">DO'S</p>
                                        <div className="space-y-2">
                                            {cropGuide.guidelines?.dos && cropGuide.guidelines.dos.length > 0 ? (
                                                cropGuide.guidelines.dos.map((item, index) => (
                                                    <div key={index} className="flex items-start gap-2 group">
                                                        <span className="material-symbols-outlined text-green-500 text-base mt-0.5 group-hover:scale-110 transition-transform">check_circle</span>
                                                        <p className="text-xs text-gray-600">{item}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-400">No guidelines available</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Don'ts */}
                                    <div className="mb-4">
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">DON'TS</p>
                                        <div className="space-y-2">
                                            {cropGuide.guidelines?.donts && cropGuide.guidelines.donts.length > 0 ? (
                                                cropGuide.guidelines.donts.map((item, index) => (
                                                    <div key={index} className="flex items-start gap-2 group">
                                                        <span className="material-symbols-outlined text-red-500 text-base mt-0.5 group-hover:scale-110 transition-transform">cancel</span>
                                                        <p className="text-xs text-gray-600">{item}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-400">No guidelines available</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Expert Help Card */}
                                <div className="bg-primary rounded-xl p-4 text-white hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md">
                                    <h3 className="text-sm font-bold mb-2">Need Expert Help?</h3>
                                    <p className="text-xs text-white/80 mb-4">
                                        Contact Agricultural Experts From Expertise of Crop Management
                                    </p>
                                    <button 
                                        onClick={() => navigate('/contact')}
                                        className="w-full py-2 bg-white text-primary text-xs font-medium rounded-lg hover:bg-white/90 transition-all hover:shadow hover:-translate-y-0.5"
                                    >
                                        Contact Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                        <span className="material-symbols-outlined text-gray-300 text-5xl">menu_book</span>
                        <p className="text-gray-500 mt-3">Select a crop to view its cultivation guide</p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <DashboardFooter />
        </div>
    );
}
