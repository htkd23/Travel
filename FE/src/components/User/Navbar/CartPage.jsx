import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";

const CartPage = () => {
    const getImageUrl = (path) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        if (path.startsWith("//")) return `https:${path}`;
        return `http://localhost:8084/assets/${path}`;
    };

    const [cartItems, setCartItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) fetchCart();
    }, [userId]);

    const fetchCart = async () => {
        try {
            const res = await axiosClient.get(`cart/${userId}`);
            setCartItems(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
        }
    };

    const handleRemove = async (tourId) => {
        try {
            await axiosClient.delete(`cart/remove?userId=${userId}&tourId=${tourId}`);
            setCartItems(cartItems.filter((item) => item.tour.tourId !== tourId));
        } catch (error) {
            console.error("Lỗi khi xóa khỏi giỏ hàng:", error?.response?.data || error.message);
            alert(error?.response?.data || "Lỗi khi xóa khỏi giỏ hàng.");
        }
    };

    const handleBooking = (tour) => {
        navigate(`/booking/${tour.tourId}`, { state: { tour } });
    };

    const getDiscountedPrice = (tour) => {
        if (
            tour.voucher &&
            tour.voucher.status === "ACTIVE" &&
            new Date() >= new Date(tour.voucher.validFrom) &&
            new Date() <= new Date(tour.voucher.validTo)
        ) {
            return tour.price * (1 - tour.voucher.discountPercentage / 100);
        }
        return tour.price;
    };

    const formatCurrency = (price) =>
        price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    const totalPages = Math.ceil(cartItems.length / itemsPerPage);
    const paginatedItems = cartItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <div className="p-6 pt-24">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Giỏ hàng của bạn</h1>

            {cartItems.length === 0 ? (
                <p className="text-gray-600">Chưa có tour nào trong giỏ hàng.</p>
            ) : (
                <>
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                        <table className="min-w-full text-sm text-gray-700">
                            <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="py-3 px-4">#</th>
                                <th className="py-3 px-4">Ảnh</th>
                                <th className="py-3 px-4 text-left">Tên Tour</th>
                                <th className="py-3 px-4">Số lượng</th>
                                <th className="py-3 px-4">Đơn giá</th>
                                <th className="py-3 px-4">Chức năng</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paginatedItems.map((item, index) => {
                                const discountedPrice = getDiscountedPrice(item.tour);
                                const hasDiscount = discountedPrice < item.tour.price;

                                return (
                                    <tr key={item.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 text-center">
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <img
                                                src={getImageUrl(item.tour.imagePath)}
                                                alt={item.tour.tourName}
                                                className="w-20 h-14 object-cover rounded"
                                            />
                                        </td>
                                        <td
                                            className="py-3 px-4"
                                            dangerouslySetInnerHTML={{ __html: item.tour.tourName }}
                                        />
                                        <td className="py-3 px-4 text-center">{item.quantity}</td>
                                        <td className="py-3 px-4 text-right">
                                            {!hasDiscount ? (
                                                <div className="flex flex-col items-end h-[40px] justify-center">
                                                    <span className="invisible text-sm">0 đ</span>
                                                    <span className="text-blue-600 font-semibold">
                {formatCurrency(item.tour.price)}
            </span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-end">
            <span className="text-gray-400 line-through text-sm">
                {formatCurrency(item.tour.price)}
            </span>
                                                    <span className="text-red-600 font-semibold">
                {formatCurrency(discountedPrice)}
            </span>
                                                </div>
                                            )}
                                        </td>

                                        <td className="py-3 px-4 text-center space-x-2">
                                            <button
                                                onClick={() => handleBooking(item.tour)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Đặt ngay
                                            </button>
                                            <button onClick={() => handleRemove(item.tour.tourId)}>
                                                <TrashIcon className="w-5 h-5 text-orange-500 hover:text-red-600 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
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
                </>
            )}
        </div>
    );
};

export default CartPage;
