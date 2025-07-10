import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BookingEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        note: "",
        status: "PENDING",
        paymentStatus: "UNPAID"
    });

    useEffect(() => {
        axios.get(`http://localhost:8084/api/bookings/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }).then((res) => {
            setBooking(res.data);
            setFormData({
                fullName: res.data.fullName,
                email: res.data.email,
                phone: res.data.phone,
                note: res.data.note || "",
                status: res.data.status,
                paymentStatus: res.data.paymentStatus
            });
        });
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        axios.put(`http://localhost:8084/api/bookings/${id}`, formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }).then(() => {
            alert("✅ Cập nhật thành công");
            navigate(-1);
        }).catch(() => {
            alert("❌ Cập nhật thất bại");
        });
    };

    const handleDelete = () => {
        if (window.confirm("Bạn có chắc chắn muốn xoá đơn này không?")) {
            axios.delete(`http://localhost:8084/api/bookings/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            }).then(() => {
                alert("🗑️ Đã xoá đơn đặt tour");
                navigate("/admin/bookingmanagement");
            });
        }
    };

    if (!booking) return <p className="text-center mt-20">Đang tải dữ liệu...</p>;

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-6 shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-6">Chỉnh sửa đơn đặt tour</h2>

            <div className="space-y-4">
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                       className="w-full border rounded px-3 py-2" placeholder="Họ tên" />
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                       className="w-full border rounded px-3 py-2" placeholder="Email" />
                <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                       className="w-full border rounded px-3 py-2" placeholder="Số điện thoại" />
                <textarea name="note" value={formData.note} onChange={handleChange}
                          className="w-full border rounded px-3 py-2" placeholder="Ghi chú" />

                <div>
                    <label className="block text-sm font-medium mb-1">Trạng thái đơn</label>
                    <select name="status" value={formData.status} onChange={handleChange}
                            className="w-full border rounded px-3 py-2">
                        <option value="PENDING">Chờ xác nhận</option>
                        <option value="CONFIRMED">Đã xác nhận</option>
                        <option value="CANCELLED">Đã huỷ</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Trạng thái thanh toán</label>
                    <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}
                            className="w-full border rounded px-3 py-2">
                        <option value="UNPAID">Chưa thanh toán</option>
                        <option value="PAID">Đã thanh toán</option>
                        <option value="FAILED">Thất bại</option>
                    </select>
                </div>
            </div>

            <div className="mt-6 flex justify-between">
                <button onClick={handleUpdate}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                    Cập nhật
                </button>
                <button onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                    Xoá đơn
                </button>
                <button onClick={() => navigate(-1)}
                        className="underline text-gray-500">
                    ← Quay lại
                </button>
            </div>
        </div>
    );
};

export default BookingEdit;
