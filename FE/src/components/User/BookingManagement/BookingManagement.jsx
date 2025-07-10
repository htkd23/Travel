import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

const BookingUserManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [feedbackContent, setFeedbackContent] = useState("");
  const navigate = useNavigate();

  const [expandedBooking, setExpandedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        alert("Bạn cần đăng nhập để xem danh sách đặt tour.");
        return;
      }
      try {
        const response = await axios.get(
            `http://localhost:8084/api/bookings/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách booking:", error);
        alert("Không thể lấy danh sách đặt tour. Vui lòng thử lại.");
      }
    };

    fetchBookings();
  }, []);

  const formatStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "CANCELLED":
        return "Đã huỷ";
      default:
        return "Không xác định";
    }
  };

  const formatPaymentStatus = (status) => {
    switch (status) {
      case "PAID":
        return "Đã thanh toán";
      case "UNPAID":
        return "Chưa thanh toán";
      case "FAILED":
        return "Thất bại";
      default:
        return "Không xác định";
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để huỷ booking.");
      return;
    }

    const confirmCancel = window.confirm("Bạn có chắc chắn muốn huỷ đặt tour này?");
    if (!confirmCancel) return;

    try {
      await axios.put(
          `http://localhost:8084/api/bookings/${bookingId}/cancel`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      setBookings((prevBookings) =>
          prevBookings.map((b) =>
              b.bookingId === bookingId ? { ...b, status: "CANCELLED" } : b
          )
      );
      alert("Huỷ đặt tour thành công.");
    } catch (error) {
      console.error("Lỗi khi huỷ booking:", error);
      alert("Không thể huỷ booking. Vui lòng thử lại.");
    }
  };

  const handlePayment = (bookingId) => {
    navigate(`/payment/${bookingId}`);
  };

  return (
      <div className="max-w-6xl mx-auto mt-24 mb-20 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quản lý Đặt Tour</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse border border-gray-300 table-fixed">
            <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Khách hàng</th>
              <th className="border border-gray-300 px-4 py-2">SĐT</th>
              <th className="border border-gray-300 px-4 py-2">Tour</th>
              <th className="border border-gray-300 px-4 py-2">Giá</th>
              <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
              <th className="border border-gray-300 px-4 py-2">Thanh toán</th>
              <th className="border border-gray-300 px-4 py-2">Thao tác</th>
            </tr>
            </thead>
            <tbody>
            {bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Chưa có yêu cầu đặt tour nào.
                  </td>
                </tr>
            ) : (
                bookings.map((booking) => (
                    <tr
                        key={booking.bookingId}
                        className="text-center cursor-pointer hover:bg-gray-100"
                        onClick={() =>
                            setExpandedBooking(
                                expandedBooking?.bookingId === booking.bookingId ? null : booking
                            )
                        }
                    >
                      <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                        {booking.fullName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                        {booking.phone}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                        <div className="font-medium">{booking.tour?.tourName}</div>
                        <div className="text-sm text-gray-500">{booking.tour?.location}</div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                        {(booking.discountedPrice || booking.tour?.price || 0).toLocaleString("vi-VN")} VNĐ
                      </td>
                      <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
          <span
              className={`text-white px-3 py-1 rounded-full shadow-md hover:shadow-lg text-sm font-medium whitespace-nowrap ${
                  booking.status === "PENDING"
                      ? "bg-yellow-500"
                      : booking.status === "CONFIRMED"
                          ? "bg-green-500"
                          : booking.status === "CANCELLED"
                              ? "bg-red-500"
                              : "bg-gray-400"
              }`}
          >
            {formatStatus(booking.status)}
          </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                        {booking.paymentStatus === "PAID" ? (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
              Đã thanh toán
            </span>
                        ) : (
                            <button
                                onClick={() => handlePayment(booking.bookingId)}
                                className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            >
                              Chưa thanh toán
                            </button>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                        {booking.status === "PENDING" ? (
                            <button
                                onClick={() => handleCancelBooking(booking.bookingId)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                              Huỷ
                            </button>
                        ) : booking.status === "CONFIRMED" &&
                        booking.paymentStatus === "PAID" ? (
                            booking.hasFeedback ? (
                                <span className="text-blue-600 italic">Đã phản hồi</span>
                            ) : (
                                <button
                                    onClick={() => {
                                      setSelectedBooking(booking);
                                      setShowFeedbackForm(true);
                                    }}
                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                >
                                  Phản hồi
                                </button>
                            )
                        ) : (
                            <span className="text-gray-400 italic">Không thể huỷ</span>
                        )}
                      </td>
                    </tr>
                ))
            )}
            </tbody>

          </table>

          {expandedBooking && (
              <div className="mt-8 p-6 border border-gray-300 rounded shadow-sm bg-gray-50">
                <h3 className="text-lg font-bold mb-4 text-green-700">
                  Chi tiết Đặt Tour
                </h3>

                <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
                  <div>
                    <p><strong>Khách hàng:</strong> {expandedBooking.fullName}</p>
                    <p><strong>Số điện thoại:</strong> {expandedBooking.phone}</p>
                    <p><strong>Trạng thái đặt tour:</strong> {formatStatus(expandedBooking.status)}</p>
                    <p><strong>Trạng thái thanh toán:</strong> {formatPaymentStatus(expandedBooking.paymentStatus)}</p>
                    <p><strong>Giá đã giảm:</strong> {(expandedBooking.discountedPrice || expandedBooking.tour?.price || 0).toLocaleString("vi-VN")} VNĐ</p>
                  </div>
                  <div>
                    <p><strong>Tên tour:</strong> {expandedBooking.tour?.tourName}</p>
                    <p><strong>Địa điểm:</strong> {expandedBooking.tour?.location}</p>
                    <p><strong>Mô tả:</strong> {expandedBooking.tour?.description || "Không có mô tả"}</p>
                    <p><strong>Ngày bắt đầu:</strong> {expandedBooking.tour?.startDate || "Chưa có"}</p>
                    <p><strong>Ngày kết thúc:</strong> {expandedBooking.tour?.endDate || "Chưa có"}</p>
                  </div>
                </div>
              </div>
          )}

        </div>

        {showFeedbackForm && selectedBooking && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-xl relative">
                <h2 className="text-xl font-semibold mb-4 text-center text-green-700">
                  Gửi phản hồi cho tour
                </h2>
                <textarea
                    rows={5}
                    placeholder="Nội dung phản hồi..."
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none"
                    value={feedbackContent}
                    onChange={(e) => setFeedbackContent(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <button
                      onClick={async () => {
                        try {
                          await axiosClient.post("feedbacks", {
                            bookingId: selectedBooking.bookingId,
                            userId: selectedBooking.user?.id,
                            tourId: selectedBooking.tour?.tourId,
                            content: feedbackContent,
                          });
                          setBookings((prev) =>
                              prev.map((b) =>
                                  b.bookingId === selectedBooking.bookingId
                                      ? { ...b, hasFeedback: true }
                                      : b
                              )
                          );
                          setShowFeedbackForm(false);
                        } catch (error) {
                          console.error("Lỗi gửi phản hồi:", error);
                          alert("Không thể gửi phản hồi.");
                        }
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Gửi phản hồi
                  </button>
                  <button
                      onClick={() => setShowFeedbackForm(false)}
                      className="text-gray-500 underline hover:text-red-600"
                  >
                    Huỷ
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default BookingUserManagement;
