import React, { useEffect, useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import axiosClient from "../../../api/axiosClient.jsx";

const ITEMS_PER_PAGE = 10;

const ReminderManagement = () => {
    const [reminders, setReminders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);

    const [searchTourName, setSearchTourName] = useState("");
    const [searchCustomerName, setSearchCustomerName] = useState("");

    useEffect(() => {
        fetchReminders();
    }, []);

    const fetchReminders = async () => {
        try {
            const res = await axiosClient.get("/scheduled-emails/all-reminders");
            console.log("Reminders fetched:", res.data);
            setReminders(res.data);
        } catch (error) {
            console.error("Error fetching reminders", error);
            alert("Không lấy được danh sách lịch hẹn!");
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa lịch hẹn này không?")) {
            setReminders(reminders.filter((item) => item.bookingId !== id));
        }
    };

    const handleSearch = () => {
        const filtered = reminders.filter(
            (item) =>
                item.tourName.toLowerCase().includes(searchTourName.toLowerCase()) &&
                item.customerName.toLowerCase().includes(searchCustomerName.toLowerCase())
        );
        setReminders(filtered);
        setCurrentPage(1);
    };

    const formatCurrency = (price) => {
        return price?.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        });
    };

    const handleSendReminders = async () => {
        if (selectedIds.length === 0) {
            alert("Vui lòng chọn ít nhất 1 lịch hẹn để gửi.");
            return;
        }

        const selectedReminders = reminders.filter(
            (item) => selectedIds.includes(item.bookingId)
        );

        if (selectedReminders.length === 0) {
            alert("Không tìm thấy các lịch hẹn đã chọn.");
            return;
        }

        let successCount = 0;
        let alreadySentCount = 0;
        let failedCount = 0;

        for (const reminder of selectedReminders) {
            try {
                await axiosClient.put(`/bookings/${reminder.bookingId}/remind-email`);
                successCount++;
                console.log(`Đã gửi email cho bookingId ${reminder.bookingId}`);
            } catch (error) {
                if (
                    error.response?.status === 400 &&
                    error.response?.data?.includes("Email nhắc lịch đã được gửi trước đó")
                ) {
                    alreadySentCount++;
                } else {
                    failedCount++;
                    console.error(error);
                }
            }
        }

        let message = "";

        if (successCount > 0) {
            message += `✅ Đã gửi lịch nhắc hẹn cho ${successCount} khách hàng.\n`;
        }

        if (alreadySentCount > 0) {
            message += `⚠️ Có ${alreadySentCount} lịch hẹn đã được gửi trước đó.\n`;
        }

        if (failedCount > 0) {
            message += `❌ Gửi thất bại ${failedCount} lịch hẹn.\n`;
        }

        if (message) {
            alert(message);
        }

        setSelectedIds([]);
        await fetchReminders();
    };

    const totalPages = Math.ceil(reminders.length / ITEMS_PER_PAGE);
    const paginatedReminders = reminders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(
                paginatedReminders
                    .filter((item) => !item.sent)
                    .map((item) => item.bookingId)
            );
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((i) => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Quản lý lịch hẹn
            </h1>

            <div className="grid grid-cols-[2fr_2fr_auto] gap-4 bg-gray-50 p-4 rounded-md shadow-sm mb-6">
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Tên tour</label>
                    <input
                        type="text"
                        placeholder="Nhập tên tour"
                        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none w-full"
                        value={searchTourName}
                        onChange={(e) => setSearchTourName(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Tên khách hàng</label>
                    <input
                        type="text"
                        placeholder="Nhập tên khách hàng"
                        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none w-full"
                        value={searchCustomerName}
                        onChange={(e) => setSearchCustomerName(e.target.value)}
                    />
                </div>

                <div className="flex items-end gap-2">
                    <button
                        onClick={handleSearch}
                        className="bg-green-700 hover:bg-green-800 text-white font-medium px-4 py-2 rounded-md text-sm"
                    >
                        Tìm kiếm
                    </button>
                    <button
                        onClick={handleSendReminders}
                        className={`${
                            selectedIds.length === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                        } text-white font-medium px-4 py-2 rounded-md text-sm`}
                        disabled={selectedIds.length === 0}
                    >
                        Gửi lịch nhắc hẹn
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 text-sm">
                    <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2 border">
                            <input
                                type="checkbox"
                                checked={
                                    paginatedReminders.length > 0 &&
                                    selectedIds.length ===
                                    paginatedReminders.filter((r) => !r.sent).length
                                }
                                onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                        </th>
                        <th className="p-2 border">#</th>
                        <th className="p-2 border">Tên tour</th>
                        <th className="p-2 border">Tên khách hàng</th>
                        <th className="p-2 border text-right">Giá đã thanh toán</th>
                        <th className="p-2 border">Ngày khởi hành</th>
                        <th className="p-2 border">Trạng thái nhắc</th>
                        <th className="p-2 border text-center">Chức năng</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedReminders.map((item, index) => (
                        <tr key={item.bookingId} className="hover:bg-gray-50">
                            <td className="p-2 border">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(item.bookingId)}
                                    onChange={() => handleSelect(item.bookingId)}
                                    disabled={item.sent}
                                />
                            </td>
                            <td className="p-2 border">
                                {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                            </td>
                            <td className="p-2 border whitespace-nowrap">
                                {item.tourName}
                            </td>
                            <td className="p-2 border whitespace-nowrap">
                                {item.customerName}
                            </td>
                            <td className="p-2 border whitespace-nowrap text-right">
                                {formatCurrency(item.pricePaid)}
                            </td>
                            <td className="p-2 border whitespace-nowrap">
                                {new Date(item.departureDate).toLocaleDateString("vi-VN")}
                            </td>
                            <td className="p-2 border whitespace-nowrap">
                                {item.sent ? (
                                    <span className="text-green-600 font-semibold">
                                            Đã nhắc
                                        </span>
                                ) : (
                                    <span className="text-gray-500">Chưa nhắc</span>
                                )}
                            </td>
                            <td className="p-2 border text-center space-x-2">
                                <button onClick={() => alert("Đi tới trang chỉnh sửa")}>
                                    <PencilSquareIcon className="w-5 h-5 text-gray-500 hover:text-blue-600 inline" />
                                </button>
                                <button onClick={() => handleDelete(item.bookingId)}>
                                    <TrashIcon className="w-5 h-5 text-orange-500 hover:text-red-600 inline" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

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
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Tiếp
                </button>
            </div>
        </div>
    );
};

export default ReminderManagement;
