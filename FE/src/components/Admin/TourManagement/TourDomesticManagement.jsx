import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import ApplyVoucherModal from "./ApplyVoucherModal";

const ITEMS_PER_PAGE = 20;

const TourDomesticManagement = () => {
    const [tours, setTours] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const [location, setLocation] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [price, setPrice] = useState("");

    const [selectedTourIds, setSelectedTourIds] = useState([]);
    const [showApplyVoucherModal, setShowApplyVoucherModal] = useState(false);

    // Fetch tours from API
    const fetchTours = () => {
        axios
            .get("http://localhost:8084/api/tours", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                const filteredTours = response.data
                    .filter((tour) => tour.tourType === "domestic")
                    .map((tour) => ({
                        ...tour,
                        imagePath: tour.imagePath.startsWith("http")
                            ? tour.imagePath
                            : `http://localhost:8084/assets/${tour.imagePath}`,
                    }));
                setTours(filteredTours);
            })
            .catch((error) => {
                console.error("Lỗi khi tải dữ liệu tour:", error);
            });
    };

    useEffect(() => {
        fetchTours();
    }, []);

    // Handle search logic
    const handleSearch = () => {
        const token = localStorage.getItem("token");
        const formattedDate = departureDate
            ? new Date(departureDate).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })
            : undefined;

        axios
            .get("http://localhost:8084/api/tours/search", {
                params: {
                    destination: location.trim() || undefined,
                    departureDate: formattedDate || undefined,
                    price: price || undefined,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                const updatedTours = res.data.map((tour) => ({
                    ...tour,
                    imagePath: tour.imagePath.startsWith("http")
                        ? tour.imagePath
                        : `http://localhost:8084/assets/${tour.imagePath}`,
                }));
                setTours(updatedTours);
                setCurrentPage(1);
            })
            .catch((err) => {
                console.error("Lỗi tìm kiếm tour:", err);
                setTours([]);
            });
    };

    // Handle delete logic
    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tour này không?")) {
            axios
                .delete(`http://localhost:8084/api/tours/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                .then(() => {
                    setTours((prev) => prev.filter((tour) => tour.tourId !== id));
                })
                .catch((error) => {
                    console.error("Lỗi khi xóa tour:", error);
                });
        }
    };

    // Get discounted price if any
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

    // Format price to VND
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN").format(price);
    };

    const totalPages = Math.ceil(tours.length / ITEMS_PER_PAGE);
    const paginatedTours = tours.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Quản lý Tour Nội địa
            </h1>

            {/* Thanh tìm kiếm + thêm mới */}
            <div className="grid grid-cols-[2fr_2fr_2fr_auto_auto_auto] gap-4 bg-gray-50 p-4 rounded-md shadow-sm mb-6 w-full">
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Tìm kiếm</label>
                    <input
                        type="text"
                        placeholder="Nhập nội dung tìm kiếm"
                        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none w-full"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Ngày khởi hành</label>
                    <input
                        type="date"
                        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none w-full"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Giá tiền</label>
                    <input
                        type="text"
                        placeholder="Nhập giá tiền"
                        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none w-full"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                <div className="flex items-end">
                    <button
                        onClick={handleSearch}
                        className="bg-green-700 hover:bg-green-800 text-white font-medium px-4 py-2 rounded-md text-sm"
                    >
                        Tìm kiếm
                    </button>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={() => navigate("/admin/tour-add")}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md text-sm"
                    >
                        Thêm Tour Mới
                    </button>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={() => setShowApplyVoucherModal(true)}
                        disabled={selectedTourIds.length === 0}
                        className={`${
                            selectedTourIds.length === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        } text-white font-medium px-4 py-2 rounded-md text-sm`}
                    >
                        Áp dụng Voucher
                    </button>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 text-sm">
                    <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2 border">
                            <input
                                type="checkbox"
                                checked={paginatedTours.length > 0 && selectedTourIds.length === paginatedTours.length}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedTourIds(paginatedTours.map((t) => t.tourId));
                                    } else {
                                        setSelectedTourIds([]);
                                    }
                                }}
                            />
                        </th>
                        <th className="p-2 border">#</th>
                        <th className="p-2 border">Hình</th>
                        <th className="p-2 border">Tên tour</th>
                        <th className="p-2 border">Loại</th>
                        <th className="p-2 border">Giá</th>
                        <th className="p-2 border">Số ngày</th>
                        <th className="p-2 border">Trạng thái</th>
                        <th className="p-2 border">Chức năng</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedTours.map((tour, index) => {
                        const discountedPrice = getDiscountedPrice(tour);
                        return (
                            <tr
                                key={tour.tourId}
                                className="hover:bg-gray-100 cursor-pointer"
                                onClick={() => navigate(`/admin/tours/${tour.tourId}`)}
                            >
                                <td className="p-2 border" onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        checked={selectedTourIds.includes(tour.tourId)}
                                        onChange={() => {
                                            if (selectedTourIds.includes(tour.tourId)) {
                                                setSelectedTourIds(
                                                    selectedTourIds.filter((id) => id !== tour.tourId)
                                                );
                                            } else {
                                                setSelectedTourIds([...selectedTourIds, tour.tourId]);
                                            }
                                        }}
                                    />
                                </td>
                                <td className="p-2 border">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                <td className="p-2 border">
                                    <img
                                        src={tour.imagePath}
                                        alt={tour.tourName}
                                        className="w-16 h-10 object-cover rounded"
                                    />
                                </td>
                                <td className="p-2 border whitespace-nowrap">{tour.tourName}</td>
                                <td className="p-2 border whitespace-nowrap">{tour.tourType}</td>
                                <td className="p-2 border whitespace-nowrap">{formatPrice(discountedPrice)} VND</td>
                                <td className="p-2 border whitespace-nowrap">
                                    {new Date(tour.endDate).getDate() - new Date(tour.startDate).getDate()} ngày
                                </td>
                                <td className="p-2 border whitespace-nowrap">{tour.status}</td>
                                <td className="border px-3 py-2 text-center space-x-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/admin/tour-edit/${tour.tourId}`);
                                        }}
                                    >
                                        <PencilSquareIcon className="w-5 h-5 text-gray-500 hover:text-blue-600" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(tour.tourId);
                                        }}
                                    >
                                        <TrashIcon className="w-5 h-5 text-orange-500 hover:text-red-600" />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div className="flex justify-center mt-6 space-x-2">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : ""}`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Tiếp
                </button>
            </div>

            {/* Modal áp dụng voucher */}
            {showApplyVoucherModal && (
                <ApplyVoucherModal
                    closeModal={() => setShowApplyVoucherModal(false)}
                    selectedTourIds={selectedTourIds}
                    refreshTours={fetchTours}
                />
            )}
        </div>
    );
};

export default TourDomesticManagement;
