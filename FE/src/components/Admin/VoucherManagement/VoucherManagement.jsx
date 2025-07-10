import React, { useState, useEffect } from "react";
import axiosClient from "../../../api/axiosClient.jsx";
import { PencilSquareIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

const VoucherManagement = () => {
    const [vouchers, setVouchers] = useState([]);

    // State cho thêm mới
    const [newVoucher, setNewVoucher] = useState({
        voucherCode: "",
        discountPercentage: 0,
        validFrom: "",
        validTo: ""
    });

    // State cho chỉnh sửa
    const [editingVoucher, setEditingVoucher] = useState(null);

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [voucherToDelete, setVoucherToDelete] = useState(null);

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        try {
            const response = await axiosClient.get("vouchers");
            setVouchers(response.data);
        } catch (error) {
            console.error("Error fetching vouchers", error);
            alert("Lỗi khi tải dữ liệu voucher.");
        }
    };

    const handleAddVoucher = async () => {
        const validDiscountPercentage = parseFloat(newVoucher.discountPercentage);

        if (isNaN(validDiscountPercentage) || validDiscountPercentage <= 0) {
            alert("Giảm giá phải là một số hợp lệ và lớn hơn 0.");
            return;
        }

        if (!newVoucher.voucherCode || newVoucher.voucherCode.trim() === "") {
            alert("Mã voucher không hợp lệ.");
            return;
        }

        const validFromDate = new Date(newVoucher.validFrom);
        const validToDate = new Date(newVoucher.validTo);

        if (validFromDate >= validToDate) {
            alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
            return;
        }

        const updatedVoucher = {
            ...newVoucher,
            discountPercentage: validDiscountPercentage
        };

        try {
            await axiosClient.post("vouchers", updatedVoucher);
            fetchVouchers();
            setNewVoucher({
                voucherCode: "",
                discountPercentage: 0,
                validFrom: "",
                validTo: ""
            });
        } catch (error) {
            console.error("Error adding voucher", error.response ? error.response.data : error.message);
            alert(`Lỗi khi thêm voucher: ${error.response ? error.response.data : error.message}`);
        }
    };

    const handleEditVoucher = (voucher) => {
        setEditingVoucher({
            ...voucher
        });
    };

    const handleSaveEdit = async () => {
        const validDiscountPercentage = parseFloat(editingVoucher.discountPercentage);

        if (isNaN(validDiscountPercentage) || validDiscountPercentage <= 0) {
            alert("Giảm giá phải là một số hợp lệ và lớn hơn 0.");
            return;
        }

        if (!editingVoucher.voucherCode || editingVoucher.voucherCode.trim() === "") {
            alert("Mã voucher không hợp lệ.");
            return;
        }

        const validFromDate = new Date(editingVoucher.validFrom);
        const validToDate = new Date(editingVoucher.validTo);

        if (validFromDate >= validToDate) {
            alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
            return;
        }

        try {
            await axiosClient.put(`vouchers/${editingVoucher.voucherId}`, {
                ...editingVoucher,
                discountPercentage: validDiscountPercentage
            });
            fetchVouchers();
            setEditingVoucher(null);
        } catch (error) {
            console.error("Error editing voucher", error.response ? error.response.data : error.message);
            alert(`Lỗi khi sửa voucher: ${error.response ? error.response.data : error.message}`);
        }
    };

    const handleDeleteVoucher = async () => {
        try {
            await axiosClient.delete(`vouchers/${voucherToDelete.voucherId}`);
            fetchVouchers();
            setShowConfirmDelete(false);
        } catch (error) {
            console.error("Error deleting voucher", error);
            alert("Lỗi khi xóa voucher.");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Voucher</h1>

            {/* Thêm voucher */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Thêm Voucher</h2>
                <div>
                    <input
                        type="text"
                        placeholder="Mã voucher"
                        value={newVoucher.voucherCode}
                        onChange={(e) =>
                            setNewVoucher({ ...newVoucher, voucherCode: e.target.value })
                        }
                        className="border border-gray-300 p-2 rounded-md mb-2 w-full"
                    />
                    <input
                        type="number"
                        placeholder="Giảm giá (%)"
                        value={newVoucher.discountPercentage}
                        onChange={(e) =>
                            setNewVoucher({ ...newVoucher, discountPercentage: e.target.value })
                        }
                        className="border border-gray-300 p-2 rounded-md mb-2 w-full"
                    />
                    <input
                        type="date"
                        placeholder="Ngày bắt đầu"
                        value={newVoucher.validFrom}
                        onChange={(e) =>
                            setNewVoucher({ ...newVoucher, validFrom: e.target.value })
                        }
                        className="border border-gray-300 p-2 rounded-md mb-2 w-full"
                    />
                    <input
                        type="date"
                        placeholder="Ngày kết thúc"
                        value={newVoucher.validTo}
                        onChange={(e) =>
                            setNewVoucher({ ...newVoucher, validTo: e.target.value })
                        }
                        className="border border-gray-300 p-2 rounded-md mb-2 w-full"
                    />
                    <button
                        onClick={handleAddVoucher}
                        className="bg-green-500 text-white p-2 rounded-md"
                    >
                        Thêm Voucher
                    </button>
                </div>
            </div>

            {/* Danh sách Voucher */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-gray-100 border-b">
                    <tr>
                        <th className="py-3 px-4 text-left">#</th>
                        <th className="py-3 px-4 text-left">Mã Voucher</th>
                        <th className="py-3 px-4 text-left">Giảm Giá (%)</th>
                        <th className="py-3 px-4 text-left">Ngày Bắt Đầu</th>
                        <th className="py-3 px-4 text-left">Ngày Kết Thúc</th>
                        <th className="py-3 px-4 text-left">Trạng Thái</th>
                        <th className="py-3 px-4 text-left">Chức Năng</th>
                    </tr>
                    </thead>
                    <tbody>
                    {vouchers.map((voucher, index) => (
                        <tr key={voucher.voucherId} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{index + 1}</td>
                            <td className="py-3 px-4">{voucher.voucherCode}</td>
                            <td className="py-3 px-4">{voucher.discountPercentage}%</td>
                            <td className="py-3 px-4">{voucher.validFrom}</td>
                            <td className="py-3 px-4">{voucher.validTo}</td>
                            <td className="py-3 px-4">{voucher.status}</td>
                            <td className="py-3 px-4">
                                <button
                                    onClick={() => handleEditVoucher(voucher)}
                                    className="text-blue-500"
                                >
                                    <PencilSquareIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => {
                                        setVoucherToDelete(voucher);
                                        setShowConfirmDelete(true);
                                    }}
                                    className="text-red-500 ml-3"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal chỉnh sửa voucher */}
            {editingVoucher && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Chỉnh sửa Voucher</h2>
                            <button
                                onClick={() => setEditingVoucher(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Mã Voucher</label>
                            <input
                                type="text"
                                value={editingVoucher.voucherCode}
                                onChange={(e) =>
                                    setEditingVoucher({ ...editingVoucher, voucherCode: e.target.value })
                                }
                                className="border border-gray-300 p-2 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Giảm Giá (%)</label>
                            <input
                                type="number"
                                value={editingVoucher.discountPercentage}
                                onChange={(e) =>
                                    setEditingVoucher({ ...editingVoucher, discountPercentage: e.target.value })
                                }
                                className="border border-gray-300 p-2 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Ngày Bắt Đầu</label>
                            <input
                                type="date"
                                value={editingVoucher.validFrom}
                                onChange={(e) =>
                                    setEditingVoucher({ ...editingVoucher, validFrom: e.target.value })
                                }
                                className="border border-gray-300 p-2 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Ngày Kết Thúc</label>
                            <input
                                type="date"
                                value={editingVoucher.validTo}
                                onChange={(e) =>
                                    setEditingVoucher({ ...editingVoucher, validTo: e.target.value })
                                }
                                className="border border-gray-300 p-2 rounded-md w-full"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditingVoucher(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Xác nhận xóa */}
            {showConfirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-2">Xóa Voucher</h2>
                        <p className="text-red-600 mb-4">
                            Bạn có chắc chắn muốn xóa voucher{" "}
                            <strong>{voucherToDelete?.voucherCode}</strong> không?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowConfirmDelete(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDeleteVoucher}
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

export default VoucherManagement;
