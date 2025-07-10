import React, { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import axiosClient from "../../../api/axiosClient.jsx";

const NotificationBell = ({ userId, token }) => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 5;
    const dropdownRef = useRef();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axiosClient.get(`notifications/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // Đảo ngược để mới nhất lên trước
                setNotifications((res.data || []).reverse());
            } catch (err) {
                console.error("❌ Lỗi lấy thông báo:", err);
            }
        };

        if (userId && token) fetchNotifications();
    }, [userId, token]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const totalPages = Math.ceil(notifications.length / notificationsPerPage);
    const indexOfLast = currentPage * notificationsPerPage;
    const indexOfFirst = indexOfLast - notificationsPerPage;
    const currentNotifications = notifications.slice(indexOfFirst, indexOfLast);

    const goToNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const goToPrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => {
                    const newState = !showDropdown;
                    setShowDropdown(newState);
                    if (newState) setCurrentPage(1); // mỗi lần mở dropdown → về trang đầu
                }}
            >
                <FaBell size={24} className="text-blue-600 hover:text-blue-800" />
            </button>


            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md p-4 z-50 max-h-[400px] overflow-hidden">
                    <h3 className="font-semibold mb-2">Thông báo</h3>

                    {currentNotifications.length === 0 ? (
                        <p className="text-gray-500 text-sm">Không có thông báo mới.</p>
                    ) : (
                        <ul className="space-y-2 max-h-[260px] overflow-y-auto">
                            {currentNotifications.map((noti, index) => (
                                <li key={index} className="border-b pb-2 text-sm">
                                    <div>{noti.message}</div>
                                    <div className="text-xs text-gray-500">
                                        {new Date(noti.createdAt).toLocaleTimeString("vi-VN")}{" "}
                                        {new Date(noti.createdAt).toLocaleDateString("vi-VN")}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}


                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-3 text-sm">
                            <button
                                onClick={goToPrev}
                                disabled={currentPage === 1}
                                className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                            >
                                Trước
                            </button>
                            <span>
                Trang {currentPage} / {totalPages}
              </span>
                            <button
                                onClick={goToNext}
                                disabled={currentPage === totalPages}
                                className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
