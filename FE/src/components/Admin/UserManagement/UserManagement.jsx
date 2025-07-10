import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showConfirm, setShowConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchKeyword.trim() === "") {
                fetchUsers();
            } else {
                searchUsers(searchKeyword);
            }
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchKeyword]);

    const fetchUsers = () => {
        axiosClient
            .get("/users")
            .then((res) => setUsers(res.data))
            .catch((err) => console.error("Lỗi khi load users:", err));
    };

    const searchUsers = (keyword) => {
        axiosClient
            .get(`/users/search?keyword=${encodeURIComponent(keyword)}`)
            .then((res) => {
                setUsers(res.data);
                setCurrentPage(1);
            })
            .catch((err) => console.error("Lỗi tìm kiếm:", err));
    };

    const confirmDelete = async () => {
        try {
            await axiosClient.delete(`/users/${userToDelete.id}`);
            alert(`✅ Đã xóa tài khoản "${userToDelete.username}" thành công!`);
            setShowConfirm(false);
            fetchUsers();
        } catch (err) {
            alert("❌ Lỗi khi xóa: " + (err.response?.data || err.message));
        }
    };

    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    const paginatedUsers = users.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Thanh tìm kiếm + thêm */}
            <div className="bg-gray-50 p-4 rounded-md shadow-sm mb-6 flex items-center justify-between gap-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Tìm kiếm người dùng"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                    onClick={() => navigate("/admin/users/add")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                    Thêm Người Dùng
                </button>
            </div>

            {/* Bảng danh sách */}
            <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                <tr>
                    <th className="border px-3 py-2">#</th>
                    <th className="border px-3 py-2">Tên tài khoản</th>
                    <th className="border px-3 py-2">Họ</th>
                    <th className="border px-3 py-2">Tên</th>
                    <th className="border px-3 py-2">Email</th>
                    <th className="border px-3 py-2">Ngày sinh</th>
                    <th className="border px-3 py-2">Vai trò</th>
                    <th className="border px-3 py-2">Điểm</th>

                    <th className="border px-3 py-2">Thao tác</th>
                </tr>
                </thead>
                <tbody>
                {paginatedUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                        <td className="border px-3 py-2">
                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </td>
                        <td className="border px-3 py-2">{user.username}</td>
                        <td className="border px-3 py-2">{user.lastName}</td>
                        <td className="border px-3 py-2">{user.firstName}</td>
                        <td className="border px-3 py-2">{user.email}</td>
                        <td className="border px-3 py-2">{user.dob}</td>
                        <td className="border px-3 py-2">{user.roles?.join(", ")}</td>
                        <td className="border px-3 py-2 text-center">{user.loyaltyPoints || 0}</td>

                        <td className="border px-3 py-2 text-center space-x-2">
                            <button
                                onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                            >
                                <PencilSquareIcon className="w-5 h-5 text-gray-500 hover:text-blue-600" />
                            </button>
                            <button
                                onClick={() => {
                                    setUserToDelete(user);
                                    setShowConfirm(true);
                                }}
                            >
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
                    className={`px-3 py-1 border rounded ${
                        currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "hover:bg-gray-100"
                    }`}
                >
                    Trước
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded border ${
                            page === currentPage
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-100"
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 border rounded ${
                        currentPage === totalPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "hover:bg-gray-100"
                    }`}
                >
                    Tiếp
                </button>
            </div>

            {/* Modal xác nhận xóa */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-2">Xóa tài khoản</h2>
                        <p className="text-red-600 mb-4">
                            Bạn có chắc chắn muốn xóa tài khoản{" "}
                            <strong>{userToDelete?.username}</strong> không?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmDelete}
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

export default UserManagement;
