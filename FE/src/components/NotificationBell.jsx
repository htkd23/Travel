// components/NotificationBell.jsx
import React, { useEffect, useState } from "react";
import { AiOutlineBell } from "react-icons/ai";
import axiosClient from "../api/axiosClient.jsx";

const NotificationBell = ({ userId, token }) => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [hideBadge, setHideBadge] = useState(false);

    useEffect(() => {
        if (userId && token) {
            axiosClient.get(`/notifications/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setNotifications(res.data || []))
                .catch(err => console.error("Lỗi khi lấy thông báo:", err));
        }
    }, [userId, token]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
        setHideBadge(true);
    };

    return (
        <div className="relative">
            <button onClick={toggleDropdown} className="relative p-2 text-gray-500 dark:text-gray-400">
                <AiOutlineBell className="text-2xl" />
                {notifications.length > 0 && !hideBadge && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">
                        {notifications.length}
                    </span>
                )}
            </button>
            {showDropdown && (
                <div className="absolute right-0 z-10 w-64 p-2 mt-2 bg-white border border-gray-200 rounded shadow-lg dark:bg-gray-800">
                    <h3 className="mb-1 font-semibold">Thông báo</h3>
                    {notifications.length === 0 ? (
                        <p className="text-sm text-gray-500">Không có thông báo nào.</p>
                    ) : (
                        notifications.map((n, idx) => {
                            const time = new Date(n.createdAt);
                            const formatted = `${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${time.toLocaleDateString()}`;
                            return (
                                <div key={idx} className="mb-2">
                                    <p className="text-sm text-gray-700 dark:text-gray-200">{n.message}</p>
                                    <p className="text-xs text-gray-500">{formatted}</p>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
