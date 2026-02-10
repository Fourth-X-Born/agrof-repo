import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import adminService from "../../services/adminService";

export default function AdminUserRequestsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [messages, setMessages] = useState([]);
    const [stats, setStats] = useState({ totalMessages: 0, newMessages: 0, readMessages: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [updating, setUpdating] = useState(false);

    const itemsPerPage = 10;

    // Fetch messages and stats from API
    useEffect(() => {
        fetchMessages();
        fetchStats();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await adminService.getContactMessages();
            const messagesData = response?.data || response || [];
            setMessages(Array.isArray(messagesData) ? messagesData : []);
        } catch (err) {
            console.error("Error fetching contact messages:", err);
            setError("Failed to load contact messages");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await adminService.getContactMessageStats();
            const data = response?.data || response || {};
            // Map API response fields to expected field names
            setStats({
                totalMessages: data.total || 0,
                newMessages: data.new || 0,
                readMessages: data.read || 0
            });
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    };

    // Get status badge styling
    const getStatusBadge = (status) => {
        const styles = {
            'NEW': 'bg-blue-100 text-blue-700 border-blue-200',
            'READ': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'RESPONDED': 'bg-green-100 text-green-700 border-green-200',
            'CLOSED': 'bg-gray-100 text-gray-600 border-gray-200',
        };
        return styles[status] || 'bg-gray-100 text-gray-600';
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filter messages based on search and status
    const filteredMessages = messages.filter((msg) => {
        const matchesSearch =
            msg.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.subject?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || msg.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Paginate messages
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMessages = filteredMessages.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

    // Reset to first page when search/filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter]);

    // View message details
    const handleViewMessage = async (message) => {
        setSelectedMessage(message);
        setShowModal(true);

        // Mark as READ if it's NEW
        if (message.status === 'NEW') {
            try {
                await adminService.updateContactMessage(message.id, { status: 'READ' });
                // Update local state
                setMessages(prev => prev.map(m =>
                    m.id === message.id ? { ...m, status: 'READ' } : m
                ));
                fetchStats();
            } catch (err) {
                console.error("Error updating message status:", err);
            }
        }
    };

    // Update message status
    const handleUpdateStatus = async (newStatus) => {
        if (!selectedMessage) return;
        setUpdating(true);
        try {
            await adminService.updateContactMessage(selectedMessage.id, { status: newStatus });
            setMessages(prev => prev.map(m =>
                m.id === selectedMessage.id ? { ...m, status: newStatus } : m
            ));
            setSelectedMessage(prev => ({ ...prev, status: newStatus }));
            fetchStats();
        } catch (err) {
            console.error("Error updating status:", err);
        } finally {
            setUpdating(false);
        }
    };

    // Delete message
    const handleDeleteMessage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;

        try {
            await adminService.deleteContactMessage(id);
            setMessages(prev => prev.filter(m => m.id !== id));
            setShowModal(false);
            setSelectedMessage(null);
            fetchStats();
        } catch (err) {
            console.error("Error deleting message:", err);
        }
    };

    return (
        <AdminLayout>
            <div className="animate-fade-in">
                {/* Header */}
                <div className="mb-6 animate-fade-in-up">
                    <h1 className="text-2xl font-bold text-[#131613]">User Requests</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        View and manage contact messages from users.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-fade-in-up delay-50">
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <span className="material-symbols-outlined text-blue-600">mail</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[#131613]">{stats.totalMessages}</p>
                                <p className="text-sm text-gray-500">Total Messages</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-50 rounded-lg">
                                <span className="material-symbols-outlined text-yellow-600">mark_email_unread</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[#131613]">{stats.newMessages}</p>
                                <p className="text-sm text-gray-500">New Messages</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <span className="material-symbols-outlined text-green-600">mark_email_read</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[#131613]">{stats.readMessages}</p>
                                <p className="text-sm text-gray-500">Read Messages</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm animate-fade-in-up delay-100">
                    {/* Search and Controls */}
                    <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Search by name, email, or subject..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>

                        {/* Filter and Count */}
                        <div className="flex items-center gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            >
                                <option value="ALL">All Status</option>
                                <option value="NEW">New</option>
                                <option value="READ">Read</option>
                                <option value="RESPONDED">Responded</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                            <span className="text-xs text-gray-500">
                                Total: {filteredMessages.length} messages
                            </span>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                                <p className="text-gray-500 mt-3 text-sm">Loading messages...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
                                <p className="text-red-600 mt-2">{error}</p>
                                <button
                                    onClick={fetchMessages}
                                    className="mt-3 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-t border-b border-gray-100 bg-gray-50/50">
                                            <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Subject
                                            </th>
                                            <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="text-left py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="text-center py-3 px-5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedMessages.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="py-8 text-center text-gray-500">
                                                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">inbox</span>
                                                    <p className="text-sm">No messages found</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedMessages.map((message, index) => (
                                                <tr
                                                    key={message.id}
                                                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors animate-fade-in ${message.status === 'NEW' ? 'bg-blue-50/30' : ''
                                                        }`}
                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                >
                                                    <td className="py-4 px-5 text-sm text-gray-500">#{message.id}</td>
                                                    <td className="py-4 px-5">
                                                        <div className="flex items-center gap-2">
                                                            {message.status === 'NEW' && (
                                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                            )}
                                                            <span className="text-sm font-medium text-[#131613]">{message.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-5 text-sm text-gray-500">{message.email}</td>
                                                    <td className="py-4 px-5 text-sm text-gray-600 max-w-[200px] truncate">
                                                        {message.subject}
                                                    </td>
                                                    <td className="py-4 px-5">
                                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(message.status)}`}>
                                                            {message.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-5 text-sm text-gray-500">
                                                        {formatDate(message.createdAt)}
                                                    </td>
                                                    <td className="py-4 px-5">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => handleViewMessage(message)}
                                                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                                                title="View Details"
                                                            >
                                                                <span className="material-symbols-outlined text-gray-500 text-lg">visibility</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteMessage(message.id)}
                                                                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete"
                                                            >
                                                                <span className="material-symbols-outlined text-red-500 text-lg">delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {filteredMessages.length > 0 && (
                                <div className="p-4 flex items-center justify-between border-t border-gray-100">
                                    <p className="text-sm text-gray-500">
                                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMessages.length)} of{" "}
                                        {filteredMessages.length} results
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-sm text-gray-500">
                                            Page {currentPage} of {totalPages || 1}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages || totalPages === 0}
                                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Message Detail Modal */}
            {showModal && selectedMessage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-scale-in">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <span className="material-symbols-outlined text-primary">mail</span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#131613]">Message Details</h2>
                                    <p className="text-sm text-gray-500">#{selectedMessage.id}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-gray-500">close</span>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5 space-y-4">
                            {/* Sender Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-wider">Name</label>
                                    <p className="text-sm font-medium text-[#131613] mt-1">{selectedMessage.name}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-wider">Email</label>
                                    <p className="text-sm font-medium text-[#131613] mt-1">
                                        <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                                            {selectedMessage.email}
                                        </a>
                                    </p>
                                </div>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider">Subject</label>
                                <p className="text-sm font-medium text-[#131613] mt-1">{selectedMessage.subject}</p>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider">Message</label>
                                <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>
                            </div>

                            {/* Meta Info */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-wider">Received At</label>
                                    <p className="text-sm text-gray-600 mt-1">{formatDate(selectedMessage.createdAt)}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-wider">Status</label>
                                    <div className="mt-1">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(selectedMessage.status)}`}>
                                            {selectedMessage.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Update */}
                            <div className="pt-4 border-t border-gray-100">
                                <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Update Status</label>
                                <div className="flex flex-wrap gap-2">
                                    {['NEW', 'READ', 'RESPONDED', 'CLOSED'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleUpdateStatus(status)}
                                            disabled={updating || selectedMessage.status === status}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${selectedMessage.status === status
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                } disabled:opacity-50`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between p-5 border-t border-gray-100 bg-gray-50/50">
                            <button
                                onClick={() => handleDeleteMessage(selectedMessage.id)}
                                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">delete</span>
                                Delete Message
                            </button>
                            <div className="flex gap-2">
                                <a
                                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                    className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">reply</span>
                                    Reply via Email
                                </a>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
