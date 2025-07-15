import React, { useEffect, useState } from "react";
import { AiOutlineBell } from "react-icons/ai";
import axiosClient from "../api/axiosClient.jsx";
import { Link } from "react-router-dom";

const NotificationBell = ({ userId, token }) => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [readAll, setReadAll] = useState(false);
    const [endpoint, setEndpoint] = useState("");

    useEffect(() => {
        const userRole = localStorage.getItem("userRole");
        if (userRole === "ADMIN") {
            setEndpoint(`/notifications/admin/${userId}`);
        } else {
            setEndpoint(`/notifications/user/${userId}`);
        }
    }, [userId]);

    useEffect(() => {
        if (userId && token && endpoint) {
            axiosClient
                .get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => setNotifications(res.data || []))
                .catch((err) => console.error("Lỗi khi lấy thông báo:", err));
        }
    }, [userId, token, endpoint]);

    useEffect(() => {
        const readStatus = localStorage.getItem(`notifications_read_${userId}`);
        setReadAll(readStatus === "true");
    }, [userId]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const markAllAsRead = () => {
        setReadAll(true);
        localStorage.setItem(`notifications_read_${userId}`, "true");
    };

    const unreadCount = readAll ? 0 : notifications.length;

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-gray-500 dark:text-gray-400"
            >
                <AiOutlineBell className="text-2xl" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 z-50 w-96 max-h-96 overflow-y-auto p-4 mt-2 bg-white border border-gray-200 rounded shadow-lg dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            Thông báo
                        </h3>
                        <button
                            className="text-sm text-green-600 hover:underline"
                            onClick={markAllAsRead}
                        >
                            Đánh dấu là đã đọc
                        </button>
                    </div>

                    {notifications.length === 0 ? (
                        <p className="text-sm text-gray-500">Không có thông báo nào.</p>
                    ) : (
                        notifications.map((n, idx) => {
                            const time = new Date(n.createdAt);
                            const formatted = time.toLocaleDateString("vi-VN");
                            return (
                                <Link
                                    to={n.link || "#"}
                                    key={idx}
                                    className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {n.title}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {n.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{formatted}</p>
                                </Link>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
