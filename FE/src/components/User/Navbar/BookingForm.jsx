import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BookingForm = ({ tour, setQrCode, setCreatedBookingId, onClose }) => {
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(tour?.quantity || 1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const discountedPrice =
      tour?.voucher &&
      tour.voucher.status === "ACTIVE" &&
      new Date() >= new Date(tour.voucher.validFrom) &&
      new Date() <= new Date(tour.voucher.validTo)
          ? tour.price * (1 - tour.voucher.discountPercentage / 100)
          : tour.price;

  const totalPrice = discountedPrice * quantity;

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
      quantity: quantity,
      fullName: formData.name,
      email: formData.email,
      phone: formData.phone,
      note: formData.note,
      status: "PENDING",
      totalPrice: totalPrice
    };

    try {
      const res = await axios.post(
          "http://localhost:8084/api/bookings",
          requestData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
      );

      const created = res.data;
      setCreatedBookingId(created.bookingId);
      setQrCode(created.bankQrCode);

      navigate(`/payment/${created.bookingId}`);
    } catch (error) {
      console.error("Lỗi khi gửi booking:", error);
      alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.");
    }
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg relative">
          <button
              onClick={() => {
                if (onClose) onClose();
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl"
          >
            &times;
          </button>

          <h2 className="text-xl font-bold text-gray-900 mb-4">Đặt Tour</h2>

          {/* Tour info */}
          <div className="flex items-center gap-4 mb-4">
            <img
                src={
                  tour.imagePath?.startsWith("http") || tour.imagePath?.startsWith("//")
                      ? (tour.imagePath?.startsWith("//")
                          ? `https:${tour.imagePath}`
                          : tour.imagePath)
                      : `http://localhost:8084/assets/${tour.imagePath}`
                }
                alt={tour.tourName}
                className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <div
                  className="font-bold text-gray-800 text-sm"
                  dangerouslySetInnerHTML={{ __html: tour.tourName }}
              />
              <div className="text-gray-500 text-xs">
                Đơn giá: {discountedPrice.toLocaleString("vi-VN")} ₫
              </div>
            </div>
          </div>

          <div className="flex items-center mb-4">
            <span className="mr-2">Số lượng:</span>
            <button
                onClick={() => handleQuantityChange(-1)}
                className="bg-gray-200 px-2 py-1 rounded"
            >
              -
            </button>
            <span className="mx-2">{quantity}</span>
            <button
                onClick={() => handleQuantityChange(1)}
                className="bg-gray-200 px-2 py-1 rounded"
            >
              +
            </button>
          </div>

          <p className="text-green-600 font-bold mb-4">
            Tổng tiền: {totalPrice.toLocaleString("vi-VN")} ₫
          </p>

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
        </div>
      </div>
  );
};

export default BookingForm;
