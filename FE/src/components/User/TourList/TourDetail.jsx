import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Hàm tính giá sau giảm
const getDiscountedPrice = (tour) => {
    if (
        tour?.voucher &&
        tour.voucher.status === "ACTIVE" &&
        new Date() >= new Date(tour.voucher.validFrom) &&
        new Date() <= new Date(tour.voucher.validTo)
    ) {
        return tour.price * (1 - tour.voucher.discountPercentage / 100);
    }
    return tour.price;
};

// ✅ Hàm định dạng số VND
const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
};

const TourDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [tour, setTour] = useState(location.state?.tour || null);
    const [loading, setLoading] = useState(!tour);
    const [activeTab, setActiveTab] = useState("intro");

    const [qrCode, setQrCode] = useState(null);
    const [createdBookingId, setCreatedBookingId] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        note: "",
    });

    useEffect(() => {
        // Nếu tour chưa có (ví dụ F5), thì gọi API
        if (!tour) {
            const fetchTour = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const res = await axios.get(
                        `http://localhost:8084/api/tours/${id}`,
                        {
                            headers: {
                                Authorization: token ? `Bearer ${token}` : undefined,
                            },
                        }
                    );
                    setTour(res.data);
                } catch (err) {
                    console.error("Lỗi load tour:", err);
                    setTour(null);
                } finally {
                    setLoading(false);
                }
            };

            fetchTour();
        } else {
            setLoading(false);
        }
    }, [id, tour]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
            alert("Bạn cần đăng nhập để đặt tour!");
            navigate("/login");
            return;
        }

        const requestData = {
            userId: parseInt(userId),
            tourId: tour.tourId,
            fullName: formData.name,
            email: formData.email,
            phone: formData.phone,
            note: formData.note,
            status: "PENDING"
        };

        try {
            const res = await axios.post("http://localhost:8084/api/bookings", requestData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const created = res.data;
            setCreatedBookingId(created.bookingId);
            setQrCode(created.bankQrCode);
            navigate(`/payment/${created.bookingId}`);

        } catch (error) {
            console.error("Lỗi khi gửi booking:", error);
            alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.");
        }
    };

    if (loading) return <p className="text-center mt-20">Đang tải thông tin tour...</p>;

    if (!tour) {
        return (
            <div className="text-center text-red-500 mt-20">
                <p>Không tìm thấy tour!</p>
                <button onClick={() => navigate("/inside")} className="mt-4 text-blue-600 underline">
                    Quay lại danh sách tour
                </button>
            </div>
        );
    }

    const hasDiscount =
        tour.voucher &&
        tour.voucher.status === "ACTIVE" &&
        new Date() >= new Date(tour.voucher.validFrom) &&
        new Date() <= new Date(tour.voucher.validTo);

    const discountedPrice = getDiscountedPrice(tour);

    return (
        <>
            <div className="max-w-6xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg mb-20">
                <div className="flex flex-col md:flex-row gap-6 w-full">
                    {/* Cột trái */}
                    <div className="md:w-2/3">
                        <img
                            src={
                                tour.imagePath.startsWith("http") || tour.imagePath.startsWith("//")
                                    ? (tour.imagePath.startsWith("//") ? `https:${tour.imagePath}` : tour.imagePath)
                                    : `http://localhost:8084/assets/${tour.imagePath}`
                            }
                            alt={tour.tourName}
                            className="w-full h-64 object-cover rounded-lg"
                        />

                        <h2
                            className="text-2xl font-bold text-gray-900 mt-4"
                            dangerouslySetInnerHTML={{ __html: tour.tourName }}
                        />
                        <p
                            className="text-sm text-gray-500"
                            dangerouslySetInnerHTML={{ __html: tour.location }}
                        />
                        <div
                            className="text-gray-600 mt-2"
                            dangerouslySetInnerHTML={{ __html: tour.description }}
                        />

                        {/* ✅ Hiển thị giá */}
                        <div className="mt-2">
                            {hasDiscount ? (
                                <div>
                  <span className="text-gray-400 line-through text-sm">
                    {formatPrice(tour.price)} VND
                  </span>
                                    <span className="ml-2 text-lg font-semibold text-red-600">
                    {formatPrice(discountedPrice)} VND
                  </span>
                                </div>
                            ) : (
                                <span className="text-lg font-semibold text-blue-600">
                  {formatPrice(tour.price)} VND
                </span>
                            )}
                        </div>

                        <p className="text-sm mt-1">
                            Ngày khởi hành: {new Date(tour.startDate).toLocaleDateString("vi-VN")}
                        </p>
                        <p className="text-sm">
                            Ngày kết thúc: {new Date(tour.endDate).toLocaleDateString("vi-VN")}
                        </p>
                    </div>

                    {/* Cột phải - Form */}
                    <div className="md:w-1/3 bg-gray-50 p-4 rounded-lg shadow-md self-start">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Đặt Tour</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Họ và tên"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded mb-2"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded mb-2"
                                required
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Số điện thoại"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded mb-2"
                                required
                            />
                            <textarea
                                name="note"
                                placeholder="Ghi chú"
                                value={formData.note}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded mb-2"
                            />
                            <button
                                type="submit"
                                className="w-full bg-purple-600 text-white py-2 rounded mt-2"
                            >
                                Gửi yêu cầu
                            </button>
                        </form>
                        <div className="flex justify-end">
                            <button onClick={() => navigate(-1)} className="mt-4 text-gray-500 hover:text-gray-900">
                                Quay lại
                            </button>
                        </div>
                    </div>
                </div>

                {/* Phần chi tiết tour chiếm toàn bộ chiều ngang */}
                {tour.tourDetail && (
                    <div className="w-full mt-10 pt-6">
                        <div className="flex space-x-6 pb-2 mb-4">
                            {["intro", "itinerary", "pricing", "review"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`font-semibold ${
                                        activeTab === tab
                                            ? "text-orange-600 border-b-2 border-orange-600"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {{
                                        intro: "Giới thiệu",
                                        itinerary: "Lịch trình",
                                        pricing: "Bảng giá",
                                        review: "Đánh giá",
                                    }[tab]}
                                </button>
                            ))}
                        </div>

                        <div className="whitespace-pre-line text-gray-700 text-sm leading-relaxed">
                            {activeTab === "intro" && (
                                <div dangerouslySetInnerHTML={{ __html: tour.tourDetail.introduction }} />
                            )}
                            {activeTab === "itinerary" && (
                                <div dangerouslySetInnerHTML={{ __html: tour.tourDetail.itinerary }} />
                            )}
                            {activeTab === "pricing" && (
                                <div dangerouslySetInnerHTML={{ __html: tour.tourDetail.policy }} />
                            )}
                            {activeTab === "review" && (
                                <div dangerouslySetInnerHTML={{ __html: tour.tourDetail.reviews }} />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Pop-up QR */}
            {qrCode && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg text-center relative">
                        <button
                            onClick={() => setQrCode(null)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold text-green-600 mb-4">Quét mã để thanh toán</h2>
                        <p className="text-sm mb-2 text-gray-500">
                            Nội dung chuyển khoản: <strong>BOOKING_{createdBookingId}</strong>
                        </p>
                        <img
                            src={qrCode.startsWith("http") ? qrCode : `data:image/png;base64,${qrCode}`}
                            alt="QR Code"
                            className="w-48 h-48 mx-auto"
                        />
                        <p className="text-sm mt-4 text-gray-500">
                            Sau khi thanh toán, hệ thống sẽ tự động xác nhận.
                        </p>
                    </div>
                </div>
            )}
            {paymentSuccess && (
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded shadow-lg z-50">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">✅</span>
                        <span className="font-semibold">Giao Dịch Thanh Toán Thành Công</span>
                    </div>
                </div>
            )}
        </>
    );
};

export default TourDetail;
