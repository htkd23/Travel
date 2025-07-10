// src/components/Admin/AdminContainer.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../layouts/AdminLayout.jsx";
import BookingManagement from "./BookingManagement/BookingManagement";
import AdminDashboard from "./AdminDashboard";
import { Outlet } from "react-router-dom";

const AdminContainer = () => {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = () => {
        axios
            .get("http://localhost:8084/api/bookings", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                const pending = res.data.filter((b) => b.status === "PENDING");
                const formatted = pending.map((b) => ({
                    username: b.fullName,
                    tourName: b.tour?.tourName,
                }));
                setNotifications(formatted);
            });
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AdminLayout notifications={notifications}>
            {/* Đây là nơi chứa các route con */}
            <Outlet context={{ refreshNotifications: fetchNotifications }} />
        </AdminLayout>
    );
};

export default AdminContainer;
