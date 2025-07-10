import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchTourType, setSearchTourType] = useState("");
    const [searchStatus, setSearchStatus] = useState("");
    const [searchPaymentStatus, setSearchPaymentStatus] = useState("");

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = () => {
        axios.get("http://localhost:8084/api/bookings", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res) => setBookings(res.data))
            .catch((err) => console.error("Error fetching bookings:", err));
    };

    const handleConfirm = (id) => {
        axios.put(`http://localhost:8084/api/bookings/${id}/confirm`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(() => {
            alert("✅ Đã xác nhận");
            fetchBookings();
        });
    };

    const handleCancel = (id) => {
        axios.put(`http://localhost:8084/api/bookings/${id}/cancel`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(() => {
            alert("❌ Đã huỷ");
            fetchBookings();
        });
    };

    const handleRowClick = (bookingId) => {
        navigate(`/admin/bookings/${bookingId}`);
    };

    const handleDeleteBooking = (booking) => {
        setBookingToDelete(booking);
        setShowConfirmDelete(true);
    };

    const confirmDeleteBooking = async () => {
        try {
            await axios.delete(`http://localhost:8084/api/bookings/${bookingToDelete.bookingId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            alert(`✅ Đã xoá đơn của "${bookingToDelete.fullName}" thành công!`);
            setShowConfirmDelete(false);
            fetchBookings();
        } catch (err) {
            alert("❌ Xoá thất bại: " + (err.response?.data || err.message));
        }
    };

    const totalPages = Math.ceil(bookings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBookings = bookings.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const handleSearch = () => {
        axios.get("http://localhost:8084/api/bookings/search", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            params: {
                keyword: searchKeyword || null,
                tourType: searchTourType || null,
                status: searchStatus || null
            }
        }).then((res) => {
            setBookings(res.data);
            setCurrentPage(1); // reset về trang đầu
        }).catch((err) => {
            console.error("Lỗi tìm kiếm:", err);
        });
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý đơn đặt Tour</h1>
            <div className="flex flex-wrap items-end gap-4 bg-gray-50 p-4 rounded-md shadow-sm mb-6">
                <div className="flex flex-col w-1/4 min-w-[200px]">
                    <label className="text-sm text-gray-600 mb-1">Tìm kiếm</label>
                    <input
                        type="text"
                        placeholder="Nhập nội dung tìm kiếm"
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                </div>

                <div className="flex flex-col w-1/4 min-w-[200px]">
                    <label className="text-sm text-gray-600 mb-1">Loại tour</label>
                    <select
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                        value={searchTourType}
                        onChange={(e) => setSearchTourType(e.target.value)}
                    >
                        <option value="">Chọn loại tour</option>
                        <option value="domestic">Trong nước</option>
                        <option value="international">Quốc tế</option>
                    </select>
                </div>

                <div className="flex flex-col w-1/4 min-w-[200px]">
                    <label className="text-sm text-gray-600 mb-1">Trạng thái</label>
                    <select
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                        value={searchStatus}
                        onChange={(e) => setSearchStatus(e.target.value)}
                    >
                        <option value="">Chọn trạng thái</option>
                        <option value="PENDING">Chờ xác nhận</option>
                        <option value="CONFIRMED">Đã xác nhận</option>
                        <option value="CANCELLED">Đã huỷ</option>
                    </select>
                </div>
                <div className="flex flex-col w-1/4 min-w-[200px]">
                    <label className="text-sm text-gray-600 mb-1">Trạng thái thanh toán</label>
                    <select
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                        value={searchPaymentStatus}
                        onChange={(e) => setSearchPaymentStatus(e.target.value)}
                    >
                        <option value="">Tất cả</option>
                        <option value="UNPAID">Chưa thanh toán</option>
                        <option value="PAID">Đã thanh toán</option>
                        <option value="FAILED">Thất bại</option>
                    </select>
                </div>


                <div className="w-full sm:w-auto">
                    <button
                        onClick={handleSearch}
                        className="bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-2 rounded-md mt-1 sm:mt-5"
                    >
                        Tìm kiếm
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-gray-100 border-b">
                    <tr>
                        <th className="py-3 px-4 text-left">#</th>
                        <th className="py-3 px-4 text-left">Tên Tour</th>
                        <th className="py-3 px-4 text-left">Người đặt</th>
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-left">SĐT</th>
                        <th className="py-3 px-4 text-left">Ngày đặt</th>
                        <th className="py-3 px-4 text-left">Trạng thái</th>
                        <th className="py-3 px-4 text-left">Thanh toán</th>
                        <th className="py-3 px-4 text-left">Hành động</th>
                        <th className="py-3 px-4 text-left">Chức năng</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedBookings.map((booking, index) => (
                        <tr
                            key={booking.bookingId}
                            className="border-b hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleRowClick(booking.bookingId)}
                        >
                            <td className="py-3 px-4">{startIndex + index + 1}</td>
                            <td className="py-3 px-4">{booking.tour?.tourName}</td>
                            <td className="py-3 px-4">{booking.fullName}</td>
                            <td className="py-3 px-4">{booking.email}</td>
                            <td className="py-3 px-4">{booking.phone}</td>
                            <td className="py-3 px-4">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                            <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    booking.status === "PENDING"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : booking.status === "CONFIRMED"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                }`}>
                                    {booking.status}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                                    booking.paymentStatus === "PAID"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                }`}>
    {booking.paymentStatus === "PAID" ? "ĐÃ THANH TOÁN" : "CHƯA THANH TOÁN"}
</span>


                            </td>
                            <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                                {booking.status === "PENDING" && booking.paymentStatus === "PAID" && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleConfirm(booking.bookingId)}
                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                        >
                                            Xác nhận
                                        </button>
                                        <button
                                            onClick={() => handleCancel(booking.bookingId)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                        >
                                            Huỷ
                                        </button>
                                    </div>
                                )}
                                {booking.status === "PENDING" && booking.paymentStatus !== "PAID" && (
                                    <span className="text-gray-500">Chưa thanh toán</span>
                                )}
                            </td>


                            <td className="py-3 px-4 text-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => navigate(`/admin/bookings/${booking.bookingId}/edit`)}>
                                    <PencilSquareIcon className="w-5 h-5 text-gray-500 hover:text-blue-600" />
                                </button>

                                <button onClick={() => handleDeleteBooking(booking)}>
                                    <TrashIcon className="w-5 h-5 text-orange-500 hover:text-red-600" />
                                </button>

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4 space-x-2">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Trước
                </button>
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => goToPage(i + 1)}
                        className={`px-3 py-1 border rounded ${
                            currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Tiếp
                </button>
            </div>
            {showConfirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-2">Xóa đơn đặt tour</h2>
                        <p className="text-red-600 mb-4">
                            Bạn có chắc chắn muốn xóa đơn của{" "}
                            <strong>{bookingToDelete?.fullName}</strong> không?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowConfirmDelete(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmDeleteBooking}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>

    );
};

export default BookingManagement;
