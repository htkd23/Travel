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

    // Hàm strip HTML -> plain text
    const stripHtml = (html) => {
        if (!html) return "";
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    };

    // Hàm bóc src từ thẻ img
    const extractImageSrc = (htmlString) => {
        if (!htmlString) return "";
        const div = document.createElement("div");
        div.innerHTML = htmlString;
        const img = div.querySelector("img");
        return img?.getAttribute("src") || "";
    };

    // Hàm build ra HTML <img> cho table
    const buildImageHtml = (path, tourName) => {
        let url = path || "";
        if (path?.includes("<img")) {
            url = extractImageSrc(path);
        } else if (path && !path.startsWith("http") && !path.startsWith("/")) {
            url = `http://localhost:8084/assets/${path}`;
        }

        // Nếu path là rỗng, thì gán ảnh mặc định
        if (!url) {
            url = "/default-image.png";
        }

        return `<img src="${url}" alt="${tourName}" class="w-16 h-10 object-cover rounded" />`;
    };

    // Hàm tính số ngày
    const calculateDays = (start, end) => {
        if (!start || !end) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffMs = endDate - startDate;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return diffDays > 0 ? Math.ceil(diffDays) : 0;
    };

    const fetchTours = () => {
        axios
            .get("http://localhost:8084/api/tours", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                const filteredTours = response.data
                    .filter((tour) => tour.tourType === "international")
                    .map((tour) => ({
                        ...tour,
                        imagePath: buildImageHtml(tour.imagePath, stripHtml(tour.tourName)),
                        tourName: stripHtml(tour.tourName),
                        location: stripHtml(tour.location),
                        description: stripHtml(tour.description),
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
                    imagePath: buildImageHtml(tour.imagePath, stripHtml(tour.tourName)),
                    tourName: stripHtml(tour.tourName),
                    location: stripHtml(tour.location),
                    description: stripHtml(tour.description),
                }));
                setTours(updatedTours);
                setCurrentPage(1);
            })
            .catch((err) => {
                console.error("Lỗi tìm kiếm tour:", err);
                setTours([]);
            });
    };

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

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN").format(price);
    };

    const translateStatus = (status) => {
        if (status === "ACTIVE") return "Đang hoạt động";
        if (status === "INACTIVE") return "Ngưng hoạt động";
        return status || "";
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
            {/* Thanh tìm kiếm */}
            <div className="flex flex-wrap items-end gap-4 bg-gray-50 p-4 rounded-md shadow-sm mb-6">
                <div className="flex flex-col w-1/4 min-w-[200px]">
                    <label className="text-sm text-gray-600 mb-1">Địa điểm</label>
                    <input
                        type="text"
                        placeholder="Nhập địa điểm"
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <div className="flex flex-col w-1/4 min-w-[200px]">
                    <label className="text-sm text-gray-600 mb-1">Ngày khởi hành</label>
                    <input
                        type="date"
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                    />
                </div>

                <div className="flex flex-col w-1/4 min-w-[200px]">
                    <label className="text-sm text-gray-600 mb-1">Giá tối đa (VND)</label>
                    <input
                        type="number"
                        placeholder="Nhập giá"
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        min={0}
                    />
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


            {/* Bảng dữ liệu */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 text-sm">
                    <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2 border">#</th>
                        <th className="p-2 border">Hình</th>
                        <th className="p-2 border">Tên tour</th>
                        <th className="p-2 border">Địa điểm</th>
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
                                <td className="p-2 border">
                                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                </td>
                                <td
                                    className="p-2 border"
                                    dangerouslySetInnerHTML={{ __html: tour.imagePath }}
                                ></td>
                                <td className="p-2 border whitespace-nowrap">
                                    {tour.tourName}
                                </td>
                                <td className="p-2 border whitespace-nowrap">
                                    {tour.location}
                                </td>
                                <td className="p-2 border whitespace-nowrap">
                                    {formatPrice(discountedPrice)} VND
                                </td>
                                <td className="p-2 border whitespace-nowrap">
                                    {calculateDays(tour.startDate, tour.endDate)} ngày
                                </td>
                                <td className="p-2 border whitespace-nowrap">
                                    {translateStatus(tour.status)}
                                </td>

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
                        className={`px-3 py-1 border rounded ${
                            currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
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
