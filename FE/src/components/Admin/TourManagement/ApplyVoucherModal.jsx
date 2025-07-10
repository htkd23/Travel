import React, { useEffect, useState } from "react";
import axios from "axios";

const ApplyVoucherModal = ({
                               closeModal,
                               selectedTourIds,
                               refreshTours,
                           }) => {
    const [vouchers, setVouchers] = useState([]);
    const [selectedVoucherId, setSelectedVoucherId] = useState("");
    const [searchCode, setSearchCode] = useState("");

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = () => {
        axios
            .get("http://localhost:8084/api/vouchers", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                setVouchers(res.data);
            });
    };

    const handleSearchVoucher = () => {
        axios
            .get(`http://localhost:8084/api/vouchers/${searchCode}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                if (res.data) {
                    setSelectedVoucherId(res.data.voucherId);
                    alert("Tìm thấy voucher: " + res.data.voucherCode);
                } else {
                    alert("Không tìm thấy voucher!");
                }
            })
            .catch(() => {
                alert("Voucher không tồn tại!");
            });
    };

    const handleApply = async () => {
        try {
            for (let tourId of selectedTourIds) {
                await axios.put(
                    `http://localhost:8084/api/tours/${tourId}/apply-voucher/${selectedVoucherId}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
            }
            alert("Áp dụng voucher thành công!");
            refreshTours();
            closeModal();
        } catch (err) {
            console.error(err);
            alert("Có lỗi khi áp dụng voucher.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Áp dụng Voucher</h2>

                <label className="block mb-2 text-sm">Tìm voucher theo mã:</label>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        placeholder="Nhập mã voucher"
                        className="border p-2 rounded w-full"
                    />
                    <button
                        onClick={handleSearchVoucher}
                        className="bg-blue-600 text-white px-3 py-2 rounded"
                    >
                        Tìm
                    </button>
                </div>

                <label className="block mb-2 text-sm">Hoặc chọn voucher:</label>
                <select
                    className="border p-2 rounded w-full mb-4"
                    value={selectedVoucherId}
                    onChange={(e) => setSelectedVoucherId(e.target.value)}
                >
                    <option value="">-- Chọn voucher --</option>
                    {vouchers.map((v) => (
                        <option key={v.voucherId} value={v.voucherId}>
                            {v.voucherCode} - {v.discountPercentage}%
                        </option>
                    ))}
                </select>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={closeModal}
                        className="px-3 py-2 bg-gray-300 rounded"
                    >
                        Hủy
                    </button>
                    <button
                        disabled={!selectedVoucherId}
                        onClick={handleApply}
                        className="px-3 py-2 bg-green-600 text-white rounded"
                    >
                        Áp dụng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplyVoucherModal;
