import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const HotelManagement = () => {
    const [hotels, setHotels] = useState([]);
    const [query, setQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const fetchHotels = () => {
        axios.get("http://localhost:8084/api/hotels", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }).then((res) => {
            const mapped = res.data.map(h => ({
                ...h,
                imagePath: h.imagePath.startsWith("http") ? h.imagePath : `http://localhost:8084${h.imagePath}`,
            }));
            setHotels(mapped);
        }).catch((err) => console.error("Lỗi tải khách sạn:", err));
    };

    const handleSearch = () => {
        axios.get("http://localhost:8084/api/hotels/search", {
            params: { q: query },
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }).then((res) => {
            const mapped = res.data.map(h => ({
                ...h,
                imagePath: h.imagePath.startsWith("http") ? h.imagePath : `http://localhost:8084${h.imagePath}`,
            }));
            setHotels(mapped);
            setCurrentPage(1);
        }).catch((err) => {
            console.error("Lỗi tìm kiếm:", err);
            setHotels([]);
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn xoá khách sạn này?")) {
            axios.delete(`http://localhost:8084/api/hotels/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }).then(() => {
                setHotels(prev => prev.filter(h => h.hotelId !== id));
            });
        }
    };

    useEffect(() => { fetchHotels(); }, []);

    const totalPages = Math.ceil(hotels.length / ITEMS_PER_PAGE);
    const paginatedHotels = hotels.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Thanh tìm kiếm + thêm */}
            <div className="bg-gray-50 p-4 rounded-md shadow-sm mb-6 flex items-center justify-between gap-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Tìm kiếm khách sạn"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                    onClick={handleSearch}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                    Tìm kiếm
                </button>
                <button
                    onClick={() => navigate("/admin/hotel-add")}
                    className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
                >
                    Thêm Khách Sạn
                </button>
            </div>

            {/* Bảng danh sách */}
            <table className="min-w-full bg-white border text-sm">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Hình</th>
                    <th className="p-2 border">Tên</th>
                    <th className="p-2 border">Địa chỉ</th>
                    <th className="p-2 border">Loại</th>
                    <th className="p-2 border">Giá</th>
                    <th className="p-2 border">Chức năng</th>
                </tr>
                </thead>
                <tbody>
                {paginatedHotels.map((hotel, index) => (
                    <tr key={hotel.hotelId} className="hover:bg-gray-50">
                        <td className="p-2 border">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                        <td className="p-2 border">
                            <img src={hotel.imagePath} alt={hotel.hotelName} className="w-16 h-10 object-cover" />
                        </td>
                        <td className="p-2 border">{hotel.hotelName}</td>
                        <td className="p-2 border">{hotel.address}</td>
                        <td className="p-2 border">{hotel.hotelType}</td>
                        <td className="p-2 border">{hotel.priceStart} VND</td>
                        <td className="border px-3 py-2 text-center space-x-2">
                            <button onClick={() => navigate(`/admin/hotel-edit/${hotel.hotelId}`)}>
                                <PencilSquareIcon className="w-5 h-5 text-gray-500 hover:text-blue-600" />
                            </button>
                            <button onClick={() => handleDelete(hotel.hotelId)}>
                                <TrashIcon className="w-5 h-5 text-orange-500 hover:text-red-600" />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Phân trang */}
            <div className="flex justify-end items-center mt-6 gap-2">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 border rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
                >
                    Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded border ${page === currentPage ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 border rounded ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
                >
                    Tiếp
                </button>
            </div>
        </div>
    );
};

export default HotelManagement;
