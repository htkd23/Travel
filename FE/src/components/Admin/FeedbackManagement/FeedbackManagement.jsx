import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import FeedbackForm from "./FeedbackForm";

const FeedbackManagement = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchDateFrom, setSearchDateFrom] = useState("");
    const [searchDateTo, setSearchDateTo] = useState("");

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [feedbackToDelete, setFeedbackToDelete] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("create");
    const [editingFeedbackId, setEditingFeedbackId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = () => {
        axios
            .get("http://localhost:8084/api/feedbacks", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                setFeedbacks(res.data);
                setCurrentPage(1);
            })
            .catch((err) => console.error("Error fetching feedbacks:", err));
    };

    const handleDeleteFeedback = (feedback) => {
        setFeedbackToDelete(feedback);
        setShowConfirmDelete(true);
    };

    const confirmDeleteFeedback = async () => {
        try {
            await axios.delete(
                `http://localhost:8084/api/feedbacks/${feedbackToDelete.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            alert(`✅ Đã xoá phản hồi thành công!`);
            setShowConfirmDelete(false);
            fetchFeedbacks();
        } catch (err) {
            alert("❌ Xoá thất bại: " + (err.response?.data || err.message));
        }
    };

    const handleSearch = () => {
        axios
            .post(
                "http://localhost:8084/api/feedbacks/search",
                {
                    tourName: searchKeyword || null,
                    userName: searchKeyword || null,
                    createdDateFrom: searchDateFrom || null,
                    createdDateTo: searchDateTo || null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            .then((res) => {
                setFeedbacks(res.data);
                setCurrentPage(1);
            })
            .catch((err) => {
                console.error("Lỗi tìm kiếm:", err);
            });
    };

    const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedFeedbacks = feedbacks.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Quản lý phản hồi
            </h1>

            <div className="flex flex-wrap items-end justify-between gap-4 bg-gray-50 p-4 rounded-md shadow-sm mb-6">
                <div className="flex flex-wrap gap-4 flex-grow">
                    <div className="flex flex-col w-[200px]">
                        <label className="text-sm text-gray-600 mb-1">Tìm kiếm</label>
                        <input
                            type="text"
                            placeholder="Nhập tên tour hoặc tên user"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col w-[180px]">
                        <label className="text-sm text-gray-600 mb-1">Từ ngày</label>
                        <input
                            type="date"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                            value={searchDateFrom}
                            onChange={(e) => setSearchDateFrom(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col w-[180px]">
                        <label className="text-sm text-gray-600 mb-1">Đến ngày</label>
                        <input
                            type="date"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                            value={searchDateTo}
                            onChange={(e) => setSearchDateTo(e.target.value)}
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={handleSearch}
                            className="bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-2 rounded"
                        >
                            Tìm kiếm
                        </button>
                    </div>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={() => {
                            setFormMode("create");
                            setEditingFeedbackId(null);
                            setShowForm(true);
                        }}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Thêm mới
                    </button>
                </div>
            </div>


            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-gray-100 border-b">
                    <tr>
                        <th className="py-3 px-4 text-left">#</th>
                        <th className="py-3 px-4 text-left">Tên Tour</th>
                        <th className="py-3 px-4 text-left">Tên User</th>
                        <th className="py-3 px-4 text-left">Nội dung</th>
                        <th className="py-3 px-4 text-left">Ngày tạo</th>
                        <th className="py-3 px-4 text-left">Chức năng</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedFeedbacks.map((feedback, index) => (
                        <tr
                            key={feedback.id}
                            className="border-b hover:bg-gray-50 cursor-pointer"
                        >
                            <td className="py-3 px-4">{startIndex + index + 1}</td>
                            <td className="py-3 px-4">{feedback.tourName}</td>
                            <td className="py-3 px-4">{feedback.userFullName}</td>
                            <td className="py-3 px-4">{feedback.content}</td>
                            <td className="py-3 px-4">
                                {new Date(feedback.createdAt).toLocaleDateString()}
                            </td>
                            <td
                                className="py-3 px-4 text-center space-x-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => {
                                        setFormMode("edit");
                                        setEditingFeedbackId(feedback.id);
                                        setShowForm(true);
                                    }}
                                >
                                    <PencilSquareIcon className="w-5 h-5 text-gray-500 hover:text-blue-600" />
                                </button>

                                <button onClick={() => handleDeleteFeedback(feedback)}>
                                    <TrashIcon className="w-5 h-5 text-orange-500 hover:text-red-600" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Trước
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
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
            )}

            {showConfirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-2">Xoá phản hồi</h2>
                        <p className="text-red-600 mb-4">
                            Bạn có chắc chắn muốn xoá phản hồi của{" "}
                            <strong>{feedbackToDelete?.userFullName}</strong> không?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowConfirmDelete(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmDeleteFeedback}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showForm && (
                <FeedbackForm
                    mode={formMode}
                    feedbackId={editingFeedbackId}
                    onClose={() => {
                        setShowForm(false);
                        fetchFeedbacks();
                    }}
                />
            )}
        </div>
    );
};

export default FeedbackManagement;
