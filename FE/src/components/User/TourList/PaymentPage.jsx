import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient.jsx";
import { FaCoins } from "react-icons/fa";

const PaymentPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [updatingQr, setUpdatingQr] = useState(false);

    // Đóng popup và quay về trang quản lý đặt tour
    const closePopup = () => navigate("/management");

    const fetchBooking = async () => {
        try {
            const res = await axiosClient.get(`bookings/${bookingId}`);
            setBooking(res.data);

            if (res.data.paymentStatus === "PAID") {
                setQrCode(null);
                setTimeout(() => navigate("/management"), 5000);  // Điều hướng về trang quản lý sau 5s
            } else {
                setQrCode(res.data.bankQrCode);
            }
        } catch (err) {
            console.error("❌ Lỗi khi lấy booking:", err);
        }
    };

    useEffect(() => {
        if (!bookingId) {
            console.warn("❌ bookingId không tồn tại trong URL!");
            return;
        }
        fetchBooking();
        const interval = setInterval(fetchBooking, 3000); // Kiểm tra trạng thái thanh toán mỗi 3 giây
        return () => clearInterval(interval);
    }, [bookingId]);

    const handleUsePoints = async () => {
        if (!booking) return;
        setUpdatingQr(true);
        try {
            await axiosClient.put(`bookings/${bookingId}`, {
                useLoyaltyPoints: true,
            });
            await fetchBooking();
        } catch (err) {
            console.error("❌ Lỗi khi đổi điểm:", err);
            alert("Không thể đổi điểm. Vui lòng thử lại.");
        } finally {
            setUpdatingQr(false);
        }
    };

    const {
        discountedPrice = 0,
        tourPrice = 0,
        loyaltyPoints = 0,
        paymentStatus = "",
    } = booking || {};

    const canUsePoints =
        Number(loyaltyPoints) >= 50 &&
        Number(discountedPrice) === Number(tourPrice);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center relative">
                <button
                    onClick={closePopup}  // Điều hướng về trang quản lý khi đóng popup
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-3xl font-bold cursor-pointer"
                >
                    &times;
                </button>

                <h2 className="text-xl font-bold text-green-600 mb-4">Quét mã để thanh toán</h2>
                <p className="text-sm mb-2 text-gray-500">
                    Nội dung chuyển khoản: <strong>BOOKING_{bookingId}</strong>
                </p>

                <div className="mb-2 text-gray-800">
                    <p className="font-medium">
                        Số tiền cần thanh toán:{" "}
                        <span className="text-blue-600 font-bold">
                            {(discountedPrice != null ? discountedPrice : tourPrice).toLocaleString("vi-VN")}{" "}
                            VND
                        </span>
                    </p>

                    <p className="text-sm mt-1 flex items-center justify-center gap-1 text-yellow-600">
                        <FaCoins className="text-lg" />
                        Điểm tích lũy: {loyaltyPoints}
                    </p>
                </div>

                {canUsePoints && (
                    <button
                        onClick={handleUsePoints}
                        disabled={updatingQr}
                        className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
                    >
                        {updatingQr ? "Đang xử lý..." : "Đổi 50 điểm để giảm giá"}
                    </button>
                )}

                {qrCode ? (
                    <img
                        src={
                            qrCode.startsWith("http")
                                ? qrCode
                                : `data:image/png;base64,${qrCode}`
                        }
                        alt="QR Code"
                        className="w-48 h-48 mx-auto mt-4"
                    />
                ) : (
                    <p className="mt-4">Đang lấy mã QR...</p>
                )}

                <p className="text-sm mt-4 text-gray-500">
                    Sau khi thanh toán, hệ thống sẽ tự động xác nhận.
                </p>
            </div>
        </div>
    );
};

export default PaymentPage;
