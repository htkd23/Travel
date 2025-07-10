import React, { useEffect, useState } from "react";
import axios from "axios";

const FeedbackForm = ({ mode, feedbackId, onClose }) => {
    const [bookings, setBookings] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    // Load list bookings (cho create)
    useEffect(() => {
        if (mode === "create") {
            axios
                .get("http://localhost:8084/api/bookings", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                .then((res) => {
                    setBookings(
                        res.data.filter(
                            (b) => b.status === "CONFIRMED" && b.paymentStatus === "PAID"
                        )
                    );
                })
                .catch((err) => console.error(err));
        }
    }, [mode]);

    // Load feedback details nếu edit
    useEffect(() => {
        if (mode === "edit" && feedbackId) {
            setLoading(true);
            axios
                .get("http://localhost:8084/api/feedbacks", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                .then((res) => {
                    const fb = res.data.find((f) => f.id === Number(feedbackId));
                    if (fb) {
                        setContent(fb.content);
                        setSelectedBookingId(fb.booking?.bookingId || "");
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [mode, feedbackId]);

    const handleSubmit = () => {
        if (!content) {
            alert("Vui lòng nhập nội dung phản hồi.");
            return;
        }

        if (mode === "create") {
            if (!selectedBookingId) {
                alert("Vui lòng chọn booking.");
                return;
            }

            axios
                .post(
                    "http://localhost:8084/api/feedbacks",
                    {
                        bookingId: selectedBookingId,
                        content,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                )
                .then(() => {
                    alert("✅ Tạo phản hồi thành công!");
                    onClose();
                })
                .catch((err) => {
                    alert("❌ Tạo thất bại: " + (err.response?.data || err.message));
                });
        } else if (mode === "edit") {
            axios
                .put(
                    `http://localhost:8084/api/feedbacks/${feedbackId}`,
                    {
                        content,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                )
                .then(() => {
                    alert("✅ Cập nhật phản hồi thành công!");
                    onClose();
                })
                .catch((err) => {
                    alert("❌ Cập nhật thất bại: " + (err.response?.data || err.message));
                });
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-full max-w-lg rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">
                    {mode === "create" ? "Thêm mới phản hồi" : "Chỉnh sửa phản hồi"}
                </h2>

                {loading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : (
                    <div className="space-y-4">
                        {mode === "create" && (
                            <div>
                                <label className="block mb-1 text-gray-700">
                                    Chọn Booking (User - Tour)
                                </label>
                                <select
                                    value={selectedBookingId}
                                    onChange={(e) => setSelectedBookingId(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                >
                                    <option value="">-- Chọn Booking --</option>
                                    {bookings.map((b) => (
                                        <option key={b.bookingId} value={b.bookingId}>
                                            {b.user?.firstName} {b.user?.lastName} -{" "}
                                            {b.tour?.tourName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block mb-1 text-gray-700">
                                Nội dung phản hồi
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 h-28"
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Huỷ
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                {mode === "create" ? "Tạo mới" : "Cập nhật"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackForm;
