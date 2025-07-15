import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BookingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:8084/api/bookings/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then((res) => {
                setBooking(res.data);

                let url = res.data.tourImagePath || "";
                if (url && !url.startsWith("http") && !url.startsWith("/")) {
                    url = `http://localhost:8084/assets/${url}`;
                }
                if (!url) {
                    url = "/default-image.png";
                }
                setImageUrl(url);
            })
            .catch((err) => console.error("Lỗi khi lấy booking:", err));
    }, [id]);

    if (!booking) return <p className="text-center mt-20">Đang tải thông tin đặt tour...</p>;

    return (
        <div className="max-w-6xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg mb-20">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Cột trái: Ảnh */}
                <div className="md:w-1/2">
                    <img
                        src={imageUrl}
                        alt={booking.tourName}
                        className="w-full h-96 object-cover rounded-lg"
                    />
                </div>

                {/* Cột phải: Thông tin chi tiết */}
                <div className="md:w-1/2">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Chi tiết đặt tour</h2>
                    <p className="mb-2"><strong>Tên tour:</strong> {booking.tourName}</p>
                    <p className="mb-2"><strong>Địa điểm:</strong> {booking.tourLocation}</p>
                    <p className="mb-2"><strong>Khách hàng:</strong> {booking.fullName}</p>
                    <p className="mb-2"><strong>Email:</strong> {booking.email || "Không có"}</p>
                    <p className="mb-2"><strong>SĐT:</strong> {booking.phone}</p>
                    <p className="mb-2"><strong>Ghi chú:</strong> {booking.note || "Không có"}</p>
                    <p className="mb-2"><strong>Ngày đặt:</strong> {new Date(booking.bookingDate).toLocaleDateString("vi-VN")}</p>
                    <p className="mb-2"><strong>Trạng thái đơn:</strong> {booking.status}</p>
                    <p className="mb-4"><strong>Trạng thái thanh toán:</strong> {booking.paymentStatus}</p>

                    {booking.bankQrCode && (
                        <div className="mt-4 text-center">
                            <p className="text-sm mb-2 text-gray-600">
                                Mã QR thanh toán (nội dung: <strong>BOOKING_{booking.bookingId}</strong>)
                            </p>
                            <img
                                src={booking.bankQrCode}
                                alt="QR Code"
                                className="w-48 h-48 mx-auto rounded border"
                            />
                        </div>
                    )}

                    <div className="mt-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-gray-500 hover:text-gray-900 underline"
                        >
                            ← Quay lại
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetail;
