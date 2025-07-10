// src/pages/FeedbackForm.jsx

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosClient from "../../../api/axiosClient.jsx";

const FeedbackForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { booking } = location.state || {};
    const [feedbackContent, setFeedbackContent] = useState("");

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");

        try {
            await axios.post("/feedbacks", {
                bookingId: booking.bookingId,
                userId: booking.user.id,
                tourId: booking.tour.tourId,
                content: feedbackContent,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Phản hồi đã được gửi!");
            navigate("/bookings"); // Quay về trang quản lý booking
        } catch (err) {
            console.error(err);
            alert("Lỗi gửi phản hồi.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-semibold text-center text-green-700 mb-4">
                    Gửi phản hồi cho tour
                </h2>
                <textarea
                    rows={6}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none mb-4"
                    placeholder="Nội dung phản hồi..."
                    value={feedbackContent}
                    onChange={(e) => setFeedbackContent(e.target.value)}
                />
                <div className="flex justify-between">
                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Gửi phản hồi
                    </button>
                    <button
                        onClick={() => navigate("/bookings")}
                        className="text-gray-500 underline hover:text-red-600"
                    >
                        Huỷ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackForm;
