import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#f6f8f6]">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="ml-[200px] min-h-screen">
                <div className="max-w-[1100px] mx-auto px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
